<template>
  <div class="path-detail-view">
    <BackgroundEffects />
    <HomeNavbar />
    
    <div class="container content-area">
      <div class="header">
        <button class="back-btn" @click="$router.push('/learning')">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <div v-if="path" class="path-header">
          <div class="path-icon"><i :class="path.icon"></i></div>
          <div class="path-title">
            <h2>{{ path.title }}</h2>
            <p>{{ path.description }}</p>
          </div>
        </div>
      </div>

      <div class="chapters-container" v-if="path">
        <h2>Daftar Bab</h2>
        <div class="chapter-list">
          <ChapterAccordion 
            v-for="chapter in path.chapters" 
            :key="chapter.id" 
            :chapter="chapter"
            :isOpen="isChapterOpen(chapter.id)"
            @toggle="toggleChapter(chapter.id)"
            @lesson-click="goToLesson(chapter.id, $event)"
          />
          
          <div v-if="!path.chapters || path.chapters.length === 0" class="empty-state">
            Materi untuk path ini belum tersedia.
          </div>
        </div>
      </div>
      <div v-else class="not-found">
        Path tidak ditemukan.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLearningPaths } from '../composables/useLearningPaths'
import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'
import ChapterAccordion from '../components/learning/ChapterAccordion.vue'

const route = useRoute()
const router = useRouter()
const { getPathById } = useLearningPaths()

const pathId = computed(() => route.params.pathId)
const path = computed(() => getPathById(pathId.value))
const openChapters = ref([])

watch(path, (newPath) => {
  if (newPath && newPath.chapters && newPath.chapters.length > 0) {
    if (openChapters.value.length === 0) {
      openChapters.value.push(newPath.chapters[0].id)
    }
  }
}, { immediate: true })

const toggleChapter = (chapterId) => {
  const index = openChapters.value.indexOf(chapterId)
  if (index === -1) {
    openChapters.value.push(chapterId)
  } else {
    openChapters.value.splice(index, 1)
  }
}

const isChapterOpen = (chapterId) => {
  return openChapters.value.includes(chapterId)
}

/**
 * Langsung navigasi ke lesson untuk preview.
 * payload bisa berupa lesson object langsung (backward compat)
 * atau { lesson, step } dari ChapterAccordion baru.
 */
const goToLesson = (chapterId, payload) => {
  const lesson = payload?.lesson ?? payload
  const step = payload?.step ?? 'theory'

  // Encode step ke query param agar LessonView tahu dari mana masuk
  router.push({
    path: `/learning/${path.value.id}/lesson/${chapterId}/${lesson.id}`,
    query: { step, preview: '1' }
  })
}
</script>

<style scoped>
.path-detail-view {
  min-height: 100vh;
  padding-bottom: 50px;
}

.content-area {
  margin-top: 40px;
}

.header {
  margin-bottom: 40px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.path-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.path-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-dark), var(--secondary));
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  color: white;
}

.path-title h2 {
  font-size: 2rem;
  margin-bottom: 5px;
}

.path-title p {
  color: #94a3b8;
}

.chapters-container {
  max-width: 800px;
  margin: 0 auto;
}

.chapters-container h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
  background: rgba(20, 15, 40, 0.7);
  border-radius: 12px;
}

@media (max-width: 768px) {
  .path-header { flex-direction: column; text-align: center; gap: 15px; }
  .path-title h2 { font-size: 1.6rem; }
  .path-title p { font-size: 0.95rem; }
  .chapters-container { padding: 0 10px; }
}
</style>

