<template>
  <div class="materials-view">
    <SimpleBackground />
    
    <!-- Reading Mode Topbar -->
    <div class="reading-topbar">
      <div class="topbar-left">
        <router-link to="/learning" class="back-btn">
          <i class="fa-solid fa-arrow-left"></i> <span>Kembali</span>
        </router-link>
      </div>

      <div class="reading-logo">
        <img src="/images/Logo iC GameZ darkmode.png" alt="iC GameZ" height="24" />
      </div>

      <div class="topbar-right">
        <!-- Pro Plan Status Badge -->
        <div v-if="isPremiumUser" class="topbar-tier-pill pro">
          <i class="fa-solid fa-crown"></i>
          <span>PRO MEMBER</span>
        </div>
        <div v-else-if="isLoggedIn" class="topbar-upgrade-group">
          <span class="topbar-tier-pill free">FREE</span>
          <router-link to="/pricing" class="topbar-upgrade-btn">
            <i class="fa-solid fa-bolt"></i> Upgrade PRO
          </router-link>
        </div>
        <div v-else class="topbar-upgrade-group">
          <router-link to="/pricing" class="topbar-upgrade-btn">
            <i class="fa-solid fa-crown"></i> Coba PRO
          </router-link>
        </div>

        <template v-if="isLoggedIn">
          <UserProfileDropdown />
        </template>
        <template v-else>
          <button class="auth-btn" @click="$router.push('/login?redirect=/materials')">Masuk/Daftar</button>
        </template>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="docs-layout">
      <MaterialSidebar 
        :paths="materials" 
        :isLoading="isLoading" 
        :isOpen="isSidebarOpen"
        :activePathId="activePathId"
        :activeChapterId="activeChapterId"
        :activeLessonId="activeLessonId"
        :selectedTier="selectedTier"
        :searchQuery="searchQuery"
        :counts="meta.counts"
        :isProUser="isPremiumUser"
        :isLoggedIn="isLoggedIn"
        @close="isSidebarOpen = false"
        @select-lesson="selectLesson"
        @update:selectedTier="handleTierChange"
        @update:searchQuery="handleSearchChange"
        @reset-filter="handleResetFilter"
      />

      <MaterialContent 
        :lesson="selectedLesson"
        :pathTitle="selectedPathTitle"
        :chapterTitle="selectedChapterTitle"
        :isMobile="isMobile"
        :isProUser="isPremiumUser"
        :isLoggedIn="isLoggedIn"
        @open-sidebar="isSidebarOpen = true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import UserProfileDropdown from '../components/common/UserProfileDropdown.vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import MaterialSidebar from '../components/materials/MaterialSidebar.vue'
import MaterialContent from '../components/materials/MaterialContent.vue'
import { useMaterials } from '../composables/useMaterials'
import { useUserAccount } from '../composables/useUserAccount'

const router = useRouter()
const { materials, meta, isLoading, selectedTier, searchQuery, fetchMaterials, getPathById, getChapterById, getLessonById } = useMaterials()
const { isLoggedIn, isPremiumUser } = useUserAccount()

const activePathId = ref(null)
const activeChapterId = ref(null)
const activeLessonId = ref(null)
const activeLessonObj = ref(null)
const isSidebarOpen = ref(false)
const isMobile = ref(window.innerWidth <= 1024)

const onResize = () => {
  isMobile.value = window.innerWidth <= 1024
}
window.addEventListener('resize', onResize)

onMounted(async () => {
  await fetchMaterials()
  autoSelectFirstLesson()
})

const autoSelectFirstLesson = () => {
  if (materials.value && materials.value.length > 0) {
    const firstPath = materials.value[0]
    if (firstPath && firstPath.chapters && firstPath.chapters.length > 0) {
      const firstChapter = firstPath.chapters[0]
      if (firstChapter && firstChapter.lessons && firstChapter.lessons.length > 0) {
        const firstLesson = firstChapter.lessons[0]
        selectLesson(firstPath.id, firstChapter.id, firstLesson.id, firstLesson)
      }
    }
  }
}

const selectLesson = (pathId, chapterId, lessonId, lessonObj = null) => {
  activePathId.value = pathId
  activeChapterId.value = chapterId
  activeLessonId.value = lessonId
  activeLessonObj.value = lessonObj
  
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleTierChange = async (tier) => {
  selectedTier.value = tier
  await fetchMaterials(tier, searchQuery.value)
  
  if (!selectedLesson.value) {
    autoSelectFirstLesson()
  } else {
    const isPro = Boolean(selectedLesson.value.is_premium || selectedLesson.value.tier === 'pro')
    if (tier === 'free' && isPro) {
      autoSelectFirstLesson()
    } else if (tier === 'pro' && !isPro) {
      autoSelectFirstLesson()
    }
  }
}

const handleSearchChange = async (query) => {
  searchQuery.value = query
  await fetchMaterials(selectedTier.value, query)
  if (!selectedLesson.value) {
    autoSelectFirstLesson()
  }
}

const handleResetFilter = async () => {
  selectedTier.value = 'all'
  searchQuery.value = ''
  await fetchMaterials('all', '')
  autoSelectFirstLesson()
}

const selectedLesson = computed(() => {
  if (!activePathId.value || !activeChapterId.value || !activeLessonId.value) return null
  return getLessonById(activePathId.value, activeChapterId.value, activeLessonId.value) || activeLessonObj.value
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
