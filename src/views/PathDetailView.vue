<template>
  <div class="path-detail-view">
    <SimpleBackground />
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
    
    <PremiumModal v-model="showPremiumModal" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLearningPaths } from '../composables/useLearningPaths'
import { useUserAccount } from '../composables/useUserAccount'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'
import ChapterAccordion from '../components/learning/ChapterAccordion.vue'
import PremiumModal from '../components/common/PremiumModal.vue'

const route = useRoute()
const router = useRouter()
const { getPathById, fetchPathDetails, isPreparingLesson } = useLearningPaths()
const { isPremiumUser } = useUserAccount()

const pathId = computed(() => route.params.pathId)
const path = computed(() => getPathById(pathId.value))
const openChapters = ref([])
const showPremiumModal = ref(false)

onMounted(async () => {
  if (!path.value || !path.value.chapters) {
    await fetchPathDetails(pathId.value)
  }
  isPreparingLesson.value = false
})

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

  const firstChapter = path.value?.chapters?.[0]
  const firstLesson = firstChapter?.lessons?.[0]
  
  const isFirstLesson = firstChapter && firstLesson &&
    (chapterId === firstChapter.id || chapterId === firstChapter.slug) &&
    (lesson.id === firstLesson.id || lesson.slug === firstLesson.slug)

  if (lesson.is_premium && !isPremiumUser.value && !isFirstLesson) {
    showPremiumModal.value = true
    return
  }

  const chapter = path.value.chapters.find(c => c.id === chapterId || c.slug === chapterId)
  
  router.push({
    path: `/learning/${path.value.slug || path.value.id}/lesson/${chapter?.slug || chapterId}/${lesson.slug || lesson.id}`,
    query: { step, preview: '1' }
  })
}
</script>

<style scoped src="../assets/css/views/PathDetailView.css"></style>
