<template>
  <div class="lesson-workspace">
    <BackgroundEffects :show-orb3="true" />

    <WorkspaceTopbar
      :path-title="path?.title ?? ''"
      :chapter-title="currentChapter?.title ?? ''"
      :lesson-title="currentLesson?.title ?? ''"
      :active-step="activeStep"
      @back="router.push('/learning')"
    />

    <div class="workspace-body">
      <WorkspaceSidebar
        v-model:is-collapsed="sidebarCollapsed"
        :path-title="path?.title ?? ''"
        :path-icon="path?.icon ?? ''"
        :chapters="path?.chapters ?? []"
        :active-chapter-id="chapterId"
        :active-lesson-id="lessonId"
        :active-step="activeStep"
        @lesson-select="onSidebarLessonSelect"
      />

      <main class="workspace-main">
        <!-- Step 1: Materi -->
        <TheoryPanel
          v-if="activeStep === STEP.THEORY && currentLesson"
          :lesson="currentLesson"
          :is-first-lesson="isFirstLesson"
          @prev="goToPrevLesson"
          @next="onRequestNextFromTheory"
        />

        <!-- Step 2: Tes / Kuis -->
        <QuizPanel
          v-else-if="activeStep === STEP.QUIZ && currentLesson"
          :quiz="currentLesson.quiz"
          :selected-answer="quiz.selectedAnswer.value"
          :is-submitted="quiz.isSubmitted.value"
          :is-correct="quiz.isCorrect.value"
          @update:selected-answer="quiz.selectedAnswer.value = $event"
          @submit="quiz.submit(currentLesson.quiz)"
          @retry="quiz.reset()"
          @back="activeStep = STEP.THEORY"
          @next="onRequestNextFromQuiz"
        />

        <!-- Step 3: Praktik -->
        <PracticePanel
          v-else-if="activeStep === STEP.PRACTICE && currentLesson"
          :lesson="currentLesson"
          :code="runner.code.value"
          :output="runner.output.value"
          :is-last-lesson="isLastLesson"
          @update:code="runner.code.value = $event"
          @run="runner.run()"
          @clear-output="runner.clearOutput()"
          @back="activeStep = STEP.QUIZ"
          @finish="goToNextLesson"
        />

        <!-- Fallback: lesson tidak ditemukan -->
        <div v-else class="not-found">
          <i class="fa-solid fa-circle-exclamation"></i>
          <p>Materi tidak ditemukan.</p>
        </div>
      </main>
    </div>

    <!-- Modal Login/Register saat user belum auth -->
    <AuthRequiredModal
      :isOpen="showAuthModal"
      :nextStepLabel="pendingStepLabel"
      @close="showAuthModal = false"
      @login="goToLogin"
      @register="goToRegister"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useLearningPaths } from '../composables/useLearningPaths'
import { useLessonNavigation } from '../composables/useLessonNavigation'
import { useQuiz } from '../composables/useQuiz'
import { useCodeRunner } from '../composables/useCodeRunner'
import { useUserAccount } from '../composables/useUserAccount'

import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import WorkspaceTopbar from '../components/workspace/WorkspaceTopbar.vue'
import WorkspaceSidebar from '../components/workspace/WorkspaceSidebar.vue'
import TheoryPanel from '../components/workspace/TheoryPanel.vue'
import QuizPanel from '../components/workspace/QuizPanel.vue'
import PracticePanel from '../components/workspace/PracticePanel.vue'
import AuthRequiredModal from '../components/common/AuthRequiredModal.vue'

// ── Enums ─────────────────────────────────────────────────────────
const STEP = Object.freeze({ THEORY: 1, QUIZ: 2, PRACTICE: 3 })

const STEP_LABEL = {
  [STEP.QUIZ]: 'Tes Pertanyaan',
  [STEP.PRACTICE]: 'Praktik Kode'
}

// ── Route & Data ──────────────────────────────────────────────────
const route = useRoute()
const router = useRouter()
const { getPathById, getLessonById, getChapterById } = useLearningPaths()
const { isLoggedIn } = useUserAccount()

const pathId = computed(() => route.params.pathId)
const chapterId = computed(() => route.params.chapterId)
const lessonId = computed(() => route.params.lessonId)

