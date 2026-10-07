import { gamezRuntime } from './runtime.js'
import { GAMEZ_CONTRACT } from './config.js'
import { handleSso } from './handler.js'
import { SsoError, noStoreHeaders, singleParameter, productUrl } from './security.js'

export function functionRequestUrl(requestUrl, query = {}) {
    const url = new URL(requestUrl, GAMEZ_CONTRACT.appOrigin)
    if (url.pathname === '/api/sso') {
        const parameter = name => {
            const raw = query[name]
            if (Array.isArray(raw)) throw new SsoError(400, 'Duplicate routing parameter.', 'invalid_path')
            return singleParameter(url.searchParams, name, false) || (typeof raw === 'string' ? raw : null)
        }
        const route = parameter('__sso_route')
        const paths = { start: '/auth/start', callback: '/auth/callback', session: '/api/session', logout: '/api/auth/logout' }
        if (route === 'bff') {
            const path = parameter('__sso_path')
            productUrl(path, '', GAMEZ_CONTRACT.backendOrigin)
            url.pathname = `/api/bff/${path}`
        } else if (Object.hasOwn(paths, route)) url.pathname = paths[route]
        else throw new SsoError(404, 'Route not found.', 'route_missing')
    }
    url.searchParams.delete('__sso_route'); url.searchParams.delete('__sso_path')
    return url
}

export default async function handler(req, res) {
    let response
    try {
        const configuration = {
            ...GAMEZ_CONTRACT, enabled: process.env.SSO_ENABLED === 'true',
            issuer: process.env.SSO_ISSUER || GAMEZ_CONTRACT.issuer,
            clientId: process.env.SSO_CLIENT_ID || GAMEZ_CONTRACT.clientId,
            redirectUri: process.env.SSO_REDIRECT_URI || GAMEZ_CONTRACT.redirectUri,
            appOrigin: process.env.APP_ORIGIN || GAMEZ_CONTRACT.appOrigin,
            backendOrigin: process.env.PRODUCT_BACKEND_URL || GAMEZ_CONTRACT.backendOrigin,
            clientSecret: process.env.SSO_CLIENT_SECRET || '',
            encryptionKey: process.env.BFF_SESSION_ENCRYPTION_KEY || '',
            redisUrl: process.env.UPSTASH_REDIS_REST_URL || '',
            redisToken: process.env.UPSTASH_REDIS_REST_TOKEN || '',
            environment: process.env.VERCEL_ENV || 'development',
        }
        const requestHeaders = new Headers()
        for (const [name, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') requestHeaders.set(name, value)
            else if (Array.isArray(value)) for (const item of value) requestHeaders.append(name, item)
        }
        const url = functionRequestUrl(req.url, req.query)
        const body = ['GET', 'HEAD'].includes(req.method) ? undefined : req
        const request = new Request(url, { method: req.method, headers: requestHeaders, ...(body ? { body, duplex: 'half' } : {}) })
        response = await handleSso(request, gamezRuntime(configuration))
    } catch (error) {
        const safe = error instanceof SsoError ? error : new SsoError(503, 'SSO service is unavailable.')
        response = new Response(JSON.stringify({ message: safe.message, code: safe.code }), { status: safe.status, headers: { ...noStoreHeaders, 'content-type': 'application/json' } })
    }
    res.statusCode = response.status
    for (const [name, value] of response.headers) if (name !== 'set-cookie') res.setHeader(name, value)
    const cookies = response.headers.getSetCookie()
    if (cookies.length) res.setHeader('set-cookie', cookies)
    if (!response.body) return res.end()
    const reader = response.body.getReader()
    try {
        while (true) {
            const { value, done } = await reader.read()
            if (done) break
            if (!res.write(Buffer.from(value))) await new Promise(resolve => res.once('drain', resolve))
        }
    } finally { reader.releaseLock(); res.end() }
}
