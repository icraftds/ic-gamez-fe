<template>
  <div class="materials-view">
    <SimpleBackground />

    <div class="docs-layout">
      <MaterialSidebar 
        :paths="paths" 
        :isLoading="isLoading" 
        :isOpen="isSidebarOpen"
        :activePathId="activePathId"
        :activeChapterId="activeChapterId"
        :activeLessonId="activeLessonId"
        @close="isSidebarOpen = false"
        @select-lesson="selectLesson"
      />

      <MaterialContent 
        :lesson="selectedLesson"
        :pathTitle="selectedPathTitle"
        :chapterTitle="selectedChapterTitle"
        :isMobile="isMobile"
        @open-sidebar="isSidebarOpen = true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import MaterialSidebar from '../components/materials/MaterialSidebar.vue'
import MaterialContent from '../components/materials/MaterialContent.vue'
import { useLearningPaths } from '../composables/useLearningPaths'

const { paths, isLoading, fetchAllPathsDetails, getPathById, getChapterById, getLessonById } = useLearningPaths()

const activePathId = ref(null)
const activeChapterId = ref(null)
const activeLessonId = ref(null)
const isSidebarOpen = ref(false)
const isMobile = ref(window.innerWidth <= 1024)

window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 1024
})

onMounted(async () => {
  await fetchAllPathsDetails()
})

const selectLesson = (pathId, chapterId, lessonId) => {
  activePathId.value = pathId
  activeChapterId.value = chapterId
  activeLessonId.value = lessonId
  
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const selectedLesson = computed(() => {
  if (!activePathId.value || !activeChapterId.value || !activeLessonId.value) return null
  return getLessonById(activePathId.value, activeChapterId.value, activeLessonId.value)
})

const selectedPathTitle = computed(() => {
  if (!activePathId.value) return ''
  const p = getPathById(activePathId.value)
  return p ? p.title : ''
})

const selectedChapterTitle = computed(() => {
  if (!activePathId.value || !activeChapterId.value) return ''
  const c = getChapterById(activePathId.value, activeChapterId.value)
  return c ? c.title : ''
})
</script>

<style scoped src="../assets/css/views/MaterialsView.css"></style>
