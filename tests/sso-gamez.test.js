import test from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { returnPath, productUrl, assertMutation, callbackParameters, assertSafeJson, sessionCookieOptions } from '../server/sso/security.js'
import { tokenEncryption } from '../server/sso/encryption.js'
import { GAMEZ_CONTRACT, gamezConfiguration } from '../server/sso/config.js'
import { gamezOAuth, verifyIdentity } from '../server/sso/oauth.js'
import { gamezSessions } from '../server/sso/session.js'

const configuration = { ...GAMEZ_CONTRACT, enabled: true, clientSecret: 'test-only-client-secret', encryptionKey: randomBytes(32).toString('base64url') }
const state = 'a'.repeat(43)

test('GameZ production configuration is exact and fails closed without secrets or rollout', () => {
    assert.equal(gamezConfiguration(configuration).clientId, GAMEZ_CONTRACT.clientId)
    assert.equal(gamezConfiguration({ ...configuration, issuer: 'https://ic-auth.unikom.my.id' }).issuer, 'https://auth.icraftds.id')
    for (const invalid of [{ enabled: false }, { clientSecret: '' }, { encryptionKey: '' }, { clientId: 'gamez' }, { appOrigin: 'https://evil.test' }, { redirectUri: 'http://localhost/auth/callback' }, { issuer: 'https://evil.test' }]) {
        assert.throws(() => gamezConfiguration({ ...configuration, ...invalid }), error => error.status === 503)
    }
})

test('Return paths reject decoded open redirects, auth loops and credential queries', () => {
    assert.equal(returnPath('/dashboard?page=2', configuration.appOrigin), '/dashboard?page=2')
    for (const path of ['https://evil.test', '//evil.test', '/\\evil.test', '/%5cevil', '/%252fevil.test', '/%0aevil', '/auth/callback', '/x/../auth/start', '/auto-login', '/?access_token=secret']) {
        assert.throws(() => returnPath(path, configuration.appOrigin), undefined, path)
    }
})

test('Duplicate callback parameters are rejected before transaction redemption', () => {
    assert.equal(callbackParameters(new URLSearchParams({ code: 'opaque', state })).code, 'opaque')
    for (const query of [`code=x&code=y&state=${state}`, `code=x&state=${state}&state=${state}`, `code=x&error=denied&state=${state}`, `state=${state}`, 'code=x&state=short']) {
        assert.throws(() => callbackParameters(new URLSearchParams(query)))
    }
})

test('BFF paths stay on the fixed GameZ API and reject internal, auth and identity injection', () => {
    assert.equal(String(productUrl('payments/create', '', configuration.backendOrigin)), 'https://icgamez.unikom.my.id/api/payments/create')
    for (const path of ['https://evil.test', '//evil.test', '../internal/debit', 'internal/debit', 'sso/sync', 'oauth/token', '%252e%252e/internal', 'orders/%2f%2fevil']) {
        assert.throws(() => productUrl(path, '', configuration.backendOrigin), undefined, path)
    }
    assert.throws(() => productUrl('wallet', '?user_id=1', configuration.backendOrigin))
    assert.throws(() => productUrl('products', '?access_token=secret', configuration.backendOrigin))
})

test('Origin/CSRF checks and host-only cookie flags', () => {
    assert.doesNotThrow(() => assertMutation(configuration.appOrigin, 'csrf', 'csrf', configuration.appOrigin))
    for (const [origin, csrf] of [['https://evil.test', 'csrf'], [undefined, 'csrf'], [configuration.appOrigin, 'wrong']]) {
        assert.throws(() => assertMutation(origin, csrf, 'csrf', configuration.appOrigin), error => error.status === 403)
    }
    assert.equal(sessionCookieOptions.httpOnly, true)
    assert.equal(sessionCookieOptions.secure, true)
    assert.equal(sessionCookieOptions.sameSite, 'lax')
    assert.equal('domain' in sessionCookieOptions, false)
})

