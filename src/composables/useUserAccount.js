import { ref, computed } from 'vue'
import api, { initCsrf } from '../services/api'
import { ssoEnabled, ssoState, loadSsoSession, logoutSso } from '../services/sso'

export function sanitizeAvatarUrl(url, name = 'User') {
  if (!url || typeof url !== 'string' || url.includes('dicebear.com')) {
    return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name || 'User') + '&background=random'
  }
  // If avatar URL has localhost:8000 but client is accessing from non-localhost environment
  if (url.includes('localhost:8000') || url.includes('127.0.0.1:8000')) {
    const isLocalhostEnv = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    if (!isLocalhostEnv) {
      return url.replace(/^https?:\/\/(?:localhost|127\.0\.0\.1):8000/, 'https://icgamez.unikom.my.id')
    }
  }
  return url
}

const authIdentity = () => ssoEnabled ? ssoState.user.value?.id ?? null : localStorage.getItem('auth_token')

const credits = ref(10)
const coinz = ref(null)
const walletStatus = ref('unavailable')
const walletInitializationPending = ref(false)
let userRequest = null
let walletRequest = null
let initializeRequest = null
let initializedToken = null
const isPremiumUser = ref(false)
const maxCredits = computed(() => {
  if (currentPlan.value === 'expert') return 25
  if (currentPlan.value === 'pro') return 20
  return 10
})
const currentPlan = ref('free')
const proQuota = ref({ total_quota: 0, used_quota: 0, remaining_quota: 0, selected_path_ids: [] })
const unlockedPathIds = ref([])
const systemConfig = ref({
  market_topup_url: 'https://market.icraftds.id/topup',
  market_redirect_enabled: true,
  module_default_price: 14999,
  module_multibuy_discount_percent: 25,
  module_default_duration_days: 30,
  pro_max_selectable_modules: 12
})
let configRequest = null
const isLoggedIn = ref(!!authIdentity())
const isLoading = ref(false)
const isBootstrapping = ref(true)
const isAuthLoading = ref(false)
const isRedirectingToSso = ref(false)
const authLoadingLabel = ref('autentikasi')
const authLoadingText = ref('')
const activeBorderId = ref(null)
let authLoadingStartedAt = 0

if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      isRedirectingToSso.value = false
      stopAuthLoading(true)
    }
  })
}

export function startAuthLoading(options = {}) {
  authLoadingStartedAt = Date.now()
  isAuthLoading.value = true
  if (typeof options === 'string') {
    if (options.startsWith('Memuat') || options.startsWith('Menghubungkan') || options.startsWith('Mengarahkan') || options.startsWith('Memproses')) {
      authLoadingText.value = options
      authLoadingLabel.value = ''
    } else {
      authLoadingLabel.value = options
      authLoadingText.value = ''
    }
  } else {
    authLoadingLabel.value = options.label || 'autentikasi'
    authLoadingText.value = options.text || ''
  }
}

export function redirectToSso(target = '/dashboard', type = 'masuk') {
  isRedirectingToSso.value = true
  startAuthLoading({
    text: type === 'daftar' ? 'Memuat pendaftaran akun' : 'Memuat autentikasi masuk'
  })

  const returnTo = encodeURIComponent(target)
  const ssoUrl = `/auth/start?return_to=${returnTo}`

  // Direct immediately to SSO endpoint; loader remains permanently on-screen until page unloads
  window.location.assign(ssoUrl)
}

export function stopAuthLoading(force = false) {
  // If an SSO redirect is in progress, NEVER dismiss the loader on Game Z!
  // The loader must stay visible until the browser arrives at SSO.
  if (isRedirectingToSso.value && !force) return

  isAuthLoading.value = false
  authLoadingText.value = ''
  authLoadingLabel.value = 'autentikasi'
}

