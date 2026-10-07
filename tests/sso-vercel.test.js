import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import handler from '../server/sso/vercel.js'

test('Vercel Node adapter returns sanitized guest/errors and preserves host-only cookie headers', async t => {
    const settings = {
        SSO_ENABLED: 'true', VERCEL_ENV: 'production', SSO_CLIENT_SECRET: 'TEST_ONLY_NODE_CLIENT_CANARY',
        BFF_SESSION_ENCRYPTION_KEY: 'b'.repeat(43), UPSTASH_REDIS_REST_URL: 'https://redis-test.invalid',
        UPSTASH_REDIS_REST_TOKEN: 'TEST_ONLY_NODE_REDIS_CANARY',
    }
    const previous = Object.fromEntries(Object.keys(settings).map(key => [key, process.env[key]]))
    Object.assign(process.env, settings)
    const server = createServer(handler)
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
    t.after(async () => {
        server.closeAllConnections()
        await new Promise(resolve => server.close(resolve))
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) delete process.env[key]
            else process.env[key] = value
        }
    })
    const origin = `http://127.0.0.1:${server.address().port}`
    for (const [path, status] of [['/api/session', 401], ['/auth/start?return_to=%2F%2Fevil.test', 400], ['/auth/callback?state=invalid&code=opaque', 400]]) {
        const response = await fetch(origin + path)
        assert.equal(response.status, status)
        assert.match(response.headers.get('cache-control'), /no-store/)
        assert.equal(response.headers.get('referrer-policy'), 'no-referrer')
        assert.doesNotMatch(await response.text(), /TEST_ONLY_NODE|stack|accessToken|refreshToken/)
        if (status === 401) {
            assert.match(response.headers.get('set-cookie'), /__Host-gamez_session=; Path=\/; Secure; HttpOnly; SameSite=Lax; Max-Age=0/)
            assert.doesNotMatch(response.headers.get('set-cookie'), /Domain=/)
        }
    }
    const rewritten = await fetch(origin + '/api/sso?__sso_route=session')
    assert.equal(rewritten.status, 401)
})
