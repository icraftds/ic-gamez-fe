<template>
  <div class="app-layout" :class="{ 'workspace-mode': isWorkspacePage }">
    <p v-if="cooldownSeconds" role="status" style="position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:999999;background:#222;color:white;padding:12px;border-radius:8px;">Terlalu banyak permintaan. Tunggu {{ cooldownSeconds }} detik.</p>
    <HomeNavbar v-if="showHomeNavbar" />
    <p v-if="ssoEnabled && ssoState.status.value === 'unavailable'" role="status">Layanan sesi belum tersedia. Coba kembali sebentar lagi.</p>
    <div v-if="!ssoEnabled || ssoState.status.value !== 'guest' || !route.meta.requiresAuth" class="app-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page-fade" mode="out-in">
          <div :key="route.path" class="route-wrapper">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </div>
    <AppFooter v-if="!isWorkspacePage && !isAuthPage && route.name !== 'materials'" />
    
    <!-- Global Loading Overlay -->
    <div v-if="isPreparingLesson" class="global-loading-overlay">
      <div class="loader-content">
        <div class="spinner-large"></div>
        <p>Mempersiapkan materi belajar...</p>
      </div>
    </div>

    <!-- Initial App Loader for SSO -->
    <div v-if="ssoEnabled && ssoState.status.value === 'idle'" class="global-loading-overlay" style="z-index: 9999999; background: var(--bg-main, #0f172a);">
      <div class="loader-content">
        <div class="spinner-large"></div>
        <p>Memuat sesi...</p>
      </div>
    </div>
    <AppToast />
    
    <!-- Global WIP Modal -->
    <CoffeeModal v-model="showWipModal" />

  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { rateLimitUntil } from './services/api'
import { useRoute } from 'vue-router'
import HomeNavbar from './components/home/HomeNavbar.vue'
import AppFooter from './components/common/AppFooter.vue'
import AppToast from './components/common/AppToast.vue'
import CoffeeModal from './components/common/CoffeeModal.vue'
import { useUserAccount, clearUserAccount } from './composables/useUserAccount'
import { ssoEnabled, ssoState, loadSsoSession } from './services/sso'
import { useLearningPaths } from './composables/useLearningPaths'
import { useWipModal } from './composables/useWipModal'
import { useTheme } from './composables/useTheme'

const now = ref(Date.now())
const cooldownSeconds = computed(() => Math.max(0, Math.ceil((rateLimitUntil.value - now.value) / 1000)))
let cooldownTimer
onMounted(() => { cooldownTimer = setInterval(() => { now.value = Date.now() }, 1000) })
onUnmounted(() => clearInterval(cooldownTimer))
const route = useRoute()
const isWorkspacePage = computed(() => route.name === 'lesson')
const isAuthPage = computed(() => ['login', 'register', 'developer', 'auto-login'].includes(route.name))
const showHomeNavbar = computed(() => {
  const hiddenRoutes = ['lesson', 'login', 'register', 'developer', 'auto-login', 'dashboard', 'not-found', 'materials']
  return !hiddenRoutes.includes(route.name) && !route.path.startsWith('/dashboard')
})

const { bootstrapSession, fetchUser, isLoggedIn } = useUserAccount()
const { isPreparingLesson } = useLearningPaths()
const { showWipModal } = useWipModal()
const { isLightMode, toggleTheme } = useTheme()

onMounted(() => {

  // Fetch user session when app loads
  bootstrapSession()

  // Anti-Cheat Basic: Cegah Klik Kanan (Dinonaktifkan sementara)
  // window.addEventListener('contextmenu', function (e) {
  //   // Kecualikan input text dan textarea agar user tetap bisa klik kanan untuk paste (jika dibutuhkan)
  //   if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
  //     e.preventDefault()
  //   }
  // }, false)

  // Anti-Cheat Basic: Cegah shortcut DevTools (F12, Ctrl+Shift+I/J, Ctrl+U)
  // window.addEventListener('keydown', function(e) {
  //   if (
  //     e.key === 'F12' || 
  //     (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) || 
  //     (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
  //   ) {
  //     e.preventDefault()
  //   }
  // })
})

let sessionTimer
const clearAccount = () => clearUserAccount()
const checkSession = async () => {
  if (!ssoEnabled || !isLoggedIn.value || document.visibilityState !== 'visible') return
  try { if (await loadSsoSession()) await fetchUser(true) } catch { /* Retain unavailable state. */ }
}
onMounted(() => {
  if (!ssoEnabled) return
  localStorage.removeItem('auth_token'); localStorage.removeItem('sso_token')
  window.addEventListener('gamez-session-cleared', clearAccount)
  window.addEventListener('focus', checkSession)
  document.addEventListener('visibilitychange', checkSession)
  sessionTimer = setInterval(checkSession, 30000)
})
onUnmounted(() => {
  clearInterval(sessionTimer)
  window.removeEventListener('gamez-session-cleared', clearAccount)
  window.removeEventListener('focus', checkSession)
  document.removeEventListener('visibilitychange', checkSession)
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

/* Page Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.route-wrapper {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
