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

<style scoped src="../../assets/css/components/learning/LessonQuiz.css"></style>
