<template>
  <div class="cheatsheet-reader-view">
    <!-- Top Fullpage Toolbar -->
    <header class="reader-toolbar">
      <div class="toolbar-left">
        <router-link to="/cheatsheet" class="btn-toolbar-back" title="Kembali ke Daftar Cheatsheet">
          <i class="fa-solid fa-arrow-left"></i>
          <span class="back-text">Kembali</span>
        </router-link>
        
        <div class="toolbar-divider hide-mobile"></div>

        <span class="toolbar-badge hide-tablet"><i class="fa-solid fa-crown"></i> Expert Vault</span>

        <h1 class="toolbar-title" v-if="currentModule" :title="currentModule.title">
          {{ currentModule.title }}
        </h1>
        
        <span class="toolbar-category-pill hide-tablet" v-if="currentModule">
          {{ currentModule.categoryLabel }}
        </span>
      </div>

      <div class="toolbar-center" v-if="currentModule && isExpert">
        <button 
          class="btn-nav-module" 
          :disabled="!prevModule" 
          @click="goToModule(prevModule)"
          :title="prevModule ? `Sebelumnya: ${prevModule.title}` : 'Sudah di modul pertama'"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <span class="module-counter-text hide-mobile">
          Modul {{ currentIndex + 1 }} dari {{ totalModules }}
        </span>

        <button 
          class="btn-nav-module" 
          :disabled="!nextModule" 
          @click="goToModule(nextModule)"
          :title="nextModule ? `Berikutnya: ${nextModule.title}` : 'Sudah di modul terakhir'"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <div class="toolbar-right" v-if="currentModule">
        <span class="questions-chip hide-mobile">
          <i class="fa-solid fa-clipboard-question"></i>
          <span>{{ currentModule.questions }} Soal</span>
        </span>

        <a 
          :href="`/cheatsheet/${currentModule.file}`" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn-external-tab"
          title="Buka Halaman Standalone Penuh di Tab Baru"
        >
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
          <span class="hide-mobile">Tab Baru</span>
        </a>
      </div>
    </header>

    <!-- Main Fullpage Body -->
    <main class="reader-main">
      <!-- 1. Akses Penuh untuk Expert -->
      <iframe
        v-if="isExpert && currentModule"
        :src="`/cheatsheet/${currentModule.file}`"
        class="fullpage-cheatsheet-frame"
        title="Cheatsheet Reader Fullpage"
      ></iframe>

      <!-- 2. Paywall Fullpage jika Bukan Akun Expert -->
      <div v-else-if="!isExpert && currentModule" class="fullpage-paywall-container">
        <div class="paywall-card-box">
          <div class="paywall-crown-icon">
            <i class="fa-solid fa-crown"></i>
          </div>
          <span class="paywall-badge">Koleksi Eksklusif Expert Plan</span>
          <h2 class="paywall-title">{{ currentModule.title }}</h2>
          <p class="paywall-desc">
            Modul ini mencakup formula teknis mendalam, panduan arsitektur industri, dan 
            <strong>{{ currentModule.questions }} simulasi latihan soal teknis</strong> berpenjelasan lengkap untuk persiapan tes kerja.
          </p>

          <div class="paywall-features-list">
            <div class="feature-item">
              <i class="fa-solid fa-circle-check"></i>
              <span>Akses tanpa batas ke 24 Cheatsheet Karir Full Page</span>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-circle-check"></i>
              <span>305+ Bank Soal Teknis Interaktif Berpenjelasan</span>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-circle-check"></i>
              <span>Hint AI Premium tanpa batas & Akses Seluruh Jalur Belajar</span>
            </div>
          </div>

          <div class="paywall-actions-row">
            <button class="btn-paywall-upgrade" @click="goToUpgrade">
              <i class="fa-solid fa-bolt"></i>
              <span>Upgrade ke Expert Plan</span>
            </button>
            <router-link to="/cheatsheet" class="btn-paywall-back">
              Kembali ke Daftar Cheatsheet
            </router-link>
          </div>
        </div>
      </div>

      <!-- 3. Module Not Found State -->
      <div v-else class="not-found-container">
        <i class="fa-solid fa-circle-exclamation"></i>
        <h2>Modul Cheatsheet Tidak Ditemukan</h2>
        <p>Modul yang Anda cari tidak tersedia atau URL tidak valid.</p>
        <router-link to="/cheatsheet" class="btn-paywall-back">
          Kembali ke Daftar Cheatsheet
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserAccount } from '../composables/useUserAccount'
import { cheatsheets, getCheatsheetBySlug } from '../data/cheatsheets'

const route = useRoute()
const router = useRouter()
const { isLoggedIn, currentPlan } = useUserAccount()

const isExpert = computed(() => {
  return isLoggedIn.value && currentPlan.value === 'expert'
})

const currentSlug = computed(() => route.params.slug)

const currentModule = computed(() => {
  return getCheatsheetBySlug(currentSlug.value) || cheatsheets[0]
})

