<template>
  <div class="dash-medals">
    <h2>Pencapaian</h2>
    <p class="subtitle">Koleksi lencana, piala, dan sertifikat pencapaianmu – siap dipajang di mana saja.</p>

    <div class="page-tabs">
      <button :class="{ active: activePageTab === 'medali' }" @click="activePageTab = 'medali'">Medali</button>
      <button :class="{ active: activePageTab === 'piala' }" @click="activePageTab = 'piala'">Piala</button>
      <button :class="{ active: activePageTab === 'sertifikat' }" @click="activePageTab = 'sertifikat'">Sertifikat</button>
    </div>

    <div v-if="activePageTab === 'medali'" class="medals-container">
      <!-- Category Dropdown for Mobile -->
      <div class="category-dropdown-mobile">
        <select v-model="activeCategory" class="cat-select">
          <option v-for="cat in categories" :key="'opt-'+cat.id" :value="cat.id">
            {{ cat.label }} ({{ cat.earned }}/{{ cat.total }})
          </option>
        </select>
      </div>

      <!-- Category Sidebar (Horizontal) -->
      <div class="category-sidebar">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="cat-btn"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <div class="cat-btn-content">
            <span class="cat-label">{{ cat.label }}</span>
            <span class="cat-count">{{ cat.earned }}/{{ cat.total }}</span>
          </div>
          <div class="cat-progress-bg">
            <div class="cat-progress-fill" :style="{ width: (cat.total > 0 ? (cat.earned / cat.total) * 100 : 0) + '%' }"></div>
          </div>
        </button>
      </div>

      <!-- Badges Grid Area -->
      <div class="badges-area">
        <div class="badges-header">
          <h3><i class="fa-solid fa-medal"></i> Koleksi {{ activeCategoryLabel }}</h3>
          <span class="badges-subtitle">{{ activeCategoryEarned }} dari {{ activeCategoryTotal }} medali terbuka</span>
        </div>

        <div class="badges-grid">
          <div
            v-for="medal in activeMedals"
            :key="medal.id"
            class="badge-card"
            :class="{ 'is-locked': !medal.earned, 'is-earned': medal.earned, 'is-clickable': medal.earned }"
            @click="medal.earned && openMedalPopup(medal)"
          >
            <div class="badge-icon-container">
              <div class="badge-hexagon">
                <CyberMedal :tierId="medal.tierId" :isLocked="!medal.earned" :iconType="medal.iconType" class="badge-svg-comp" />
              </div>
              <div v-if="!medal.earned && medal.current > 0" class="badge-mini-progress">
                {{ Math.round((medal.current / medal.target) * 100) }}%
              </div>
            </div>
            <div class="badge-info">
              <h4>{{ medal.name }}</h4>
              <p class="badge-desc">{{ medal.description }}</p>
              <div class="badge-status">
                <span v-if="medal.earned" class="status-earned"><i class="fa-solid fa-check"></i> Terbuka</span>
                <span v-else class="status-locked">
                  <i class="fa-solid fa-lock"></i> {{ medal.current }}/{{ medal.target }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Piala -->
    <div v-else-if="activePageTab === 'piala'" class="medals-container no-sidebar">
      <div class="badges-area">
        <div class="badges-header">
          <h3><i class="fa-solid fa-trophy"></i> Koleksi Piala</h3>
          <span class="badges-subtitle">Menampilkan seluruh pencapaianmu tanpa filter</span>
        </div>
        <div class="badges-grid">
          <div
            v-for="medal in allMedals"
            :key="'piala-'+medal.id"
            class="badge-card"
            :class="{ 'is-locked': !medal.earned, 'is-earned': medal.earned, 'is-clickable': medal.earned }"
            @click="medal.earned && openMedalPopup(medal)"
          >
            <div class="badge-icon-container">
              <div class="badge-hexagon">
                <CyberMedal :tierId="medal.tierId" :isLocked="!medal.earned" :iconType="medal.iconType" class="badge-svg-comp" />
              </div>
              <div v-if="!medal.earned && medal.current > 0" class="badge-mini-progress">
                {{ Math.round((medal.current / medal.target) * 100) }}%
              </div>
            </div>
            <div class="badge-info">
              <h4>{{ medal.name }}</h4>
              <p class="badge-desc">{{ medal.description }}</p>
              <div class="badge-status">
                <span v-if="medal.earned" class="status-earned"><i class="fa-solid fa-check"></i> Terbuka</span>
                <span v-else class="status-locked">
                  <i class="fa-solid fa-lock"></i> {{ medal.current }}/{{ medal.target }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sertifikat -->
    <div v-else-if="activePageTab === 'sertifikat'" class="certificate-section">
      <div class="cert-header">
        <h3><i class="fa-solid fa-award"></i> Sertifikat Profesional</h3>
        <p>Tunjukkan keahlianmu ke dunia. Sinkronisasi 1-klik ke LinkedIn.</p>
      </div>
      
      <div class="cert-showcase empty-state">
        <div class="cert-hologram"></div>
        <div class="cert-content">
          <i class="fa-solid fa-file-contract empty-icon"></i>
          <h4>Sertifikat Belum Tersedia</h4>
          <p>Selesaikan setidaknya satu modul (Path) secara penuh untuk mendapatkan sertifikat resmi pertamamu.</p>
          <router-link to="/learning" class="btn-cert-action">Mulai Belajar Sekarang <i class="fa-solid fa-arrow-right"></i></router-link>
        </div>
      </div>
    </div>

    <NewMedalPopup :show="showNewMedal" :medal="newMedalData" @update:show="showNewMedal = $event" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAchievements } from '../../composables/useAchievements'
import NewMedalPopup from './NewMedalPopup.vue'
import CyberMedal from '../ui/CyberMedal.vue'

const { userStats, fetchUserStats, allMedals } = useAchievements()

const showNewMedal = ref(false)
const newMedalData = ref(null)
const activePageTab = ref('medali')

onMounted(async () => {
  if (!userStats.value.completed_exercises) {
    await fetchUserStats()
  }
  checkNewMedals()
})

watch(() => userStats.value, () => {
  checkNewMedals()
}, { deep: true })

const checkNewMedals = () => {
  if (!userStats.value.completed_exercises) return; 
  
  const previouslyEarned = JSON.parse(localStorage.getItem('earned_medals') || '[]')
  const newlyEarned = []
  
  allMedals.value.forEach(medal => {
    if (medal.earned && !previouslyEarned.includes(medal.id)) {
      newlyEarned.push(medal)
      previouslyEarned.push(medal.id)
    }
  })
  
  localStorage.setItem('earned_medals', JSON.stringify(previouslyEarned))
  
  if (newlyEarned.length > 0) {
    newMedalData.value = newlyEarned[0]
    showNewMedal.value = true
  }
}

const openMedalPopup = (medal) => {
  newMedalData.value = medal
  showNewMedal.value = true
}

const activeCategory = ref('all')

const categories = computed(() => {
  const medals = allMedals.value
  return [
    { id: 'all', label: 'Semua', earned: medals.filter(m => m.earned).length, total: medals.length },
    { id: 'sql', label: 'SQL', earned: medals.filter(m => m.category === 'sql' && m.earned).length, total: medals.filter(m => m.category === 'sql').length },
    { id: 'frontend', label: 'Frontend', earned: medals.filter(m => m.category === 'frontend' && m.earned).length, total: medals.filter(m => m.category === 'frontend').length },
    { id: 'streak', label: 'Streak', earned: medals.filter(m => m.category === 'streak' && m.earned).length, total: medals.filter(m => m.category === 'streak').length },
    { id: 'level', label: 'Level', earned: medals.filter(m => m.category === 'level' && m.earned).length, total: medals.filter(m => m.category === 'level').length }
  ]
})

const activeCategoryLabel = computed(() => {
  const cat = categories.value.find(c => c.id === activeCategory.value)
  return cat ? cat.label : ''
})
const activeCategoryEarned = computed(() => {
  const cat = categories.value.find(c => c.id === activeCategory.value)
  return cat ? cat.earned : 0
})
const activeCategoryTotal = computed(() => {
  const cat = categories.value.find(c => c.id === activeCategory.value)
  return cat ? cat.total : 0
})
const activeMedals = computed(() => {
  let medals = [...allMedals.value]
  
  if (activeCategory.value !== 'all') {
    medals = medals.filter(m => m.category === activeCategory.value)
    return medals.sort((a, b) => {
      if (a.earned && !b.earned) return -1
      if (!a.earned && b.earned) return 1
      if (a.earned && b.earned) return b.tierId - a.tierId
      return a.tierId - b.tierId
    })
  } else {
    const highestEarned = {}
    medals.forEach(m => {
      if (m.earned) {
        if (!highestEarned[m.category] || m.tierId > highestEarned[m.category].tierId) {
          highestEarned[m.category] = m
        }
      }
    })
    
    const highestEarnedIds = Object.values(highestEarned).map(m => m.id)
    
    return medals.sort((a, b) => {
      const aIsHighest = highestEarnedIds.includes(a.id)
      const bIsHighest = highestEarnedIds.includes(b.id)
      
      if (aIsHighest && !bIsHighest) return -1
      if (!aIsHighest && bIsHighest) return 1
      if (aIsHighest && bIsHighest) return b.tierId - a.tierId
      
      if (a.earned && !b.earned) return -1
      if (!a.earned && b.earned) return 1
      if (a.earned && b.earned) return b.tierId - a.tierId
      
      return a.tierId - b.tierId
    })
  }
})
</script>

<style scoped src="../../assets/css/components/dashboard/DashboardMedals.css"></style>
