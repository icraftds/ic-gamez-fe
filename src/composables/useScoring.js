/**
 * Composable untuk mengelola scoring / pemberian XP
 * saat user menyelesaikan aktivitas belajar (quiz, practice).
 *
 * Skor disimpan di localStorage agar persist antar session.
 */
import { ref } from 'vue'
import { useUserAccount } from './useUserAccount'

/** Jumlah XP per tipe aktivitas. */
const XP_REWARDS = Object.freeze({
  QUIZ_CORRECT: 50,
  PRACTICE_COMPLETE: 100,
})

/**
 * Key localStorage untuk menyimpan Set lesson+type yang sudah diberi skor.
 * Format item: `{lessonId}:{type}` — contoh: `l1:quiz`, `l1:practice`.
 */
const STORAGE_KEY = 'icgamez_scored'

/** @returns {Set<string>} */
const loadScored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

const saveScored = (/** @type {Set<string>} */ set) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

/** Reactive set agar bisa dicek dari luar. */
const scoredActivities = ref(loadScored())

export function useScoring() {
  const { addXp } = useUserAccount()

  /**
   * Beri XP untuk sebuah aktivitas.
   * Duplikat (lesson+tipe yang sama) akan diabaikan agar user
   * tidak bisa mendapat XP ganda.
   *
   * @param {'quiz' | 'practice'} type
   * @param {string} lessonId
   * @returns {{ awarded: boolean, xp: number }} awarded = false jika sudah pernah
   */
  const awardXp = (type, lessonId) => {
    const key = `${lessonId}:${type}`

    if (scoredActivities.value.has(key)) {
      return { awarded: false, xp: 0 }
    }

    const xp = type === 'quiz' ? XP_REWARDS.QUIZ_CORRECT : XP_REWARDS.PRACTICE_COMPLETE

    // Tandai sudah diambil
    scoredActivities.value.add(key)
    saveScored(scoredActivities.value)

    // Tambahkan ke profil user
    addXp(xp)

    return { awarded: true, xp }
  }

  /**
   * Cek apakah suatu aktivitas sudah pernah diberi skor.
   * @param {'quiz' | 'practice'} type
   * @param {string} lessonId
   */
  const hasBeenScored = (type, lessonId) => {
    return scoredActivities.value.has(`${lessonId}:${type}`)
  }

  return {
    awardXp,
    hasBeenScored,
    XP_REWARDS,
  }
}
