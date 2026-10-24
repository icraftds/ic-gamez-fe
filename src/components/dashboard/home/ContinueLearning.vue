<template>
  <div class="section-card">
    <div class="cl-header">
      <div class="cl-title-wrap">
        <h2>Teruskan Perjalanan Belajarmu</h2>
        <span class="cl-count-badge" v-if="paths && paths.length > 0">
          {{ paths.length }} Alur
        </span>
      </div>
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
      <div 
        class="cl-item" 
        v-for="(path, index) in paths" 
        :key="path.id"
        :style="{ '--card-theme': getTheme(path, index) }"
      >
        <div 
          class="cl-icon"
          :style="{
            color: getTheme(path, index),
            backgroundColor: getTheme(path, index) + '18',
            borderColor: getTheme(path, index) + '45'
          }"
        >
          <i :class="getIcon(path)"></i>
        </div>

        <div class="cl-body">
          <div class="cl-top-line">
            <div class="cl-title-group">
              <h4 class="cl-title">{{ path.title }}</h4>
              <span v-if="path.is_premium || path.isPremium" class="cc-pro-badge sm">
                <i class="fa-solid fa-crown"></i> PRO
              </span>
            </div>
            <span class="cl-percent" :style="{ color: getTheme(path, index) }">
              {{ getPathProgress(path) }}%
            </span>
          </div>

          <div class="cl-bottom-line">
            <div class="cl-bar-wrapper">
              <div class="cc-bar-bg cl-bar">
                <div 
                  class="cc-bar-fill" 
                  :style="{ 
                    width: getPathProgress(path) + '%',
                    background: `linear-gradient(90deg, ${getTheme(path, index)}, ${getTheme(path, index)}dd)`,
                    boxShadow: `0 0 10px ${getTheme(path, index)}66`
                  }"
                ></div>
              </div>
              <span class="cl-meta-text">
                {{ getCompletedLessonsForPath(path) }} dari {{ getTotalLessonsForPath(path) }} materi diselesaikan
              </span>
            </div>

            <router-link 
              :to="`/learning/${path.slug || path.id}`" 
              class="btn-continue cl-btn"
              :style="{
                color: getTheme(path, index),
                borderColor: getTheme(path, index) + '40',
                backgroundColor: getTheme(path, index) + '12'
              }"
            >
              <span>{{ getActionLabel(path) }}</span>
              <i :class="getActionIcon(path)" class="btn-icon"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="continue-grid">
      <div 
        class="continue-card" 
        v-for="(path, index) in paths" 
        :key="path.id"
        :style="{ '--card-theme': getTheme(path, index) }"
      >
        <div class="card-glow" :style="{ background: getTheme(path, index) }"></div>

        <!-- Top Header: Icon + Badges -->
        <div class="cc-header">
          <div 
            class="cc-icon"
            :style="{
              color: getTheme(path, index),
              backgroundColor: getTheme(path, index) + '18',
              borderColor: getTheme(path, index) + '45'
            }"
          >
            <i :class="getIcon(path)"></i>
          </div>
          
          <div class="cc-badges">
            <span v-if="path.is_premium || path.isPremium" class="cc-pro-badge">
              <i class="fa-solid fa-crown"></i> PRO
            </span>
            <span 
              class="cc-progress-pill" 
              :style="{ 
                color: getTheme(path, index), 
                borderColor: getTheme(path, index) + '35', 
                backgroundColor: getTheme(path, index) + '14' 
              }"
            >
              {{ getPathProgress(path) }}%
            </span>
          </div>
        </div>

        <!-- Content: Uniform Title & Clamped Description -->
        <div class="cc-info">
          <h4 class="cc-title">{{ path.title }}</h4>
          <p class="cc-desc">{{ path.description }}</p>
        </div>

        <!-- Progress Bar & Stats -->
        <div class="cc-progress-section">
          <div class="cc-bar-bg">
            <div 
              class="cc-bar-fill" 
              :style="{ 
                width: getPathProgress(path) + '%',
                background: `linear-gradient(90deg, ${getTheme(path, index)}, ${getTheme(path, index)}dd)`,
                boxShadow: `0 0 10px ${getTheme(path, index)}55`
              }"
            ></div>
          </div>
          <div class="cc-stats">
            <span class="stats-count">
              <i class="fa-solid fa-book-open"></i> {{ getCompletedLessonsForPath(path) }} dari {{ getTotalLessonsForPath(path) }} materi
            </span>
            <span class="stats-badge" :style="{ color: getTheme(path, index) }">
              {{ getPathProgress(path) === 100 ? 'Selesai' : (getPathProgress(path) > 0 ? 'Sedang Dipelajari' : 'Tersedia') }}
            </span>
          </div>
        </div>

        <!-- Bottom Action Button: Always Pinned at Bottom -->
        <router-link 
          :to="`/learning/${path.slug || path.id}`" 
          class="btn-continue"
          :style="{
            color: getTheme(path, index),
            borderColor: getTheme(path, index) + '40',
            backgroundColor: getTheme(path, index) + '12'
          }"
        >
          <span>{{ getActionLabel(path) }}</span>
          <i :class="getActionIcon(path)" class="btn-icon"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLearningPaths } from '../../../composables/useLearningPaths'
import { getPathThemeColor, getPathIconClass } from '../../../utils/pathTheme'

const { paths } = useLearningPaths()

const VIEW_KEY = 'continue_learning_view'
const viewMode = ref(localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid')
const setViewMode = (mode) => {
  viewMode.value = mode
  localStorage.setItem(VIEW_KEY, mode)
}

const getTheme = (path, index) => {
  return getPathThemeColor(path, index)
}

const getIcon = (path) => {
  return getPathIconClass(path)
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

const getActionLabel = (path) => {
  const p = getPathProgress(path)
  if (p === 100) return 'Pelajari Ulang'
  if (p > 0) return 'Lanjutkan Belajar'
  return 'Mulai Belajar'
}

const getActionIcon = (path) => {
  const p = getPathProgress(path)
  if (p === 100) return 'fa-solid fa-rotate-right'
  if (p > 0) return 'fa-solid fa-arrow-right'
  return 'fa-solid fa-play'
}
</script>

<style scoped src="../../../assets/css/components/dashboard/home/ContinueLearning.css"></style>
