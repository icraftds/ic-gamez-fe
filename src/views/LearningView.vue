<template>
  <div class="learning-view">
    <SimpleBackground />
    <HomeNavbar />

    <div class="container learning-container">
      <div class="learning-hero">
        <div class="hero-badge">
          <i class="fa-solid fa-map"></i> Peta Kurikulum
        </div>
        <h1 class="hero-title">Learning <span class="gradient-text">Paths</span></h1>
        <p class="hero-desc">Ikuti roadmap pembelajaran terstruktur kami dari dasar pemrograman hingga penguasaan algoritma tingkat lanjut.</p>
      </div>
      
      <!-- Filter Section (New) -->
      <div class="filter-section">
        <div class="search-box">
          <i class="fa-solid fa-search"></i>
          <input type="text" v-model="searchQuery" placeholder="Cari alur belajar..." />
        </div>
        <div class="filter-pills">
          <button 
            v-for="cat in ['All', 'Free', 'Premium']" 
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
import HomeNavbar from '../components/home/HomeNavbar.vue'
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
  if (selectedCategory.value === 'Premium') {
    result = result.filter(p => p.isPremium || p.is_premium)
  } else if (selectedCategory.value === 'Free') {
    result = result.filter(p => !p.isPremium && !p.is_premium)
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

<style scoped>
.learning-view {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.learning-container {
  margin-top: 40px;
  padding-bottom: 64px;
}

/* Hero Section */
.learning-hero {
  text-align: center;
  margin-bottom: 40px;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 24px;
  border: 1px solid rgba(99, 102, 241, 0.2);
}
.hero-title {
  font-size: 3rem;
  font-weight: 900;
  color: var(--text-light);
  margin-bottom: 16px;
  line-height: 1.2;
}
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-desc {
  font-size: 1.1rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Filter Section */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
  align-items: center;
}
@media (min-width: 768px) {
  .filter-section {
    flex-direction: row;
    justify-content: space-between;
  }
}
.search-box {
  position: relative;
  width: 100%;
  max-width: 400px;
}
.search-box i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}
.search-box input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg-card-0_6);
  color: var(--text-light);
  font-size: 1rem;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}
.search-box input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.2);
}
.search-box input::placeholder {
  color: var(--text-muted);
}
.filter-pills {
  display: flex;
  gap: 8px;
}
.pill-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg-card-0_6);
  color: var(--text-light);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}
.pill-btn:hover {
  background: rgba(0, 240, 255, 0.1);
  color: var(--primary);
  border-color: var(--primary);
}
.pill-btn.active {
  background: var(--primary);
  color: var(--bg-deep);
  border-color: var(--primary);
}

/* Grid */
.paths-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 48px;
  color: var(--text-muted);
}
.no-results i {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
.loader-content {
  background: var(--glass-bg-modal-1);
  padding: 32px 48px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid var(--glass-border);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  color: var(--text-light);
}
.spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0, 240, 255, 0.3);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
