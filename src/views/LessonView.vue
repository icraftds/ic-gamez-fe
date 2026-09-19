<template>
  <div class="lesson-workspace">
    <SimpleBackground />

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
        <transition name="fade-slide" mode="out-in">
          <!-- Step 1: Materi -->
          <TheoryPanel
            key="theory"
            v-if="activeStep === STEP.THEORY && currentLesson"
            :lesson="currentLesson"
            :is-first-lesson="isFirstLesson"
            @prev="goToPrevLesson"
            @next="onRequestNextFromTheory"
          />

          <!-- Step 2: Tes / Kuis -->
          <QuizPanel
            key="quiz"
            v-else-if="activeStep === STEP.QUIZ && currentLesson"
            :lesson="currentLesson"
            :quiz="currentLesson.quizzes"
            :selected-answer="quiz.selectedAnswer.value"
            :is-submitted="quiz.isSubmitted.value"
            :is-correct="quiz.isCorrect.value"
            :is-checking="quiz.isChecking.value"
            :error-message="quiz.errorMessage.value"
            @update:selected-answer="quiz.selectedAnswer.value = $event"
            @submit="onQuizSubmit"
            @retry="quiz.reset()"
            @back="activeStep = STEP.THEORY"
            @next="onRequestNextFromQuiz"
          />

          <!-- Step 3: Praktik -->
          <PracticePanel
            key="practice"
            :run-status="practiceStatus"
            v-else-if="activeStep === STEP.PRACTICE && currentLesson"
            :lesson="currentLesson"
            :language="lessonLanguage"
            :code="runner.code.value"
            :output="runner.output.value"
            :is-last-lesson="isLastLesson"
            @update:code="runner.code.value = $event; practiceStatus = 'idle'"
            @run="onPracticeRun"
            @clear-output="runner.clearOutput()"
            @back="activeStep = STEP.QUIZ"
            @finish="onPracticeFinish"
          />

          <!-- Loading State -->
          <div key="loading" v-else-if="isLoading || !path?.chapters" class="loading-state">
            <div class="spinner-large"></div>
            <p>Mempersiapkan materi belajar...</p>
          </div>

          <!-- Fallback: lesson tidak ditemukan -->
          <div key="notfound" v-else class="not-found">
            <i class="fa-solid fa-circle-exclamation"></i>
            <p>Materi tidak ditemukan atau sudah dihapus. Pastikan URL Anda benar.</p>
            <button class="btn-primary" @click="router.push('/learning')" style="margin-top: 15px; padding: 10px 20px; border-radius: 8px;">
              Kembali ke Modul Belajar
            </button>
          </div>
        </transition>
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

    <!-- Modal Premium -->
    <PremiumModal
      v-model="showPremiumModal"
    />

    <!-- XP Toast Notification -->
    <XpToast
      :amount="toast.xp.value"
      :label="toast.label.value"
      :type="toast.type.value"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useLearningPaths } from '../composables/useLearningPaths'
import { useLessonNavigation } from '../composables/useLessonNavigation'
import { useQuiz } from '../composables/useQuiz'
import { useCodeRunner } from '../composables/useCodeRunner'
import { useUserAccount } from '../composables/useUserAccount'
import { useScoring } from '../composables/useScoring'
import { checkOutputMatch } from '../utils/codeChecker'

import SimpleBackground from '../components/common/SimpleBackground.vue'
import WorkspaceTopbar from '../components/workspace/WorkspaceTopbar.vue'
import WorkspaceSidebar from '../components/workspace/WorkspaceSidebar.vue'
const TheoryPanel = defineAsyncComponent(() => import('../components/workspace/TheoryPanel.vue'))
const QuizPanel = defineAsyncComponent(() => import('../components/workspace/QuizPanel.vue'))
const PracticePanel = defineAsyncComponent(() => import('../components/workspace/PracticePanel/PracticePanel.vue'))
const AuthRequiredModal = defineAsyncComponent(() => import('../components/common/AuthRequiredModal.vue'))
const PremiumModal = defineAsyncComponent(() => import('../components/common/PremiumModal.vue'))
import XpToast from '../components/common/XpToast.vue'

