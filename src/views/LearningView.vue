<template>
  <div class="learning-view">
    <BackgroundEffects :show-orb3="true" />
    <HomeNavbar />

    <div class="container" style="margin-top: 40px">
      <div class="learning-hero">
        <div class="hero-badge">
          <i class="fa-solid fa-map"></i> Peta Kurikulum
        </div>
        <h1 class="hero-title">Learning <span class="gradient-text">Paths</span></h1>
        <p class="hero-desc">Ikuti roadmap pembelajaran terstruktur kami dari dasar pemrograman hingga penguasaan algoritma tingkat lanjut.</p>
      </div>

      <div class="paths-grid">
        <PathCard 
          v-for="(path, index) in paths" 
          :key="path.id" 
          :path="path"
          :index="index"
          @click="goToPath(path)" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'
import PathCard from '../components/learning/PathCard.vue'
import { useLearningPaths } from '../composables/useLearningPaths'

const router = useRouter()
const { paths } = useLearningPaths()

const goToPath = (path) => {
  if (path.isLocked) return

  // Langsung ke lesson pertama dari chapter pertama
  const firstChapter = path.chapters?.[0]
  const firstLesson = firstChapter?.lessons?.[0]

  if (firstChapter && firstLesson) {
    router.push(`/learning/${path.id}/lesson/${firstChapter.id}/${firstLesson.id}`)
  } else {
    // Fallback ke PathDetailView jika tidak ada lesson
    router.push(`/learning/${path.id}`)
  }
}
</script>



<style scoped>
.learning-view {
  min-height: 100vh;
  padding-bottom: 80px;
}

.learning-hero {
  text-align: center;
  margin-bottom: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.hero-badge {
  background: rgba(0, 240, 255, 0.1);
  color: #00f0ff;
  border: 1px solid rgba(0, 240, 255, 0.3);
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 15px;
  letter-spacing: -0.02em;
}

.hero-desc {
  color: #94a3b8;
  font-size: 1.15rem;
  max-width: 600px;
  line-height: 1.6;
}

.paths-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .learning-hero { margin-bottom: 40px; }
  .hero-title { font-size: 2.2rem; }
  .hero-desc { font-size: 1rem; }
  .paths-grid { grid-template-columns: 1fr; gap: 20px; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 1.8rem; }
}
</style>