test('JWE storage encryption authenticates ciphertext and product namespace', async () => {
    const encryption = tokenEncryption(configuration.encryptionKey, 'gamez')
    const ciphertext = await encryption.seal({ accessToken: 'private-access', refreshToken: 'private-refresh' })
    assert.equal(ciphertext.includes('private-access'), false)
    assert.equal((await encryption.open(ciphertext)).accessToken, 'private-access')
    await assert.rejects(tokenEncryption(configuration.encryptionKey, 'market').open(ciphertext))
    await assert.rejects(tokenEncryption(randomBytes(32).toString('base64url'), 'gamez').open(ciphertext))
})

test('Verified OAuth identity must be active, verified, product-bound, scoped and unexpired', () => {
    const response = { success: true, data: { id: 501, status: 'active', email_verified_at: '2026-10-07' }, oauth: { client_id: configuration.clientId, product: 'gamez', scopes: ['profile'], expires_at: new Date(Date.now() + 60000).toISOString(), session_expires_at: new Date(Date.now() + 120000).toISOString() } }
    assert.equal(verifyIdentity(response, configuration).identity.id, 501)
    for (const oauth of [{ product: 'market' }, { client_id: 'other' }, { scopes: [] }, { expires_at: '2000-01-01' }]) assert.throws(() => verifyIdentity({ ...response, oauth: { ...response.oauth, ...oauth } }, configuration))
    assert.throws(() => verifyIdentity({ ...response, data: { ...response.data, status: 'suspended' } }, configuration))
    assert.throws(() => verifyIdentity({ ...response, data: { ...response.data, email_verified_at: null } }, configuration))
})

test('OAuth library constructs S256 + profile authorization using the exact GameZ callback', async () => {
    const client = gamezOAuth(configuration, async url => {
        assert.equal(String(url), `${configuration.issuer}/.well-known/oauth-authorization-server`)
        return Response.json({ issuer: configuration.issuer, authorization_endpoint: `${configuration.issuer}/oauth/authorize`, token_endpoint: `${configuration.issuer}/oauth/token` })
    })
    const { url, transaction } = await client.begin('/dashboard', 'browser-binding')
    assert.equal(url.searchParams.get('scope'), 'profile')
    assert.equal(url.searchParams.get('redirect_uri'), GAMEZ_CONTRACT.redirectUri)
    assert.equal(url.searchParams.get('code_challenge_method'), 'S256')
    assert.match(url.searchParams.get('code_challenge'), /^[A-Za-z0-9_-]{43}$/)
    assert.match(transaction.verifier, /^[A-Za-z0-9_-]{43,128}$/)
    assert.match(transaction.state, /^[A-Za-z0-9_-]{32,128}$/)
    assert.equal(url.searchParams.has('prompt'), false)
})

test('OAuth exchange sends ClientSecretPost and verifier once, never exposes token payloads', async () => {
    let exchanged = 0
    const client = gamezOAuth(configuration, async (url, init) => {
        if (String(url).includes('.well-known')) return Response.json({ issuer: configuration.issuer, authorization_endpoint: `${configuration.issuer}/oauth/authorize`, token_endpoint: `${configuration.issuer}/oauth/token` })
        exchanged++
        const body = new URLSearchParams(init.body)
        assert.equal(body.get('client_id'), configuration.clientId)
        assert.equal(body.get('client_secret'), configuration.clientSecret)
        assert.equal(body.get('redirect_uri'), configuration.redirectUri)
        assert.equal(body.get('grant_type'), 'authorization_code')
        assert.equal(body.get('code_verifier'), 'v'.repeat(43))
        return Response.json({ token_type: 'Bearer', access_token: 'server-access', refresh_token: 'server-refresh', expires_in: 50 })
    })
    const tokens = await client.exchange({ state, verifier: 'v'.repeat(43), redirectUri: configuration.redirectUri, expiresAt: Date.now() + 60000 }, new URLSearchParams({ state, code: 'opaque' }))
    assert.equal(tokens.accessToken, 'server-access'); assert.equal(exchanged, 1)
    assert.ok(tokens.expiresAt - Date.now() <= 50000)
    assert.throws(() => assertSafeJson({ data: { access_token: 'secret' } }), error => error.status === 502)
})

