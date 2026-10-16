/**
 * Composable untuk mengelola state kuis (quiz) di dalam sebuah lesson.
 * Mendukung Single-Quiz (backward-compatible) dan Multi-Quiz (misal 5 kuis per materi).
 */
import { ref, watch } from 'vue'

export function useQuiz() {
  // Map jawaban: { [quizId]: optionIndex }
  const selectedAnswers = ref({})
  // Fallback single answer untuk kompatibilitas ke belakang
  const selectedAnswer = ref(null)
  
  // Index soal yang aktif pada stepper/paginasi (0-indexed)
  const currentQuizIndex = ref(0)
  
  // Hasil evaluasi per quiz dari backend: { [quizId]: { is_correct: bool, explanation: string } }
  const quizResults = ref({})

  const isSubmitted = ref(false)
  const isCorrect = ref(false)
  const isChecking = ref(false)
  const errorMessage = ref('')
  const currentLessonId = ref(null)

  const saveToStorage = () => {
    if (!currentLessonId.value) return
    const data = {
      selectedAnswers: selectedAnswers.value,
      selectedAnswer: selectedAnswer.value,
      currentQuizIndex: currentQuizIndex.value,
      quizResults: quizResults.value,
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
        selectedAnswers.value = data.selectedAnswers || {}
        selectedAnswer.value = data.selectedAnswer ?? null
        currentQuizIndex.value = data.currentQuizIndex ?? 0
        quizResults.value = data.quizResults || {}
        isSubmitted.value = !!data.isSubmitted
        isCorrect.value = !!data.isCorrect
        errorMessage.value = data.errorMessage || ''
      } catch (e) {
        resetStateOnly()
      }
    } else {
      resetStateOnly()
    }
  }

  watch(
    [selectedAnswers, selectedAnswer, currentQuizIndex, quizResults, isSubmitted, isCorrect, errorMessage],
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  /** Simpan pilihan jawaban untuk kuis tertentu */
  const setAnswer = (quizId, optIndex) => {
    const key = String(quizId)
    selectedAnswers.value = {
      ...selectedAnswers.value,
      [key]: optIndex
    }
    selectedAnswer.value = optIndex
  }

  /** Ambil jawaban terpilih untuk kuis tertentu */
  const getAnswer = (quizId) => {
    if (quizId === undefined || quizId === null) return selectedAnswer.value
    return selectedAnswers.value[String(quizId)] ?? null
  }

  /** Cek apakah semua kuis dalam daftar sudah dijawab */
  const isAllAnswered = (quizzes = []) => {
    if (!Array.isArray(quizzes) || quizzes.length === 0) return selectedAnswer.value !== null
    return quizzes.every(q => selectedAnswers.value[String(q.id)] !== undefined)
  }

  /** Simpan hasil evaluasi dari backend */
  const setResults = (resultsList = []) => {
    if (!Array.isArray(resultsList)) return
    const map = {}
    resultsList.forEach(r => {
      if (r && r.quiz_id !== undefined) {
        map[String(r.quiz_id)] = r
      }
    })
    quizResults.value = map
  }

  /** Siapkan payload pengiriman ke server (kompatibel single & multi-quiz) */
  const getPayload = (quizzes = []) => {
    const answersList = []
    let firstAnswer = selectedAnswer.value

    if (Array.isArray(quizzes) && quizzes.length > 0) {
      quizzes.forEach((q, idx) => {
        const ans = selectedAnswers.value[String(q.id)]
        if (ans !== undefined) {
          answersList.push({
            quiz_id: q.id,
            answer_index: ans
          })
          if (idx === 0) {
            firstAnswer = ans
          }
        }
      })
      if (firstAnswer === null && answersList.length > 0) {
        firstAnswer = answersList[0].answer_index
      }
    }

    return {
      answer_index: firstAnswer !== null ? Number(firstAnswer) : null,
      answers: answersList.length > 0 ? answersList : undefined
    }
  }

  /** Pindah ke kuis berikutnya */
  const nextQuiz = (total = 1) => {
    if (currentQuizIndex.value < total - 1) {
      currentQuizIndex.value++
    }
  }

  /** Pindah ke kuis sebelumnya */
  const prevQuiz = () => {
    if (currentQuizIndex.value > 0) {
      currentQuizIndex.value--
    }
  }

  /** Pindah langsung ke index kuis tertentu */
  const goToQuiz = (index) => {
    currentQuizIndex.value = Math.max(0, index)
  }

  /** Submit lokal sederhana (fallback) */
  const submit = (quiz) => {
    if (!quiz || quiz.length === 0) return
    isSubmitted.value = true
    isCorrect.value = selectedAnswer.value === quiz[0].answer_index
  }

  /** Reset state hasil/submit agar user bisa memperbaiki jawaban tanpa mengetik ulang semua */
  const retry = () => {
    isSubmitted.value = false
    isCorrect.value = false
    isChecking.value = false
    errorMessage.value = ''
    quizResults.value = {}
  }

  const resetStateOnly = () => {
    selectedAnswers.value = {}
    selectedAnswer.value = null
    currentQuizIndex.value = 0
    quizResults.value = {}
    isSubmitted.value = false
    isCorrect.value = false
    isChecking.value = false
    errorMessage.value = ''
  }

  /** Reset semua state kuis ke kondisi awal */
  const reset = () => {
    resetStateOnly()
    if (currentLessonId.value) {
      localStorage.removeItem(`quiz_state_${currentLessonId.value}`)
    }
  }

  return {
    selectedAnswers,
    selectedAnswer,
    currentQuizIndex,
    quizResults,
    isSubmitted,
    isCorrect,
    isChecking,
    errorMessage,
    setAnswer,
    getAnswer,
    isAllAnswered,
    setResults,
    getPayload,
    nextQuiz,
    prevQuiz,
    goToQuiz,
    submit,
    retry,
    reset,
    loadFromStorage
  }
}
