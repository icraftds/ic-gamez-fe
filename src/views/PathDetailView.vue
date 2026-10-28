<template>
  <div class="roadmap-view">
    <SimpleBackground />
        
    <div class="content-area">
      <div class="container roadmap-shell">
        
        <!-- Breadcrumb & Top Bar -->
        <div class="nav-top">
          <button class="back-btn" @click="$router.push('/learning')">
            <i class="fa-solid fa-arrow-left"></i> Kembali ke Alur
          </button>
          <div class="roadmap-badge-top" v-if="path">
            <i class="fa-solid fa-graduation-cap"></i> Roadmap Terstruktur
          </div>
        </div>

        <div v-if="path && path.chapters && path.chapters.length > 0" class="roadmap-hub-card">
          
          <!-- Hub Header (Compact Banner matching mockup) -->
          <div class="hub-header">
            <!-- Left: Path Logo / Icon Visual (Matches /learning) -->
            <div 
              class="hub-icon-wrapper" 
              :style="{
                borderColor: pathThemeColor + '55',
                background: `radial-gradient(circle at 50% 50%, ${pathThemeColor}28, rgba(14, 20, 42, 0.9))`,
                boxShadow: `0 0 28px ${pathThemeColor}30, inset 0 0 16px ${pathThemeColor}18`
              }"
            >
              <div class="hub-icon-glow" :style="{ background: pathThemeColor }"></div>
              <i :class="pathIconClass" class="hub-path-icon" :style="{ color: pathThemeColor }"></i>
            </div>

            <!-- Center: Title, Description, Progress -->
            <div class="hub-info">
              <h1 class="hub-title">{{ path.title }}</h1>
              <p class="hub-desc">{{ path.description }}</p>
              
              <!-- Progress Bar -->
              <div class="hub-progress-wrap">
                <div class="hub-progress-track">
                  <div class="hub-progress-bar" :style="{ width: progressPercentage + '%' }"></div>
                </div>
                <div class="hub-progress-labels">
                  <span class="hub-progress-pct">{{ progressPercentage }}% selesai</span>
                  <span class="hub-progress-count">{{ completedLessonsCount }} dari {{ totalLessonsCount }} materi selesai</span>
                </div>
              </div>
            </div>

            <!-- Right: Action Button -->
            <div class="hub-action">
              <button class="btn-hub-continue" @click="resumeLearning">
                <span>{{ progressPercentage === 100 ? 'Pelajari Ulang' : (progressPercentage > 0 ? 'Lanjutkan' : 'Mulai Belajar') }}</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- Hub Body (2 Columns matching mockup) -->
          <div class="hub-body">
            
            <!-- Left Column: Chapter Stepper -->
            <div class="stepper-column">
              <div class="stepper-header">
                <span class="stepper-title">DAFTAR BAB</span>
                <span class="stepper-badge">{{ path.chapters.length }} Bab</span>
              </div>

              <div class="stepper-list-wrapper">
                <div class="stepper-track-line"></div>
                
                <div 
                  v-for="(chapter, cIdx) in path.chapters" 
                  :key="chapter.id"
                  class="stepper-item"
                  :class="{ 
                    'active': selectedChapterId === chapter.id,
                    'completed': isChapterCompleted(chapter)
                  }"
                  :style="selectedChapterId === chapter.id ? { 
                    borderColor: getChapterTheme(chapter, cIdx).color + '66',
                    background: `linear-gradient(90deg, ${getChapterTheme(chapter, cIdx).color}1f 0%, rgba(15, 23, 42, 0.45) 100%)`
                  } : {}"
                  @click="selectChapter(chapter)"
                >
                  <!-- Node Circle -->
                  <div 
                    class="stepper-node"
                    :style="selectedChapterId === chapter.id ? { 
                      background: getChapterTheme(chapter, cIdx).color, 
                      borderColor: getChapterTheme(chapter, cIdx).color,
                      boxShadow: `0 0 14px ${getChapterTheme(chapter, cIdx).color}88`,
                      color: '#ffffff'
                    } : {}"
                  >
                    <i v-if="isChapterCompleted(chapter)" class="fa-solid fa-check"></i>
                    <span v-else>{{ cIdx + 1 }}</span>
                  </div>

                  <!-- Item Content -->
                  <div class="stepper-content">
                    <div class="stepper-item-title">
                      <span 
                        class="stepper-ch-icon" 
                        :style="{ 
                          color: getChapterTheme(chapter, cIdx).color, 
                          backgroundColor: getChapterTheme(chapter, cIdx).color + '18',
                          borderColor: getChapterTheme(chapter, cIdx).color + '35'
                        }"
                        :title="'Bab ' + (cIdx + 1)"
                      >
                        <i :class="getChapterTheme(chapter, cIdx).icon"></i>
                      </span>
                      <span class="stepper-title-text">{{ chapter.title }}</span>
                    </div>
                    <div class="stepper-item-meta">
                      <span>{{ chapter.lessons?.length || 0 }} materi</span>
                      <span v-if="getChapterCompletedCount(chapter) > 0" class="stepper-item-done">
                        • {{ getChapterCompletedCount(chapter) }}/{{ chapter.lessons?.length || 0 }} selesai
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Active Chapter Showcase & Lesson List -->
            <div class="detail-column" v-if="selectedChapter">
              
              <!-- Chapter Showcase Card -->
              <div 
                class="chapter-showcase-card" 
                :style="{
                  borderColor: activeChapterTheme.color + '40',
                  background: `linear-gradient(135deg, ${activeChapterTheme.color}14 0%, rgba(13, 20, 38, 0.75) 100%)`
                }"
              >
                <!-- Dynamic Chapter Icon Showcase Visual -->
                <div class="chapter-visual-wrapper" :style="{ '--ch-color': activeChapterTheme.color }">
                  <div class="chapter-visual-glow" :style="{ background: activeChapterTheme.color }"></div>
                  <div 
                    class="chapter-visual-core" 
                    :style="{
                      borderColor: activeChapterTheme.color + '66',
                      background: `radial-gradient(circle at 50% 50%, ${activeChapterTheme.color}25, rgba(15, 23, 42, 0.92))`,
                      boxShadow: `0 0 25px ${activeChapterTheme.color}35, inset 0 0 15px ${activeChapterTheme.color}20`
                    }"
                  >
                    <div class="chapter-visual-orbit" :style="{ borderColor: activeChapterTheme.color + '33' }"></div>
                    <i :class="activeChapterTheme.icon" class="chapter-visual-icon" :style="{ color: activeChapterTheme.color }"></i>
                  </div>
                  <div 
                    class="chapter-visual-pill" 
                    :style="{
                      color: activeChapterTheme.color,
                      borderColor: activeChapterTheme.color + '45',
                      backgroundColor: activeChapterTheme.color + '18'
                    }"
                  >
                    BAB {{ selectedChapterIndex + 1 }}
                  </div>
                </div>

                <div class="chapter-showcase-info">
                  <div 
                    class="chapter-badge" 
                    :style="{
                      color: activeChapterTheme.color,
                      borderColor: activeChapterTheme.color + '45',
                      backgroundColor: activeChapterTheme.color + '16'
                    }"
                  >
                    <i :class="activeChapterTheme.icon"></i>
                    <span>MODUL BAB {{ selectedChapterIndex + 1 }}</span>
                  </div>
                  <h2 class="chapter-title">{{ selectedChapter.title }}</h2>
                  <p class="chapter-desc">{{ selectedChapter.description || 'Pelajari materi dan selesaikan tantangan untuk menguasai bab ini secara komprehensif.' }}</p>
                  
                  <div class="chapter-meta-row">
                    <span class="meta-tag"><i class="fa-solid fa-book-open"></i> {{ selectedChapter.lessons?.length || 0 }} materi</span>
                    <span class="meta-tag"><i class="fa-solid fa-clock"></i> ~{{ Math.max(15, (selectedChapter.lessons?.length || 1) * 12) }} menit</span>
                    <span class="meta-tag"><i class="fa-solid fa-trophy"></i> +{{ (selectedChapter.lessons?.length || 0) * 50 }} XP</span>
                  </div>

                  <button 
                    class="btn-start-module" 
                    :style="{
                      background: `linear-gradient(135deg, ${activeChapterTheme.color} 0%, ${activeChapterTheme.color}dd 100%)`,
                      boxShadow: `0 4px 18px ${activeChapterTheme.color}45`
                    }"
                    @click="startOrResumeChapter(selectedChapter)"
                  >
                    <i class="fa-solid fa-play"></i>
                    <span>{{ isChapterCompleted(selectedChapter) ? 'Ulangi Bab' : (getChapterCompletedCount(selectedChapter) > 0 ? 'Lanjutkan Modul' : 'Mulai Modul') }}</span>
                  </button>
                </div>
              </div>

              <!-- Lessons Section (Interactive List of Lessons) -->
              <div class="chapter-lessons-container">
                <div class="lessons-bar-header">
                  <div class="lessons-header-left">
                    <i class="fa-solid fa-list-check"></i>
                    <span>Materi di Bab Ini</span>
                  </div>
                  <span class="lessons-progress-chip">
                    {{ getChapterCompletedCount(selectedChapter) }}/{{ selectedChapter.lessons?.length || 0 }} Selesai
                  </span>
                </div>

                <div class="lessons-list" v-if="selectedChapter.lessons && selectedChapter.lessons.length > 0">
                  <div 
                    v-for="(lesson, lIdx) in selectedChapter.lessons" 
                    :key="lesson.id"
                    class="lesson-item-row"
                    :class="{ 
                      'is-completed': isLessonCompleted(lesson),
                      'is-locked': lesson.is_premium && !isPremiumUser && !(selectedChapterIndex === 0 && lIdx === 0)
                    }"
                    @click="goToLesson(selectedChapter.id, lesson)"
                  >
                    <!-- Status Icon -->
                    <div class="lesson-status-icon">
                      <i v-if="lesson.is_premium && !isPremiumUser && !(selectedChapterIndex === 0 && lIdx === 0)" class="fa-solid fa-lock text-amber" title="Konten Premium"></i>
                      <i v-else-if="isLessonCompleted(lesson)" class="fa-solid fa-circle-check text-green" title="Selesai"></i>
                      <i v-else class="fa-solid fa-circle-play text-cyan" title="Siap dipelajari"></i>
                    </div>

                    <!-- Number & Title -->
                    <div class="lesson-info">
                      <div class="lesson-name">
                        <span class="lesson-num">{{ selectedChapterIndex + 1 }}.{{ lIdx + 1 }}</span>
                        <span class="lesson-title-text">{{ lesson.title }}</span>
                      </div>
                      <div class="lesson-type-chips">
                        <span v-if="lesson.type === 'code'" class="type-pill code"><i class="fa-solid fa-code"></i> Praktik Kode</span>
                        <span v-else-if="lesson.quizzes && lesson.quizzes.length > 0" class="type-pill quiz"><i class="fa-solid fa-circle-question"></i> Kuis</span>
                        <span v-else class="type-pill theory"><i class="fa-solid fa-book-open"></i> Teori</span>
                        <span class="type-pill xp">+50 XP</span>
                      </div>
                    </div>

                    <!-- Action Button / Tag -->
                    <div class="lesson-action">
                      <span v-if="lesson.is_premium && !isPremiumUser && !(selectedChapterIndex === 0 && lIdx === 0)" class="action-tag lock">
                        PRO
                      </span>
                      <span v-else-if="isLessonCompleted(lesson)" class="action-tag done">
                        Selesai <i class="fa-solid fa-rotate-right"></i>
                      </span>
                      <button v-else class="btn-lesson-open">
                        Buka <i class="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Next Chapter Switcher -->
                <div class="next-chapter-footer" v-if="selectedChapterIndex < path.chapters.length - 1">
                  <button class="btn-next-chapter" @click="goToNextChapter">
                    <span>Lanjut ke BAB {{ selectedChapterIndex + 2 }}</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <TerminalLoader v-else-if="isLoading" label="roadmap belajar" />
        
        <div v-else-if="path && !isLoading" class="empty-state">
          <div class="empty-icon"><i class="fa-solid fa-person-digging"></i></div>
          <h3>Roadmap Sedang Dibangun</h3>
          <p>Materi untuk alur belajar ini sedang dalam tahap penyusunan.</p>
        </div>

      </div>
    </div>
    
    <PremiumModal v-model="showPremiumModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLearningPaths } from '../composables/useLearningPaths'
