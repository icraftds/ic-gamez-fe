<template>
  <div class="section-card">
    <h2>Lanjut Belajar</h2>
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
          <span>{{ getCompletedLessonsForPath(path) }} dari {{ getTotalLessonsForPath(path) }} latihan selesai</span>
        </div>
        <router-link :to="`/learning/${path.id}`" class="btn-continue">
          Mulai Belajar {{ path.title.split(' ')[0] }} →
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
  path.chapters.forEach(c => c.lessons.forEach(l => { if (l.isCompleted) count++ }))
  return count
}

const getTotalLessonsForPath = (path) => {
  let count = 0
  path.chapters.forEach(c => { count += c.lessons.length })
  return count
}
</script>

<style scoped>
.section-card {
  background: rgba(15, 10, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  transform-style: preserve-3d;
}

.section-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-5px);
  box-shadow: -10px 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(147, 51, 234, 0.2);
  border-color: rgba(147, 51, 234, 0.3);
}

.section-card h2 { font-size: 1.3rem; margin-bottom: 20px; }

.continue-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.continue-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  transform-style: preserve-3d;
}

.continue-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-5px);
  box-shadow: -5px 10px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(34, 211, 238, 0.2);
  border-color: rgba(34, 211, 238, 0.3);
}
.cc-header { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
.cc-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--primary); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.1rem; }
.cc-info { flex: 1; }
.cc-info h4 { margin: 0 0 3px 0; font-size: 1rem; }
.cc-info p { margin: 0; color: #64748b; font-size: 0.8rem; }
.cc-progress { font-size: 1.3rem; font-weight: 800; color: white; }
.cc-bar-bg { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-bottom: 12px; }
.cc-bar-fill { height: 100%; background: linear-gradient(90deg, #10b981, #22d3ee); border-radius: 2px; }
.cc-stats { color: #64748b; font-size: 0.85rem; margin-bottom: 15px; }
.btn-continue {
  display: block;
  text-align: center;
  padding: 12px;
  background: linear-gradient(135deg, #22d3ee, #3b82f6);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s;
}
.btn-continue:hover { transform: translateY(-2px); }
</style>
