<template>
  <div class="section-card">
    <h2>Teruskan Perjalanan Belajarmu</h2>
    <div class="continue-grid">
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
          <span>{{ getCompletedLessonsForPath(path) }} dari {{ getTotalLessonsForPath(path) }} modul diselesaikan</span>
        </div>
        <router-link :to="`/learning/${path.id}`" class="btn-continue">
          Lanjutkan Modul {{ path.title.split(' ')[0] }} 🚀
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLearningPaths } from '../../../composables/useLearningPaths'

const { paths } = useLearningPaths()

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
