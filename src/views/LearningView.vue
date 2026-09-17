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



<style scoped src="../assets/css/views/LearningView.css"></style>
