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
          <div class="dropdown-trigger" ref="dropdownTriggerRef" @click.stop="showUserDropdown = !showUserDropdown" style="position: relative; display: flex; align-items: center; gap: 10px; cursor: pointer;">
            <div class="avatar-circle">
              <img :src="userAvatar" alt="Avatar" />
            </div>
            <i class="fa-solid fa-chevron-down dropdown-icon" style="font-size: 0.8rem; color: #6b7280;"></i>
            
            <UserDropdownMenu 
              v-if="showUserDropdown" 
              @close="showUserDropdown = false" 
              @logout-click="handleLogoutClick" 
            />
          </div>
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
import UserDropdownMenu from '../components/common/UserDropdownMenu.vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import MaterialSidebar from '../components/materials/MaterialSidebar.vue'
import MaterialContent from '../components/materials/MaterialContent.vue'
import { useLearningPaths } from '../composables/useLearningPaths'
import { useUserAccount } from '../composables/useUserAccount'

const { paths, isLoading, fetchAllPathsDetails, getPathById, getChapterById, getLessonById } = useLearningPaths()
const { userProfile, isLoggedIn, logout } = useUserAccount()
const router = useRouter()
const { showToast } = useToast()

const showUserDropdown = ref(false)
const dropdownTriggerRef = ref(null)

const activePathId = ref(null)
const activeChapterId = ref(null)
const activeLessonId = ref(null)
const isSidebarOpen = ref(false)
const isMobile = ref(window.innerWidth <= 1024)

const userAvatar = computed(() => {
  return userProfile.value?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'
})

window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 1024
})

const handleClickOutside = (event) => {
  if (showUserDropdown.value && dropdownTriggerRef.value && !dropdownTriggerRef.value.contains(event.target)) {
    showUserDropdown.value = false
  }
}

onMounted(async () => {
  await fetchAllPathsDetails()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleLogoutClick = async () => {
  try {
    await logout()
    showToast('Berhasil keluar', 'success')
    router.push('/login')
  } catch (error) {
    showToast('Gagal keluar', 'error')
  }
}

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
