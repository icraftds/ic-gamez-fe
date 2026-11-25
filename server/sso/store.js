import { Redis } from '@upstash/redis'
import { randomUUID } from 'node:crypto'
import net from 'node:net'
import { SsoError } from './security.js'

// Every revision/ownership check and write executes in one Redis operation.
export const SESSION_SCRIPTS = Object.freeze({
    consume: `local raw=redis.call('GET',KEYS[1]); if not raw then return 0 end; local row=cjson.decode(raw); if row.status=='revoked' or row.revision~=tonumber(ARGV[1]) then return 0 end; redis.call('DEL',KEYS[1]); return 1`,
    release: `if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) end; return 0`,
    update: `if redis.call('GET',KEYS[2])~=ARGV[1] then return 0 end; local raw=redis.call('GET',KEYS[1]); if not raw then return 0 end; local row=cjson.decode(raw); if row.status=='revoked' or row.revision~=tonumber(ARGV[2]) then return 0 end; redis.call('SET',KEYS[1],ARGV[3],'PXAT',ARGV[4]); return 1`,
    retry: `redis.call('SET',KEYS[1],ARGV[1],'PXAT',ARGV[2]); redis.call('ZADD',KEYS[2],ARGV[3],KEYS[1]); return 1`,
    retrySave: `if redis.call('GET',KEYS[2])~=ARGV[1] or redis.call('EXISTS',KEYS[1])==0 then return 0 end; redis.call('SET',KEYS[1],ARGV[2],'PXAT',ARGV[3]); return 1`,
    retryFinish: `if redis.call('GET',KEYS[2])~=ARGV[1] then return 0 end; redis.call('DEL',KEYS[1],KEYS[2]); redis.call('ZREM',KEYS[3],KEYS[1]); return 1`,
    retryDefer: `if redis.call('GET',KEYS[2])~=ARGV[1] then return 0 end; redis.call('ZADD',KEYS[3],ARGV[2],KEYS[1]); return 1`,
})

function encodeRespCommand(args) {
    let out = `*${args.length}\r\n`
    for (const arg of args) {
        const str = String(arg)
        out += `$${Buffer.byteLength(str, 'utf8')}\r\n${str}\r\n`
    }
    return out
}

function parseRespValue(buffer, offset = 0) {
    if (offset >= buffer.length) return null
    const type = String.fromCharCode(buffer[offset])
    const lineEnd = buffer.indexOf('\r\n', offset + 1)
    if (lineEnd === -1) return null
    const header = buffer.subarray(offset + 1, lineEnd).toString('utf8')
    const nextOffset = lineEnd + 2

    if (type === '+') return { value: header, nextOffset }
    if (type === '-') return { error: new Error(header), nextOffset }
    if (type === ':') return { value: Number(header), nextOffset }
    if (type === '$') {
        const len = Number(header)
        if (len === -1) return { value: null, nextOffset }
        const end = nextOffset + len
        if (buffer.length < end + 2) return null
        return { value: buffer.subarray(nextOffset, end).toString('utf8'), nextOffset: end + 2 }
    }
    if (type === '*') {
        const count = Number(header)
        if (count === -1) return { value: null, nextOffset }
        const items = []
        let cursor = nextOffset
        for (let i = 0; i < count; i++) {
            const parsed = parseRespValue(buffer, cursor)
            if (!parsed) return null
            if (parsed.error) return parsed
            items.push(parsed.value)
            cursor = parsed.nextOffset
        }
        return { value: items, nextOffset: cursor }
    }
    throw new Error(`Unsupported RESP type: ${type}`)
}

/**
 * Native zero-dependency Local Redis client over TCP (redis://127.0.0.1:6379) or Unix socket (unix:/path/to/redis.sock).
 */
export function createLocalRedisClient(connectionUrl, password = '') {
    const isUnix = connectionUrl.startsWith('unix:') || connectionUrl.startsWith('redis+unix:')
    let connectOptions
    let authPassword = password
    let authUsername = ''
    let dbIndex = 0

    if (isUnix) {
        const socketPath = connectionUrl.replace(/^(redis\+)?unix:(\/\/)?/, '')
        connectOptions = { path: socketPath }
    } else {
        const parsed = new URL(connectionUrl)
        connectOptions = {
            host: parsed.hostname || '127.0.0.1',
            port: Number(parsed.port || 6379),
        }
        if (parsed.password) authPassword = decodeURIComponent(parsed.password)
        if (parsed.username) authUsername = decodeURIComponent(parsed.username)
        if (parsed.pathname && parsed.pathname.length > 1) {
            const idx = Number(parsed.pathname.slice(1))
            if (Number.isInteger(idx) && idx > 0) dbIndex = idx
        }
    }

    function execRaw(commands, timeoutMs = 4000) {
        return new Promise((resolve, reject) => {
            const socket = net.createConnection(connectOptions)
            let buffer = Buffer.alloc(0)
            const results = []
            const expectedCount = commands.length
            let settled = false

            const timer = setTimeout(() => {
                if (!settled) {
                    settled = true
                    socket.destroy()
                    reject(new Error('Local Redis command timed out.'))
                }
            }, timeoutMs)

            const finish = (err, val) => {
                if (settled) return
                settled = true
                clearTimeout(timer)
                socket.end()
                if (err) reject(err)
                else resolve(val)
            }

            socket.on('error', err => finish(err))
            socket.on('connect', () => {
                const payload = commands.map(encodeRespCommand).join('')
                socket.write(payload)
            })
            socket.on('data', chunk => {
                buffer = Buffer.concat([buffer, chunk])
                while (results.length < expectedCount) {
                    let parsed
                    try {
                        parsed = parseRespValue(buffer, 0)
                    } catch (err) {
                        return finish(err)
                    }
                    if (!parsed) break
                    buffer = buffer.subarray(parsed.nextOffset)
                    if (parsed.error) return finish(parsed.error)
                    results.push(parsed.value)
                }
                if (results.length === expectedCount) {
                    finish(null, results[results.length - 1])
                }
            })
            socket.on('close', () => {
                if (!settled) finish(new Error('Local Redis connection closed prematurely.'))
            })
        })
    }

    async function sendCommand(args) {
        const pipeline = []
        if (authPassword) {
            pipeline.push(authUsername ? ['AUTH', authUsername, authPassword] : ['AUTH', authPassword])
        }
        if (dbIndex > 0) {
            pipeline.push(['SELECT', String(dbIndex)])
        }
        pipeline.push(args)
        return execRaw(pipeline)
    }

    return {
        get: key => sendCommand(['GET', key]),
        set: (key, value, options = {}) => {
            const cmd = ['SET', key, value]
            if (options.nx) cmd.push('NX')
            if (options.pxat) cmd.push('PXAT', String(options.pxat))
            else if (options.px) cmd.push('PX', String(options.px))
            return sendCommand(cmd)
        },
        eval: (script, keys = [], args = []) =>
            sendCommand(['EVAL', script, String(keys.length), ...keys.map(String), ...args.map(String)]),
        zrange: (key, min, max, options = {}) => {
            const cmd = ['ZRANGE', key, String(min), String(max)]
            if (options.byScore) {
                cmd.push('BYSCORE', 'LIMIT', String(options.offset ?? 0), String(options.count ?? 1))
            }
            return sendCommand(cmd)
        },
    }
}