// ── Enums ─────────────────────────────────────────────────────────
const STEP = Object.freeze({ THEORY: 1, QUIZ: 2, PRACTICE: 3 })

const STEP_LABEL = {
  [STEP.QUIZ]: 'Tes Pertanyaan',
  [STEP.PRACTICE]: 'Praktik Kode'
}

// ── Route & Data ──────────────────────────────────────────────────
const route = useRoute()
const router = useRouter()
const { getPathById, getLessonById, getChapterById, fetchPathDetails, isLoading, isPreparingLesson } = useLearningPaths()
const { isLoggedIn, isPremiumUser } = useUserAccount()

const pathId = computed(() => route.params.pathId)
const chapterId = computed(() => route.params.chapterId)
const lessonId = computed(() => route.params.lessonId)

const path = computed(() => getPathById(pathId.value))
const currentLesson = computed(() => getLessonById(pathId.value, chapterId.value, lessonId.value))
const currentChapter = computed(() => getChapterById(pathId.value, chapterId.value))

onMounted(async () => {
  if (!path.value || !path.value.chapters) {
    await fetchPathDetails(pathId.value)
  }
  isPreparingLesson.value = false
})

// ── Composables ───────────────────────────────────────────────────
const { isFirstLesson, isLastLesson, goToPrevLesson, goToNextLesson, goToLesson, getNextLesson } =
  useLessonNavigation(path, lessonId, pathId)

const quiz = useQuiz()
const runner = useCodeRunner()
const scoring = useScoring()

const lessonLanguage = computed(() => {
  const pSlug = path.value?.slug || pathId.value;
  const cSlug = currentChapter.value?.slug || chapterId.value;
  
  if (pSlug === 'database') return 'sql'
  if (pSlug === 'frontend' || pSlug === 'frontend-web') {
    if (['fe1', 'fe2'].includes(cSlug)) return 'html'
    if (cSlug === 'fe3') return 'css'
    return 'javascript'
  }
  return 'javascript'
})

// ── Toast State ───────────────────────────────────────────────────
const toast = {
  xp: ref(0),
  label: ref(''),
  type: ref('quiz'),
}

/** Tampilkan toast XP. Setiap panggilan me-reset amount agar watcher trigger ulang. */
const showXpToast = (xp, label, type = 'quiz') => {
  // Reset dulu agar watcher mendeteksi perubahan meski nilainya sama
  toast.xp.value = 0
  setTimeout(() => {
    toast.xp.value = xp
    toast.label.value = label
    toast.type.value = type
  }, 50)
}

// ── Local State ───────────────────────────────────────────────────
const activeStep = ref(STEP.THEORY)
const practiceStatus = ref('idle')
const sidebarCollapsed = ref(false)
const showAuthModal = ref(false)
const showPremiumModal = ref(false)
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
  const firstChapter = path.value?.chapters?.[0]
  const firstLesson = firstChapter?.lessons?.[0]
  
  const isClickedFirstLesson = firstChapter && firstLesson &&
    (cId === firstChapter.id || cId === firstChapter.slug) &&
    (lesson.id === firstLesson.id || lesson.slug === firstLesson.slug)

  if (lesson.is_premium && !isPremiumUser.value && !isClickedFirstLesson) {
    showPremiumModal.value = true
    return
  }

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
      runner.resetCode(lesson.practice)
      activeStep.value = STEP.PRACTICE
      practiceStatus.value = 'idle'
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


