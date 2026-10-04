/**
 * Composable untuk mengelola state kuis (quiz) di dalam sebuah lesson.
 */
import { ref, watch } from 'vue'

export function useQuiz() {
  const selectedAnswer = ref(null)
  const isSubmitted = ref(false)
  const isCorrect = ref(false)
  const isChecking = ref(false)
  const errorMessage = ref('')
  const currentLessonId = ref(null)

  const saveToStorage = () => {
    if (!currentLessonId.value) return
    const data = {
      selectedAnswer: selectedAnswer.value,
      isSubmitted: isSubmitted.value,
      isCorrect: isCorrect.value,
      errorMessage: errorMessage.value
    }
    localStorage.setItem(`quiz_state_${currentLessonId.value}`, JSON.stringify(data))
  }

  const loadFromStorage = (lessonId) => {
    currentLessonId.value = lessonId
    const dataStr = localStorage.getItem(`quiz_state_${lessonId}`)
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr)
        selectedAnswer.value = data.selectedAnswer
        isSubmitted.value = data.isSubmitted
        isCorrect.value = data.isCorrect
        errorMessage.value = data.errorMessage
      } catch (e) {
        resetStateOnly()
      }
    } else {
      resetStateOnly()
    }
  }

  watch([selectedAnswer, isSubmitted, isCorrect, errorMessage], () => {
    saveToStorage()
  })

  /** Submit jawaban dan evaluasi hasilnya. */
  const submit = (quiz) => {
    if (!quiz || quiz.length === 0) return
    isSubmitted.value = true
    isCorrect.value = selectedAnswer.value === quiz[0].answer_index
  }

  const resetStateOnly = () => {
    selectedAnswer.value = null
    isSubmitted.value = false
    isCorrect.value = false
    isChecking.value = false
    errorMessage.value = ''
  }

  /** Reset semua state kuis ke kondisi awal. */
  const reset = () => {
    resetStateOnly()
  }

  return {
    selectedAnswer,
    isSubmitted,
    isCorrect,
    isChecking,
    errorMessage,
    submit,
    reset,
    loadFromStorage
  }
}
