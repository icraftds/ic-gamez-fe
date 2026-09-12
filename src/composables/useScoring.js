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

  const awardXp = async (type, lessonId) => {
    const key = `${lessonId}:${type}`

    if (scoredActivities.value.has(key)) {
      return { awarded: false, xp: 0 }
    }

    try {
      let endpoint = ''
      if (type === 'quiz') endpoint = '/progress/quiz-pass'
      else if (type === 'practice') endpoint = '/progress/practice-complete'
      else if (type === 'theory') endpoint = '/progress/complete'
      
      if (!endpoint) return { awarded: false, xp: 0 }

      const response = await api.post(endpoint, { lesson_id: lessonId })
      
      // Jika berhasil di backend
      scoredActivities.value.add(key)
      
      // Refresh XP dan Level di profile
      await refreshStats()

      // Backend mungkin mereturn info XP di response, jika tidak, kita gunakan const
      const xp = type === 'quiz' ? XP_REWARDS.QUIZ_CORRECT : XP_REWARDS.PRACTICE_COMPLETE

      return { awarded: true, xp }
    } catch (error) {
      console.error(`Failed to award XP for ${type}`, error)
      return { awarded: false, xp: 0 }
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