test('Missing durable adapter is an outage, never memory or filesystem session fallback', () => {
    assert.throws(() => gamezSessions({ configuration }), error => error.status === 503 && error.code === 'session_storage')
})

// In-memory adapter is ONLY a unit-test fixture, never a production session store.
function fixtureStore() {
    const rows = new Map(), locks = new Map(), retries = []
    return {
        rows, locks, retries,
        async create(key, ciphertext, expiresAt) { if (rows.has(key)) return false; rows.set(key, { ciphertext, expiresAt, revision: 1 }); return true },
        async read(key) { const row = rows.get(key); return row ? { ...row } : null },
        async consume(key, revision) { if (rows.get(key)?.revision !== revision) return false; rows.delete(key); return true },
        async acquire(key, owner) { if (locks.has(key)) return false; locks.set(key, owner); return true },
        async release(key, owner) { if (locks.get(key) === owner) locks.delete(key) },
        async saveLocked(key, owner, revision, ciphertext, expiresAt) {
            if (locks.get(key) !== owner || rows.get(key)?.revision !== revision) return false
            rows.set(key, { ciphertext, expiresAt, revision: revision + 1 }); return true
        },
        async retireLocked(key, owner, revision, expiresAt) {
            if (locks.get(key) !== owner || rows.get(key)?.revision !== revision) return false
            rows.delete(key); return true
        },
        async revocationRetry(ciphertext, expiresAt) { retries.push({ ciphertext, expiresAt }) },
    }
}

async function sessionFixture(overrides = {}) {
    const encryption = tokenEncryption(configuration.encryptionKey, 'gamez')
    const store = fixtureStore()
    let exchanges = 0, refreshes = 0
    const deadline = Date.now() + 120000
    const oauth = {
        exchange: async () => { exchanges++; return { accessToken: 'test-access-rev-1', refreshToken: 'test-refresh-rev-1', expiresAt: Date.now() + 10000 } },
        profile: async () => ({ identity: { id: 501 }, expiresAt: Date.now() + 10000, absoluteDeadline: deadline }),
        refresh: async () => { refreshes++; return { accessToken: 'test-access-rev-2', refreshToken: 'test-refresh-rev-2', expiresAt: Date.now() + 60000 } },
        logout: async () => {}, ...overrides,
    }
    const sessions = gamezSessions({ store, encryption, oauth, configuration, productProfile: async () => ({ id: 3, role: 'buyer' }), initializeWallet: async () => { throw { status: 503 } } })
    const transaction = { state, verifier: 'v'.repeat(43), binding: 'b'.repeat(43), redirectUri: configuration.redirectUri, returnTo: '/dashboard', expiresAt: Date.now() + 60000 }
    await sessions.transaction(transaction)
    return { sessions, transaction, store, oauth, exchanges: () => exchanges, refreshes: () => refreshes, encryption }
}

test('Wrong browser binding and replayed callback never call token exchange', async () => {
    const fixture = await sessionFixture()
    const query = new URLSearchParams({ state, code: 'opaque' })
    await assert.rejects(fixture.sessions.callback(query, 'wrong'), error => error.status === 400)
    assert.equal(fixture.exchanges(), 0)
    const result = await fixture.sessions.callback(query, fixture.transaction.binding)
    assert.match(result.id, /^[A-Za-z0-9_-]{43}$/)
    await assert.rejects(fixture.sessions.callback(query, fixture.transaction.binding), error => error.status === 400)
    assert.equal(fixture.exchanges(), 1)
    const sanitized = await fixture.sessions.verify(result.id)
    assert.equal(sanitized.user.id, 3)
    assert.equal(sanitized.wallet_initialization_pending, true)
    assert.equal('accessToken' in sanitized, false)
    assert.equal('refreshToken' in sanitized, false)
})