import { useUserAccount } from '../composables/useUserAccount'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import PremiumModal from '../components/common/PremiumModal.vue'
import { getPathThemeColor, getPathIconClass } from '../utils/pathTheme'

const route = useRoute()
const router = useRouter()
const { getPathById, fetchPathDetails, isLoading, isPreparingLesson } = useLearningPaths()
const { isPremiumUser } = useUserAccount()

const pathId = computed(() => route.params.pathId)
const path = computed(() => getPathById(pathId.value))
const showPremiumModal = ref(false)

// Path theme color matching /learning
const pathThemeColor = computed(() => {
  if (!path.value) return '#38bdf8'
  return getPathThemeColor(path.value)
})

// Path icon class matching /learning
const pathIconClass = computed(() => {
  return getPathIconClass(path.value)
})

// Diverse Chapter Themes & Icons per Bab
const CHAPTER_PALETTE = [
  { color: '#38bdf8', defaultIcon: 'fa-solid fa-seedling' },
  { color: '#ec4899', defaultIcon: 'fa-solid fa-code-branch' },
  { color: '#a855f7', defaultIcon: 'fa-solid fa-arrows-rotate' },
  { color: '#10b981', defaultIcon: 'fa-solid fa-layer-group' },
  { color: '#f59e0b', defaultIcon: 'fa-solid fa-gears' },
  { color: '#6366f1', defaultIcon: 'fa-solid fa-shield-halved' },
  { color: '#06b6d4', defaultIcon: 'fa-solid fa-rocket' },
  { color: '#f43f5e', defaultIcon: 'fa-solid fa-trophy' }
]

