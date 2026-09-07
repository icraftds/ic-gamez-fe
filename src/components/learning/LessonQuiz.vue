<template>
  <div class="step-content">
    <div class="quiz-box">
      <h3>Tes Pemahaman</h3>
      <div v-for="(q, index) in quiz" :key="index" class="quiz-item">
        <p class="question">{{ q.question }}</p>
        <div class="options">
          <button 
            v-for="(opt, optIndex) in q.options" 
            :key="optIndex"
            class="option-btn"
            :class="{ 
              'selected': selectedAnswer === optIndex,
              'correct': hasSubmitted && optIndex === q.answerIndex,
              'wrong': hasSubmitted && selectedAnswer === optIndex && selectedAnswer !== q.answerIndex
            }"
            @click="!hasSubmitted && (selectedAnswer = optIndex)"
          >
            {{ opt }}
          </button>
        </div>
      </div>
      
      <div class="quiz-feedback" v-if="hasSubmitted">
        <p v-if="isCorrect" class="success-msg"><i class="fa-solid fa-check-circle"></i> Jawaban Benar!</p>
        <p v-else class="error-msg"><i class="fa-solid fa-times-circle"></i> Jawaban Salah, coba lagi.</p>
      </div>
    </div>
    
    <div class="action-bar">
      <button class="btn-secondary" @click="$emit('back')">Kembali</button>
      <button 
        v-if="!hasSubmitted" 
        class="btn-primary" 
        :disabled="selectedAnswer === null" 
        @click="submitQuiz"
      >
        Cek Jawaban
      </button>
      <button 
        v-else-if="isCorrect" 
        class="btn-primary" 
        @click="$emit('next')"
      >
        Lanjut ke Praktik <i class="fa-solid fa-arrow-right"></i>
      </button>
      <button 
        v-else 
        class="btn-secondary" 
        @click="resetQuiz"
      >
        Coba Lagi
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  quiz: {
    type: Array,
    required: true
  }
})

defineEmits(['back', 'next'])

const selectedAnswer = ref(null)
const hasSubmitted = ref(false)
const isCorrect = ref(false)

const submitQuiz = () => {
  if (props.quiz && props.quiz.length > 0) {
    hasSubmitted.value = true
    isCorrect.value = selectedAnswer.value === props.quiz[0].answerIndex
  }
}

const resetQuiz = () => {
  hasSubmitted.value = false
  selectedAnswer.value = null
  isCorrect.value = false
}
</script>

<style scoped>
.step-content {
  width: 100%;
  max-width: 800px;
  background: rgba(20, 15, 40, 0.7);
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:disabled {
  background: #475569;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.quiz-box h3 {
  margin-bottom: 20px;
}

.question {
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-btn {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 15px;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.option-btn:hover:not(.disabled) {
  background: rgba(147, 51, 234, 0.2);
  border-color: rgba(147, 51, 234, 0.5);
}

.option-btn.selected {
  background: rgba(147, 51, 234, 0.3);
  border-color: var(--primary);
}

.option-btn.correct {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
}

.option-btn.wrong {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
}

.quiz-feedback {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
}

.success-msg {
  color: #10b981;
  font-weight: 600;
}

.error-msg {
  color: #ef4444;
  font-weight: 600;
}
</style>
