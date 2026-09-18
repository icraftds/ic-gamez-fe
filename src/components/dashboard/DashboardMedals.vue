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
                <i :class="medal.icon" class="b-icon"></i>
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
import { ref, computed } from 'vue'

const activeCategory = ref('all')

const categories = [
  { id: 'all', label: 'Semua', earned: 0, total: 15 },
  { id: 'sql', label: 'SQL', earned: 0, total: 6 },
  { id: 'frontend', label: 'Frontend', earned: 0, total: 4 },
  { id: 'streak', label: 'Streak', earned: 0, total: 3 },
  { id: 'level', label: 'Level', earned: 0, total: 2 }
]

const allMedals = [
  { id: 'm1', category: 'sql', name: 'Halo, SELECT!', icon: 'fa-solid fa-database', description: 'Challenge SQL pertamamu beres! Query pertama emang paling...', target: 1, current: 0, earned: false },
  { id: 'm2', category: 'sql', name: 'Lagi Anget-Angetnya', icon: 'fa-solid fa-fire', description: '5 challenge kelar. Jarimu mulai hafal WHERE tanpa mikir.', target: 5, current: 0, earned: false },
  { id: 'm3', category: 'sql', name: 'Mulai Ketagihan Ngulik', icon: 'fa-solid fa-magnifying-glass', description: '10 challenge SQL! Udah mulai nagih kan? Nggak apa-apa...', target: 10, current: 0, earned: false },
  { id: 'm4', category: 'sql', name: 'Pendekar Query', icon: 'fa-solid fa-shield-halved', description: '25 challenge kamu libas. JOIN sama GROUP BY udah nggak bikin kering...', target: 25, current: 0, earned: false },
  { id: 'm5', category: 'sql', name: 'Suhu SQL', icon: 'fa-solid fa-crown', description: '50 challenge! Level analis beneran nih — dan sertifikatnya udah nungg...', target: 50, current: 0, earned: false },
  { id: 'm6', category: 'sql', name: 'Legenda Ngulik SQL', icon: 'fa-solid fa-gem', description: '100 challenge SQL tamat. Kamu resmi legenda — dan iya, ini pantas...', target: 100, current: 0, earned: false },
  { id: 'm7', category: 'frontend', name: 'Hello, World!', icon: 'fa-brands fa-html5', description: 'Buat halaman HTML pertamamu. Langkah pertama selalu spesial.', target: 1, current: 0, earned: false },
  { id: 'm8', category: 'frontend', name: 'CSS Wizard', icon: 'fa-brands fa-css3-alt', description: 'Selesaikan 5 tantangan CSS. Layoutmu mulai rapih!', target: 5, current: 0, earned: false },
  { id: 'm9', category: 'streak', name: 'Konsisten 7 Hari', icon: 'fa-solid fa-calendar-check', description: 'Belajar 7 hari berturut-turut. Disiplin adalah kuncinya!', target: 7, current: 0, earned: false },
  { id: 'm10', category: 'streak', name: 'Maraton 30 Hari', icon: 'fa-solid fa-rocket', description: 'Streak 30 hari tanpa putus. Kamu luar biasa!', target: 30, current: 0, earned: false },
  { id: 'm11', category: 'level', name: 'Naik Level 5', icon: 'fa-solid fa-arrow-up', description: 'Mencapai Level 5. Perjalananmu baru dimulai!', target: 5, current: 0, earned: false },
  { id: 'm12', category: 'level', name: 'Level 25 Master', icon: 'fa-solid fa-star', description: 'Level 25! Kamu sudah jadi master.', target: 25, current: 0, earned: false },
]

const activeCategoryLabel = computed(() => {
  const cat = categories.find(c => c.id === activeCategory.value)
  return cat ? cat.label : ''
})
const activeCategoryEarned = computed(() => {
  const cat = categories.find(c => c.id === activeCategory.value)
  return cat ? cat.earned : 0
})
const activeCategoryTotal = computed(() => {
  const cat = categories.find(c => c.id === activeCategory.value)
  return cat ? cat.total : 0
})
const activeMedals = computed(() => {
  if (activeCategory.value === 'all') return allMedals
  return allMedals.filter(m => m.category === activeCategory.value)
})
</script>

<style scoped src="../../assets/css/components/dashboard/DashboardMedals.css"></style>
