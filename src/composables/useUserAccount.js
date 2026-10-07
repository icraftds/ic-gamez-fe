import { ref, computed } from 'vue'
import api, { initCsrf } from '../services/api'
import { ssoEnabled, ssoState, loadSsoSession, logoutSso } from '../services/sso'

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
const isLoggedIn = ref(!!authIdentity())
const isLoading = ref(false)
const isBootstrapping = ref(true)

const userProfile = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  avatar: '',
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  streak: 0,
  longest_streak: 0,
  is_admin: false,
  joinDate: ''
})

export function clearUserAccount() {
  isLoggedIn.value = false
  userProfile.value = { id: null, name: '', email: '', phone: '', avatar: '', level: 1, xp: 0, totalXp: 0, nextLevelXp: 100, streak: 0, longest_streak: 0, is_admin: false, joinDate: '' }
  coinz.value = null; walletStatus.value = 'unavailable'; walletInitializationPending.value = false
  currentPlan.value = 'free'; isPremiumUser.value = false; credits.value = 10; initializedToken = null
}

export function useUserAccount() {
  /**
   * Fetch current user data from the backend
   */
  const loadUser = async (silent = false) => {
    const token = authIdentity()
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
        email: data.email,
        phone: data.phone || '',
        avatar: (data.avatar_url && !data.avatar_url.includes('dicebear.com')) ? data.avatar_url : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.name || 'User') + '&background=random',
        level: data.level,
        xp: data.xp,
        totalXp: data.total_xp,
        nextLevelXp: data.next_level_xp,
        streak: data.current_streak,
        longest_streak: data.longest_streak,
        is_admin: data.is_admin || false,
        joinDate: new Date(data.created_at).toLocaleDateString()
      }
      credits.value = data.credits
      isPremiumUser.value = data.is_premium
      currentPlan.value = typeof data.current_plan === 'object' && data.current_plan !== null 
        ? data.current_plan.slug 
        : (data.current_plan || 'free')

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

  const bootstrapSession = async () => {
    isBootstrapping.value = true
    try {
      if (ssoEnabled) {
        try { if (!await loadSsoSession()) return false } catch { return false }
      }
      const user = await fetchUser(true)
      if (!user) return false
      if (!ssoEnabled) await initializeWallet()
      else walletInitializationPending.value = ssoState.walletPending.value
      await fetchWallet()
      return true
    } finally {
      isBootstrapping.value = false
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
        id: null, name: '', email: '', avatar: '',
        level: 1, xp: 0, totalXp: 0, nextLevelXp: 100, streak: 0, longest_streak: 0, is_admin: false, joinDate: ''
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

  return {
    isLoggedIn,
    isLoading,
    isBootstrapping,
    userProfile,
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
    credits,
    coinz,
    maxCredits,
    isPremiumUser,
    currentPlan,
    deductCredit,
    checkoutPlan,
    resetCredits,
    hasEnoughCredits,
    subscriptionStatus
  }
}