const getChapterTheme = (chapter, index = 0) => {
  if (!chapter) return { color: '#38bdf8', icon: 'fa-solid fa-book-open' }
  
  if (chapter.icon) {
    const fallback = CHAPTER_PALETTE[index % CHAPTER_PALETTE.length]
    return { color: fallback.color, icon: chapter.icon }
  }

  const text = `${chapter.slug || ''} ${chapter.title || ''}`.toLowerCase()

  let icon = null
  let color = null

  if (text.includes('variabel') || text.includes('sintaks') || text.includes('pengenalan') || text.includes('fundamental') || text.includes('dekomposisi')) {
    icon = text.includes('dekomposisi') ? 'fa-solid fa-puzzle-piece' : (text.includes('sintaks') ? 'fa-solid fa-terminal' : 'fa-solid fa-cube')
    color = '#38bdf8'
  } else if (text.includes('operator') || text.includes('percabangan') || text.includes('kondisi') || text.includes('kontrol alur') || text.includes('flowchart') || text.includes('himpunan')) {
    icon = text.includes('flowchart') ? 'fa-solid fa-diagram-project' : 'fa-solid fa-code-branch'
    color = '#ec4899'
  } else if (text.includes('perulangan') || text.includes('loop') || text.includes('iterasi') || text.includes('fungsi') || text.includes('modul')) {
    icon = text.includes('fungsi') ? 'fa-solid fa-puzzle-piece' : 'fa-solid fa-arrows-rotate'
    color = '#a855f7'
  } else if (text.includes('array') || text.includes('objek') || text.includes('struktur data') || text.includes('list') || text.includes('dictionary') || text.includes('file')) {
    icon = text.includes('file') ? 'fa-solid fa-file-code' : 'fa-solid fa-layer-group'
    color = '#10b981'
  } else if (text.includes('pencarian') || text.includes('pengurutan') || text.includes('search') || text.includes('sort')) {
    icon = 'fa-solid fa-arrow-down-short-wide'
    color = '#f59e0b'
  } else if (text.includes('soal logika') || text.includes('logika matematika') || text.includes('algoritma')) {
    icon = 'fa-solid fa-brain'
    color = '#8b5cf6'
  } else if (text.includes('bilangan') || text.includes('representasi data') || text.includes('matematika')) {
    icon = 'fa-solid fa-calculator'
    color = '#06b6d4'
  } else if (text.includes('kombinatorika') || text.includes('peluang') || text.includes('graf')) {
    icon = text.includes('graf') ? 'fa-solid fa-network-wired' : 'fa-solid fa-dice'
    color = '#6366f1'
  } else if (text.includes('html') || text.includes('semantik') || text.includes('struktur')) {
    icon = 'fa-brands fa-html5'
    color = '#f97316'
  } else if (text.includes('form') || text.includes('input') || text.includes('validasi') || text.includes('teks')) {
    icon = 'fa-solid fa-file-pen'
    color = '#eab308'
  } else if (text.includes('flexbox') || text.includes('box model') || text.includes('css')) {
    icon = text.includes('flexbox') ? 'fa-solid fa-table-columns' : 'fa-brands fa-css3-alt'
    color = '#3b82f6'
  } else if (text.includes('grid')) {
    icon = 'fa-solid fa-table-cells-large'
    color = '#8b5cf6'
  } else if (text.includes('responsive') || text.includes('media query') || text.includes('mobile')) {
    icon = 'fa-solid fa-mobile-screen-button'
    color = '#14b8a6'
  } else if (text.includes('landing page') || text.includes('proyek') || text.includes('mini project')) {
    icon = 'fa-solid fa-rocket'
    color = '#ec4899'
  } else if (text.includes('komponen') || text.includes('jsx')) {
    icon = 'fa-solid fa-cubes'
    color = '#00d8ff'
  } else if (text.includes('state') || text.includes('props')) {
    icon = 'fa-solid fa-sliders'
    color = '#a855f7'
  } else if (text.includes('hooks') || text.includes('lifecycle')) {
    icon = 'fa-solid fa-wand-magic-sparkles'
    color = '#f59e0b'
  } else if (text.includes('routing') || text.includes('route')) {
    icon = 'fa-solid fa-route'
    color = '#10b981'
  } else if (text.includes('server') || text.includes('node')) {
    icon = 'fa-brands fa-node-js'
    color = '#22c55e'
  } else if (text.includes('express') || text.includes('api') || text.includes('rest')) {
    icon = 'fa-solid fa-bolt'
    color = '#06b6d4'
  } else if (text.includes('database') || text.includes('sql') || text.includes('crud') || text.includes('ddl') || text.includes('dml') || text.includes('eloquent')) {
    icon = 'fa-solid fa-database'
    color = '#0284c7'
  } else if (text.includes('autentikasi') || text.includes('auth') || text.includes('keamanan') || text.includes('security')) {
    icon = 'fa-solid fa-shield-halved'
    color = '#f43f5e'
  } else if (text.includes('laravel') || text.includes('blade')) {
    icon = 'fa-brands fa-laravel'
    color = '#f43f5e'
  } else if (text.includes('challenge') || text.includes('tantangan') || text.includes('boss')) {
    icon = 'fa-solid fa-trophy'
    color = '#eab308'
  }

  const fallback = CHAPTER_PALETTE[index % CHAPTER_PALETTE.length]
  return {
    color: color || fallback.color,
    icon: icon || fallback.defaultIcon
  }
}

