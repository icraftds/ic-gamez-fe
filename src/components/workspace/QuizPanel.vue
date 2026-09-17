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

<style scoped>
.quiz-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 40px 64px;
}
.panel-content::-webkit-scrollbar { width: 5px; }
.panel-content::-webkit-scrollbar-thumb { background: rgba(147, 51, 234, 0.3); border-radius: 3px; }

/* ── Header ── */
.quiz-header { margin-bottom: 32px; }
.quiz-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.quiz-header h2 i { color: #f59e0b; }
.quiz-header p { color: #64748b; font-size: 0.9rem; }

/* ── Question card ── */
.quiz-container {
  user-select: none;
  -webkit-user-select: none;
}

.question-card { margin-bottom: 28px; }
.question-text {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 18px;
  line-height: 1.55;
  color: #e2e8f0;
}

/* ── Options ── */
.options-list { display: flex; flex-direction: column; gap: 10px; }

.option-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 13px 18px;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  font-size: 0.95rem;
  transition: all 0.2s;
}
.option-btn:hover:not(:disabled) {
  background: rgba(147, 51, 234, 0.1);
  border-color: rgba(147, 51, 234, 0.35);
  color: white;
}
.option-btn.selected { background: rgba(147, 51, 234, 0.18); border-color: #7c3aed; color: white; }
.option-btn.correct { background: rgba(16, 185, 129, 0.12); border-color: #10b981; color: #6ee7b7; }
.option-btn.wrong { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; color: #fca5a5; }

.option-letter {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* ── Feedback ── */
.feedback {
  margin-top: 14px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.5;
}
.feedback.correct { background: rgba(16, 185, 129, 0.1); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.2); }
.feedback.wrong { background: rgba(239, 68, 68, 0.1); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.2); }

/* ── No quiz ── */
.no-quiz {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 10px;
  padding: 20px 24px;
  color: #7dd3fc;
}
.no-quiz i { font-size: 1.4rem; flex-shrink: 0; }

/* ── Footer ── */
.panel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 64px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(10, 6, 18, 0.6);
  flex-shrink: 0;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.prev-btn { background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.12); color: #94a3b8; }
.prev-btn:hover { background: rgba(255, 255, 255, 0.12); color: white; }

.submit-btn { background: linear-gradient(135deg, #7c3aed, #06b6d4); color: white; }
.submit-btn:hover:not(:disabled) { opacity: 0.9; }

.retry-btn { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; }
.retry-btn:hover { background: rgba(239, 68, 68, 0.18); }

.next-btn { background: linear-gradient(135deg, #7c3aed, #06b6d4); color: white; }
.next-btn:hover { opacity: 0.9; transform: translateY(-1px); }

/* ── Footer layout & Hint ── */
.footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hint-btn {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.hint-btn:hover:not(:disabled) {
  background: rgba(245, 158, 11, 0.2);
  color: white;
}

.hint-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hint-display-inline {
  flex: 1;
  margin: 0 20px;
  padding: 8px 16px;
  background: rgba(245, 158, 11, 0.1);
  border-left: 4px solid #fbbf24;
  border-radius: 6px;
  font-size: 0.85rem;
}

.hint-display-inline h4 {
  margin: 0 0 4px 0;
  color: #fbbf24;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

.hint-content {
  color: #cbd5e1;
  line-height: 1.4;
}

/* ── Mobile Responsiveness ── */
@media (max-width: 768px) {
  .quiz-panel {
    overflow: visible;
  }
  
  .panel-content {
    padding: 20px 16px;
    overflow-y: visible;
  }
  
  .panel-footer {
    padding: 14px 16px;
    flex-direction: column;
    gap: 12px;
  }

  .footer-left,
  .footer-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .nav-btn {
    width: 100%;
    justify-content: center;
  }
  
  .quiz-header h2 {
    font-size: 1.25rem;
  }
}
</style>