export function finishAuthLoading(minDuration = 450) {
  if (!isAuthLoading.value) return
  const elapsed = Date.now() - authLoadingStartedAt
  const remaining = Math.max(0, minDuration - elapsed)
  setTimeout(() => {
    stopAuthLoading()
  }, remaining)
}

const userProfile = ref({
  id: null,
  name: '',
  username: '',
  tag_id: '',
  last_username_change_at: null,
  email: '',
  phone: '',
  avatar: '',
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  streak: 0,
  longest_streak: 0,
  is_admin: false,
  friends_count: 0,
  joinDate: ''
})

export function clearUserAccount() {
  isLoggedIn.value = false
  userProfile.value = { id: null, name: '', username: '', tag_id: '', last_username_change_at: null, email: '', phone: '', avatar: '', level: 1, xp: 0, monthlyXp: 0, totalXp: 0, nextLevelXp: 100, streak: 0, longest_streak: 0, is_admin: false, showcase_medals: null, joinDate: '' }
  coinz.value = null; walletStatus.value = 'unavailable'; walletInitializationPending.value = false
  currentPlan.value = 'free'; isPremiumUser.value = false; credits.value = 10; initializedToken = null
  proQuota.value = { total_quota: 0, used_quota: 0, remaining_quota: 0, selected_path_ids: [] }
  unlockedPathIds.value = []
  activeBorderId.value = null
}