const activeChapterTheme = computed(() => {
  return getChapterTheme(selectedChapter.value, selectedChapterIndex.value)
})

const selectedChapterId = ref(null)

const selectChapter = (chapter) => {
  selectedChapterId.value = chapter.id
  router.replace({ query: { chapter: chapter.slug || chapter.id } })
}

watch(() => path.value, (newPath) => {
  if (newPath && newPath.chapters && newPath.chapters.length > 0) {
    if (route.query.chapter) {
      const found = newPath.chapters.find(c => c.slug === route.query.chapter || String(c.id) === String(route.query.chapter))
      if (found) {
        selectedChapterId.value = found.id
        return
      }
    }
    if (!selectedChapterId.value) {
      selectedChapterId.value = newPath.chapters[0].id
    }
  }
}, { immediate: true })

const selectedChapter = computed(() => {
  if (!path.value || !path.value.chapters) return null
  return path.value.chapters.find(c => c.id === selectedChapterId.value) || path.value.chapters[0]
})

const selectedChapterIndex = computed(() => {
  if (!path.value || !path.value.chapters) return 0
  const index = path.value.chapters.findIndex(c => c.id === selectedChapterId.value)
  return index !== -1 ? index : 0
})

const totalLessonsCount = computed(() => {
  if (!path.value?.chapters) return 0
  return path.value.chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0)
})

