import { ref } from 'vue'
import { useUserAccount } from './useUserAccount'
import api from '../services/api'

const XP_REWARDS = Object.freeze({
  QUIZ_CORRECT: 50,
  PRACTICE_COMPLETE: 100,
})

const scoredActivities = ref(new Set())
const isProgressLoaded = ref(false)

export function useScoring() {
  const { refreshStats } = useUserAccount()

  const loadProgress = async () => {
    if (isProgressLoaded.value) return
    try {
      const response = await api.get('/progress')
      const progressList = response.data.data
      
      const newSet = new Set()
      progressList.forEach(p => {
        if (p.is_completed) newSet.add(`${p.lesson_id}:theory`)
        if (p.quiz_passed) newSet.add(`${p.lesson_id}:quiz`)
        if (p.saved_code) newSet.add(`${p.lesson_id}:practice`) // Asumsikan jika ada code = practice disubmit (atau gunakan parameter terpisah)
      })
      scoredActivities.value = newSet
      isProgressLoaded.value = true
    } catch (error) {
      console.error('Failed to load user progress', error)
    }
  }

  const awardXp = async (type, lessonId, extraData = {}) => {
    const key = `${lessonId}:${type}`

    // JANGAN blokir request jika tipe-nya adalah 'quiz'.
    // Kita harus selalu mengirim kuis ke backend untuk divalidasi kebenarannya!
    if (scoredActivities.value.has(key) && type !== 'quiz') {
      return { success: true, awarded: false, xp: 0 }
    }

    try {
      let endpoint = ''
      if (type === 'quiz') endpoint = '/progress/quiz-pass'
      else if (type === 'practice') endpoint = '/progress/practice-complete'
      else if (type === 'theory') endpoint = '/progress/complete'

      if (!endpoint) return { success: false, awarded: false, xp: 0, error: 'Endpoint invalid' }

      const payload = { lesson_id: lessonId, ...extraData }
      const response = await api.post(endpoint, payload)
      
      // Jika berhasil di backend
      scoredActivities.value.add(key)
      await refreshStats()
      
      const awarded = response.data.awarded !== undefined ? response.data.awarded : true;
      const xp = response.data.xp_earned !== undefined ? response.data.xp_earned : (type === 'quiz' ? XP_REWARDS.QUIZ_CORRECT : XP_REWARDS.PRACTICE_COMPLETE);
      const explanation = response.data.explanation
      return { success: true, awarded, xp, explanation };
    } catch (error) {
      console.error(`Failed to award XP for ${type}`, error)
      if (error.response?.status === 400) {
        // Berjalan di background, tidak memblokir response
        refreshStats().catch(console.error)
        return { success: false, awarded: false, xp: 0, error: error.response.data?.message || 'Gagal memproses' }
      }
      return { success: false, awarded: false, xp: 0, error: error.response?.data?.message || 'Terjadi kesalahan sistem, coba lagi.' }
    }
  }

  const hasBeenScored = (type, lessonId) => {
    return scoredActivities.value.has(`${lessonId}:${type}`)
  }

  return {
    awardXp,
    hasBeenScored,
    loadProgress,
    XP_REWARDS,
  }
}
