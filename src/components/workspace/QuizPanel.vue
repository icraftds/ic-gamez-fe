<template>
  <div class="quiz-panel">
    <section class="panel-content">
      <header class="quiz-header">
        <h2><i class="fa-solid fa-circle-question"></i> Tes Pemahaman</h2>
        <p>Jawab pertanyaan berikut sebelum lanjut ke sesi praktik.</p>
      </header>

      <!-- Quiz questions -->
      <div v-if="hasQuestions" class="quiz-container" @copy.prevent @cut.prevent @paste.prevent>
        <div v-for="(question, qIndex) in quiz" :key="qIndex" class="question-card">
          <p class="question-text">{{ question.question }}</p>

          <div class="options-list">
            <button
              v-for="(option, optIndex) in question.options"
              :key="optIndex"
              class="option-btn"
              :class="getOptionClass(optIndex, question.answerIndex)"
              :disabled="isSubmitted || isChecking"
              @click="$emit('update:selectedAnswer', optIndex)"
            >
              <span class="option-letter">{{ String.fromCharCode(65 + optIndex) }}</span>
              <span style="flex: 1;">{{ option }}</span>
              <i v-if="isSubmitted && selectedAnswer === optIndex && !isCorrect" class="fa-solid fa-times-circle" style="color: #ef4444; font-size: 1.2rem;"></i>
              <i v-if="isSubmitted && isCorrect && selectedAnswer === optIndex" class="fa-solid fa-check-circle" style="color: #10b981; font-size: 1.2rem;"></i>
            </button>
          </div>

          <!-- Feedback after submit -->
          <div v-if="isSubmitted && (question.explanation || (!isCorrect && errorMessage))" class="feedback" :class="isCorrect ? 'correct' : 'wrong'">
            <i :class="isCorrect ? 'fa-solid fa-check-circle' : 'fa-solid fa-times-circle'"></i>
            {{ isCorrect ? question.explanation : errorMessage }}
          </div>

          <!-- Hint Section (Button & Display) right below options/feedback -->
          <div v-if="!isCorrect && !hintText" style="margin-top: 15px;">
            <button 
              class="nav-btn hint-btn" 
              @click="openHint" 
              :disabled="isHintLoading"
              style="width: 100%; justify-content: center;"
            >
              <i v-if="isHintLoading" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-lightbulb"></i> Buka Hint (⚡1)
            </button>
          </div>

          <div v-if="hintText" class="hint-display-inline" style="margin: 15px 0 0 0;">
            <h4><i class="fa-solid fa-lightbulb"></i> Hint:</h4>
            <div class="hint-content" v-html="hintText"></div>
          </div>
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
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </button>
      </div>

      <div class="footer-right">
      <button
        v-if="hasQuestions && !isSubmitted"
        class="nav-btn submit-btn"
        :disabled="selectedAnswer === null || isChecking"
        @click="$emit('submit')"
      >
        <i v-if="isChecking" class="fa-solid fa-spinner fa-spin"></i>
        {{ isChecking ? 'Mengecek...' : 'Cek Jawaban' }}
      </button>

      <!-- State: sudah submit, salah -->
      <button
        v-else-if="isSubmitted && !isCorrect"
        class="nav-btn retry-btn"
        @click="$emit('retry')"
      >
        <i class="fa-solid fa-rotate-left"></i> Coba Lagi
      </button>

      <!-- State: tidak ada kuis, atau sudah benar -->
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
import { ref, computed } from 'vue'
import { marked } from 'marked'
import api from '../../services/api'
import { useUserAccount } from '../../composables/useUserAccount'

const props = defineProps({
  lesson: { type: Object, default: () => ({}) },
  quiz: { type: Array, required: true },
  selectedAnswer: { type: Number, default: null },
  isSubmitted: { type: Boolean, default: false },
  isCorrect: { type: Boolean, default: false },
  isChecking: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
})

defineEmits(['back', 'submit', 'retry', 'next', 'update:selectedAnswer'])

const hasQuestions = computed(() => props.quiz && props.quiz.length > 0)

const getOptionClass = (optIndex, correctIndex) => {
  // Karena backend tidak mengirimkan jawaban benar secara langsung (anti-cheat),
  // kita menentukan indeks benar dari jawaban pengguna ketika divalidasi berhasil.
  const actualCorrectIndex = props.isCorrect ? props.selectedAnswer : correctIndex;

  return {
    selected: props.selectedAnswer === optIndex,
    correct: props.isSubmitted && optIndex === actualCorrectIndex,
    wrong: props.isSubmitted && props.selectedAnswer === optIndex && optIndex !== actualCorrectIndex,
  }
}

const hintText = ref(null)
const isHintLoading = ref(false)
const { credits } = useUserAccount()

const openHint = async () => {
  const quizId = props.quiz && props.quiz[0] ? props.quiz[0].id : null;
  if (!quizId) return;

  isHintLoading.value = true
  try {
    const res = await api.post(`/hints/quiz/${quizId}`)
    if (res.data && res.data.hint) {
      hintText.value = marked.parse(res.data.hint || 'Tidak ada hint tersedia.')
      
      // Update saldo hint premium atau energi user
      if (res.data.remaining_credits !== undefined) {
        credits.value = res.data.remaining_credits
      }
    } else {
      hintText.value = marked.parse('Tidak ada hint tersedia.')
    }
  } catch (error) {
    if (error.response?.status === 403) {
      alert(error.response?.data?.message || 'Energi Anda habis. Silakan top-up atau upgrade ke PRO.')
    } else if (error.response?.status === 400) {
      alert(error.response?.data?.message || 'Gagal membuka hint.')
    } else {
      alert('Gagal mengambil hint.')
    }
  } finally {
    isHintLoading.value = false
  }
}
</script>

<style scoped src="../../assets/css/components/workspace/QuizPanel.css"></style>
