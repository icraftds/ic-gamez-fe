import { ref, computed } from 'vue'
import api, { initCsrf } from '../services/api'

const credits = ref(5)
const maxCredits = 5
const isPremiumUser = ref(false)
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
      await api.post('/auth/login', { email, password })
      await fetchUser()
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
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
      await api.post('/auth/register', { name, email, password, password_confirmation: password })
      await fetchUser() // Auto login
      return { success: true }
    } catch (error) {
      console.error('Register failed:', error)
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
      isLoggedIn.value = false
      userProfile.value = {
        id: null, name: '', email: '', avatar: '',
        level: 1, xp: 0, nextLevelXp: 100, streak: 0, longest_streak: 0, joinDate: ''
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

  const upgradeToPremium = async () => {
    try {
      await api.post('/subscription/upgrade')
      await fetchUser()
    } catch (error) {
      console.error('Upgrade failed', error)
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
    deductCredit,
    upgradeToPremium,
    resetCredits,
    hasEnoughCredits,
    subscriptionStatus
  }
}
