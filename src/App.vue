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

    <!-- Theme Toggle Button -->
    <button @click="toggleTheme" class="theme-toggle-btn" :title="isLightMode ? 'Beralih ke Dark Mode' : 'Beralih ke Light Mode'">
      <i :class="isLightMode ? 'fas fa-moon' : 'fas fa-sun'"></i>
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
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

const isLightMode = ref(false)

const toggleTheme = () => {
  isLightMode.value = !isLightMode.value
  if (isLightMode.value) {
    document.body.classList.add('light-mode')
    localStorage.setItem('theme', 'light')
  } else {
    document.body.classList.remove('light-mode')
    localStorage.setItem('theme', 'dark')
  }
}

onMounted(() => {
  // Theme initialization
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light') {
    isLightMode.value = true
    document.body.classList.add('light-mode')
  }

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
<style scoped>
.theme-toggle-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--glass-bg, rgba(30, 20, 50, 0.9));
  border: 1px solid var(--primary);
  color: var(--primary);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}
.theme-toggle-btn:hover {
  transform: scale(1.1) rotate(15deg);
  background: var(--primary);
  color: #fff;
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
}
</style>
