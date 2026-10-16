<template>
  <div class="quiz-panel">
    <section class="panel-content">
      <header class="quiz-header">
        <div class="quiz-header-top">
          <h2><i class="fa-solid fa-circle-question"></i> Tes Pemahaman</h2>
          <span v-if="isMultiQuiz" class="quiz-progress-badge">
            <i class="fa-solid fa-list-check"></i> {{ answeredCount }} / {{ quiz.length }} Terjawab
          </span>
        </div>
        <p>Jawab pertanyaan berikut sebelum lanjut ke sesi praktik.</p>
      </header>

      <!-- Multi-quiz Stepper Navigation (hanya jika > 1 kuis) -->
      <div v-if="isMultiQuiz" class="quiz-stepper">
        <button
          v-for="(question, qIndex) in quiz"
          :key="qIndex"
          type="button"
          class="stepper-step"
          :class="{
            'active': localIndex === qIndex,
            'answered': isQuizAnswered(question.id),
            'correct': isSubmitted && isQuizCorrect(question.id),
            'wrong': isSubmitted && isQuizWrong(question.id)
          }"
          @click="goToStep(qIndex)"
        >
          <span class="step-indicator">
            <i v-if="isSubmitted && isQuizCorrect(question.id)" class="fa-solid fa-check"></i>
            <i v-else-if="isSubmitted && isQuizWrong(question.id)" class="fa-solid fa-xmark"></i>
            <span v-else>{{ qIndex + 1 }}</span>
          </span>
          <span class="step-title">Soal {{ qIndex + 1 }}</span>
        </button>
      </div>

      <!-- Quiz Card Display -->
      <div v-if="hasQuestions" class="quiz-container">
        <!-- Render Active Question Card -->
        <div v-if="activeQuestion" class="question-card">
          <div class="question-header-pill">
            <span class="q-badge">
              <i class="fa-solid fa-circle-question"></i> Soal Pemahaman {{ isMultiQuiz ? `#${localIndex + 1} dari ${quiz.length}` : '' }}
            </span>
            <span v-if="isSubmitted && isQuizCorrect(activeQuestion.id)" class="status-pill status-correct">
              <i class="fa-solid fa-circle-check"></i> Benar
            </span>
            <span v-else-if="isSubmitted && isQuizWrong(activeQuestion.id)" class="status-pill status-wrong">
              <i class="fa-solid fa-circle-xmark"></i> Salah
            </span>
          </div>

          <div class="question-text" v-html="formatQuizText(activeQuestion.question)"></div>

          <div class="options-list">
            <button
              v-for="(option, optIndex) in activeQuestion.options"
              :key="optIndex"
              type="button"
              class="option-btn"
              :class="getOptionClass(optIndex, activeQuestion)"
              :disabled="isSubmitted || isChecking"
              @click="handleSelectOption(optIndex)"
            >
              <span class="option-letter">{{ String.fromCharCode(65 + optIndex) }}</span>
              <span class="option-label" v-html="formatQuizText(option)"></span>
              <i v-if="isSubmitted && isSelected(activeQuestion.id, optIndex) && !isQuizCorrect(activeQuestion.id)" class="fa-solid fa-circle-xmark status-icon wrong-icon"></i>
              <i v-if="isSubmitted && isSelected(activeQuestion.id, optIndex) && isQuizCorrect(activeQuestion.id)" class="fa-solid fa-circle-check status-icon correct-icon"></i>
            </button>
          </div>

          <!-- Dynamic Hint (per soal yang sedang dibuka) -->
          <div v-if="currentHintText" class="hint-display-inline" style="margin: 20px 0 0 0;">
            <h4><i class="fa-solid fa-lightbulb"></i> Hint Soal #{{ localIndex + 1 }}:</h4>
            <div class="hint-content" v-html="currentHintText"></div>
          </div>

          <!-- Feedback after submit -->
          <div v-if="isSubmitted && (activeExplanation || (!isCorrect && errorMessage))" class="feedback" :class="isQuizCorrect(activeQuestion.id) ? 'correct' : 'wrong'">
            <i :class="isQuizCorrect(activeQuestion.id) ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation'"></i>
            <div class="feedback-body">
              <strong class="feedback-title">{{ isQuizCorrect(activeQuestion.id) ? 'Jawaban Benar!' : 'Jawaban Belum Tepat' }}</strong>
              <p class="feedback-text">{{ isQuizCorrect(activeQuestion.id) ? activeExplanation : (errorMessage || 'Periksa kembali opsi pilihanmu untuk soal ini.') }}</p>
            </div>
          </div>
        </div>

        <!-- In-card Navigation between quizzes (hanya jika multi-quiz) -->
        <div v-if="isMultiQuiz" class="stepper-nav-row">
          <button
            type="button"
            class="stepper-btn prev-step"
            :disabled="localIndex === 0"
            @click="prevStep"
          >
            <i class="fa-solid fa-arrow-left"></i> Soal Sebelumnya
          </button>
          <span class="step-counter">Soal {{ localIndex + 1 }} / {{ quiz.length }}</span>
          <button
            type="button"
            class="stepper-btn next-step"
            :disabled="localIndex === quiz.length - 1"
            @click="nextStep"
          >
            Soal Selanjutnya <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- No quiz state -->
      <div v-else class="no-quiz">
        <i class="fa-solid fa-circle-info"></i>
        <p>Tidak ada kuis untuk materi ini. Langsung lanjut ke Praktik!</p>
      </div>
    </section>

    <footer class="panel-footer">
      <div class="footer-left">
        <button class="nav-btn prev-btn" @click="$emit('back')">
          <i class="fa-solid fa-arrow-left"></i> Kembali ke Materi
        </button>
        
        <HintButton 
          v-if="!isCorrect && !currentHintText && hasQuestions && hasCurrentHint" 
          :isLoading="isHintLoading"
          @click="openHint" 
        />
      </div>

      <div class="footer-right">
        <!-- Belum Submit: tombol Cek Jawaban -->
        <button
          v-if="hasQuestions && !isSubmitted"
          class="nav-btn submit-btn"
          :disabled="!canSubmit || isChecking"
          @click="$emit('submit')"
        >
          <i v-if="isChecking" class="fa-solid fa-spinner fa-spin"></i>
          {{ isChecking ? 'Mengecek...' : (isMultiQuiz ? `Cek Semua Jawaban (${answeredCount}/${quiz.length})` : 'Cek Jawaban') }}
        </button>

        <!-- Sudah Submit & Belum Lulus: tombol Coba Lagi -->
        <button
          v-else-if="isSubmitted && !isCorrect"
          class="nav-btn retry-btn"
          @click="$emit('retry')"
        >
          <i class="fa-solid fa-rotate-left"></i> Coba Lagi
        </button>

        <!-- Sudah Lulus atau tidak ada kuis: lanjut ke Praktik -->
        <button
          v-else
          class="nav-btn next-btn"
          @click="$emit('next')"
        >
          Lanjut ke Praktik <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import api from '../../services/api'
