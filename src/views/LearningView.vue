<template>
  <div class="learning-view">
    <SimpleBackground />
    
    <div class="container learning-container">
      <div class="learning-hero">
        <div class="hero-badge">
          <i class="fa-solid fa-map"></i> Peta Kurikulum
        </div>
        <h1 class="hero-title">Alur <span class="gradient-text">Belajar</span></h1>
        <p class="hero-desc">Ikuti roadmap pembelajaran terstruktur kami dari dasar pemrograman hingga penguasaan algoritma tingkat lanjut.</p>
        
        <div class="hero-actions">
          <button class="materials-btn" @click="$router.push('/materials')">
            <i class="fa-solid fa-book-open-reader"></i> Baca Pusat Materi
          </button>
          <button class="encyclopedia-btn" @click="$router.push('/encyclopedia')">
            <i class="fa-solid fa-book-bookmark"></i> Ensiklopedia
          </button>
        </div>
      </div>
      
      <!-- Filter Section -->
      <div class="filter-section">
        <!-- Top Bar: Search & Access Tier -->
        <div class="filter-top-bar">
          <div class="search-box">
            <i class="fa-solid fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Cari alur belajar (contoh: Python, CSS, Logika)..." 
            />
            <button 
              v-if="searchQuery" 
              class="clear-search-btn" 
              @click="searchQuery = ''" 
              title="Hapus pencarian"
              type="button"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Tier / Access Filter -->
          <div class="tier-pills">
            <button 
              v-for="tier in accessFilters" 
              :key="tier.id"
              class="tier-pill-btn"
              :class="{ 
                active: selectedTier === tier.id,
                'tier-free': tier.id === 'free',
                'tier-pro': tier.id === 'premium'
              }"
              @click="selectedTier = tier.id"
              type="button"
            >
              <i v-if="tier.icon" :class="tier.icon"></i>
              <span>{{ tier.label }}</span>
              <span class="count-badge">{{ tierCounts[tier.id] }}</span>
            </button>
          </div>
        </div>

        <!-- Bottom Bar: Curriculum Track Categories & Meta -->
        <div class="filter-bottom-bar">
          <div class="filter-pills">
            <button 
              v-for="cat in categories" 
              :key="cat.id"
              class="pill-btn"
              :class="{ active: selectedCategory === cat.id }"
              @click="selectedCategory = cat.id"
              type="button"
            >
              <i v-if="cat.icon" :class="cat.icon"></i>
              <span>{{ cat.label }}</span>
              <span class="count-badge">{{ categoryCounts[cat.id] }}</span>
            </button>
          </div>

          <!-- Filter Reset & Results Counter -->
          <div v-if="hasActiveFilter" class="filter-reset-wrapper">
            <span class="results-count">
              Menampilkan <strong>{{ filteredPaths.length }}</strong> dari {{ paths?.length || 0 }} alur
            </span>
            <button class="reset-filter-btn" @click="resetFilters" type="button">
              <i class="fa-solid fa-rotate-left"></i> Reset Filter
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state if full paths list is being fetched -->
      <div v-if="isLoading && paths.length <= 1" class="paths-loading-state" style="display: flex; justify-content: center; align-items: center; min-height: 320px; width: 100%;">
        <TerminalLoader size="lg" label="seluruh alur belajar" />
      </div>

      <div v-else class="paths-grid">
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
          <button v-if="hasActiveFilter" class="empty-reset-btn" @click="resetFilters" type="button">
            <i class="fa-solid fa-rotate-left"></i> Tampilkan Semua Alur Belajar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <TerminalLoader v-if="isPreparingLesson" variant="overlay" size="lg" label="roadmap belajar" />
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
const selectedCategory = ref('all')
const selectedTier = ref('all')

const categories = [
  { id: 'all', label: 'Semua Track', icon: 'fa-solid fa-layer-group' },
  { id: 'fondasi', label: 'Fondasi & Logika', icon: 'fa-solid fa-brain' },
  { id: 'web', label: 'Web Development', icon: 'fa-solid fa-code' },
  { id: 'data', label: 'Python & Data', icon: 'fa-solid fa-database' }
]

