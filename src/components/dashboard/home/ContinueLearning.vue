<template>
  <div class="section-card">
    <div class="cl-header">
      <h2>Teruskan Perjalanan Belajarmu</h2>
      <div class="view-toggle" role="group" aria-label="Ubah tampilan">
        <button
          id="cl-view-grid"
          :class="{ active: viewMode === 'grid' }"
          @click="setViewMode('grid')"
          title="Tampilan Kotak"
          aria-label="Tampilan Kotak"
        >
          <i class="fa-solid fa-table-cells-large"></i>
        </button>
        <button
          id="cl-view-list"
          :class="{ active: viewMode === 'list' }"
          @click="setViewMode('list')"
          title="Tampilan List"
          aria-label="Tampilan List"
        >
          <i class="fa-solid fa-list"></i>
        </button>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="continue-list">
      <div class="cl-item" v-for="path in paths" :key="path.id">
        <div class="cc-icon cl-icon"><i :class="path.icon"></i></div>
        <div class="cl-body">
          <h4 class="cl-title">{{ path.title }}</h4>
          <span class="cl-percent">{{ getPathProgress(path) }}%</span>
          <div class="cc-bar-bg cl-bar"><div class="cc-bar-fill" :style="{ width: getPathProgress(path) + '%' }"></div></div>
          <router-link :to="`/learning/${path.id}`" class="btn-continue cl-btn">
            Lanjutkan Materi
          </router-link>
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="continue-grid">
      <div class="continue-card" v-for="path in paths" :key="path.id">
        <div class="cc-header">
          <div class="cc-icon"><i :class="path.icon"></i></div>
          <div class="cc-info">
            <h4>{{ path.title }}</h4>
            <p>{{ path.description }}</p>
          </div>
          <span class="cc-progress">{{ getPathProgress(path) }}%</span>
        </div>
        <div class="cc-bar-bg"><div class="cc-bar-fill" :style="{ width: getPathProgress(path) + '%' }"></div></div>
        <div class="cc-stats">
          <span>{{ getCompletedLessonsForPath(path) }} dari {{ getTotalLessonsForPath(path) }} materi diselesaikan</span>
        </div>
        <router-link :to="`/learning/${path.id}`" class="btn-continue">
          Lanjutkan Materi {{ path.title.split(' ')[0] }} 🚀
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLearningPaths } from '../../../composables/useLearningPaths'

const { paths } = useLearningPaths()

const VIEW_KEY = 'continue_learning_view'
const viewMode = ref(localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid')
const setViewMode = (mode) => {
  viewMode.value = mode
  localStorage.setItem(VIEW_KEY, mode)
}

const getPathProgress = (path) => {
  const total = getTotalLessonsForPath(path)
  if (total === 0) return 0
  return Math.round((getCompletedLessonsForPath(path) / total) * 100)
}

const getCompletedLessonsForPath = (path) => {
  let count = 0
  path?.chapters?.forEach(c => c.lessons?.forEach(l => { if (l.isCompleted) count++ }))
  return count
}

const getTotalLessonsForPath = (path) => {
  let count = 0
  path?.chapters?.forEach(c => { count += (c.lessons?.length || 0) })
  return count
}
</script>

<style scoped src="../../../assets/css/components/dashboard/home/ContinueLearning.css"></style>
