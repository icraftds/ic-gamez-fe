<template>
  <div class="lesson-view">
    <BackgroundEffects :show-orb3="true" />
    
    <!-- Navbar Khusus Belajar -->
    <nav class="lesson-navbar">
      <div class="nav-left">
        <button class="back-btn" @click="$router.push(`/learning/${pathId}`)">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <span class="lesson-title" v-if="lesson">{{ lesson.title }}</span>
      </div>
      <div class="nav-progress">
        <div class="step-indicator" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">1. Materi</div>
        <div class="step-line"></div>
        <div class="step-indicator" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">2. Tes</div>
        <div class="step-line"></div>
        <div class="step-indicator" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">3. Praktik</div>
      </div>
    </nav>

    <div class="container lesson-container" v-if="lesson">
      <!-- Step 1: Penjelasan -->
      <LessonExplanation 
        v-if="currentStep === 1" 
        :explanation="lesson.explanation" 
        @next="nextStep" 
      />

      <!-- Step 2: Tes Pemahaman -->
      <LessonQuiz 
        v-else-if="currentStep === 2" 
        :quiz="lesson.quiz" 
        @back="currentStep = 1"
        @next="nextStep"
      />

      <!-- Step 3: Praktik -->
      <LessonPractice 
        v-else-if="currentStep === 3" 
        :instruction="lesson.practice" 
        @back="currentStep = 2"
        @finish="finishLesson"
      />
    </div>
    
    <div v-else class="container not-found">
      Materi tidak ditemukan.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLearningPaths } from '../composables/useLearningPaths'
import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import LessonExplanation from '../components/learning/LessonExplanation.vue'
import LessonQuiz from '../components/learning/LessonQuiz.vue'
import LessonPractice from '../components/learning/LessonPractice.vue'

const route = useRoute()
const router = useRouter()
const { getLessonByIds } = useLearningPaths()

const pathId = computed(() => route.params.pathId)
const chapterId = computed(() => route.params.chapterId)
const lessonId = computed(() => route.params.lessonId)

const lesson = computed(() => getLessonByIds(pathId.value, chapterId.value, lessonId.value))

const currentStep = ref(1)

// Handle direct challenge links via query param

watch(() => route.query.step, (newStep) => {
  if (newStep) {
    currentStep.value = parseInt(newStep)
  }
}, { immediate: true })

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const finishLesson = () => {
  router.push(`/learning/${pathId.value}`)
}
</script>

<style scoped>
.lesson-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.lesson-navbar {
  height: 60px;
  background: rgba(15, 10, 30, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
}

.back-btn:hover {
  color: white;
}

.lesson-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.nav-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

.step-indicator {
  color: #64748b;
  font-weight: 500;
}

.step-indicator.active {
  color: #c084fc;
}

.step-indicator.completed {
  color: #10b981;
}

.step-line {
  width: 30px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
}

.lesson-container {
  flex: 1;
  display: flex;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 40px;
}

.not-found {
  text-align: center;
  margin-top: 50px;
  color: #94a3b8;
}
</style>
