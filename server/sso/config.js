import { SsoError } from './security.js'

export const GAMEZ_CONTRACT = Object.freeze({
    issuer: 'https://ic-auth.unikom.my.id',
    clientId: '01a113e2-6f4c-709e-bbc1-7be88648c0d7',
    redirectUri: 'https://gamez.icraftds.id/auth/callback',
    appOrigin: 'https://gamez.icraftds.id',
    backendOrigin: 'https://icgamez.unikom.my.id',
    product: 'gamez', cookieName: '__Host-gamez_session',
    profilePath: '/api/auth/me', walletInitializePath: '/api/user/wallet/initialize',
})

export function gamezConfiguration(config) {
    if (config.enabled !== true && config.enabled !== 'true') throw new SsoError(503, 'SSO rollout is not enabled.', 'sso_disabled')
    if (config.environment && config.environment !== 'production') throw new SsoError(503, 'This client has no registered development or preview callback.', 'sso_configuration')
    for (const key of ['issuer', 'clientId', 'redirectUri', 'appOrigin', 'backendOrigin']) {
        if (config[key] !== GAMEZ_CONTRACT[key]) throw new SsoError(503, 'SSO deployment configuration is invalid.', 'sso_configuration')
    }
    if (typeof config.clientSecret !== 'string' || !config.clientSecret || typeof config.encryptionKey !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(config.encryptionKey)) {
        throw new SsoError(503, 'Private SSO configuration is unavailable.', 'sso_configuration')
    }
    return { ...config, ...GAMEZ_CONTRACT }
}
