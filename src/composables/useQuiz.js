/**
 * Composable untuk mengelola state kuis (quiz) di dalam sebuah lesson.
 */
import { ref } from 'vue'

export function useQuiz() {
  const selectedAnswer = ref(null)
  const isSubmitted = ref(false)
  const isCorrect = ref(false)

  /** Submit jawaban dan evaluasi hasilnya. */
  const submit = (quiz) => {
    if (!quiz || quiz.length === 0) return
    isSubmitted.value = true
    isCorrect.value = selectedAnswer.value === quiz[0].answerIndex
  }

  /** Reset semua state kuis ke kondisi awal. */
  const reset = () => {
    selectedAnswer.value = null
    isSubmitted.value = false
    isCorrect.value = false
  }

  return {
    selectedAnswer,
    isSubmitted,
    isCorrect,
    submit,
    reset,
  }
}