export function upstashSessionStore({ url, token, product, environment, redis }) {
    if (!['market', 'gamez'].includes(product) || !['production', 'preview', 'development'].includes(environment)) {
        throw new SsoError(503, 'Session storage namespace is not configured.', 'session_storage')
    }
    const isLocalRedisUrl = typeof url === 'string' && /^(redis:\/\/|redis\+unix:|unix:)/.test(url)
    const isRestUrl = typeof url === 'string' && /^https:\/\//.test(url)
    if (!redis && !isLocalRedisUrl && (!isRestUrl || !token)) {
        throw new SsoError(503, 'Upstash session storage is not configured.', 'session_storage')
    }
    const client = redis || (isLocalRedisUrl
        ? createLocalRedisClient(url, token || '')
        : new Redis({ url, token, retry: { retries: 0 }, signal: () => AbortSignal.timeout(5000), automaticDeserialization: false, enableAutoPipelining: false }))
    const prefix = `icraft:sso:${product}:${environment}:`
    const name = key => prefix + key
    const lock = key => name(key) + ':lock'
    const row = (revision, ciphertext, expiresAt, status = 'active') => JSON.stringify({ revision, ciphertext, expiresAt, status })
    return {
        async create(key, ciphertext, expiresAt) {
            return await client.set(name(key), row(1, ciphertext, expiresAt), { nx: true, pxat: expiresAt }) === 'OK'
        },
        async read(key) {
            const raw = await client.get(name(key))
            if (!raw) return null
            const record = typeof raw === 'string' ? JSON.parse(raw) : raw
            return record.status === 'revoked' ? null : record
        },
        async consume(key, revision) { return Number(await client.eval(SESSION_SCRIPTS.consume, [name(key)], [revision])) === 1 },
        async acquire(key, owner, ttl) { return await client.set(lock(key), owner, { nx: true, px: ttl }) === 'OK' },
        async release(key, owner) { return Number(await client.eval(SESSION_SCRIPTS.release, [lock(key)], [owner])) === 1 },
        async saveLocked(key, owner, revision, ciphertext, expiresAt) {
            return Number(await client.eval(SESSION_SCRIPTS.update, [name(key), lock(key)], [owner, revision, row(revision + 1, ciphertext, expiresAt), expiresAt])) === 1
        },
        async retireLocked(key, owner, revision, expiresAt) {
            return Number(await client.eval(SESSION_SCRIPTS.update, [name(key), lock(key)], [owner, revision, row(revision + 1, null, expiresAt, 'revoked'), expiresAt])) === 1
        },
        async revocationRetry(ciphertext, expiresAt) {
            const retryKey = name(`revocation:${randomUUID()}`)
            await client.eval(SESSION_SCRIPTS.retry, [retryKey, name('revocations')], [ciphertext, expiresAt, Date.now()])
        },
        async retryEntries() {
            const keys = await client.zrange(name('revocations'), '-inf', Date.now(), { byScore: true, offset: 0, count: 1 })
            return Promise.all(keys.map(async id => ({ id, ciphertext: await client.get(id) })))
        },
        async acquireRetry(id, owner) { return await client.set(`${id}:lock`, owner, { nx: true, px: 60000 }) === 'OK' },
        async readRetry(id) { return client.get(id) },
        async deferRetry(id, owner, nextAttempt) { return Number(await client.eval(SESSION_SCRIPTS.retryDefer, [id, `${id}:lock`, name('revocations')], [owner, nextAttempt])) === 1 },
        async saveRetry(id, owner, ciphertext, deadline) { return Number(await client.eval(SESSION_SCRIPTS.retrySave, [id, `${id}:lock`], [owner, ciphertext, deadline])) === 1 },
        async finishRetry(id, owner) { return Number(await client.eval(SESSION_SCRIPTS.retryFinish, [id, `${id}:lock`, name('revocations')], [owner])) === 1 },
        async releaseRetry(id, owner) { return Number(await client.eval(SESSION_SCRIPTS.release, [`${id}:lock`], [owner])) === 1 },
    }
}
