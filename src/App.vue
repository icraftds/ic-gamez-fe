<template>
  <div class="app-layout" :class="{ 'workspace-mode': isWorkspacePage }">
    <div class="app-content">
      <router-view />
    </div>
    <AppFooter v-if="!isWorkspacePage" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from './components/common/AppFooter.vue'

const route = useRoute()
const isWorkspacePage = computed(() => route.name === 'lesson')
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
</style>
