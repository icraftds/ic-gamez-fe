<template>
  <div class="roadmap-view">
    <SimpleBackground />
    <HomeNavbar />
    
    <div class="container content-area">
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

      <div class="timeline-container" v-if="path && path.chapters && path.chapters.length > 0">
        
        <div class="timeline-tree">
          <!-- Main Vertical Spine -->
          <div class="spine"></div>

          <div v-for="(chapter, cIdx) in path.chapters" :key="chapter.id" class="chapter-section">
            
            <!-- Chapter Node (Centered) -->
            <div class="chapter-node-wrapper">
              <div class="chapter-node">
                <span class="chapter-label">BAB {{ cIdx + 1 }}</span>
                <h3>{{ chapter.title }}</h3>
              </div>
            </div>

            <!-- Lessons in this Chapter -->
            <div class="lessons-list" v-if="chapter.lessons && chapter.lessons.length > 0">
              <div 
                v-for="(lesson, lIdx) in chapter.lessons" 
                :key="lesson.id" 
                class="lesson-wrapper"
                :class="lIdx % 2 === 0 ? 'left-side' : 'right-side'"
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
                    'locked': lesson.is_premium && !isPremiumUser && !(cIdx === 0 && lIdx === 0) 
                  }"
                  @click="goToLesson(chapter.id, lesson)"
                >
                  <div class="lesson-header">
                    <span class="lesson-status">
                      <i v-if="lesson.is_premium" class="fa-solid fa-lock premium-lock" :class="{ 'unlocked': isPremiumUser || (cIdx === 0 && lIdx === 0) }"></i>
                      <i v-else class="fa-solid fa-check-circle free-check"></i>
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

          </div>
          
          <!-- End Node -->
          <div class="end-node-wrapper">
            <div class="end-node">
              <i class="fa-solid fa-flag-checkered"></i> Selesai
            </div>
          </div>
        </div>

      </div>
      
      <div v-else-if="path && !isLoading" class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-person-digging"></i></div>
        <h3>Roadmap Sedang Dibangun</h3>
        <p>Materi untuk alur belajar ini sedang dalam tahap penyusunan.</p>
      </div>
      
    </div>
    <PremiumModal v-model="showPremiumModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLearningPaths } from '../composables/useLearningPaths'
import { useUserAccount } from '../composables/useUserAccount'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'
import PremiumModal from '../components/common/PremiumModal.vue'

const route = useRoute()
const router = useRouter()
const { getPathById, fetchPathDetails, isLoading, isPreparingLesson } = useLearningPaths()
const { isPremiumUser } = useUserAccount()

const pathId = computed(() => route.params.pathId)
const path = computed(() => getPathById(pathId.value))
const showPremiumModal = ref(false)

onMounted(async () => {
  if (!path.value || !path.value.chapters) {
    await fetchPathDetails(pathId.value)
  }
  isPreparingLesson.value = false
})

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

<style scoped>
.roadmap-view {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.content-area {
  margin-top: 40px;
  padding-bottom: 80px;
}

.header {
  margin-bottom: 60px;
  text-align: center;
}
.back-btn {
  background: var(--glass-bg-card-0_6);
  border: 1px solid var(--glass-border);
  color: var(--text-light);
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}
.back-btn:hover {
  background: rgba(0, 240, 255, 0.1);
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}
.path-title h2 {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--text-light);
  margin-bottom: 12px;
}
.path-title p {
  color: var(--text-muted);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

/* Vertical Timeline Layout */
.timeline-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 20px;
}

.timeline-tree {
  position: relative;
  width: 100%;
  max-width: 800px; /* Keep it constrained for readability */
  display: flex;
  flex-direction: column;
}

/* Main Spine */
.spine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  background: linear-gradient(to bottom, var(--primary), var(--secondary));
  border-radius: 6px;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
  z-index: 1;
}

/* Chapter Section */
.chapter-section {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 40px;
  z-index: 2;
}

/* Chapter Node */
.chapter-node-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 40px;
}

