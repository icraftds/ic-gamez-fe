<template>
  <div class="learning-view">
    <SimpleBackground />
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

    <!-- Loading Overlay -->
    <div v-if="isPreparingLesson" class="loading-overlay">
      <div class="loader-content">
        <div class="spinner-large"></div>
        <p>Mempersiapkan materi belajar...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'
import PathCard from '../components/learning/PathCard.vue'
import { useLearningPaths } from '../composables/useLearningPaths'

const router = useRouter()
const { paths, fetchPaths, fetchPathDetails, isLoading, isPreparingLesson, hasFetchedAllPaths } = useLearningPaths()

onMounted(() => {
  if (!hasFetchedAllPaths.value) {
    fetchPaths()
  }
  isPreparingLesson.value = false
})

const goToPath = async (path) => {
  if (path.isLocked) return

  isPreparingLesson.value = true

  // Pastikan kita memiliki detail path (termasuk chapters dan lessons)
  let detailedPath = path
  
  // Periksa apakah lessons sudah dimuat, jika belum panggil API detail
  if (!detailedPath.chapters || detailedPath.chapters.length === 0 || !detailedPath.chapters[0].lessons) {
    const fetched = await fetchPathDetails(path.slug || path.id)
    if (fetched) detailedPath = fetched
  }

  // Langsung ke lesson pertama dari chapter pertama
  const firstChapter = detailedPath?.chapters?.[0]
  const firstLesson = firstChapter?.lessons?.[0]

  if (firstChapter && firstLesson) {
    router.push(`/learning/${detailedPath.slug || detailedPath.id}/lesson/${firstChapter.slug || firstChapter.id}/${firstLesson.slug || firstLesson.id}`)
  } else {
    // Fallback ke PathDetailView hanya jika path benar-benar kosong
    router.push(`/learning/${detailedPath?.slug || detailedPath?.id || path.slug || path.id}`)
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

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 10, 30, 0.85);
  backdrop-filter: blur(12px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease-out forwards;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loader-content p {
  color: #f8fafc;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  animation: pulse 1.5s infinite;
}

.spinner-large {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 240, 255, 0.1);
  border-radius: 50%;
  border-top-color: #00f0ff;
  border-right-color: #a855f7;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
