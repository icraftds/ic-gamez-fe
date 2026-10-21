<template>
  <div class="lesson-workspace">
    <SimpleBackground />

    <WorkspaceTopbar
      :path-title="path?.title ?? ''"
      :chapter-title="currentChapter?.title ?? ''"
      :lesson-title="currentLesson?.title ?? ''"
      :previous-lesson-title="previousLessonTitle"
      :active-step="activeStep"
      :lesson="currentLesson"
      @back="router.push({ path: `/learning/${path?.slug || pathId}`, query: { chapter: currentChapter?.slug || currentChapter?.id } })"
      @prev-lesson="goToPrevLesson"
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
        :is-first-lesson="isFirstLesson"
        @lesson-select="onSidebarLessonSelect"
        @prev-lesson="goToPrevLesson"
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
            :selected-answers="quiz.selectedAnswers.value"
            :current-quiz-index="quiz.currentQuizIndex.value"
            :quiz-results="quiz.quizResults.value"
            :is-submitted="quiz.isSubmitted.value"
            :is-correct="quiz.isCorrect.value"
            :is-checking="quiz.isChecking.value"
            :error-message="quiz.errorMessage.value"
            @update:selected-answer="quiz.selectedAnswer.value = $event"
            @update:selected-answers="quiz.setAnswer($event.quizId, $event.optionIndex)"
            @update:current-quiz-index="quiz.goToQuiz($event)"
            @submit="onQuizSubmit"
            @retry="quiz.retry()"
            @back="activeStep = STEP.THEORY"
            @next="onRequestNextFromQuiz"
          />

          <!-- Step 3: Praktik -->
          <PracticePanel
            key="practice"
            :run-status="runner.status.value"
            v-else-if="activeStep === STEP.PRACTICE && currentLesson"
            :lesson="currentLesson"
            :language="lessonLanguage"
            :code="runner.code.value"
            :output="runner.output.value"
            :is-last-lesson="isLastLesson"
            @update:code="runner.code.value = $event; runner.status.value = 'idle'"
            @run="onPracticeRun"
            @clear-output="runner.clearOutput()"
            @back="activeStep = STEP.QUIZ"
            @finish="onPracticeFinish"
          />

          <!-- Loading State -->
          <div key="loading" v-else-if="isLoading || !path?.chapters" class="loading-state">
            <TerminalLoader size="lg" label="materi belajar" />
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

    <!-- Dedicated iCoinZ Toast Notification -->
    <CoinzToast
      :amount="toast.coinz.value"
      label="Bonus iCoinZ!"
    />

    
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useLearningPaths } from '../composables/useLearningPaths'
import { useLessonNavigation } from '../composables/useLessonNavigation'
import { useQuiz } from '../composables/useQuiz'
import { useCodeRunner } from '../composables/useCodeRunner'
import { useUserAccount } from '../composables/useUserAccount'
import { useScoring } from '../composables/useScoring'
import api from '../services/api'
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
import CoinzToast from '../components/common/CoinzToast.vue'

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
  // Pastikan detail (termasuk quizzes) dimuat. Endpoint index tidak me-load quizzes.
  const hasQuizzesLoaded = path.value?.chapters?.[0]?.lessons?.[0]?.quizzes !== undefined;
  
  if (!path.value || !path.value.chapters || !hasQuizzesLoaded) {
    await fetchPathDetails(pathId.value)
  }
  isPreparingLesson.value = false

  // Proses pending outbox dari sesi sebelumnya (jika ada)
  scoring.processPendingFromPreviousSession()
})

onBeforeUnmount(() => {
  scoring.flushOutboxNow().catch(() => {})
})


// ── Composables ───────────────────────────────────────────────────
const { allLessons, currentIndex, isFirstLesson, isLastLesson, goToPrevLesson, goToNextLesson, goToLesson, getNextLesson } =
  useLessonNavigation(path, lessonId, pathId)

const previousLessonTitle = computed(() => {
  if (currentIndex.value > 0) {
    return allLessons.value[currentIndex.value - 1].title;
  }
  return '';
})

const quiz = useQuiz()
const runner = useCodeRunner()
const scoring = useScoring()

const lessonLanguage = computed(() => {
  if (currentLesson.value?.language) {
    return currentLesson.value.language;
  }

  // Fallback for older lessons that don't have language property
  const pSlug = (path.value?.slug || pathId.value || '').toLowerCase();
  const cSlug = (currentChapter.value?.slug || chapterId.value || '').toLowerCase();
  
  if (pSlug.includes('database') || pSlug.includes('sql')) return 'sql';
  if (pSlug.includes('python')) return 'python';
  if (pSlug.includes('php') || pSlug.includes('laravel')) return 'php';
  
  if (pSlug.includes('frontend') || pSlug.includes('web')) {
    if (cSlug.includes('javascript') || cSlug.includes('js') || ['fe4', 'fe5', 'fe6'].includes(cSlug)) return 'javascript';
    if (cSlug.includes('css') || cSlug === 'fe3') return 'css';
    return 'html';
  }
  
  return 'javascript';
})

// ── Toast State ───────────────────────────────────────────────────
const toast = {
  xp: ref(0),
  coinz: ref(0),
  label: ref(''),
  type: ref('quiz'),
}