const completedLessonsCount = computed(() => {
  if (!path.value?.chapters) return 0
  return path.value.chapters.reduce((sum, ch) => {
    return sum + (ch.lessons?.filter(l => isLessonCompleted(l)).length || 0)
  }, 0)
})

const progressPercentage = computed(() => {
  if (totalLessonsCount.value === 0) return 0
  return Math.round((completedLessonsCount.value / totalLessonsCount.value) * 100)
})

const getChapterCompletedCount = (chapter) => {
  if (!chapter?.lessons) return 0
  return chapter.lessons.filter(l => isLessonCompleted(l)).length
}

const nextUncompletedLessonInfo = computed(() => {
  if (!path.value?.chapters) return null
  for (const ch of path.value.chapters) {
    for (const l of (ch.lessons || [])) {
      if (!isLessonCompleted(l)) {
        return { chapter: ch, lesson: l }
      }
    }
  }
  const firstCh = path.value.chapters[0]
  return firstCh?.lessons?.[0] ? { chapter: firstCh, lesson: firstCh.lessons[0] } : null
})

const resumeLearning = () => {
  const target = nextUncompletedLessonInfo.value
  if (target) {
    selectChapter(target.chapter)
    goToLesson(target.chapter.id, target.lesson)
  }
}

const startOrResumeChapter = (chapter) => {
  if (!chapter?.lessons || chapter.lessons.length === 0) return
  const uncompleted = chapter.lessons.find(l => !isLessonCompleted(l))
  const targetLesson = uncompleted || chapter.lessons[0]
  goToLesson(chapter.id, targetLesson)
}

