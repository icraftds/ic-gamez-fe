<template>
  <div class="roadmap-view">
    <SimpleBackground />
        
    <div class="content-area">
      <div class="container">
        <div class="header">
        <button class="back-btn" @click="$router.push('/learning')">
          <i class="fa-solid fa-arrow-left"></i> Kembali ke Alur
        </button>
        <div v-if="path" class="path-header">
          <div class="path-title">
            <h2>{{ path.title }} Roadmap</h2>
            <p>{{ path.description }}</p>
          </div>
        </div>
      </div>
      </div>

      <div class="layout-wrapper" v-if="path && path.chapters && path.chapters.length > 0">
        
        <!-- Hanging Sidebar -->
        <div class="sidebar-wrapper">
          <div class="chapter-sidebar">
            <h3 class="sidebar-title">Daftar Bab</h3>
            <div class="chapter-nav">
              <button 
                v-for="(chapter, cIdx) in path.chapters" 
                :key="chapter.id"
                class="chapter-nav-btn"
                :class="{ active: selectedChapterId === chapter.id }"
                @click="selectedChapterId = chapter.id"
              >
                <span class="bab-label">
                  BAB {{ cIdx + 1 }}
                  <i v-if="isChapterCompleted(chapter)" class="fa-solid fa-check-circle" style="color: #10b981; margin-left: 5px;"></i>
                </span>
                <span class="bab-title">{{ chapter.title }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="timeline-container">
          <div class="timeline-tree">
            <!-- Main Vertical Spine -->
            <div class="spine"></div>

            <transition name="fade" mode="out-in">
              <div v-if="selectedChapter" :key="selectedChapter.id" class="chapter-section">
                
                <!-- Chapter Node (Centered) -->
                <div class="chapter-node-wrapper">
                  <div class="chapter-node">
                    <span class="chapter-label">
                      BAB {{ selectedChapterIndex + 1 }}
                      <i v-if="isChapterCompleted(selectedChapter)" class="fa-solid fa-check-circle" style="color: #10b981; margin-left: 5px; font-size: 0.9em;"></i>
                    </span>
                    <h3>{{ selectedChapter.title }}</h3>
                  </div>
                </div>

                <!-- Lessons in this Chapter -->
                <div class="lessons-list" v-if="selectedChapter.lessons && selectedChapter.lessons.length > 0">
                  <div 
                    v-for="(lesson, lIdx) in selectedChapter.lessons" 
                    :key="lesson.id" 
                    class="lesson-wrapper"
                    :class="lIdx % 2 === 0 ? 'left-side' : 'right-side'"
                    :style="{ animationDelay: `${0.2 + (lIdx * 0.15)}s` }"
                  >
                    <!-- Connector to Spine -->
                    <div class="lesson-connector"></div>
                    <!-- Dot on the Spine -->
                    <div class="spine-dot"></div>

                    <!-- Lesson Card -->
                    <div 
                      class="lesson-card group"
                      :class="{ 
                        'premium': lesson.is_premium, 
                        'locked': lesson.is_premium && !isPremiumUser && !(selectedChapterIndex === 0 && lIdx === 0) 
                      }"
                      @click="goToLesson(selectedChapter.id, lesson)"
                    >
                      <div class="lesson-header">
                        <span class="lesson-status">
                          <i v-if="lesson.is_premium && !isPremiumUser && !(selectedChapterIndex === 0 && lIdx === 0)" class="fa-solid fa-lock premium-lock"></i>
                          <i v-else-if="isLessonCompleted(lesson)" class="fa-solid fa-check-circle free-check"></i>
                          <i v-else class="fa-regular fa-circle" style="color: #6b7280; font-size: 0.9rem;"></i>
                        </span>
                        <span class="lesson-tag">Materi</span>
                      </div>
                      <h4>{{ lesson.title }}</h4>
                      <div class="lesson-footer">
                        <span class="btn-text">Mulai <i class="fa-solid fa-arrow-right icon-arrow"></i></span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Next Chapter Button -->
                <div 
                  class="next-chapter-wrapper" 
                  v-if="selectedChapterIndex < path.chapters.length - 1"
                  :style="{ animationDelay: `${0.2 + ((selectedChapter.lessons?.length || 0) * 0.15)}s` }"
                >
                  <button class="next-chapter-node" @click="goToNextChapter">
                    Lanjut ke BAB {{ selectedChapterIndex + 2 }} <i class="fa-solid fa-arrow-down"></i>
                  </button>
                </div>

                <!-- End Node -->
                <div 
                  class="end-node-wrapper" 
                  v-if="selectedChapterIndex === path.chapters.length - 1"
                  :style="{ animationDelay: `${0.2 + ((selectedChapter.lessons?.length || 0) * 0.15)}s` }"
                >
                  <div class="end-node">
                    <i class="fa-solid fa-flag-checkered"></i> Selesai
                  </div>
                </div>

              </div>
            </transition>
          </div>
        </div>

      </div>
      
      <div v-else-if="path && !isLoading" class="container empty-state">
        <div class="empty-icon"><i class="fa-solid fa-person-digging"></i></div>
        <h3>Roadmap Sedang Dibangun</h3>
        <p>Materi untuk alur belajar ini sedang dalam tahap penyusunan.</p>
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

watch(() => path.value, (newPath) => {
  if (newPath && newPath.chapters && newPath.chapters.length > 0 && !selectedChapterId.value) {
    selectedChapterId.value = newPath.chapters[0].id
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

const goToNextChapter = () => {
  if (path.value && path.value.chapters) {
    const nextIndex = selectedChapterIndex.value + 1
    if (nextIndex < path.value.chapters.length) {
      selectedChapterId.value = path.value.chapters[nextIndex].id
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
  return p ? (p.is_completed || !!p.saved_code) : false
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
  
  // Set isPreparingLesson for the next transition to LessonView if needed
  // (Optional: but LessonView will unset it anyway, here we don't really need to set it since the router handles it quickly, 
  // but let's keep it clean and only let LessonView handle its own loader).
  isPreparingLesson.value = true
  
  router.push({
    path: `/learning/${path.value.slug || path.value.id}/lesson/${chapter?.slug || chapterId}/${lesson.slug || lesson.id}`,
    query: { step, preview: '1' }
  })
}
</script>

<style scoped src="../assets/css/views/PathDetailView.css"></style>
