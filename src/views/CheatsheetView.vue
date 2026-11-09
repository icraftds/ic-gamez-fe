<template>
  <div class="cheatsheet-view">
    <SimpleBackground />

    <div class="cheatsheet-container">
      <!-- 0. Top Navigation: Back to Alur Belajar -->
      <div class="cheatsheet-top-nav">
        <router-link to="/learning" class="back-link">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Kembali ke Alur Belajar</span>
        </router-link>
      </div>

      <!-- 1. Header Vault Section -->
      <header class="vault-header">
        <div class="vault-brand-header">
          <div class="vault-logo-wrap">
            <img src="/images/Logo iC GameZ darkmode.png" alt="iC Game-Z" class="brand-logo-img logo-dark" />
            <img src="/images/Logo iC GameZ Lightmode.png" alt="iC Game-Z" class="brand-logo-img logo-light" />
          </div>
          <h1 class="vault-title"><span class="gradient-text">Cheatsheet</span></h1>
        </div>
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
            <i v-if="cat.icon" :class="cat.icon" class="tab-icon"></i>
            <span class="tab-label">{{ cat.label }}</span>
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
              <h3 class="cheat-title" v-html="highlightText(item.title, trimmedQuery)"></h3>
              <p class="cheat-desc" v-html="highlightText(item.desc, trimmedQuery)"></p>
            </div>
          </div>

          <!-- Search Preview Snippet (Tampil saat kata kunci pencarian cocok dengan rumus / materi) -->
          <div v-if="trimmedQuery && item.matchedTopics?.length" class="card-search-preview">
            <div class="search-preview-header">
              <span class="preview-badge">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>{{ item.matchedTopics.length }} Materi / Rumus Cocok:</span>
              </span>
            </div>
            <div class="search-preview-list">
              <div
                v-for="(topic, tIdx) in item.matchedTopics.slice(0, 3)"
                :key="tIdx"
                class="preview-topic-item"
                :title="`Buka materi ${topic.name}`"
                @click.stop="goToCheatsheet(item.slug, topic.sectionId)"
              >
                <div class="topic-header-line">
                  <span class="topic-name" v-html="highlightText(topic.name, trimmedQuery)"></span>
                  <span v-if="topic.category" class="topic-category-tag">{{ topic.category }}</span>
                </div>
                <div v-if="topic.syntax" class="topic-syntax-box">
                  <code v-html="highlightText(topic.syntax, trimmedQuery)"></code>
                </div>
                <p v-if="topic.desc" class="topic-desc" v-html="highlightText(topic.desc, trimmedQuery)"></p>
              </div>
            </div>
            <div v-if="item.matchedTopics.length > 3" class="search-preview-more">
              +{{ item.matchedTopics.length - 3 }} materi / rumus lainnya cocok
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

      <!-- 4B. Empty State: Ada hasil di kategori lain -->
      <div v-else-if="searchResults.length > 0 && selectedCategory !== 'all'" class="empty-cheatsheet-state">
        <i class="fa-solid fa-layer-group"></i>
        <h3>Tidak Ada Modul di Kategori Ini</h3>
        <p>
          Kata kunci "<strong>{{ searchQuery }}</strong>" tidak ditemukan pada kategori terpilih, tetapi ditemukan
          <strong>{{ searchResults.length }} modul</strong> di kategori lainnya.
        </p>
        <button class="btn-reset-filter" @click="selectedCategory = 'all'">
          <i class="fa-solid fa-arrows-rotate"></i>
          <span>Tampilkan Semua Kategori ({{ searchResults.length }} Hasil)</span>
        </button>
      </div>

      <!-- 4C. Empty State: Tidak ada hasil sama sekali -->
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

const trimmedQuery = computed(() => searchQuery.value.trim())

// Helper sanitasi HTML dan highlight kata kunci pencarian
const escapeHtml = (str) => {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const highlightText = (text, query) => {
  if (!text) return ''
  const safeText = escapeHtml(text)
  const q = (query || '').trim()
  if (!q) return safeText

  const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return safeText.replace(regex, '<mark class="search-hl">$1</mark>')
}

// Deep search across titles, descriptions, and topics/formulas
const searchResults = computed(() => {
  const q = trimmedQuery.value.toLowerCase()
  if (!q) {
    return cheatsheets.map(item => ({
      ...item,
      matchedTopics: []
    }))
  }

  const terms = q.split(/\s+/).filter(Boolean)
  const scored = []

  for (const item of cheatsheets) {
    const titleLower = item.title.toLowerCase()
    const descLower = item.desc.toLowerCase()
    const highlightLower = item.highlight.toLowerCase()

    const matchedTopics = []
    if (item.topics && item.topics.length > 0) {
      for (const topic of item.topics) {
        const nameLower = (topic.name || '').toLowerCase()
        const syntaxLower = (topic.syntax || '').toLowerCase()
        const topicDescLower = (topic.desc || '').toLowerCase()
        const keywords = (topic.keywords || []).map(k => k.toLowerCase())

        const matchesTopic = nameLower.includes(q) ||
          syntaxLower.includes(q) ||
          topicDescLower.includes(q) ||
          keywords.some(k => k.includes(q)) ||
          terms.every(t =>
            nameLower.includes(t) ||
            syntaxLower.includes(t) ||
            topicDescLower.includes(t) ||
            keywords.some(k => k.includes(t))
          )

        if (matchesTopic) {
          let topicScore = 0
          if (nameLower === q) topicScore += 100
          else if (nameLower.startsWith(q)) topicScore += 70
          else if (nameLower.includes(q)) topicScore += 50
          else if (syntaxLower.includes(q)) topicScore += 30
          else if (topicDescLower.includes(q)) topicScore += 20
          else topicScore += 10

          matchedTopics.push({
            ...topic,
            _score: topicScore
          })
        }
      }

      matchedTopics.sort((a, b) => b._score - a._score)
    }

    const matchesCardMeta = titleLower.includes(q) ||
      descLower.includes(q) ||
      highlightLower.includes(q) ||
      terms.every(t => titleLower.includes(t) || descLower.includes(t) || highlightLower.includes(t))

    if (matchesCardMeta || matchedTopics.length > 0) {
      let cardScore = 0
      if (titleLower === q) cardScore += 200
      else if (titleLower.startsWith(q)) cardScore += 120
      else if (titleLower.includes(q)) cardScore += 80

      if (matchedTopics.length > 0) {
        cardScore += matchedTopics[0]._score + (matchedTopics.length * 10)
      }

      if (descLower.includes(q)) cardScore += 25
      if (highlightLower.includes(q)) cardScore += 20

      scored.push({
        item: {
          ...item,
          matchedTopics
        },
        score: cardScore
      })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.map(s => s.item)
})

const filteredCheatsheets = computed(() => {
  const list = searchResults.value
  if (selectedCategory.value === 'all') {
    return list
  }
  return list.filter(item => item.category === selectedCategory.value)
})

const getCategoryCount = (catId) => {
  const list = searchResults.value
  if (catId === 'all') return list.length
  return list.filter(c => c.category === catId).length
}

const goToCheatsheet = (slug, sectionId) => {
  if (sectionId) {
    router.push({ path: `/cheatsheet/${slug}`, hash: `#${sectionId}` })
  } else {
    router.push(`/cheatsheet/${slug}`)
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

<style scoped src="../assets/css/views/CheatsheetView.css"></style>
