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
            <!-- Left: 3D Isometric Cube Visual -->
            <div class="hub-icon-wrapper">
              <svg class="iso-cube-svg" viewBox="0 0 80 80" width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="cubeTop1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#38bdf8"/>
                    <stop offset="100%" stop-color="#0284c7"/>
                  </linearGradient>
                  <linearGradient id="cubeLeft1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0369a1"/>
                    <stop offset="100%" stop-color="#0c4a6e"/>
                  </linearGradient>
                  <linearGradient id="cubeRight1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0284c7"/>
                    <stop offset="100%" stop-color="#075985"/>
                  </linearGradient>
                  <linearGradient id="cubeTop2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#818cf8"/>
                    <stop offset="100%" stop-color="#4f46e5"/>
                  </linearGradient>
                  <linearGradient id="cubeLeft2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4338ca"/>
                    <stop offset="100%" stop-color="#312e81"/>
                  </linearGradient>
                  <linearGradient id="cubeRight2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4f46e5"/>
                    <stop offset="100%" stop-color="#3730a3"/>
                  </linearGradient>
                  <filter id="cubeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#38bdf8" flood-opacity="0.4"/>
                  </filter>
                </defs>
                <g transform="translate(10, 36) scale(0.65)">
                  <polygon points="24,4 44,14 24,24 4,14" fill="url(#cubeTop2)" />
                  <polygon points="4,14 24,24 24,46 4,36" fill="url(#cubeLeft2)" />
                  <polygon points="24,24 44,14 44,36 24,46" fill="url(#cubeRight2)" />
                </g>
                <g transform="translate(36, 36) scale(0.65)">
                  <polygon points="24,4 44,14 24,24 4,14" fill="url(#cubeTop2)" />
                  <polygon points="4,14 24,24 24,46 4,36" fill="url(#cubeLeft2)" />
                  <polygon points="24,24 44,14 44,36 24,46" fill="url(#cubeRight2)" />
                </g>
                <g transform="translate(23, 10) scale(0.72)" filter="url(#cubeGlow)">
                  <polygon points="24,4 44,14 24,24 4,14" fill="url(#cubeTop1)" />
                  <polygon points="4,14 24,24 24,46 4,36" fill="url(#cubeLeft1)" />
                  <polygon points="24,24 44,14 44,36 24,46" fill="url(#cubeRight1)" />
                </g>
              </svg>
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
                  @click="selectChapter(chapter)"
                >
                  <!-- Node Circle -->
                  <div class="stepper-node">
                    <i v-if="isChapterCompleted(chapter)" class="fa-solid fa-check"></i>
                    <span v-else>{{ cIdx + 1 }}</span>
                  </div>

                  <!-- Item Content -->
                  <div class="stepper-content">
                    <div class="stepper-item-title">{{ chapter.title }}</div>
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
              <div class="chapter-showcase-card">
                <!-- Isometric Diagram Visual -->
                <div class="chapter-iso-visual">
                  <svg viewBox="0 0 200 120" width="160" height="96" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="chPinkTop" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#f87171"/><stop offset="100%" stop-color="#e11d48"/>
                      </linearGradient>
                      <linearGradient id="chPinkLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#be123c"/><stop offset="100%" stop-color="#881337"/>
                      </linearGradient>
                      <linearGradient id="chPinkRight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#e11d48"/><stop offset="100%" stop-color="#9f1239"/>
                      </linearGradient>
                      
                      <linearGradient id="chCyanTop" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/>
                      </linearGradient>
                      <linearGradient id="chCyanLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#0369a1"/><stop offset="100%" stop-color="#0c4a6e"/>
                      </linearGradient>
                      <linearGradient id="chCyanRight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#075985"/>
                      </linearGradient>
                      
                      <linearGradient id="chPurpTop" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#7c3aed"/>
                      </linearGradient>
                      <linearGradient id="chPurpLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#6d28d9"/><stop offset="100%" stop-color="#4c1d95"/>
                      </linearGradient>
                      <linearGradient id="chPurpRight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#5b21b6"/>
                      </linearGradient>
                    </defs>
                    
                    <!-- Dotted Connector Lines -->
                    <path d="M100 32 L60 58 M100 32 L140 58 M60 64 L70 88 M140 64 L130 88" stroke="rgba(147, 197, 253, 0.35)" stroke-width="2" stroke-dasharray="3 3"/>
                    
                    <!-- Top Cube (Pink) -->
                    <g transform="translate(85, 6) scale(0.65)">
                      <polygon points="24,4 44,14 24,24 4,14" fill="url(#chPinkTop)" />
                      <polygon points="4,14 24,24 24,44 4,34" fill="url(#chPinkLeft)" />
                      <polygon points="24,24 44,14 44,34 24,44" fill="url(#chPinkRight)" />
                    </g>
                    <!-- Mid Left Cube (Cyan) -->
                    <g transform="translate(45, 34) scale(0.62)">
                      <polygon points="24,4 44,14 24,24 4,14" fill="url(#chCyanTop)" />
                      <polygon points="4,14 24,24 24,44 4,34" fill="url(#chCyanLeft)" />
                      <polygon points="24,24 44,14 44,34 24,44" fill="url(#chCyanRight)" />
                    </g>
                    <!-- Mid Right Cube (Cyan) -->
                    <g transform="translate(125, 34) scale(0.62)">
                      <polygon points="24,4 44,14 24,24 4,14" fill="url(#chCyanTop)" />
                      <polygon points="4,14 24,24 24,44 4,34" fill="url(#chCyanLeft)" />
                      <polygon points="24,24 44,14 44,34 24,44" fill="url(#chCyanRight)" />
                    </g>
                    <!-- Center Core Cube (Purple) -->
                    <g transform="translate(85, 48) scale(0.68)">
                      <polygon points="24,4 44,14 24,24 4,14" fill="url(#chPurpTop)" />
                      <polygon points="4,14 24,24 24,44 4,34" fill="url(#chPurpLeft)" />
                      <polygon points="24,24 44,14 44,34 24,44" fill="url(#chPurpRight)" />
                    </g>
                  </svg>
                </div>

                <div class="chapter-showcase-info">
                  <div class="chapter-badge">BAB {{ selectedChapterIndex + 1 }}</div>
                  <h2 class="chapter-title">{{ selectedChapter.title }}</h2>
                  <p class="chapter-desc">{{ selectedChapter.description || 'Pelajari materi dan selesaikan tantangan untuk menguasai bab ini secara komprehensif.' }}</p>
                  
                  <div class="chapter-meta-row">
                    <span class="meta-tag"><i class="fa-solid fa-book-open"></i> {{ selectedChapter.lessons?.length || 0 }} materi</span>
                    <span class="meta-tag"><i class="fa-solid fa-clock"></i> ~{{ Math.max(15, (selectedChapter.lessons?.length || 1) * 12) }} menit</span>
                    <span class="meta-tag"><i class="fa-solid fa-trophy"></i> +{{ (selectedChapter.lessons?.length || 0) * 50 }} XP</span>
                  </div>

                  <button class="btn-start-module" @click="startOrResumeChapter(selectedChapter)">
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

const route = useRoute()
const router = useRouter()
const { getPathById, fetchPathDetails, isLoading, isPreparingLesson } = useLearningPaths()
const { isPremiumUser } = useUserAccount()

const pathId = computed(() => route.params.pathId)
const path = computed(() => getPathById(pathId.value))
const showPremiumModal = ref(false)

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