const onQuizSubmit = async () => {
  if (!isLoggedIn.value) {
    requireAuth(STEP.PRACTICE)
    return
  }
  quiz.isChecking.value = true
  
  // Panggil backend
  const result = await scoring.awardXp('quiz', currentLesson.value.id, { 
    answer_index: quiz.selectedAnswer.value 
  })
  
  quiz.isChecking.value = false
  quiz.isSubmitted.value = true
  
  if (quiz.isChecking) quiz.isChecking.value = false;
  quiz.isSubmitted.value = true;
  
  // GUNAKAN RESULT.SUCCESS SEBAGAI PENENTU KEBENARAN
  if (result.success) {
    // Jawaban Benar (Backend mengembalikan 200 OK)
    quiz.isCorrect.value = true
    if (currentLesson.value) currentLesson.value.quizPassed = true
    if (result.explanation && currentLesson.value.quizzes?.[0]) {
      currentLesson.value.quizzes[0].explanation = result.explanation
    }
    if (result.awarded) {
      showXpToast(result.xp, 'Quiz Benar!', 'quiz')
    }
  } else {
    // Jawaban Salah (Backend mengembalikan 400 Error)
    quiz.isCorrect.value = false
    if (result.error) {
      quiz.errorMessage.value = result.error
    }
  }
}

const onRequestNextFromTheory = async () => {
  if (!isLoggedIn.value) {
    requireAuth(STEP.QUIZ)
    return
  }
  
  if (currentLesson.value) {
    currentLesson.value.isCompleted = true
    // Beritahu backend (berjalan di background, tidak memblokir UI)
    scoring.awardXp('theory', currentLesson.value.id).catch(console.error)
  }
  activeStep.value = STEP.QUIZ
}

const onRequestNextFromQuiz = async () => {
  if (!isLoggedIn.value) {
    requireAuth(STEP.PRACTICE)
    return
  }
  // Simulate progress unlocking
  if (currentLesson.value) {
    currentLesson.value.quizPassed = true
  }

  runner.resetCode(currentLesson.value?.practice)
  activeStep.value = STEP.PRACTICE
}

/** Jalankan kode practice dan beri XP jika berhasil tanpa error. */
const onPracticeRun = async () => {
  practiceStatus.value = 'idle'
  runner.run(lessonLanguage.value)

  const hasError = runner.output.value.some(e => e.type === 'error')
  
  if (hasError) {
    practiceStatus.value = 'error'
  } else {
    // Validasi kesesuaian output
    const isMatch = checkOutputMatch(lessonLanguage.value, currentLesson.value?.practice, runner.output.value, runner.code.value);
    
    if (isMatch) {
      practiceStatus.value = 'success'
      if (currentLesson.value) {
        currentLesson.value.practiceDone = true
        const result = await scoring.awardXp('practice', currentLesson.value.id)
        if (result.awarded) {
          showXpToast(result.xp, 'Praktik Berhasil!', 'practice')
        }
      }
    } else {
      practiceStatus.value = 'warning'
    }
  }
}

/** Selesai & Lanjut dari practice. */
const onPracticeFinish = async () => {
  if (currentLesson.value) {
    currentLesson.value.practiceDone = true
  }

  const next = getNextLesson()
  if (next && next.is_premium && !isPremiumUser.value) {
    showPremiumModal.value = true
    return
  }

  goToNextLesson()
}

const goToLogin = () => {
  showAuthModal.value = false
  router.push('/login')
}

const goToRegister = () => {
  showAuthModal.value = false
  router.push('/register')
}

// Lesson berubah → reset semua state
watch(currentLesson, (newLesson) => {
  if (newLesson && newLesson.is_premium && !isPremiumUser.value && !isFirstLesson.value) {
    showPremiumModal.value = true
    router.replace(`/learning/${pathId.value}`)
    return
  }
  initStepFromQuery()
  quiz.reset()
  runner.resetCode(newLesson?.practice)
}, { immediate: true })

// Inisialisasi pertama kali
// (tidak perlu initStepFromQuery() di sini lagi karena sudah via watch { immediate: true })
</script>


<style src="../assets/css/pages/LessonView.css" scoped></style>
<style scoped src="../assets/css/views/LessonView.css"></style>
t o u c h  
 