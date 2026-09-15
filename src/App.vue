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
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from './components/common/AppFooter.vue'
import { useUserAccount } from './composables/useUserAccount'
import { useLearningPaths } from './composables/useLearningPaths'

const route = useRoute()
const isWorkspacePage = computed(() => route.name === 'lesson')
const isAuthPage = computed(() => ['login', 'register'].includes(route.name))

const { fetchUser } = useUserAccount()
const { isPreparingLesson } = useLearningPaths()

onMounted(() => {
  // Fetch user session when app loads
  fetchUser()
})
</script>

<style>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.app-layout.workspace-mode {
  height: 100vh;
  overflow: hidden;
}
.app-content {
  flex: 1;
}

.global-loading-overlay {
  position: fixed;
  inset: 0;
  background: var(--glass-bg, rgba(15, 10, 30, 0.85));
  backdrop-filter: blur(12px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loader-content p {
  color: #fff;
  font-weight: 600;
  letter-spacing: 1px;
}

.spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255,255,255,0.1);
  border-left-color: #00f0ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