const goToNextChapter = () => {
  if (path.value && path.value.chapters) {
    const nextIndex = selectedChapterIndex.value + 1
    if (nextIndex < path.value.chapters.length) {
      selectChapter(path.value.chapters[nextIndex])
    }
  }
}

onMounted(async () => {
  const hasQuizzesLoaded = path.value?.chapters?.[0]?.lessons?.[0]?.quizzes !== undefined;
  if (!path.value || !path.value.chapters || !hasQuizzesLoaded) {
    await fetchPathDetails(pathId.value)
  }
  isPreparingLesson.value = false
})

const isLessonCompleted = (lesson) => {
  let p = lesson.progress
  if (Array.isArray(p)) p = p.length > 0 ? p[0] : null
  
  const theoryDone = lesson.isCompleted !== undefined ? lesson.isCompleted : (p ? p.is_completed : false);
  
  const hasQuiz = lesson.quizzes && lesson.quizzes.length > 0;
  const quizDone = !hasQuiz || (lesson.quizPassed !== undefined ? lesson.quizPassed : (p ? p.quiz_passed : false));
  
  const hasPractice = lesson.type === 'code' || lesson.type === 'theory_quiz_practice' || !!lesson.practice || !!lesson.practice_instructions;
  const practiceDone = !hasPractice || (lesson.practiceDone !== undefined ? lesson.practiceDone : (p ? !!p.saved_code : false));
  
  return theoryDone && quizDone && practiceDone;
}

const isChapterCompleted = (chapter) => {
  if (!chapter || !chapter.lessons || chapter.lessons.length === 0) return false;
  return chapter.lessons.every(lesson => isLessonCompleted(lesson));
}

const goToLesson = (chapterId, lesson) => {
  const step = 'theory'
  const firstChapter = path.value?.chapters?.[0]
  const firstLesson = firstChapter?.lessons?.[0]
  
  const isFirst = firstChapter && firstLesson &&
    (chapterId === firstChapter.id || chapterId === firstChapter.slug) &&
    (lesson.id === firstLesson.id || lesson.slug === firstLesson.slug)
  
  if (lesson.is_premium && !isPremiumUser.value && !isFirst) {
    showPremiumModal.value = true
    return
  }
  
  const chapter = path.value.chapters.find(c => c.id === chapterId || c.slug === chapterId)
  isPreparingLesson.value = true
  
  router.push({
    path: `/learning/${path.value.slug || path.value.id}/lesson/${chapter?.slug || chapterId}/${lesson.slug || lesson.id}`,
    query: { step, preview: '1' }
  })
}
</script>

<style scoped src="../assets/css/views/PathDetailView.css"></style>