test('Rotation persists both tokens with fixed absolute deadline; stale revision cannot rotate twice', async () => {
    const fixture = await sessionFixture()
    const result = await fixture.sessions.callback(new URLSearchParams({ state, code: 'opaque' }), fixture.transaction.binding)
    const before = await fixture.sessions.read(result.id)
    const after = await fixture.sessions.authorize(result.id, before.revision)
    assert.equal(after.accessToken, 'test-access-rev-2'); assert.equal(after.refreshToken, 'test-refresh-rev-2')
    assert.equal(after.absoluteDeadline, before.absoluteDeadline)
    const again = await fixture.sessions.authorize(result.id, before.revision)
    assert.equal(again.revision, after.revision); assert.equal(fixture.refreshes(), 1)
    for (const record of fixture.store.rows.values()) assert.equal(record.ciphertext.includes('test-access-rev-2'), false)
})

test('Local logout retires durable session and retains encrypted retry if central revocation fails', async () => {
    const fixture = await sessionFixture({ logout: async () => { throw Error('provider down') } })
    const result = await fixture.sessions.callback(new URLSearchParams({ state, code: 'opaque' }), fixture.transaction.binding)
    const loggedOut = await fixture.sessions.logout(result.id)
    assert.equal(loggedOut.revoked, false); assert.equal(loggedOut.revocationPending, true)
    await assert.rejects(fixture.sessions.authorize(result.id), error => error.status === 401)
    assert.equal(fixture.store.retries.length, 1)
    assert.equal(fixture.store.retries[0].ciphertext.includes('test-access-rev-1'), false)
})

test('BFF HTTP boundary rejects CSRF before transport and never replays a mutating 401', async () => {
    const { handleSso } = await import('../server/sso/handler.js')
    const session = { csrf: 'browser-csrf', accessToken: 'SERVER-ONLY-ACCESS', revision: 1 }
    const runtime = { configuration: GAMEZ_CONTRACT, sessions: { authorize: async () => session } }
    const prior = globalThis.fetch
    let calls = 0
    globalThis.fetch = async (url, options) => {
        calls++
        assert.equal(url.origin, GAMEZ_CONTRACT.backendOrigin)
        assert.equal(options.headers.get('authorization'), 'Bearer SERVER-ONLY-ACCESS')
        assert.equal(options.headers.get('cookie'), null)
        assert.equal(options.headers.get('x-internal-token'), null)
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json', 'set-cookie': 'malicious=1' } })
    }
    try {
        const rejected = await handleSso(new Request('https://gamez.icraftds.id/api/bff/payments/create', { method: 'POST', headers: { origin: 'https://attacker.test' } }), runtime)
        assert.equal(rejected.status, 403); assert.equal(calls, 0)
        const response = await handleSso(new Request('https://gamez.icraftds.id/api/bff/payments/create', { method: 'POST', headers: { origin: GAMEZ_CONTRACT.appOrigin, 'x-csrf-token': session.csrf, authorization: 'Bearer UNTRUSTED', 'x-internal-token': 'UNTRUSTED' }, body: '{}' }), runtime)
        assert.equal(response.status, 401); assert.equal(calls, 1)
        assert.equal(response.headers.get('set-cookie'), null)
        assert.match(response.headers.get('cache-control'), /no-store/)
        assert.doesNotMatch(await response.text(), /SERVER-ONLY/)
    } finally { globalThis.fetch = prior }
})

test('BFF start uses separate HttpOnly transaction cookies and validates redirect before authorization', async () => {
    const { handleSso } = await import('../server/sso/handler.js')
    let calls = 0
    const runtime = { configuration: GAMEZ_CONTRACT, sessions: { transaction: async () => {} }, oauth: { begin: async (target, binding) => {
        calls++
        assert.equal(target, '/dashboard')
        assert.match(binding, /^[A-Za-z0-9_-]{43}$/)
        return { url: new URL('https://auth.icraftds.id/oauth/authorize'), transaction: { state: 's'.repeat(43) } }
    } } }
    assert.equal((await handleSso(new Request('https://gamez.icraftds.id/auth/start?return_to=%2F%2Fevil.test'), runtime)).status, 400)
    assert.equal(calls, 0)
    const response = await handleSso(new Request('https://gamez.icraftds.id/auth/start?return_to=%2Fdashboard'), runtime)
    assert.equal(response.status, 303)
    assert.match(response.headers.get('set-cookie'), /__Host-gamez_tx_.*Secure; HttpOnly; SameSite=Lax/)
    assert.doesNotMatch(response.headers.get('set-cookie'), /Domain=/)
})