export function useUserAccount() {
  /**
   * Fetch current user data from the backend
   */
  const loadUser = async (silent = false) => {
    const token = authIdentity()
    if (!token) {
      isLoggedIn.value = false
      if (!silent) isLoading.value = false
      return null
    }
    try {
      if (!silent) isLoading.value = true
      const response = await api.get('/auth/me')
      if (token !== authIdentity()) return null
      const data = response.data.data
      
      if (userProfile.value.id !== data.id) { coinz.value = null; walletStatus.value = 'unavailable' }
      isLoggedIn.value = true
      userProfile.value = {
        id: data.id,
        name: data.name,
        username: data.username,
        tag_id: data.tag_id,
        last_username_change_at: data.last_username_change_at,
        email: data.email,
        phone: data.phone || '',
        avatar: sanitizeAvatarUrl(data.avatar_url, data.name),
        level: Number(data.level) || 1,
        xp: Number(data.xp) || 0,
        monthlyXp: Number(data.monthly_xp) || 0,
        totalXp: Number(data.total_xp ?? data.xp) || 0,
        nextLevelXp: Number(data.next_level_xp) || 100,
        streak: data.current_streak,
        longest_streak: data.longest_streak,
        is_admin: data.is_admin || false,
        showcase_medals: data.showcase_medals || null,
        friends_count: data.friends_count || 0,
        joinDate: new Date(data.created_at).toLocaleDateString()
      }
      credits.value = data.credits
      isPremiumUser.value = data.is_premium
      currentPlan.value = typeof data.current_plan === 'object' && data.current_plan !== null 
        ? data.current_plan.slug 
        : (data.current_plan || 'free')
      proQuota.value = data.pro_quota || { total_quota: 0, used_quota: 0, remaining_quota: 0, selected_path_ids: [] }
      unlockedPathIds.value = Array.isArray(data.unlocked_path_ids) ? data.unlocked_path_ids.map(Number) : []

      if (data.active_border_id) activeBorderId.value = data.active_border_id;

      return data
    } catch (error) {
      if (token === authIdentity() && error.response?.status === 401) {
        localStorage.removeItem('auth_token')
        clearUserAccount()
      }
      return null
    } finally {
      if (!silent) isLoading.value = false
    }
  }

  const fetchUser = (silent = false) => {
    if (!userRequest) userRequest = loadUser(silent).finally(() => { userRequest = null })
    return userRequest
  }

  const fetchWallet = () => {
    if (walletRequest) return walletRequest
    const token = authIdentity()
    walletRequest = api.get('/user/wallet', { params: { include_histories: 0 } }).then(response => {
      if (token !== authIdentity()) return false
      const balance = response.data.data?.balance
      if (balance === null || balance === undefined || !Number.isFinite(Number(balance))) throw new Error('Saldo tidak tersedia')
      coinz.value = Number(balance)
      walletStatus.value = 'fresh'
      return true
    }).catch(() => {
      if (token === authIdentity()) walletStatus.value = coinz.value === null ? 'unavailable' : 'stale'
      return false
    }).finally(() => { walletRequest = null })
    return walletRequest
  }

  const initializeWallet = (retry = false) => {
    const token = authIdentity()
    if (!token) return Promise.resolve(false)
    if (initializeRequest) return initializeRequest
    if (!retry && initializedToken === token) return Promise.resolve(!walletInitializationPending.value)
    initializedToken = token
    initializeRequest = api.post('/user/wallet/initialize', {}).then(() => {
      if (token === authIdentity()) walletInitializationPending.value = false
      return true
    }).catch(() => {
      if (token === authIdentity()) walletInitializationPending.value = true
      return false
    }).finally(() => { initializeRequest = null })
    return initializeRequest
  }

  const fetchPublicConfig = (force = false) => {
    if (configRequest && !force) return configRequest
    configRequest = api.get('/system/public-config').then(res => {
      if (res.data?.success && res.data?.data) {
        systemConfig.value = { ...systemConfig.value, ...res.data.data }
      }
      return systemConfig.value
    }).catch(() => systemConfig.value)
    return configRequest
  }

  const hasModuleAccess = (path) => {
    if (!path) return false
    if (path.is_unlocked) return true
    if (currentPlan.value === 'expert') return true
    if (path.id && unlockedPathIds.value.includes(Number(path.id))) return true
    return path.is_premium === false
  }

  const bootstrapSession = async (silent = false) => {
    if (!silent) isBootstrapping.value = true
    try {
      fetchPublicConfig()
      if (ssoEnabled) {
        try { if (!await loadSsoSession()) return false } catch { return false }
      }
      const user = await fetchUser(true)
      if (!user) return false
      if (!ssoEnabled) {
        await initializeWallet()
      } else {
        walletInitializationPending.value = ssoState.walletPending.value
        if (walletInitializationPending.value) {
          await initializeWallet()
        }
      }
      await fetchWallet()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gamez-session-loaded'))
      }
      return true
    } finally {
      if (!silent) isBootstrapping.value = false
    }
  }

  /**
   * Perform login via Laravel Sanctum
   * For testing, defaults to seeded user if no credentials provided.
   */
  const login = async (email = 'admin@example.com', password = 'password') => {
    if (ssoEnabled) { window.location.assign('/auth/start?return_to=%2Fdashboard'); return { success: false } }
    if (isLoading.value) return { success: false, message: 'Permintaan sedang diproses.' }
    try {
      isLoading.value = true
      await initCsrf()
      const response = await api.post('/auth/login', { email, password })
      
      // Simpan token bawaan SSO ke localStorage
      const token = response.data?.data?.token || response.data?.token
      if (token) {
        localStorage.setItem('auth_token', token)
      }
      
      await bootstrapSession()
      return { success: true }
    } catch (error) {

      if (error.response?.status === 429) {
        return { success: false, message: error.response.data.message, retryAfter: error.retryAfter }
      }
      const message = error.response?.data?.message || 'Email atau kata sandi salah'
      return { success: false, message, retryAfter: error.retryAfter, data: error.response?.data }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Register a new user
   */
  const register = async (name, email, phone, password, password_confirmation) => {
    if (ssoEnabled) return login()
    if (isLoading.value) return { success: false, message: 'Permintaan sedang diproses.' }
    try {
      isLoading.value = true
      await initCsrf()
      const response = await api.post('/auth/register', { name, email, phone, password, password_confirmation })
      
      // Jangan login otomatis & jangan simpan token karena butuh OTP
      
      return { success: true }
    } catch (error) {

      if (error.response?.status === 429) {
        return { success: false, message: error.response.data.message, retryAfter: error.retryAfter }
      }
      const message = error.response?.data?.message || 'Pendaftaran gagal'
      const errors = error.response?.data?.errors || {}
      return { success: false, message, errors }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Verify OTP
   */
  const verifyOtp = async (email, otp) => {
    if (ssoEnabled) return login()
    if (isLoading.value) return { success: false, message: 'Permintaan sedang diproses.' }
    if (!/^\d{6}$/.test(String(otp))) return { success: false, message: 'OTP harus enam digit.' }
    try {
      isLoading.value = true
      const response = await api.post('/auth/verify-otp', { email, otp: String(otp) })
      
      // Simpan token bawaan SSO
      const token = response.data?.data?.token || response.data?.token
      if (token) {
        localStorage.setItem('auth_token', token)
      }
      
      await bootstrapSession() // Auto login
      return { success: true }
    } catch (error) {

      const message = error.response?.data?.message || 'OTP tidak valid atau kadaluarsa'
      return { success: false, message, retryAfter: error.retryAfter, data: error.response?.data }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Resend OTP
   */
  const resendOtp = async (email) => {
    if (ssoEnabled) return { success: false, message: 'Lanjutkan melalui IC Auth.' }
    if (isLoading.value) return { success: false, message: 'Permintaan sedang diproses.' }
    try {
      isLoading.value = true
      const response = await api.post('/auth/resend-otp', { email })
      return { success: true, message: response.data?.message || 'OTP berhasil dikirim ulang' }
    } catch (error) {

      const message = error.response?.data?.message || 'Gagal mengirim ulang OTP'
      return { success: false, message, retryAfter: error.retryAfter, data: error.response?.data }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Perform logout
   */
  const logout = async () => {
    if (ssoEnabled) await logoutSso()
    try {
      isLoading.value = true
      if (!ssoEnabled) await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error.response?.status || 'request_failed')
    } finally {
      // Hapus token dari localStorage saat logout
      localStorage.removeItem('auth_token')
      localStorage.removeItem('sso_token')
      
      isLoggedIn.value = false
      userProfile.value = {
        id: null, name: '', username: '', tag_id: '', last_username_change_at: null, email: '', phone: '', avatar: '',
        level: 1, xp: 0, totalXp: 0, nextLevelXp: 100, streak: 0, longest_streak: 0, is_admin: false, showcase_medals: null, joinDate: ''
      }
      coinz.value = null
      walletStatus.value = 'unavailable'
      walletInitializationPending.value = false
      initializedToken = null
      currentPlan.value = 'free'
      credits.value = 10
      isPremiumUser.value = false
      isLoading.value = false
    }
  }

  /**
   * Trigger backend to refresh stats (used after completing activities)
   */
  const refreshStats = async () => {
    await Promise.all([fetchUser(), fetchWallet()])
  }

  // Deprecated: used to add XP locally. Now it just refreshes from backend.
  const addXp = async (amount) => {
    console.warn('addXp is deprecated. Backend handles XP automatically. Refreshing stats instead.')
    await refreshStats()
  }

  /**
   * Optimistic local XP update (untuk Optimistic UI).
   * Tidak memanggil API - hanya update local reactive state.
   */
  const addXpLocal = (amount) => {
    const numAmount = Number(amount) || 0
    if (numAmount <= 0) return
    const curXp = Number(userProfile.value.xp) || 0
    const curTotalXp = Number(userProfile.value.totalXp ?? curXp) || 0
    const curNextLevelXp = Number(userProfile.value.nextLevelXp) || 100
    let curLevel = Number(userProfile.value.level) || 1

    let newXp = curXp + numAmount
    let newNextLevelXp = curNextLevelXp

    while (newXp >= newNextLevelXp) {
      newXp -= newNextLevelXp
      curLevel += 1
      newNextLevelXp = Math.round(newNextLevelXp * 1.2)
    }

    userProfile.value.xp = newXp
    userProfile.value.totalXp = curTotalXp + numAmount
    userProfile.value.level = curLevel
    userProfile.value.nextLevelXp = newNextLevelXp
  }

  /**
   * Optimistic local Coinz update (untuk Optimistic UI).
   * Tidak memanggil API - hanya update local reactive state.
   */
  const addCoinzLocal = (amount) => {
    const numAmount = Number(amount) || 0
    if (numAmount <= 0) return
    coinz.value = (Number(coinz.value) || 0) + numAmount
  }

  const deductCredit = async (amount = 1) => {
    if (credits.value >= amount) {
      // Optimitic update
      credits.value -= amount
      try {
        await api.post('/user/deduct-credits', { amount })
      } catch (error) {
        console.error('Failed to deduct credits on backend', error.response?.status || 'request_failed')
      }
      return true
    }
    return false
  }

  // upgradeToPremium dihapus sesuai PRD baru, gunakan checkoutPlan.

  const checkoutPlan = async (planId, couponCode = '') => {
    try {
      isLoading.value = true
      
      const payload = {
        plan_id: planId,
        coupon_code: couponCode || null
      }
      
      const response = await api.post('/subscription/checkout', payload)
      
      // Update state setelah berhasil
      await fetchUser() // fetch ulang data user untuk mengupdate is_premium dan current_plan
      
      return { success: true, message: response.data.message || `Selamat! Pembayaran berhasil.` }
    } catch (error) {
      console.error('Checkout failed', error.response?.status || 'request_failed')
      const message = error.response?.data?.message || 'Pembayaran gagal. Silakan coba lagi.'
      // alert(message) // Opsional, UI akan menangani error ini
      return { success: false, message, retryAfter: error.retryAfter, data: error.response?.data }
    } finally {
      isLoading.value = false
    }
  }

  const resetCredits = () => {
    // Usually handled by backend cron job, but we leave this for local mock consistency if needed
    credits.value = maxCredits.value
  }

  const hasEnoughCredits = (amount = 1) => {
    return credits.value >= amount
  }

  const subscriptionStatus = computed(() => {
    return isPremiumUser.value ? 'Premium' : 'Gratis'
  })

  const userStats = ref({
    events: { daily: 0, weekly: 0, annual: 0 }
  })

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/user/statistics')
      if (response.data && response.data.data) {
        userStats.value = response.data.data
      }
    } catch (error) {
      console.error('Failed to fetch user stats', error.response?.status || 'request_failed')
    }
  }

  const setActiveBorder = async (borderId, imageUrl = null) => {
    // Optimistic update
    activeBorderId.value = borderId;
    if (userProfile.value) {
      userProfile.value.active_border_id = borderId;
      userProfile.value.active_border_url = imageUrl;
    }
    
    try {
      await api.put('/user/active-border', { border_id: borderId });
    } catch (error) {
      console.error('Failed to update active border', error);
      // Fallback in case of error could be implemented here
    }
  }

  return {
    isLoggedIn,
    isLoading,
    isBootstrapping,
    userProfile,
    activeBorderId,
    setActiveBorder,
    userStats,
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
    fetchUser,
    fetchWallet,
    initializeWallet,
    bootstrapSession,
    walletStatus,
    walletInitializationPending,
    fetchUserStats,
    refreshStats,
    addXp,
    addXpLocal,
    addCoinzLocal,
    credits,
    coinz,
    maxCredits,
    isPremiumUser,
    currentPlan,
    proQuota,
    unlockedPathIds,
    systemConfig,
    fetchPublicConfig,
    hasModuleAccess,
    isAuthLoading,
    isRedirectingToSso,
    authLoadingLabel,
    authLoadingText,
    startAuthLoading,
    stopAuthLoading,
    finishAuthLoading,
    redirectToSso,
    deductCredit,
    checkoutPlan,
    resetCredits,
    hasEnoughCredits,
    subscriptionStatus
  }
}
