<template>
  <div class="cheatsheet-view">
    <SimpleBackground />

    <div class="cheatsheet-container">
      <!-- 0. Mode Switcher: Ensiklopedia vs Cheatsheet Vault -->
      <div class="cheatsheet-mode-switcher">
        <router-link to="/encyclopedia" class="mode-tab">
          <i class="fa-solid fa-book-atlas"></i>
          <span>Ensiklopedia Teori</span>
        </router-link>
        <button class="mode-tab active vault-tab">
          <i class="fa-solid fa-crown"></i>
          <span>Cheatsheet Vault (Expert)</span>
        </button>
      </div>

      <!-- 1. Header Vault Section -->
      <header class="vault-header">
        <div class="vault-badge-pill">
          <i class="fa-solid fa-crown"></i>
          <span>Expert Vault • Benefit Eksklusif</span>
        </div>
        <h1 class="vault-title">Career Technical Cheatsheet & Test Guide</h1>
        <p class="vault-desc">
          Panduan komprehensif formula teknis industri, kumpulan referensi cepat, dan 300+ simulasi soal tes kerja interaktif untuk mengasah kompetensi profesional.
        </p>
      </header>

      <!-- 2. Paywall Banner (Tampil jika BUKAN Expert) -->
      <div v-if="!isExpert" class="vault-paywall-banner">
        <div class="paywall-info">
          <div class="paywall-icon-wrap">
            <i class="fa-solid fa-lock"></i>
          </div>
          <div class="paywall-text">
            <h3>Koleksi Khusus Akun Expert Plan</h3>
            <p>
              Tingkatkan progres belajarmu dengan akses tanpa batas ke 24 Cheatsheet interaktif & bank soal teknis karir.
            </p>
          </div>
        </div>
        <div class="paywall-actions">
          <button class="btn-upgrade-vault" @click="goToUpgrade">
            <i class="fa-solid fa-bolt"></i>
            <span>Upgrade ke Expert Plan</span>
          </button>
          <router-link to="/pricing" class="btn-outline-plans">
            Lihat Paket
          </router-link>
        </div>
      </div>

      <!-- 2B. Unlocked Status Banner (Tampil jika SUDAH Expert) -->
      <div v-else class="vault-unlocked-banner">
        <div class="unlocked-info">
          <i class="fa-solid fa-circle-check"></i>
          <span>Status Akun: Expert Plan Aktif • Akses Seluruh Vault Terbuka Penuh</span>
        </div>
        <div class="unlocked-stats">
          <span><i class="fa-solid fa-book-bookmark"></i> 24 Modul</span>
          <span class="stat-divider">•</span>
          <span><i class="fa-solid fa-list-check"></i> 305+ Soal Latihan</span>
        </div>
      </div>

      <!-- 3. Filter Categories & Search Bar -->
      <div class="vault-controls-bar">
        <div class="vault-category-tabs">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="tab-btn"
            :class="{ active: selectedCategory === cat.id }"
            @click="selectedCategory = cat.id"
          >
            <span>{{ cat.label }}</span>
            <span class="tab-count">{{ getCategoryCount(cat.id) }}</span>
          </button>
        </div>

        <div class="vault-search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari cheatsheet, topik, rumus..."
          />
          <button
            v-if="searchQuery"
            type="button"
            class="clear-search-btn"
            @click="searchQuery = ''"
            title="Bersihkan pencarian"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- 4. Cheatsheet Cards Grid -->
      <div v-if="filteredCheatsheets.length > 0" class="cheatsheet-grid">
        <div
          v-for="item in filteredCheatsheets"
          :key="item.slug"
          class="cheat-card"
          :class="{ locked: !isExpert }"
          @click="goToCheatsheet(item.slug)"
        >
          <!-- Top Row: Category Label & Status Badge -->
          <div class="card-top">
            <span class="card-category-badge">{{ item.categoryLabel }}</span>
            <span v-if="!isExpert" class="card-status-badge locked">
              <i class="fa-solid fa-lock"></i> Expert Only
            </span>
            <span v-else class="card-status-badge unlocked">
              <i class="fa-solid fa-unlock"></i> Terbuka
            </span>
          </div>

          <!-- Main Body: Icon + Title + Desc -->
          <div class="card-body">
            <div class="cheat-icon" :class="item.category">
              <i :class="item.icon"></i>
            </div>
            <div class="cheat-content">
              <h3 class="cheat-title">{{ item.title }}</h3>
              <p class="cheat-desc">{{ item.desc }}</p>
            </div>
          </div>

          <!-- Meta Row: Questions + Highlights -->
          <div class="card-meta-row">
            <span class="meta-chip questions">
              <i class="fa-solid fa-clipboard-question"></i> {{ item.questions }} Soal
            </span>
            <span class="meta-chip highlight">
              <i class="fa-solid fa-bolt"></i> {{ item.highlight }}
            </span>
          </div>

          <!-- Card Action Button (Fullpage Navigation) -->
          <div class="card-footer">
            <button
              v-if="isExpert"
              class="btn-open-cheat"
              @click.stop="goToCheatsheet(item.slug)"
            >
              <span>Buka Cheatsheet</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button
              v-else
              class="btn-locked-cheat"
              @click.stop="goToCheatsheet(item.slug)"
            >
              <i class="fa-solid fa-lock"></i>
              <span>Buka Akses (Expert)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 4B. Empty State -->
      <div v-else class="empty-cheatsheet-state">
        <i class="fa-solid fa-file-circle-question"></i>
        <h3>Tidak Ada Cheatsheet Ditemukan</h3>
        <p>Pencarian untuk "<strong>{{ searchQuery }}</strong>" tidak menghasilkan modul apapun.</p>
        <button class="btn-reset-filter" @click="searchQuery = ''; selectedCategory = 'all'">
          Tampilkan Semua Modul
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAccount } from '../composables/useUserAccount'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import { categories, cheatsheets } from '../data/cheatsheets'

const router = useRouter()
const { isLoggedIn, currentPlan } = useUserAccount()

// Cek apakah akun adalah Expert
const isExpert = computed(() => {
  return isLoggedIn.value && currentPlan.value === 'expert'
})

const searchQuery = ref('')
const selectedCategory = ref('all')

const getCategoryCount = (catId) => {
  if (catId === 'all') return cheatsheets.length
  return cheatsheets.filter(c => c.category === catId).length
}

const filteredCheatsheets = computed(() => {
  return cheatsheets.filter(item => {
    const matchesCat = selectedCategory.value === 'all' || item.category === selectedCategory.value
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchesCat

    const matchesQuery = item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.highlight.toLowerCase().includes(q)
    return matchesCat && matchesQuery
  })
})

const goToCheatsheet = (slug) => {
  router.push(`/cheatsheet/${slug}`)
}

const goToUpgrade = () => {
  router.push({
    name: 'checkout',
    query: {
      plan: 'Expert',
      price: 99000,
      slug: 'expert'
    }
  })
}
</script>

<style scoped src="../assets/css/views/CheatsheetView.css"></style>
