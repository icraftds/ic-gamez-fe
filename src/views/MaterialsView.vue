<template>
  <div class="materials-view">
    <SimpleBackground />
    
    <!-- Reading Mode Topbar -->
    <div class="reading-topbar">
      <router-link to="/learning" class="back-btn">
        <i class="fa-solid fa-arrow-left"></i> <span>Kembali</span>
      </router-link>
      <div class="reading-logo">
        <img src="/images/Logo iC GameZ darkmode.png" alt="iC GameZ" height="24" />
      </div>
      <div class="topbar-right">
        <template v-if="isLoggedIn">
          <UserProfileDropdown />
        </template>
        <template v-else>
          <button class="auth-btn" @click="$router.push('/login')">Masuk/Daftar</button>
        </template>
      </div>
    </div>

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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'
import UserProfileDropdown from '../components/common/UserProfileDropdown.vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import MaterialSidebar from '../components/materials/MaterialSidebar.vue'
import MaterialContent from '../components/materials/MaterialContent.vue'
import { useLearningPaths } from '../composables/useLearningPaths'
import { useUserAccount } from '../composables/useUserAccount'

const { paths, isLoading, fetchAllPathsDetails, getPathById, getChapterById, getLessonById } = useLearningPaths()
const { userProfile, isLoggedIn, logout } = useUserAccount()
const router = useRouter()
const { showToast } = useToast()



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
