<template>
  <div class="learning-view">
    <SimpleBackground />
    
    <div class="container learning-container">
      <div class="learning-hero">
        <div class="hero-badge">
          <i class="fa-solid fa-map"></i> Peta Kurikulum
        </div>
        <h1 class="hero-title">Learning <span class="gradient-text">Paths</span></h1>
        <p class="hero-desc">Ikuti roadmap pembelajaran terstruktur kami dari dasar pemrograman hingga penguasaan algoritma tingkat lanjut.</p>
        
        <div class="hero-actions">
          <button class="materials-btn" @click="$router.push('/materials')">
            <i class="fa-solid fa-book-open-reader"></i> Baca Pusat Materi
          </button>
        </div>
      </div>
      
      <!-- Filter Section (New) -->
      <div class="filter-section">
        <div class="search-box">
          <i class="fa-solid fa-search"></i>
          <input type="text" v-model="searchQuery" placeholder="Cari alur belajar..." />
        </div>
        <div class="filter-pills">
          <button 
            v-for="cat in ['All', 'Web Dev', 'Mobile', 'Data Science', 'Game Dev']" 
            :key="cat"
            class="pill-btn"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="paths-grid">
        <PathCard 
          v-for="(path, index) in filteredPaths" 
          :key="path.id" 
          :path="path"
          :index="index"
          @click="goToPath(path)" 
        />
        
        <div v-if="filteredPaths.length === 0" class="no-results">
          <i class="fa-solid fa-ghost"></i>
          <p>Tidak ada alur belajar yang sesuai dengan filter Anda.</p>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isPreparingLesson" class="loading-overlay">
      <div class="loader-content">
        <div class="spinner-large"></div>
        <p>Mempersiapkan Roadmap Belajar...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import PathCard from '../components/learning/PathCard.vue'
import { useLearningPaths } from '../composables/useLearningPaths'

const router = useRouter()
const { paths, fetchPaths, fetchPathDetails, isLoading, isPreparingLesson, hasFetchedAllPaths } = useLearningPaths()

const searchQuery = ref('')
const selectedCategory = ref('All')

onMounted(() => {
  if (!hasFetchedAllPaths.value) {
    fetchPaths()
  }
  isPreparingLesson.value = false
})

const filteredPaths = computed(() => {
  let result = paths.value || [];
  
  // Apply Search
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      (p.title && p.title.toLowerCase().includes(q)) || 
      (p.description && p.description.toLowerCase().includes(q))
    )
  }
  
  // Apply Category
  if (selectedCategory.value !== 'All') {
    const cat = selectedCategory.value.toLowerCase()
    if (cat === 'web dev') {
      result = result.filter(p => p.title.toLowerCase().includes('web') || p.title.toLowerCase().includes('frontend') || p.title.toLowerCase().includes('backend'))
    } else if (cat === 'data science') {
      result = result.filter(p => p.title.toLowerCase().includes('data') || p.title.toLowerCase().includes('sql') || p.title.toLowerCase().includes('python'))
    } else if (cat === 'mobile') {
      result = result.filter(p => p.title.toLowerCase().includes('mobile') || p.title.toLowerCase().includes('android') || p.title.toLowerCase().includes('flutter'))
    } else if (cat === 'game dev') {
      result = result.filter(p => p.title.toLowerCase().includes('game') || p.title.toLowerCase().includes('unity') || p.title.toLowerCase().includes('godot'))
    } else {
      result = result.filter(p => p.category === selectedCategory.value)
    }
  }
  
  return result;
})

const goToPath = async (path) => {
  if (path.isLocked) return

  isPreparingLesson.value = true

  // Let RoadmapView handle the fetching of details, just navigate there directly
  // Route to the new Roadmap view (which will replace PathDetailView)
  router.push(`/learning/${path.slug || path.id}`)
}
</script>

<style scoped src="../assets/css/views/LearningView.css"></style>
