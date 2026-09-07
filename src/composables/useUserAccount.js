import { ref, computed } from 'vue'

const credits = ref(5) // Default free credits per day
const maxCredits = 5
const isPremiumUser = ref(false)
const isLoggedIn = ref(false)

const userProfile = ref({
  name: 'randi (uo), S.Kom., CWDev.',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  level: 12,
  xp: 3450,
  nextLevelXp: 5000,
  streak: 7,
  joinDate: '2026-01-15'
})

export function useUserAccount() {
  const login = () => {
    isLoggedIn.value = true
  }

  const logout = () => {
    isLoggedIn.value = false
  }

  const deductCredit = (amount = 1) => {
    if (isPremiumUser.value) return true
    if (credits.value >= amount) {
      credits.value -= amount
      return true
    }
    return false
  }

  const upgradeToPremium = () => {
    isPremiumUser.value = true
  }

  const resetCredits = () => {
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
    userProfile,
    login,
    logout,
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