.chapter-node {
  background: var(--bg-deep);
  border: 2px solid var(--secondary);
  border-radius: 12px;
  padding: 16px 32px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(236, 72, 153, 0.2);
  min-width: 250px;
  position: relative;
}
.chapter-node::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%);
  z-index: -1;
  pointer-events: none;
}
.chapter-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 4px;
}
.chapter-node h3 {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-light);
  margin: 0;
}

/* Lessons List */
.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
}

/* Lesson Wrapper */
.lesson-wrapper {
  display: flex;
  width: 50%;
  position: relative;
  align-items: center;
}

.lesson-wrapper.left-side {
  align-self: flex-start;
  justify-content: flex-end;
  padding-right: 40px; /* Space for connector */
}

.lesson-wrapper.right-side {
  align-self: flex-end;
  justify-content: flex-start;
  padding-left: 40px; /* Space for connector */
}

/* Connectors */
.lesson-connector {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 4px;
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary);
  z-index: 1;
}
.lesson-wrapper.left-side .lesson-connector {
  right: 0;
}
.lesson-wrapper.right-side .lesson-connector {
  left: 0;
}

/* Spine Dot */
.spine-dot {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: var(--bg-deep);
  border: 3px solid var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 15px var(--primary);
  z-index: 3;
}
.lesson-wrapper.left-side .spine-dot {
  right: -8px; /* Center exactly on the 6px spine */
}
.lesson-wrapper.right-side .spine-dot {
  left: -8px;
}

/* Lesson Card */
.lesson-card {
  width: 100%;
  max-width: 300px;
  background: var(--bg-deep);
  border: 2px solid rgba(0, 240, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.lesson-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
  box-shadow: 0 10px 25px rgba(0, 240, 255, 0.2);
  background: var(--glass-bg-card-0_9);
}

.lesson-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.lesson-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.premium-lock { color: #f59e0b; }
.premium-lock.unlocked { color: #10b981; }
.free-check { color: #10b981; }

.lesson-card h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-light);
  line-height: 1.4;
  margin-bottom: 16px;
}

.lesson-footer {
  display: flex;
  justify-content: flex-start;
}
.btn-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: gap 0.2s;
}
.lesson-card:hover .btn-text {
  gap: 12px;
}

.lesson-card.locked {
  opacity: 0.5;
  border-color: rgba(255, 255, 255, 0.1);
}
.lesson-card.locked:hover {
  transform: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  background: var(--bg-deep);
  border-color: rgba(255, 255, 255, 0.1);
}
.lesson-card.locked .btn-text {
  color: var(--text-muted);
}

/* End Node */
.end-node-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  z-index: 2;
}
.end-node {
  background: var(--bg-deep);
  border: 2px solid #10b981;
  border-radius: 50px;
  padding: 12px 32px;
  color: #10b981;
  font-weight: 800;
  font-size: 1.2rem;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--glass-bg-card-0_6);
  border-radius: 20px;
  border: 1px dashed var(--glass-border);
}
.empty-icon {
  font-size: 4rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}
.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-light);
  margin-bottom: 12px;
}
.empty-state p {
  color: var(--text-muted);
  font-size: 1.1rem;
}

/* Responsive Mobile Layout */
@media (max-width: 768px) {
  .spine {
    left: 20px;
    transform: none;
  }
  
  .chapter-node-wrapper {
    justify-content: flex-start;
    padding-left: 50px; /* Make space for spine */
  }
  .chapter-node {
    width: 100%;
    max-width: none;
    text-align: left;
  }
  
  .lesson-wrapper {
    width: 100%;
    align-self: flex-start !important;
    justify-content: flex-start !important;
    padding-left: 50px !important;
    padding-right: 0 !important;
  }

  .lesson-connector {
    width: 30px;
    left: 20px !important;
    right: auto !important;
  }

  .spine-dot {
    left: -8px !important;
    right: auto !important;
  }
  
  .end-node-wrapper {
    justify-content: flex-start;
    padding-left: 50px;
  }
}
</style>
