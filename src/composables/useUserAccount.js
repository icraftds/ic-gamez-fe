import { ref, computed } from 'vue'

const credits = ref(5) // Default free credits per day
const maxCredits = 5
const isPremiumUser = ref(false)
const isLoggedIn = ref(false)

/** Muat XP tersimpan dari localStorage jika ada. */
const loadPersistedXp = () => {
  try {
    const saved = localStorage.getItem('icgamez_user_xp')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const persistedXp = loadPersistedXp()

const userProfile = ref({
  name: 'randi (uo), S.Kom., CWDev.',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  level: persistedXp?.level ?? 12,
  xp: persistedXp?.xp ?? 3450,
  nextLevelXp: persistedXp?.nextLevelXp ?? 5000,
  streak: 7,
  joinDate: '2026-01-15'
})

/** Simpan state XP ke localStorage. */
const persistXp = () => {
  localStorage.setItem('icgamez_user_xp', JSON.stringify({
    xp: userProfile.value.xp,
    level: userProfile.value.level,
    nextLevelXp: userProfile.value.nextLevelXp,
  }))
}

export function useUserAccount() {
  const login = () => {
    isLoggedIn.value = true
  }

  const logout = () => {
    isLoggedIn.value = false
  }

  /**
   * Tambahkan XP ke profil user. Otomatis level-up jika melebihi threshold.
   * @param {number} amount Jumlah XP yang ditambahkan
   */
  const addXp = (amount) => {
    userProfile.value.xp += amount

    // Auto-level up: setiap kali XP >= nextLevelXp
    while (userProfile.value.xp >= userProfile.value.nextLevelXp) {
      userProfile.value.xp -= userProfile.value.nextLevelXp
      userProfile.value.level += 1
      // Threshold naik 20% setiap level
      userProfile.value.nextLevelXp = Math.round(userProfile.value.nextLevelXp * 1.2)
    }

    persistXp()
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

