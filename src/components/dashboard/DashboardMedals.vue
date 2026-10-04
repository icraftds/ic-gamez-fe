<template>
  <div class="dash-medals">
    <h2>Medali & Sertifikat</h2>
    <p class="subtitle">Koleksi lencana dan sertifikat pencapaianmu – siap dipajang di LinkedIn.</p>

    <div class="medals-container">
      <!-- Category Sidebar -->
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
            :class="{ 'is-locked': !medal.earned, 'is-earned': medal.earned }"
          >
            <div class="badge-icon-container">
              <div class="badge-glow" v-if="medal.earned"></div>
              <div class="badge-hexagon">
                <img :src="medal.image" :alt="medal.name" class="badge-image" />
                <img src="/images/icoinz.svg" class="ic-badge-emblem" alt="iC Badge" />
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

    <NewMedalPopup :show="showNewMedal" :medal="newMedalData" @update:show="showNewMedal = $event" />

    <!-- Sertifikat -->
    <div class="certificate-section">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserAccount } from '../../composables/useUserAccount'
import NewMedalPopup from './NewMedalPopup.vue'

const { userProfile, userStats, fetchUserStats } = useUserAccount()

const showNewMedal = ref(false)
const newMedalData = ref(null)

onMounted(async () => {
  // If stats aren't loaded yet or missing data, fetch them
  if (!userStats.value.completed_exercises) {
    await fetchUserStats()
  }
  checkNewMedals()
})

watch(() => userStats.value, () => {
  checkNewMedals()
}, { deep: true })

const checkNewMedals = () => {
  if (!userStats.value.completed_exercises) return; // Belum ter-load
  
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

const activeCategory = ref('all')

// Safe getters for user progress
const getSqlCount = () => {
  // Can be based on SQL path completion or events. Let's use completed_exercises for paths + daily events
  const paths = userStats.value?.completed_exercises?.breakdown?.sql || 0
  const daily = userStats.value?.events?.daily || 0
  return paths + daily
}
const getFrontendCount = () => userStats.value?.completed_exercises?.breakdown?.frontend || 0
const getStreak = () => userProfile.value?.longest_streak || 0
const getLevel = () => userProfile.value?.level || 1

const allMedals = computed(() => {
  const sqlCount = getSqlCount()
  const feCount = getFrontendCount()
  const streakCount = getStreak()
  const lvlCount = getLevel()

  return [
    { id: 'm1', category: 'sql', name: 'Halo, SELECT!', image: '/images/medals/bronze.jpg', description: 'Challenge SQL pertamamu beres! Query pertama emang paling...', target: 1, current: Math.min(sqlCount, 1), earned: sqlCount >= 1 },
    { id: 'm2', category: 'sql', name: 'Lagi Anget-Angetnya', image: '/images/medals/bronze.jpg', description: '5 challenge kelar. Jarimu mulai hafal WHERE tanpa mikir.', target: 5, current: Math.min(sqlCount, 5), earned: sqlCount >= 5 },
    { id: 'm3', category: 'sql', name: 'Mulai Ketagihan Ngulik', image: '/images/medals/silver.jpg', description: '10 challenge SQL! Udah mulai nagih kan?', target: 10, current: Math.min(sqlCount, 10), earned: sqlCount >= 10 },
    { id: 'm4', category: 'sql', name: 'Pendekar Query', image: '/images/medals/gold.jpg', description: '25 challenge kamu libas. JOIN sama GROUP BY udah jago.', target: 25, current: Math.min(sqlCount, 25), earned: sqlCount >= 25 },
    { id: 'm5', category: 'sql', name: 'Suhu SQL', image: '/images/medals/diamond.jpg', description: '50 challenge! Level analis beneran nih.', target: 50, current: Math.min(sqlCount, 50), earned: sqlCount >= 50 },
    { id: 'm6', category: 'sql', name: 'Legenda Ngulik SQL', image: '/images/medals/diamond.jpg', description: '100 challenge SQL tamat. Kamu resmi legenda.', target: 100, current: Math.min(sqlCount, 100), earned: sqlCount >= 100 },
    { id: 'm7', category: 'frontend', name: 'Hello, World!', image: '/images/medals/bronze.jpg', description: 'Buat halaman HTML pertamamu. Langkah pertama selalu spesial.', target: 1, current: Math.min(feCount, 1), earned: feCount >= 1 },
    { id: 'm8', category: 'frontend', name: 'CSS Wizard', image: '/images/medals/silver.jpg', description: 'Selesaikan 5 tantangan CSS. Layoutmu mulai rapih!', target: 5, current: Math.min(feCount, 5), earned: feCount >= 5 },
    { id: 'm9', category: 'streak', name: 'Konsisten 7 Hari', image: '/images/medals/silver.jpg', description: 'Belajar 7 hari berturut-turut. Disiplin adalah kuncinya!', target: 7, current: Math.min(streakCount, 7), earned: streakCount >= 7 },
    { id: 'm10', category: 'streak', name: 'Maraton 30 Hari', image: '/images/medals/gold.jpg', description: 'Streak 30 hari tanpa putus. Kamu luar biasa!', target: 30, current: Math.min(streakCount, 30), earned: streakCount >= 30 },
    { id: 'm11', category: 'level', name: 'Naik Level 5', image: '/images/medals/bronze.jpg', description: 'Mencapai Level 5. Perjalananmu baru dimulai!', target: 5, current: Math.min(lvlCount, 5), earned: lvlCount >= 5 },
    { id: 'm12', category: 'level', name: 'Level 25 Master', image: '/images/medals/gold.jpg', description: 'Level 25! Kamu sudah jadi master.', target: 25, current: Math.min(lvlCount, 25), earned: lvlCount >= 25 },
  ]
})

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
  let medals = allMedals.value
  if (activeCategory.value !== 'all') {
    medals = medals.filter(m => m.category === activeCategory.value)
  }
  return [...medals].sort((a, b) => {
    if (a.earned === b.earned) return 0
    return a.earned ? -1 : 1
  })
})
</script>

<style scoped src="../../assets/css/components/dashboard/DashboardMedals.css"></style>