import HintButton from './HintButton.vue'
import { useUserAccount } from '../../composables/useUserAccount'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()
const { credits } = useUserAccount()

const props = defineProps({
  lesson: { type: Object, default: () => ({}) },
  quiz: { type: Array, required: true },
  selectedAnswer: { type: Number, default: null }, // legacy fallback
  selectedAnswers: { type: Object, default: () => ({}) },
  currentQuizIndex: { type: Number, default: 0 },
  quizResults: { type: Object, default: () => ({}) },
  isSubmitted: { type: Boolean, default: false },
  isCorrect: { type: Boolean, default: false },
  isChecking: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
})

const emit = defineEmits([
  'back',
  'submit',
  'retry',
  'next',
  'update:selectedAnswer',
  'update:selectedAnswers',
  'update:currentQuizIndex'
])

// Stepper index lokal disinkronkan dengan prop
const localIndex = ref(props.currentQuizIndex || 0)
watch(() => props.currentQuizIndex, (newIdx) => {
  if (typeof newIdx === 'number' && newIdx !== localIndex.value) {
    localIndex.value = newIdx
  }
})

const isMultiQuiz = computed(() => Array.isArray(props.quiz) && props.quiz.length > 1)
const hasQuestions = computed(() => Array.isArray(props.quiz) && props.quiz.length > 0)

const activeQuestion = computed(() => {
  if (!hasQuestions.value) return null
  return props.quiz[localIndex.value] || props.quiz[0]
})

const activeQuizId = computed(() => {
  return activeQuestion.value ? String(activeQuestion.value.id) : ''
})

const hasCurrentHint = computed(() => {
  return activeQuestion.value && Boolean(activeQuestion.value.has_hint)
})

const activeExplanation = computed(() => {
  if (!activeQuestion.value) return ''
  const qId = activeQuizId.value
  if (props.quizResults && props.quizResults[qId]?.explanation) {
    return props.quizResults[qId].explanation
  }
  return activeQuestion.value.explanation || ''
})