const path = computed(() => getPathById(pathId.value))
const currentLesson = computed(() => getLessonById(pathId.value, chapterId.value, lessonId.value))
const currentChapter = computed(() => getChapterById(pathId.value, chapterId.value))

// ── Composables ───────────────────────────────────────────────────
const { isFirstLesson, isLastLesson, goToPrevLesson, goToNextLesson, goToLesson } =
  useLessonNavigation(path, lessonId, pathId)

const quiz = useQuiz()
const runner = useCodeRunner()

// ── Local State ───────────────────────────────────────────────────
const activeStep = ref(STEP.THEORY)
const sidebarCollapsed = ref(false)
const showAuthModal = ref(false)
const pendingStepLabel = ref('Tes Pertanyaan')

// ── Initialise step from query param (preview navigation) ─────────
const initStepFromQuery = () => {
  const stepParam = route.query.step
  if (stepParam === 'quiz') {
    activeStep.value = STEP.QUIZ
  } else if (stepParam === 'practice') {
    activeStep.value = STEP.PRACTICE
  } else {
    activeStep.value = STEP.THEORY
  }
}

// ── Auth Guard ────────────────────────────────────────────────────
/**
 * Cek apakah user sudah login. Jika belum, tampilkan modal.
 * Kembalikan true jika boleh lanjut, false jika ditahan.
 */
const requireAuth = (targetStep) => {
  if (isLoggedIn.value) return true
  pendingStepLabel.value = STEP_LABEL[targetStep] ?? 'langkah selanjutnya'
  showAuthModal.value = true
  return false
}

// ── Handlers ─────────────────────────────────────────────────────
const onSidebarLessonSelect = ({ chapterId: cId, lesson, step }) => {
  // Jika masih di lesson yang sama, cukup ubah step-nya saja
  if (cId === chapterId.value && lesson.id === lessonId.value) {
    if (step === 'quiz') {
      if (!isLoggedIn.value) {
        requireAuth(STEP.QUIZ)
        return
      }
      if (!lesson.isCompleted) return // Ignore click if locked
      activeStep.value = STEP.QUIZ
    } else if (step === 'practice') {
      if (!isLoggedIn.value) {
        requireAuth(STEP.PRACTICE)
        return
      }
      if (!lesson.quizPassed) return // Ignore click if locked
      runner.resetCode()
      activeStep.value = STEP.PRACTICE
    } else {
      activeStep.value = STEP.THEORY
    }
    // Update URL agar jika direfresh step-nya tetap
    router.replace({ query: { ...route.query, step } })
  } else {
    // Navigasi ke lesson yang berbeda, bawa step-nya
    router.push({
      path: `/learning/${path.value.id}/lesson/${cId}/${lesson.id}`,
      query: { step: step || 'theory', preview: '1' }
    })
  }
}


const onRequestNextFromTheory = () => {
  if (!isLoggedIn.value) {
    requireAuth(STEP.QUIZ)
    return
  }
  // Simulate progress unlocking
  if (currentLesson.value) {
    currentLesson.value.isCompleted = true
  }
  activeStep.value = STEP.QUIZ
}

const onRequestNextFromQuiz = () => {
  if (!isLoggedIn.value) {
    requireAuth(STEP.PRACTICE)
    return
  }
  // Simulate progress unlocking
  if (currentLesson.value) {
    currentLesson.value.quizPassed = true
  }
  runner.resetCode()
  activeStep.value = STEP.PRACTICE
}

const goToLogin = () => {
  showAuthModal.value = false
  // Arahkan ke halaman login — sesuaikan route jika sudah ada
  router.push('/?auth=login')
}

const goToRegister = () => {
  showAuthModal.value = false
  // Arahkan ke halaman daftar — sesuaikan route jika sudah ada
  router.push('/?auth=register')
}

// Lesson berubah → reset semua state
watch(currentLesson, () => {
  initStepFromQuery()
  quiz.reset()
  runner.resetCode()
})

// Inisialisasi pertama kali
initStepFromQuery()
</script>


<style scoped>
.lesson-workspace {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.workspace-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.workspace-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.not-found {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #475569;
  font-size: 1rem;
}
.not-found i { font-size: 2rem; }
</style>
