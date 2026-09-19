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
})
</script>

<style src="./assets/css/App.css"></style>