const accessFilters = [
  { id: 'all', label: 'Semua Akses' },
  { id: 'free', label: 'Gratis', icon: 'fa-solid fa-gift' },
  { id: 'premium', label: 'Pro', icon: 'fa-solid fa-crown' }
]

// Accurate mapping for curriculum tracks
const getPathCategory = (path) => {
  const slug = (path?.slug || '').toLowerCase()
  const title = (path?.title || '').toLowerCase()
  
  if (
    slug.includes('html') ||
    slug.includes('css') ||
    slug.includes('layout') ||
    slug.includes('responsive') ||
    slug.includes('javascript') ||
    slug.includes('frontend') ||
    slug.includes('backend') ||
    slug.includes('php') ||
    slug.includes('laravel') ||
    slug.includes('react') ||
    title.includes('html') ||
    title.includes('css') ||
    title.includes('layout') ||
    title.includes('javascript') ||
    title.includes('frontend') ||
    title.includes('backend') ||
    title.includes('php') ||
    title.includes('laravel') ||
    title.includes('react') ||
    title.includes('web')
  ) {
    return 'web'
  }
  
  if (
    slug.includes('python') ||
    slug.includes('database') ||
    slug.includes('sql') ||
    title.includes('python') ||
    title.includes('database') ||
    title.includes('sql') ||
    title.includes('data')
  ) {
    return 'data'
  }
  
  if (
    slug.includes('dasar-pemrograman') ||
    slug.includes('logika') ||
    slug.includes('matematika') ||
    slug.includes('algoritma') ||
    title.includes('dasar pemrograman') ||
    title.includes('logika') ||
    title.includes('matematika') ||
    title.includes('komputasional') ||
    title.includes('algoritma')
  ) {
    return 'fondasi'
  }
  
  return 'fondasi'
}

const isPathPremium = (path) => {
  return Boolean(path.is_premium || path.isPremium)
}

const categoryCounts = computed(() => {
  const counts = { all: paths.value?.length || 0, fondasi: 0, web: 0, data: 0 }
  if (paths.value) {
    paths.value.forEach(p => {
      const cat = getPathCategory(p)
      if (counts[cat] !== undefined) {
        counts[cat]++
      }
    })
  }
  return counts
})

const tierCounts = computed(() => {
  const counts = { all: paths.value?.length || 0, free: 0, premium: 0 }
  if (paths.value) {
    paths.value.forEach(p => {
      if (isPathPremium(p)) {
        counts.premium++
      } else {
        counts.free++
      }
    })
  }
  return counts
})

const hasActiveFilter = computed(() => {
  return searchQuery.value.trim() !== '' || selectedCategory.value !== 'all' || selectedTier.value !== 'all'
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedTier.value = 'all'
}

onMounted(async () => {
  if (!hasFetchedAllPaths.value || paths.value.length <= 1) {
    await fetchPaths()
  }
  isPreparingLesson.value = false
})

const filteredPaths = computed(() => {
  let result = paths.value || []
  
  // 1. Search Query filter
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(p => {
      const title = (p.title || '').toLowerCase()
      const desc = (p.description || '').toLowerCase()
      const slug = (p.slug || '').toLowerCase()
      return title.includes(q) || desc.includes(q) || slug.includes(q)
    })
  }
  
  // 2. Category filter
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => getPathCategory(p) === selectedCategory.value)
  }

  // 3. Access Tier filter
  if (selectedTier.value !== 'all') {
    if (selectedTier.value === 'free') {
      result = result.filter(p => !isPathPremium(p))
    } else if (selectedTier.value === 'premium') {
      result = result.filter(p => isPathPremium(p))
    }
  }
  
  return result
})

const goToPath = async (path) => {
  if (path.isLocked || path.is_locked) return

  isPreparingLesson.value = true

  // Let RoadmapView handle the fetching of details, just navigate there directly
  router.push(`/learning/${path.slug || path.id}`)
}
</script>

<style scoped src="../assets/css/views/LearningView.css"></style>
