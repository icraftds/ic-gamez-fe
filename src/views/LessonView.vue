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
          :quiz="currentLesson.quizzes"
          :selected-answer="quiz.selectedAnswer.value"
          :is-submitted="quiz.isSubmitted.value"
          :is-correct="quiz.isCorrect.value"
          @update:selected-answer="quiz.selectedAnswer.value = $event"
          @submit="quiz.submit(currentLesson.quizzes)"
          @retry="quiz.reset()"
          @back="activeStep = STEP.THEORY"
          @next="onRequestNextFromQuiz"
        />

        <!-- Step 3: Praktik -->
        <PracticePanel
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
        <div v-else-if="isLoading || !path?.chapters" class="loading-state">
          <div class="spinner-large"></div>
          <p>Mempersiapkan materi belajar...</p>
        </div>

        <!-- Fallback: lesson tidak ditemukan -->
        <div v-else class="not-found">
          <i class="fa-solid fa-circle-exclamation"></i>
          <p>Materi tidak ditemukan. Pastikan URL Anda benar.</p>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useLearningPaths } from '../composables/useLearningPaths'
import { useLessonNavigation } from '../composables/useLessonNavigation'
import { useQuiz } from '../composables/useQuiz'
import { useCodeRunner } from '../composables/useCodeRunner'
import { useUserAccount } from '../composables/useUserAccount'
import { useScoring } from '../composables/useScoring'

import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import WorkspaceTopbar from '../components/workspace/WorkspaceTopbar.vue'
import WorkspaceSidebar from '../components/workspace/WorkspaceSidebar.vue'
import TheoryPanel from '../components/workspace/TheoryPanel.vue'
import QuizPanel from '../components/workspace/QuizPanel.vue'
import PracticePanel from '../components/workspace/PracticePanel.vue'
import AuthRequiredModal from '../components/common/AuthRequiredModal.vue'
import PremiumModal from '../components/common/PremiumModal.vue'
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


const checkOutputMatch = (lessonLanguage, lessonPractice, runnerOutputArray, currentCode) => {
  // Pengecekan Universal: Jika masih ada "___" di bagian kode utama (abaikan komentar), berarti belum diisi!
  if (currentCode) {
    const codeWithoutComments = currentCode.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    if (codeWithoutComments.includes('___')) return false;
  }

  if (['html', 'css', 'sql'].includes(lessonLanguage)) return true;
  if (!lessonPractice) return true;
  
  const lines = lessonPractice.split('\n');
  let expectedOutput = '';
  let inOutputSection = false;
  
  for (let line of lines) {
    let t = line.trim();
    if (!t.startsWith('//')) {
      if (t !== '') break;
      continue;
    }
    let commentText = t.replace(/^\/\/\s*/, '');
    let lowerLine = commentText.toLowerCase();
    
    if (lowerLine.startsWith('harapan:') || lowerLine.startsWith('output:')) {
      inOutputSection = true;
      expectedOutput += commentText.replace(/(?:harapan|output):/i, '').trim() + ' ';
      continue;
    } else if (lowerLine.match(/^(tugas|contoh|🎯)/i) && inOutputSection) {
      inOutputSection = false;
    }
    
    if (inOutputSection && commentText.trim() !== '') {
      expectedOutput += commentText + ' ';
    }
  }
  
  expectedOutput = expectedOutput.trim();
  if (!expectedOutput) return true; 
  
  const actualOutput = runnerOutputArray.map(o => o.text).join(' ').trim();
  const looseExpected = expectedOutput.toLowerCase().replace(/\s+/g, ' ').replace(/["']/g, '');
  const looseActual = actualOutput.toLowerCase().replace(/\s+/g, ' ').replace(/["']/g, '');
  
  return looseActual.includes(looseExpected) || looseExpected.includes(looseActual);
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
  if (lesson.is_premium && !isPremiumUser.value) {
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


const onRequestNextFromTheory = async () => {
  if (!isLoggedIn.value) {
    requireAuth(STEP.QUIZ)
    return
  }
  
  if (currentLesson.value) {
    currentLesson.value.isCompleted = true
    // Beritahu backend bahwa theory sudah dibaca agar status tersimpan (persist)
    await scoring.awardXp('theory', currentLesson.value.id)
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

  // Award XP untuk quiz benar (hanya sekali per lesson)
  if (currentLesson.value) {
    const result = await scoring.awardXp('quiz', currentLesson.value.id)
    if (result.awarded) {
      showXpToast(result.xp, 'Quiz Benar!', 'quiz')
    }
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

/** Selesai & Lanjut dari practice. Pastikan XP diberikan juga. */
const onPracticeFinish = async () => {
  if (currentLesson.value) {
    // Beri XP jika belum pernah (misal user langsung klik finish)
    const result = await scoring.awardXp('practice', currentLesson.value.id)
    if (result.awarded) {
      showXpToast(result.xp, 'Praktik Selesai!', 'practice')
    }
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
  // Arahkan ke halaman login — sesuaikan route jika sudah ada
  router.push('/?auth=login')
}

const goToRegister = () => {
  showAuthModal.value = false
  // Arahkan ke halaman daftar — sesuaikan route jika sudah ada
  router.push('/?auth=register')
}

// Lesson berubah → reset semua state
watch(currentLesson, (newLesson) => {
  if (newLesson && newLesson.is_premium && !isPremiumUser.value) {
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
