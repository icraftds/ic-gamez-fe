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
    <!-- Piala -->
    <div v-else-if="activePageTab === 'piala'" class="medals-container no-sidebar">
      <div class="badges-area">
        <div class="badges-header">
          <h3><i class="fa-solid fa-trophy"></i> Koleksi Piala Kejuaraan</h3>
          <span class="badges-subtitle">Piala megah Cyberpunk dari kejuaraan mingguan, tahunan, dan penghargaan spesial</span>
        </div>
        <div class="badges-grid trophy-grid">
          <div
            v-for="piala in allPiala"
            :key="'piala-'+piala.id"
            class="badge-card trophy-card"
            :class="{ 'is-locked': !piala.earned, 'is-earned': piala.earned, 'is-clickable': piala.earned }"
            @click="piala.earned && openTrophyPopup(piala)"
          >
            <div class="trophy-icon-container" style="position: relative; width: 100%; height: 230px; display: flex; justify-content: center; align-items: center; margin-bottom: 18px;">
              <CyberTrophy :tier="piala.tier" :icon="piala.icon || 'none'" :isLocked="!piala.earned" :size="220" />
              <div v-if="piala.count > 1" class="badge-count-pill" style="position: absolute; top: 0px; right: 10px; background: linear-gradient(135deg, #FFD700, #FF8C00); color: #020617; font-size: 0.8rem; font-weight: 800; padding: 3px 10px; border-radius: 999px; box-shadow: 0 0 14px rgba(255,215,0,0.7); border: 2px solid #0F172A; z-index: 5;">
                x{{ piala.count }}
              </div>
            </div>
            <div class="badge-info">
              <h4>{{ piala.title || piala.name }}</h4>
              <div class="badge-status">
                <span v-if="piala.earned" class="status-earned">
                  <i class="fa-solid fa-trophy"></i> Diraih <span v-if="piala.count > 1">({{ piala.count }}x)</span>
                </span>
                <span v-else class="status-locked">
                  <i class="fa-solid fa-lock"></i> Belum Diraih
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

    <!-- Modal Khusus Medali -->
    <NewMedalPopup :show="showNewMedal" :medal="newMedalData" @update:show="showNewMedal = $event" />

    <!-- Modal Khusus Piala -->
    <NewTrophyPopup :show="showNewTrophy" :trophy="newTrophyData" :withConfetti="trophyPopupWithConfetti" @update:show="showNewTrophy = $event" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAchievements } from '../../composables/useAchievements'
import NewMedalPopup from './NewMedalPopup.vue'
import NewTrophyPopup from './NewTrophyPopup.vue'
import CyberMedal from '../ui/CyberMedal.vue'
import CyberTrophy from '../ui/CyberTrophy.vue'

const { userStats, fetchUserStats, allMedals, allPiala } = useAchievements()

const showNewMedal = ref(false)
const newMedalData = ref(null)

const showNewTrophy = ref(false)
const newTrophyData = ref(null)
const trophyPopupWithConfetti = ref(false)

const activePageTab = ref('medali')

const TIER_COLORS = {
  1: '#FF8C42', 2: '#00FF66', 3: '#00F0FF', 4: '#B026FF', 5: '#FFD700',
  6: '#FF003C', 7: '#E2E8F0', 8: '#A855F7', 9: '#00FFFF', 10: '#FFD700'
}
const getTrophyColor = (tier) => TIER_COLORS[tier] || '#FFD700'

onMounted(async () => {
  if (!userStats.value.completed_exercises) {
    await fetchUserStats()
  }
  checkNewMedals()
  if (activePageTab.value === 'piala') {
    checkNewTrophies()
  }
})

watch(() => userStats.value, () => {
  checkNewMedals()
  if (activePageTab.value === 'piala') {
    checkNewTrophies()
  }
}, { deep: true })

watch(() => allPiala.value, () => {
  if (activePageTab.value === 'piala') {
    checkNewTrophies()
  }
}, { deep: true })

watch(activePageTab, (tab) => {
  if (tab === 'piala') {
    checkNewTrophies()
  } else if (tab === 'medali') {
    checkNewMedals()
  }
})

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

const checkNewTrophies = () => {
  if (!allPiala.value || allPiala.value.length === 0) return
  
  const earnedTrophies = allPiala.value.filter(p => p.earned)
  if (earnedTrophies.length === 0) return

  const seenTrophies = JSON.parse(localStorage.getItem('seen_trophies') || '[]')
  const newlyEarned = []

  earnedTrophies.forEach(p => {
    const key = p.uniqueKey || p.id
    if (!seenTrophies.includes(key)) {
      newlyEarned.push(p)
      seenTrophies.push(key)
    }
  })

  localStorage.setItem('seen_trophies', JSON.stringify(seenTrophies))

  if (newlyEarned.length > 0) {
    newTrophyData.value = newlyEarned[0]
    trophyPopupWithConfetti.value = true // Otomatis saat dapat piala -> ada confetti!
    showNewTrophy.value = true
  }
}

const openMedalPopup = (medal) => {
  newMedalData.value = medal
  showNewMedal.value = true
}

const openTrophyPopup = (piala) => {
  newTrophyData.value = piala
  trophyPopupWithConfetti.value = false // Manual klik piala -> TIDAK ADA CONFETTI!
  showNewTrophy.value = true
}

const activeCategory = ref('all')

const categories = computed(() => {
  const medals = allMedals.value
  return [
    { id: 'all', label: 'Semua', earned: medals.filter(m => m.earned).length, total: medals.length },
    { id: 'dasar-pemrograman', label: 'Dasar Pemrograman', earned: medals.filter(m => m.category === 'dasar-pemrograman' && m.earned).length, total: medals.filter(m => m.category === 'dasar-pemrograman').length },
    { id: 'frontend-web', label: 'Frontend Web', earned: medals.filter(m => m.category === 'frontend-web' && m.earned).length, total: medals.filter(m => m.category === 'frontend-web').length },
    { id: 'database-sql', label: 'Database & SQL', earned: medals.filter(m => m.category === 'database-sql' && m.earned).length, total: medals.filter(m => m.category === 'database-sql').length },
    { id: 'javascript-pemula', label: 'JavaScript Pemula', earned: medals.filter(m => m.category === 'javascript-pemula' && m.earned).length, total: medals.filter(m => m.category === 'javascript-pemula').length },
    { id: 'backend-development', label: 'Backend Dev', earned: medals.filter(m => m.category === 'backend-development' && m.earned).length, total: medals.filter(m => m.category === 'backend-development').length },
    { id: 'streak', label: 'Streak', earned: medals.filter(m => m.category === 'streak' && m.earned).length, total: medals.filter(m => m.category === 'streak').length },
    { id: 'level', label: 'Level', earned: medals.filter(m => m.category === 'level' && m.earned).length, total: medals.filter(m => m.category === 'level').length },
    { id: 'pertemanan', label: 'Pertemanan', earned: medals.filter(m => m.category === 'pertemanan' && m.earned).length, total: medals.filter(m => m.category === 'pertemanan').length }
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