/** Tampilkan toast XP. Setiap panggilan me-reset amount agar watcher trigger ulang. */
const showRewardToast = (xp, label, type = 'quiz', coinz = 0) => {
  toast.xp.value = 0
  toast.coinz.value = 0
  setTimeout(() => {
    toast.xp.value = xp
    toast.coinz.value = coinz
    toast.label.value = label
    toast.type.value = type
  }, 50)
}

// ── Local State ───────────────────────────────────────────────────
const activeStep = ref(STEP.THEORY)
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
      runner.loadFromStorage(lesson.id, lesson.practice)
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


const onQuizSubmit = async () => {
  if (!isLoggedIn.value) {
    requireAuth(STEP.PRACTICE)
    return
  }
  quiz.isChecking.value = true
  quiz.errorMessage.value = ''
  
  // Siapkan payload yang mendukung single-quiz dan multi-quiz
  const payload = quiz.getPayload(currentLesson.value?.quizzes || [])

  // Quiz TETAP sinkron ke server karena perlu validasi jawaban
  const result = await scoring.awardXp('quiz', currentLesson.value.id, payload)
  
  quiz.isChecking.value = false
  quiz.isSubmitted.value = true
  
  // Simpan hasil evaluasi per soal jika tersedia dari backend
  if (result.results) {
    quiz.setResults(result.results)
  }

  // GUNAKAN RESULT.SUCCESS SEBAGAI PENENTU KEBENARAN
  if (result.success) {
    // Semua Jawaban Benar (Backend mengembalikan 200 OK)
    quiz.isCorrect.value = true
    if (currentLesson.value) currentLesson.value.quizPassed = true
    if (result.explanation && currentLesson.value.quizzes?.[0]) {
      currentLesson.value.quizzes[0].explanation = result.explanation
    }
    if (result.awarded) {
      const rewardLabel = (currentLesson.value.quizzes?.length > 1) ? 'Semua Kuis Benar!' : 'Quiz Benar!'
      showRewardToast(result.xp, rewardLabel, 'quiz', 0)
    }
  } else {
    // Jawaban Salah / Belum Lengkap (Backend mengembalikan 400 Error)
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
    localStorage.setItem(`theory_completed_${currentLesson.value.id}`, 'true')
    // Simpan progres materi selesai ke backend (tanpa penambahan reward XP)
    api.post('/progress/complete', { lesson_id: currentLesson.value.id }).catch(console.error)
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

  runner.loadFromStorage(currentLesson.value?.id, currentLesson.value?.practice)
  activeStep.value = STEP.PRACTICE
}

/** Jalankan kode practice dan beri XP jika berhasil tanpa error. */
const onPracticeRun = async () => {
  runner.status.value = 'idle'
  await runner.run(lessonLanguage.value, currentLesson.value)

  const hasError = runner.output.value.some(e => e.type === 'error')
  
  if (hasError) {
    runner.status.value = 'error'
  } else {
    // Validasi kesesuaian output
    const isMatch = await checkOutputMatch(lessonLanguage.value, currentLesson.value?.practice, runner.output.value, runner.code.value, currentLesson.value);
    
    if (isMatch) {
      runner.status.value = 'success'
      if (currentLesson.value) {
        // Cegah double-award secara lokal
        if (scoring.hasBeenScored('practice', currentLesson.value.id)) return

        currentLesson.value.practiceDone = true

        // Hitung nilai XP secara lokal untuk informasi chapter/difficulty
        const chapterOrder = currentLesson.value.chapter?.sort_order
          ?? currentLesson.value.chapterOrder
          ?? 1
        const difficulty = currentLesson.value.difficulty || ''

        // ① OPTIMISTIC: Update UI instan tanpa menunggu API
        const { xp, coinz } = scoring.awardXpOptimistic('practice', currentLesson.value.id, {
          difficulty,
          chapterOrder,
          awardCoinz: true
        })

        // ② Tampilkan TOAST segera (XP & iCoinZ langsung muncul instan di Toast, 0 delay, no blocking popup!)
        showRewardToast(xp, 'Praktik Berhasil!', 'practice', coinz)

        // ③ BACKGROUND SYNC: Kirim ke server dengan delay 3 detik
        const extraData = {
          saved_code: runner.code.value,
          code: runner.code.value
        }
        if (route.query.mode) extraData.mode = route.query.mode

        scoring.enqueueSyncToServer('practice', currentLesson.value.id, extraData, xp, coinz)
      }
    } else {
      runner.status.value = 'warning'
    }
  }
}


/** Selesai & Lanjut dari practice. */
const onPracticeFinish = async () => {
  if (currentLesson.value) {
    currentLesson.value.practiceDone = true
  }

  // Segera kirim outbox yang tertunda saat user lanjut tanpa menunggu 3 detik
  scoring.flushOutboxNow().catch(() => {})

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
  if (newLesson && newLesson.id) {
    quiz.loadFromStorage(newLesson.id)
  } else {
    quiz.reset()
  }
  if (newLesson && newLesson.id) {
    runner.loadFromStorage(newLesson.id, newLesson?.practice)
    if (quiz.isCorrect.value) {
      newLesson.quizPassed = true
    }
    if (runner.status.value === 'success') {
      newLesson.practiceDone = true
    }
  } else {
    runner.resetCode(newLesson?.practice)
  }
}, { immediate: true })

// Inisialisasi pertama kali
// (tidak perlu initStepFromQuery() di sini lagi karena sudah via watch { immediate: true })
</script>


<style scoped src="../assets/css/views/LessonView.css"></style>

