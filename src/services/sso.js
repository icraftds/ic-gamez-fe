import { ref } from 'vue'

export const ssoEnabled = __SSO_ENABLED__
export const globalLogoutEnabled = ssoEnabled && __SSO_GLOBAL_LOGOUT_ENABLED__
export const ssoState = { user: ref(null), csrf: ref(null), status: ref('idle'), walletPending: ref(false), generation: 0 }
let inFlight = null

export function clearSsoSession() {
    ssoState.user.value = null; ssoState.csrf.value = null
    ssoState.walletPending.value = false; ssoState.status.value = 'guest'; ssoState.generation++
    window.dispatchEvent(new CustomEvent('gamez-session-cleared'))
}

export async function sessionRequest(path, options = {}) {
    let response
    try { response = await fetch(path, { ...options, credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(15000) }) }
    catch { throw { response: { status: 503, data: { message: 'Layanan sesi belum tersedia.' } } } }
    const data = await response.json()
    if (!response.ok) throw { response: { status: response.status, data } }
    return data
}

export function loadSsoSession() {
    if (inFlight) return inFlight
    const generation = ssoState.generation
    inFlight = sessionRequest('/api/session').then(data => {
        if (generation !== ssoState.generation) return null
        ssoState.user.value = data.user; ssoState.csrf.value = data.csrf
        ssoState.walletPending.value = data.wallet_initialization_pending
        ssoState.status.value = 'authenticated'
        return data.user
    }).catch(error => {
        if ([401, 403].includes(error.response?.status)) { clearSsoSession(); return null }
        ssoState.status.value = 'unavailable'
        throw error
    }).finally(() => { inFlight = null })
    return inFlight
}

export async function logoutSso() {
    let result
    try { result = await sessionRequest('/api/auth/logout', { method: 'POST', headers: { 'X-CSRF-Token': ssoState.csrf.value || '' } }) }
    catch (error) {
        if (error.response?.status !== 401) throw error
        result = { revoked: false, alreadySignedOut: true }
    }
    clearSsoSession()
    return result
}
