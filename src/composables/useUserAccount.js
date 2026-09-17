import { ref, computed } from 'vue'
import api, { initCsrf } from '../services/api'

const credits = ref(5)
const maxCredits = 5
const isPremiumUser = ref(false)
const currentPlan = ref('free')
const isLoggedIn = ref(false)
const isLoading = ref(false)

const userProfile = ref({
  id: null,
  name: '',
  email: '',
  avatar: '',
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  streak: 0,
  longest_streak: 0,
  joinDate: ''
})

export function useUserAccount() {
  /**
   * Fetch current user data from the backend
   */
  const fetchUser = async () => {
    try {
      isLoading.value = true
      const response = await api.get('/auth/me')
      const data = response.data.data
      
      isLoggedIn.value = true
      userProfile.value = {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + data.name,
        level: data.level,
        xp: data.xp,
        totalXp: data.total_xp,
        nextLevelXp: data.next_level_xp,
        streak: data.current_streak,
        longest_streak: data.longest_streak,
        joinDate: new Date(data.created_at).toLocaleDateString()
      }
      credits.value = data.credits
      isPremiumUser.value = data.is_premium
    } catch (error) {
      isLoggedIn.value = false
      // Clear user data on failure (e.g. 401)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Perform login via Laravel Sanctum
   * For testing, defaults to seeded user if no credentials provided.
   */
  const login = async (email = 'admin@example.com', password = 'password') => {
    try {
      isLoading.value = true
      await initCsrf()
      const response = await api.post('/auth/login', { email, password })
      
      // Simpan token ke localStorage untuk Mode API Token
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
      }
      
      await fetchUser()
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      if (error.response?.status === 429) {
        return { success: false, message: 'Terlalu banyak percobaan masuk. Mohon tunggu 1 menit sebelum mencoba lagi.' }
      }
      const message = error.response?.data?.message || 'Email atau kata sandi salah'
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Register a new user
   */
  const register = async (name, email, password) => {
    try {
      isLoading.value = true
      await initCsrf()
      const response = await api.post('/auth/register', { name, email, password, password_confirmation: password })
      
      // Simpan token ke localStorage untuk Mode API Token
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
      }
      
      await fetchUser() // Auto login
      return { success: true }
    } catch (error) {
      console.error('Register failed:', error)
      if (error.response?.status === 429) {
        return { success: false, message: 'Terlalu banyak percobaan pendaftaran. Mohon tunggu 1 menit sebelum mencoba lagi.' }
      }
      const message = error.response?.data?.message || 'Pendaftaran gagal'
      const errors = error.response?.data?.errors || {}
      return { success: false, message, errors }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Perform logout
   */
  const logout = async () => {
    try {
      isLoading.value = true
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Hapus token dari localStorage saat logout
      localStorage.removeItem('auth_token')
      
      isLoggedIn.value = false
      userProfile.value = {
        id: null, name: '', email: '', avatar: '',
        level: 1, xp: 0, totalXp: 0, nextLevelXp: 100, streak: 0, longest_streak: 0, joinDate: ''
      }
      credits.value = 5
      isPremiumUser.value = false
      isLoading.value = false
    }
  }

  /**
   * Trigger backend to refresh stats (used after completing activities)
   */
  const refreshStats = async () => {
    await fetchUser()
  }

  // Deprecated: used to add XP locally. Now it just refreshes from backend.
  const addXp = async (amount) => {
    console.warn('addXp is deprecated. Backend handles XP automatically. Refreshing stats instead.')
    await refreshStats()
  }

  const deductCredit = async (amount = 1) => {
    if (isPremiumUser.value) return true
    if (credits.value >= amount) {
      // Optimitic update
      credits.value -= amount
      // TODO: Hit backend endpoint `/credits/deduct` if it exists
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
      console.error('Checkout failed', error)
      const message = error.response?.data?.message || 'Pembayaran gagal. Silakan coba lagi.'
      // alert(message) // Opsional, UI akan menangani error ini
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  const resetCredits = () => {
    // Usually handled by backend cron job, but we leave this for local mock consistency if needed
    credits.value = maxCredits
  }

  const hasEnoughCredits = (amount = 1) => {
    if (isPremiumUser.value) return true
    return credits.value >= amount
  }

  const subscriptionStatus = computed(() => {
    return isPremiumUser.value ? 'Premium' : 'Gratis'
  })

  return {
    isLoggedIn,
    isLoading,
    userProfile,
    login,
    register,
    logout,
    fetchUser,
    refreshStats,
    addXp,
    credits,
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