test('GameZ retains its UserResource envelope and its own wallet initializer', async () => {
    const { gamezProductUser } = await import('../server/sso/runtime.js')
    const user = { id: 7, current_plan: 'pro', credits: 20 }
    assert.deepEqual(gamezProductUser({ data: user }), user)
    assert.throws(() => gamezProductUser({ success: true, data: {} }))
    assert.equal(GAMEZ_CONTRACT.profilePath, '/api/auth/me')
    assert.equal(GAMEZ_CONTRACT.walletInitializePath, '/api/user/wallet/initialize')
})

test('Vercel rewrites preserve callback parameters and route BFF before the SPA', async () => {
    const { functionRequestUrl } = await import('../server/sso/vercel.js')
    const callback = functionRequestUrl('/api/sso?__sso_route=callback&code=opaque&state=state')
    assert.equal(callback.pathname, '/auth/callback')
    assert.equal(callback.searchParams.get('code'), 'opaque')
    assert.equal(callback.searchParams.has('__sso_route'), false)
    assert.equal(functionRequestUrl('/api/sso?__sso_route=bff&__sso_path=user%2Fwallet').pathname, '/api/bff/user/wallet')
    assert.throws(() => functionRequestUrl('/api/sso?__sso_route=bff&__sso_path=internal%2Fdebit'))
    assert.throws(() => functionRequestUrl('/api/sso?__sso_route=start&__sso_route=callback'))
})

test('Expired access is rotated under the logout lock before product-wide revocation', async () => {
    let revokedToken
    const fixture = await sessionFixture({ exchange: async () => ({ accessToken: 'expired', refreshToken: 'r1', expiresAt: Date.now() - 1 }), logout: async token => { revokedToken = token } })
    const result = await fixture.sessions.callback(new URLSearchParams({ state, code: 'opaque' }), fixture.transaction.binding)
    assert.equal((await fixture.sessions.logout(result.id)).revoked, true)
    assert.equal(revokedToken, 'test-access-rev-2')
    assert.equal(fixture.refreshes(), 1)
    await assert.rejects(fixture.sessions.read(result.id), error => error.status === 401)
})

test('Confirmed central revocation retires local session; provider outage preserves it', async () => {
    const fixture = await sessionFixture()
    const result = await fixture.sessions.callback(new URLSearchParams({ state, code: 'opaque' }), fixture.transaction.binding)
    fixture.oauth.profile = async () => { throw { status: 503 } }
    await assert.rejects(fixture.sessions.verify(result.id), error => error.status === 503)
    assert.equal((await fixture.sessions.read(result.id)).status, 'active')
    fixture.oauth.profile = async () => { throw { status: 401 } }
    await assert.rejects(fixture.sessions.verify(result.id), error => error.status === 401)
    await assert.rejects(fixture.sessions.read(result.id), error => error.status === 401)
})