const currentIndex = computed(() => {
  return cheatsheets.findIndex(c => c.slug === currentModule.value?.slug)
})

const totalModules = computed(() => cheatsheets.length)

const prevModule = computed(() => {
  if (currentIndex.value <= 0) return null
  return cheatsheets[currentIndex.value - 1]
})

const nextModule = computed(() => {
  if (currentIndex.value >= cheatsheets.length - 1) return null
  return cheatsheets[currentIndex.value + 1]
})

const goToModule = (mod) => {
  if (mod) {
    router.push(`/cheatsheet/${mod.slug}`)
  }
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

<style scoped>
.cheatsheet-reader-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #090e17;
  color: #f1f5f9;
  overflow: hidden;
  position: relative;
  z-index: 100;
}

/* Toolbar Header */
.reader-toolbar {
  height: 54px;
  background: #0b1120;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  gap: 12px;
  flex-shrink: 0;
  z-index: 10;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.btn-toolbar-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-toolbar-back:hover {
  background: rgba(56, 189, 248, 0.15);
  border-color: #38bdf8;
  color: #38bdf8;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.toolbar-badge {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #fbbf24;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.toolbar-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 380px;
}

.toolbar-category-pill {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.25);
  flex-shrink: 0;
}

/* Toolbar Center: Next & Prev */
.toolbar-center {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.btn-nav-module {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.btn-nav-module:hover:not(:disabled) {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.3);
}

.btn-nav-module:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.module-counter-text {
  font-size: 0.82rem;
  color: #94a3b8;
  font-weight: 500;
  white-space: nowrap;
}

/* Toolbar Right */
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.questions-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.25);
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
}

.btn-external-tab {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-external-tab:hover {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border-color: #38bdf8;
}

/* Main Content: Fullpage Frame */
.reader-main {
  flex: 1;
  width: 100%;
  min-height: 0;
  position: relative;
  background: #0b0f19;
  overflow: hidden;
}

.fullpage-cheatsheet-frame {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

/* Paywall Fullpage Container */
.fullpage-paywall-container,
.not-found-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at center, rgba(124, 58, 237, 0.08) 0%, rgba(9, 14, 23, 1) 70%);
  overflow-y: auto;
}

.paywall-card-box {
  max-width: 540px;
  width: 100%;
  background: rgba(15, 23, 42, 0.85);
  border: 1.5px solid rgba(245, 158, 11, 0.35);
  border-radius: 20px;
  padding: 36px 30px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
}

.paywall-crown-icon {
  font-size: 2.8rem;
  color: #fbbf24;
  margin-bottom: 14px;
}

.paywall-badge {
  display: inline-block;
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 4px 12px;
  border-radius: 99px;
  margin-bottom: 12px;
}

.paywall-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0 0 10px 0;
}

.paywall-desc {
  font-size: 0.92rem;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 22px 0;
}

.paywall-features-list {
  text-align: left;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: #e2e8f0;
}

.feature-item i {
  color: #10b981;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.paywall-actions-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-paywall-upgrade {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #090e17;
  font-weight: 800;
  font-size: 0.92rem;
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 18px rgba(245, 158, 11, 0.4);
}

.btn-paywall-upgrade:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(245, 158, 11, 0.55);
}

.btn-paywall-back {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 11px 20px;
  border-radius: 10px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.btn-paywall-back:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* Not Found */
.not-found-container {
  flex-direction: column;
  text-align: center;
  gap: 14px;
}

.not-found-container i {
  font-size: 3rem;
  color: #ef4444;
}

.not-found-container h2 {
  font-size: 1.5rem;
  color: #f8fafc;
  margin: 0;
}

.not-found-container p {
  color: #94a3b8;
  margin: 0 0 10px 0;
}

/* Responsive Breakpoints */
@media (max-width: 992px) {
  .hide-tablet {
    display: none !important;
  }

  .toolbar-title {
    max-width: 220px;
  }
}

@media (max-width: 768px) {
  .reader-toolbar {
    padding: 0 10px;
    height: 50px;
    gap: 8px;
  }

  .toolbar-left {
    gap: 8px;
  }

  .btn-toolbar-back {
    padding: 5px 10px;
    font-size: 0.8rem;
  }

  .toolbar-title {
    max-width: 160px;
    font-size: 0.95rem;
  }

  .hide-mobile {
    display: none !important;
  }

  .btn-nav-module {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }

  .btn-external-tab {
    padding: 6px 10px;
    font-size: 0.78rem;
  }

  .paywall-card-box {
    padding: 26px 20px;
  }

  .paywall-title {
    font-size: 1.35rem;
  }
}

@media (max-width: 480px) {
  .back-text {
    display: none;
  }

  .btn-toolbar-back {
    padding: 6px 9px;
  }

  .toolbar-title {
    max-width: 120px;
    font-size: 0.88rem;
  }
}
</style>

