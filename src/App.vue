<template>
  <div class="app-layout" :class="{ 'workspace-mode': isWorkspacePage }">
    <div class="app-content">
      <router-view />
    </div>
    <AppFooter v-if="!isWorkspacePage && !isAuthPage" />
    
    <!-- Global Loading Overlay -->
    <div v-if="isPreparingLesson" class="global-loading-overlay">
      <div class="loader-content">
        <div class="spinner-large"></div>
        <p>Mempersiapkan materi belajar...</p>
      </div>
    </div>
    <AppToast />
    
    <!-- Global WIP Modal -->
    <CoffeeModal v-model="showWipModal" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from './components/common/AppFooter.vue'
import AppToast from './components/common/AppToast.vue'
import CoffeeModal from './components/common/CoffeeModal.vue'
import { useUserAccount } from './composables/useUserAccount'
import { useLearningPaths } from './composables/useLearningPaths'
import { useWipModal } from './composables/useWipModal'

const route = useRoute()
const isWorkspacePage = computed(() => route.name === 'lesson')
const isAuthPage = computed(() => ['login', 'register', 'developer'].includes(route.name))

const { fetchUser } = useUserAccount()
const { isPreparingLesson } = useLearningPaths()
const { showWipModal } = useWipModal()

onMounted(() => {
  // Fetch user session when app loads
  fetchUser()

  // Anti-Cheat Basic: Cegah Klik Kanan
  window.addEventListener('contextmenu', function (e) {
    // Kecualikan input text dan textarea agar user tetap bisa klik kanan untuk paste (jika dibutuhkan)
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault()
    }
  }, false)

  // Anti-Cheat Basic: Cegah shortcut DevTools (F12, Ctrl+Shift+I/J, Ctrl+U)
  window.addEventListener('keydown', function(e) {
    if (
      e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) || 
      (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
    ) {
      e.preventDefault()
    }
  })
})
</script>

<style src="./assets/css/App.css"></style>