test('BFF preserves multipart bytes and permitted attachment downloads', async () => {
    const { handleSso } = await import('../server/sso/handler.js')
    const session = { csrf: 'csrf', accessToken: 'SERVER_PRIVATE_ACCESS', refreshToken: 'SERVER_PRIVATE_REFRESH', revision: 1 }
    const runtime = { configuration: GAMEZ_CONTRACT, sessions: { authorize: async () => session } }
    const boundary = 'test-boundary'
    const body = `--${boundary}\r\nContent-Disposition: form-data; name="avatar"; filename="avatar.png"\r\nContent-Type: image/png\r\n\r\nimage-bytes\r\n--${boundary}--\r\n`
    const previous = globalThis.fetch
    globalThis.fetch = async (url, options) => {
        assert.equal(url.pathname, '/api/user/profile')
        assert.equal(new TextDecoder().decode(options.body), body)
        assert.equal(options.headers.get('content-type'), `multipart/form-data; boundary=${boundary}`)
        return new Response(new Uint8Array([1, 2, 3]), { headers: { 'content-type': 'application/octet-stream', 'content-disposition': 'attachment; filename="file.bin"', 'set-cookie': 'upstream=1' } })
    }
    try {
        const response = await handleSso(new Request(`${GAMEZ_CONTRACT.appOrigin}/api/bff/user/profile`, { method: 'POST', headers: { origin: GAMEZ_CONTRACT.appOrigin, 'x-csrf-token': session.csrf, 'content-type': `multipart/form-data; boundary=${boundary}` }, body }), runtime)
        assert.equal(response.status, 200)
        assert.equal(response.headers.get('set-cookie'), null)
        assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [1, 2, 3])
    } finally { globalThis.fetch = previous }
})

test('Browser auth routes render HTML recovery page instead of raw JSON on expired callback or session', async () => {
    const { handleSso } = await import('../server/sso/handler.js')
    const { SsoError } = await import('../server/sso/security.js')
    const expiredState = 'expired-tx-0000000000000000000000'
    const deadSessionState = 'dead-session-00000000000000000000'
    const runtime = {
        configuration: GAMEZ_CONTRACT,
        sessions: {
            callback: async (params) => {
                if (params.get('state') === expiredState) throw new SsoError(400, 'Authorization transaction expired or was already used.', 'invalid_callback')
                throw new SsoError(401, 'Please authorize again.', 'reauthorization_required')
            },
            verify: async () => { throw new SsoError(401, 'Local session expired.', 'session_expired') },
        },
        oauth: {
            begin: async () => { throw new SsoError(503, 'SSO service is unavailable.') },
        },
    }

    const expiredCallback = await handleSso(
        new Request(`${GAMEZ_CONTRACT.appOrigin}/auth/callback?state=${expiredState}&code=opaque`, { headers: { accept: 'text/html,application/xhtml+xml' } }),
        runtime,
    )
    assert.equal(expiredCallback.status, 400)
    assert.match(expiredCallback.headers.get('content-type'), /^text\/html/)
    assert.match(expiredCallback.headers.get('set-cookie'), /__Host-gamez_tx_expired-tx-0000000000000000000000=; Path=\/; Secure; HttpOnly; SameSite=Lax; Max-Age=0/)
    const expiredBody = await expiredCallback.text()
    assert.match(expiredBody, /Tautan Autentikasi Sudah Kadaluarsa/)
    assert.match(expiredBody, /\/auth\/start\?return_to=%2Fdashboard/)

    const expiredSessionCallback = await handleSso(
        new Request(`${GAMEZ_CONTRACT.appOrigin}/auth/callback?state=${deadSessionState}&code=opaque`, { headers: { cookie: `${GAMEZ_CONTRACT.cookieName}=old`, accept: 'text/html' } }),
        runtime,
    )
    assert.equal(expiredSessionCallback.status, 401)
    assert.match(expiredSessionCallback.headers.get('content-type'), /^text\/html/)
    assert.match(expiredSessionCallback.headers.get('set-cookie'), /__Host-gamez_session=; Path=\/; Secure; HttpOnly; SameSite=Lax; Max-Age=0/)
    assert.match(await expiredSessionCallback.text(), /Sesi Login Anda Telah Habis/)

    const apiSession = await handleSso(new Request(`${GAMEZ_CONTRACT.appOrigin}/api/session`, { headers: { accept: 'application/json' } }), runtime)
    assert.equal(apiSession.status, 401)
    assert.match(apiSession.headers.get('content-type'), /^application\/json/)

    const browserSession = await handleSso(
        new Request(`${GAMEZ_CONTRACT.appOrigin}/api/session`, { headers: { accept: 'text/html', 'sec-fetch-mode': 'navigate' } }),
        runtime,
    )
    assert.equal(browserSession.status, 401)
    assert.match(browserSession.headers.get('content-type'), /^text\/html/)

    const jsonCallback = await handleSso(
        new Request(`${GAMEZ_CONTRACT.appOrigin}/auth/callback?state=${expiredState}&code=opaque`, { headers: { accept: 'application/json' } }),
        runtime,
    )
    assert.equal(jsonCallback.status, 400)
    assert.match(jsonCallback.headers.get('content-type'), /^application\/json/)

    const expiredStartOutage = await handleSso(
        new Request(`${GAMEZ_CONTRACT.appOrigin}/auth/start?return_to=%2Fdashboard`, { headers: { cookie: `${GAMEZ_CONTRACT.cookieName}=old`, accept: 'text/html' } }),
        runtime,
    )
    assert.equal(expiredStartOutage.status, 503)
    assert.match(expiredStartOutage.headers.get('content-type'), /^text\/html/)
    assert.match(expiredStartOutage.headers.get('set-cookie'), /__Host-gamez_session=; Path=\/; Secure; HttpOnly; SameSite=Lax; Max-Age=0/)
    assert.match(await expiredStartOutage.text(), /Layanan Autentikasi Sedang Tidak Tersedia/)
})

