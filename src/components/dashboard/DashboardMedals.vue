<template>
  <div class="dash-medals">
    <h2>Medali & Sertifikat</h2>
    <p class="subtitle">Koleksi lencana dan sertifikat pencapaianmu – siap dipajang di LinkedIn.</p>

    <!-- Category Tabs -->
    <div class="medal-tabs">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="medal-tab"
        :class="{ active: activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        {{ cat.label }} <span class="tab-count">{{ cat.earned }}/{{ cat.total }}</span>
      </button>
    </div>

    <!-- Badges Grid -->
    <div class="section-card">
      <div class="medal-section-header">
        <h3><i class="fa-solid fa-trophy"></i> Lencana {{ activeCategoryLabel }}</h3>
        <span class="medal-count">{{ activeCategoryEarned }} dari {{ activeCategoryTotal }} terkumpul</span>
      </div>

      <div class="medals-grid">
        <div
          v-for="medal in activeMedals"
          :key="medal.id"
          class="medal-item"
          :class="{ locked: !medal.earned }"
        >
          <div class="medal-icon-wrapper">
            <i :class="medal.icon" class="medal-icon"></i>
            <span v-if="medal.target" class="medal-target-badge">{{ medal.target }}</span>
          </div>
          <h4>{{ medal.name }}</h4>
          <p class="medal-progress" v-if="medal.target">{{ medal.current }}/{{ medal.target }}</p>
          <p class="medal-progress" v-else>{{ medal.earned ? 'Terkunci' : 'Terkunci' }}</p>
          <p class="medal-desc">{{ medal.description }}</p>
        </div>
      </div>
    </div>

    <!-- Sertifikat -->
    <div class="section-card">
      <h3><i class="fa-solid fa-certificate"></i> Sertifikat</h3>
      <p class="sub-desc">Siap di-download dan dipajang di LinkedIn.</p>

      <div class="cert-empty">
        <i class="fa-solid fa-scroll" style="font-size: 2.5rem; color: #475569; margin-bottom: 15px;"></i>
        <p><strong>Belum ada sertifikat di kategori ini</strong></p>
        <p class="sub-text">Sertifikat terbit otomatis begitu kamu menuntaskan satu kursus.</p>
        <router-link to="/learning" class="btn-accent">Mulai Kursus</router-link>
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