const getSelectedAnswerForQuiz = (qId) => {
  const key = String(qId)
  if (props.selectedAnswers && props.selectedAnswers[key] !== undefined) {
    return props.selectedAnswers[key]
  }
  if (!isMultiQuiz.value && props.selectedAnswer !== null) {
    return props.selectedAnswer
  }
  return null
}

const isSelected = (qId, optIndex) => {
  return getSelectedAnswerForQuiz(qId) === optIndex
}

const isQuizAnswered = (qId) => {
  return getSelectedAnswerForQuiz(qId) !== null
}

const answeredCount = computed(() => {
  if (!Array.isArray(props.quiz)) return 0
  return props.quiz.filter(q => isQuizAnswered(q.id)).length
})

const canSubmit = computed(() => {
  if (!hasQuestions.value) return false
  if (isMultiQuiz.value) {
    return answeredCount.value === props.quiz.length
  }
  return props.selectedAnswer !== null || getSelectedAnswerForQuiz(props.quiz[0]?.id) !== null
})

const isQuizCorrect = (qId) => {
  const key = String(qId)
  if (props.quizResults && props.quizResults[key]) {
    return Boolean(props.quizResults[key].is_correct)
  }
  return props.isCorrect
}

const isQuizWrong = (qId) => {
  const key = String(qId)
  if (props.quizResults && props.quizResults[key]) {
    return props.quizResults[key].is_correct === false
  }
  return props.isSubmitted && !props.isCorrect
}

const handleSelectOption = (optIndex) => {
  if (props.isSubmitted || props.isChecking || !activeQuestion.value) return
  const qId = activeQuestion.value.id
  emit('update:selectedAnswers', { quizId: qId, optionIndex: optIndex })
  emit('update:selectedAnswer', optIndex)
}

const getOptionClass = (optIndex, question) => {
  const qId = String(question.id)
  const isThisSelected = isSelected(qId, optIndex)
  const result = props.quizResults ? props.quizResults[qId] : null

  if (props.isSubmitted) {
    if (result) {
      if (result.is_correct && isThisSelected) {
        return { selected: true, correct: true }
      }
      if (!result.is_correct && isThisSelected) {
        return { selected: true, wrong: true }
      }
    } else {
      const actualCorrect = props.isCorrect ? isThisSelected : (optIndex === question.answer_index)
      return {
        selected: isThisSelected,
        correct: isThisSelected && props.isCorrect,
        wrong: isThisSelected && !props.isCorrect
      }
    }
  }

  return {
    selected: isThisSelected
  }
}

// Navigasi Stepper
const goToStep = (idx) => {
  localIndex.value = idx
  emit('update:currentQuizIndex', idx)
}

const prevStep = () => {
  if (localIndex.value > 0) {
    goToStep(localIndex.value - 1)
  }
}

const nextStep = () => {
  if (localIndex.value < props.quiz.length - 1) {
    goToStep(localIndex.value + 1)
  }
}

// Formatting
const formatQuizText = (text) => {
  if (!text) return ''
  try {
    return marked.parseInline(String(text))
  } catch (e) {
    return String(text)
  }
}

// Hint Management (Map per Quiz ID)
const hintsMap = ref({})
const isHintLoading = ref(false)

const currentHintText = computed(() => {
  return hintsMap.value[activeQuizId.value] || null
})

const openHint = async () => {
  const qId = activeQuizId.value
  if (!qId) return

  isHintLoading.value = true
  try {
    const res = await api.post(`/hints/quiz/${qId}`)
    if (res.data && res.data.hint) {
      hintsMap.value[qId] = marked.parse(res.data.hint || 'Tidak ada hint tersedia.')
      if (res.data.remaining_credits !== undefined) {
        credits.value = res.data.remaining_credits
      }
    } else {
      hintsMap.value[qId] = marked.parse('Tidak ada hint tersedia.')
    }
  } catch (error) {
    if (error.response?.status === 403) {
      showToast(error.response?.data?.message || 'Energi Anda habis. Silakan top-up atau upgrade ke PRO.', 'warning')
    } else if (error.response?.status === 400) {
      showToast(error.response?.data?.message || 'Gagal membuka hint.', 'error')
    } else {
      showToast('Gagal mengambil hint.', 'error')
    }
  } finally {
    isHintLoading.value = false
  }
}
</script>

<style scoped src="../../assets/css/components/workspace/QuizPanel.css"></style>