test('Local Redis TCP client (redis://127.0.0.1) executes RESP2 session operations without Upstash', async t => {
    const net = await import('node:net')
    const { upstashSessionStore } = await import('../server/sso/store.js')
    const kv = new Map()

    const redisServer = net.createServer(socket => {
        socket.on('data', chunk => {
            const text = chunk.toString('utf8')
            const lines = text.split('\r\n')
            const args = []
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].startsWith('$')) {
                    args.push(lines[i + 1] ?? '')
                    i++
                }
            }
            const cmd = (args[0] || '').toUpperCase()
            if (cmd === 'SET') {
                const key = args[1]
                const val = args[2]
                const isNx = args.includes('NX')
                if (isNx && kv.has(key)) {
                    socket.write('$-1\r\n')
                } else {
                    kv.set(key, val)
                    socket.write('+OK\r\n')
                }
            } else if (cmd === 'GET') {
                const val = kv.get(args[1])
                if (val === undefined) socket.write('$-1\r\n')
                else socket.write(`$${Buffer.byteLength(val, 'utf8')}\r\n${val}\r\n`)
            } else if (cmd === 'EVAL') {
                const key = args[3]
                const rev = Number(args[4])
                const raw = kv.get(key)
                if (!raw) {
                    socket.write(':0\r\n')
                } else {
                    const row = JSON.parse(raw)
                    if (row.status === 'revoked' || row.revision !== rev) {
                        socket.write(':0\r\n')
                    } else {
                        kv.delete(key)
                        socket.write(':1\r\n')
                    }
                }
            } else {
                socket.write('+OK\r\n')
            }
        })
    })

    await new Promise(resolve => redisServer.listen(0, '127.0.0.1', resolve))
    t.after(() => redisServer.close())
    const port = redisServer.address().port

    const store = upstashSessionStore({
        url: `redis://127.0.0.1:${port}`,
        token: '',
        product: 'gamez',
        environment: 'production',
    })

    const expiresAt = Date.now() + 60000
    assert.equal(await store.create('transaction:local', 'jwe-local-cipher', expiresAt), true)
    assert.equal(await store.create('transaction:local', 'jwe-local-cipher', expiresAt), false)
    const readBack = await store.read('transaction:local')
    assert.equal(readBack.ciphertext, 'jwe-local-cipher')
    assert.equal(readBack.revision, 1)
    assert.equal(await store.consume('transaction:local', 1), true)
    assert.equal(await store.consume('transaction:local', 1), false)
    assert.equal(await store.read('transaction:local'), null)
})
