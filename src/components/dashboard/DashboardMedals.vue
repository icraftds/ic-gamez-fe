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

<style scoped>
.dash-medals h2 { font-size: 1.6rem; margin-bottom: 5px; }
.subtitle { color: #94a3b8; margin-bottom: 25px; }

.medal-tabs { display: flex; gap: 10px; margin-bottom: 25px; flex-wrap: wrap; }
.medal-tab {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  background: transparent;
  color: #94a3b8;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.medal-tab.active { background: #22d3ee; color: #0f0a1e; border-color: #22d3ee; }
.medal-tab:hover:not(.active) { background: rgba(255,255,255,0.05); }
.tab-count { font-size: 0.8rem; opacity: 0.7; margin-left: 4px; }

.section-card {
  background: rgba(15, 10, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  transform-style: preserve-3d;
}

.section-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-5px);
  box-shadow: -10px 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.3);
}
.section-card h3 { font-size: 1.2rem; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
.sub-desc { color: #64748b; font-size: 0.9rem; margin-top: -15px; margin-bottom: 25px; }

.medal-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.medal-section-header h3 { margin-bottom: 0; }
.medal-count { color: #64748b; font-size: 0.85rem; }

.medals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 20px; }
.medal-item {
  text-align: center;
  padding: 20px 15px;
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.02);
  transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
  transform-style: preserve-3d;
}
.medal-item:hover {
  transform: perspective(1000px) rotateX(5deg) rotateY(-5deg) translateY(-5px);
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.1);
  box-shadow: -5px 10px 20px rgba(0,0,0,0.5);
}
.medal-item.locked { opacity: 0.5; }
.medal-icon-wrapper { position: relative; display: inline-block; margin-bottom: 12px; }
.medal-icon { font-size: 3rem; color: #475569; }
.medal-item:not(.locked) .medal-icon { color: #f59e0b; }
.medal-target-badge {
  position: absolute;
  bottom: -5px;
  right: -10px;
  background: rgba(0,0,0,0.7);
  color: #94a3b8;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}
.medal-item h4 { font-size: 0.9rem; margin: 0 0 5px 0; }
.medal-progress { color: #64748b; font-size: 0.8rem; margin: 0 0 8px 0; }
.medal-desc { color: #475569; font-size: 0.75rem; margin: 0; line-height: 1.3; }

.cert-empty { text-align: center; padding: 40px; color: #94a3b8; }
.sub-text { color: #64748b; font-size: 0.85rem; }
.btn-accent {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 24px;
  background: #f59e0b;
  color: #0f0a1e;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
}
</style>
