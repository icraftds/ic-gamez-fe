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
          @click="isExpert ? openCheatsheet(item) : openLockedTeaser(item)"
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

          <!-- Card Action Button -->
          <div class="card-footer">
            <button
              v-if="isExpert"
              class="btn-open-cheat"
              @click.stop="openCheatsheet(item)"
            >
              <span>Buka Cheatsheet</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button
              v-else
              class="btn-locked-cheat"
              @click.stop="openLockedTeaser(item)"
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

    <!-- 5. In-App Cheatsheet Reader Modal -->
    <div v-if="activeCheatsheet && isExpert" class="cheat-modal-overlay" @click.self="closeReader">
      <div class="cheat-modal-container">
        <div class="cheat-modal-header">
          <div class="modal-header-left">
            <span class="modal-header-badge"><i class="fa-solid fa-crown"></i> Expert Vault</span>
            <div class="modal-title-wrap">
              <h2 class="modal-header-title">{{ activeCheatsheet.title }}</h2>
              <span class="modal-category-sub">{{ activeCheatsheet.categoryLabel }} • {{ activeCheatsheet.questions }} Soal Latihan</span>
            </div>
          </div>
          <div class="modal-header-actions">
            <a
              :href="`/cheatsheet/${activeCheatsheet.file}`"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-modal-action"
              title="Buka Halaman Penuh di Tab Baru"
            >
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
              <span>Tab Penuh</span>
            </a>
            <button class="btn-modal-close" @click="closeReader" title="Tutup Modal (Esc)">
              <i class="fa-solid fa-xmark"></i>
              <span>Tutup</span>
            </button>
          </div>
        </div>
        <div class="cheat-modal-body">
          <iframe
            :src="`/cheatsheet/${activeCheatsheet.file}`"
            class="cheat-modal-iframe"
            title="Cheatsheet Viewer"
          ></iframe>
        </div>
      </div>
    </div>

    <!-- 6. Teaser / Upgrade Modal (Saat non-expert klik kartu) -->
    <div v-if="teaserItem" class="cheat-modal-overlay" @click.self="teaserItem = null">
      <div class="cheat-modal-container teaser-modal">
        <div class="teaser-icon">
          <i class="fa-solid fa-crown"></i>
        </div>
        <h2 class="teaser-title">
          {{ teaserItem.title }}
        </h2>
        <p class="teaser-desc">
          Modul ini dilengkapi dengan rangkuman formula praktis dan <strong>{{ teaserItem.questions }} latihan soal teknis</strong> berpenjelasan lengkap. Dapatkan akses penuh ke seluruh 24 cheatsheet industri dengan berlangganan akun <strong>Expert Plan</strong>.
        </p>
        <div class="teaser-actions">
          <button class="btn-upgrade-vault" @click="goToUpgrade">
            <i class="fa-solid fa-bolt"></i> Upgrade ke Expert Plan
          </button>
          <button class="btn-outline-plans" @click="teaserItem = null">
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAccount } from '../composables/useUserAccount'
import SimpleBackground from '../components/common/SimpleBackground.vue'

const router = useRouter()
const { isLoggedIn, currentPlan } = useUserAccount()

// Cek apakah akun adalah Expert
const isExpert = computed(() => {
  return isLoggedIn.value && currentPlan.value === 'expert'
})

const searchQuery = ref('')
const selectedCategory = ref('all')
const activeCheatsheet = ref(null)
const teaserItem = ref(null)

const categories = [
  { id: 'all', label: 'Semua Modul' },
  { id: 'data', label: '📊 Data & Bisnis' },
  { id: 'dev', label: '💻 Developer & DevOps' },
  { id: 'sys', label: '⚙️ Sistem & Keamanan' },
  { id: 'ai', label: '🚀 Desain & AI' },
]

// Metadata 24 Modul Cheatsheet
const cheatsheets = [
  // 1. Data & Bisnis
  {
    slug: 'excel',
    title: 'Microsoft Excel',
    desc: '70+ rumus (SUM, XLOOKUP, INDEX MATCH, SUMIFS), 9 Data Tools, Pivot Table, dan shortcuts Win/Mac.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-file-excel',
    highlight: '70+ Rumus & Data Tools',
    questions: 22,
    file: 'excel.html'
  },
  {
    slug: 'googlesheets',
    title: 'Google Sheets & Apps Script',
    desc: 'Formula =QUERY(), =IMPORTRANGE(), =ARRAYFORMULA(), serta dasar otomasi Google Apps Script.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-table',
    highlight: 'QUERY & Otomasi Script',
    questions: 12,
    file: 'googlesheets.html'
  },
  {
    slug: 'sql',
    title: 'SQL & Database Querying',
    desc: 'SELECT, Visual JOINs, GROUP BY, Window Functions, CTE (WITH clause), dan indeks optimasi query.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-database',
    highlight: 'JOINs, CTE & Window Fn',
    questions: 15,
    file: 'sql.html'
  },
  {
    slug: 'powerbi',
    title: 'Power BI & DAX Functions',
    desc: 'Formula DAX CALCULATE(), FILTER(), RELATED(), Time Intelligence, Star Schema, dan visualisasi interaktif.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-chart-column',
    highlight: 'DAX, Star Schema & KPI',
    questions: 12,
    file: 'powerbi.html'
  },
  {
    slug: 'accounting',
    title: 'Akuntansi & Laporan Keuangan',
    desc: 'Persamaan dasar akuntansi, debit/kredit, jurnal penyesuaian, laporan laba rugi, neraca, dan arus kas.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-calculator',
    highlight: 'Jurnal, Laba Rugi & Neraca',
    questions: 12,
    file: 'accounting.html'
  },
  {
    slug: 'hr-payroll',
    title: 'HR & Penggajian (Payroll)',
    desc: 'Siklus rekrutmen, perhitungan PPh 21 tarif TER, BPJS Ketenagakerjaan/Kesehatan, dan pesangon UU Ciptaker.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-users-gear',
    highlight: 'PPh 21 TER & BPJS',
    questions: 12,
    file: 'hr-payroll.html'
  },
  {
    slug: 'supply-chain',
    title: 'Supply Chain & Logistik',
    desc: 'Metode EOQ, Reorder Point (ROP), Safety Stock, Incoterms 2020 (FOB, CIF, DDP), dan manajemen gudang.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-truck-fast',
    highlight: 'EOQ, ROP & Incoterms 2020',
    questions: 12,
    file: 'supply-chain.html'
  },
  {
    slug: 'regex',
    title: 'Regular Expression (RegEx)',
    desc: 'Karakter khusus, cuantifier, capturing groups, lookaround assertions (lookahead/lookbehind), dan flags.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-code',
    highlight: 'Lookaround & Grouping',
    questions: 12,
    file: 'regex.html'
  },

  // 2. Developer & DevOps
  {
    slug: 'typescript',
    title: 'TypeScript Modern',
    desc: 'Generics, Utility Types (Partial, Omit, Pick, Record), type guards, keyof/typeof, dan tsconfig practices.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-solid fa-code',
    highlight: 'Generics & Utility Types',
    questions: 12,
    file: 'typescript.html'
  },
  {
    slug: 'javascript',
    title: 'JavaScript ES6+ & Async',
    desc: 'Array methods (map, filter, reduce), destructuring, closures, Event Loop, Promise chaining, dan async/await.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-brands fa-js',
    highlight: 'Async/Await & Event Loop',
    questions: 12,
    file: 'javascript.html'
  },
  {
    slug: 'git',
    title: 'Git & Version Control',
    desc: 'Branching strategy, merge vs rebase, stashing, cherry-pick, conventional commits, dan undo mistakes.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-brands fa-git-alt',
    highlight: 'Rebase, Merge & Stash',
    questions: 15,
    file: 'git.html'
  },
  {
    slug: 'docker',
    title: 'Docker & Containerization',
    desc: 'Lifecycle container, multi-stage Dockerfile, docker-compose, networking, persistent volume, dan security.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-brands fa-docker',
    highlight: 'Multi-stage & Compose',
    questions: 12,
    file: 'docker.html'
  },
  {
    slug: 'kubernetes',
    title: 'Kubernetes (K8s)',
    desc: 'Arsitektur control plane/worker node, Pod, Deployment, Service (ClusterIP/NodePort), Ingress, dan ConfigMap.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-solid fa-dharmachakra',
    highlight: 'Pods, Probes & CLI',
    questions: 12,
    file: 'kubernetes.html'
  },
  {
    slug: 'http-api',
    title: 'HTTP Status & RESTful API',
    desc: 'Matriks status code (401 vs 403, 502), method PUT vs PATCH, header idempotency, CORS, dan OAuth 2.0 flow.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-solid fa-network-wired',
    highlight: 'Status Code & CORS',
    questions: 12,
    file: 'http-api.html'
  },
  {
    slug: 'postman',
    title: 'Postman & API Testing',
    desc: 'Assertions pm.test, environment/collection variables, script pre-request, automated runner, dan mock server.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-solid fa-paper-plane',
    highlight: 'pm.test & Token Chaining',
    questions: 12,
    file: 'postman.html'
  },
  {
    slug: 'html-css',
    title: 'HTML5 & Modern CSS Layout',
    desc: 'Elemen semantik, box-sizing, teknik centering Flexbox, 12-kolom CSS Grid, clamp() responsive, dan animasi.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-brands fa-html5',
    highlight: 'Grid, Flexbox & Clamp',
    questions: 12,
    file: 'html-css.html'
  },

  // 3. Sistem & Keamanan
  {
    slug: 'linux',
    title: 'Linux CLI & Administration',
    desc: 'Navigasi bash, manipulasi file, permission chmod/chown, pipeline grep/awk/sed, systemctl, dan disk monitoring.',
    category: 'sys',
    categoryLabel: 'Sistem & Keamanan',
    icon: 'fa-brands fa-linux',
    highlight: 'Piping, Chmod & Systemd',
    questions: 15,
    file: 'linux.html'
  },
  {
    slug: 'networking',
    title: 'Computer Networking & TCP/IP',
    desc: 'Model 7 lapis OSI, TCP 3-way handshake vs UDP, subnetting IPv4/CIDR, DNS resolution, dan TLS 1.3 handshake.',
    category: 'sys',
    categoryLabel: 'Sistem & Keamanan',
    icon: 'fa-solid fa-server',
    highlight: 'OSI Layer, Subnet & Handshake',
    questions: 12,
    file: 'networking.html'
  },
  {
    slug: 'security',
    title: 'Keamanan Web & OWASP Top 10',
    desc: 'Mitigasi SQL Injection, XSS (CSP header), CSRF token, hashing bcrypt/argon2, Rate Limiting, dan JWT security.',
    category: 'sys',
    categoryLabel: 'Sistem & Keamanan',
    icon: 'fa-solid fa-shield-halved',
    highlight: 'SQLi, XSS, CSRF & JWT',
    questions: 12,
    file: 'security.html'
  },
  {
    slug: 'python',
    title: 'Python for Engineering & Data',
    desc: 'List comprehensions, generator yield, decorator @, context manager with, penanganan exception, dan OOP.',
    category: 'sys',
    categoryLabel: 'Sistem & Keamanan',
    icon: 'fa-brands fa-python',
    highlight: 'Decorators, Yield & OOP',
    questions: 15,
    file: 'python.html'
  },

  // 4. Desain & AI
  {
    slug: 'figma',
    title: 'Figma & UI/UX Design System',
    desc: 'Auto Layout (Hug vs Fill), component sets & variants, spacing 8pt grid, dan 10 prinsip heuristik Jakob Nielsen.',
    category: 'ai',
    categoryLabel: 'Desain & AI',
    icon: 'fa-brands fa-figma',
    highlight: 'Auto Layout & 8pt Grid',
    questions: 12,
    file: 'figma.html'
  },
  {
    slug: 'prompting',
    title: 'Prompt Engineering & Generative AI',
    desc: 'Framework RTCE, teknik Few-Shot, Chain-of-Thought (CoT), output JSON terstruktur, dan strategi anti-halusinasi.',
    category: 'ai',
    categoryLabel: 'Desain & AI',
    icon: 'fa-solid fa-robot',
    highlight: 'RTCE, CoT & JSON Output',
    questions: 12,
    file: 'prompting.html'
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing & SEO Metrics',
    desc: 'Formula kalkulasi ROAS, CAC, target rasio LTV 3:1, CTR, CPM, tag canonical, schema markup, dan Core Web Vitals.',
    category: 'ai',
    categoryLabel: 'Desain & AI',
    icon: 'fa-solid fa-bullhorn',
    highlight: 'ROAS, CAC & Core Web Vitals',
    questions: 12,
    file: 'digital-marketing.html'
  },
  {
    slug: 'markdown',
    title: 'Markdown & GitHub Flavored (GFM)',
    desc: 'Heading, alignment tabel, task list checkbox, GitHub alerts blockquote, diagram Mermaid, dan rumus KaTeX math.',
    category: 'ai',
    categoryLabel: 'Desain & AI',
    icon: 'fa-brands fa-markdown',
    highlight: 'Mermaid, KaTeX & Alerts',
    questions: 10,
    file: 'markdown.html'
  }
]

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

const openCheatsheet = (item) => {
  activeCheatsheet.value = item
}

const closeReader = () => {
  activeCheatsheet.value = null
}

const openLockedTeaser = (item) => {
  teaserItem.value = item
}

const goToUpgrade = () => {
  teaserItem.value = null
  router.push({
    name: 'checkout',
    query: {
      plan: 'Expert',
      price: 99000,
      slug: 'expert'
    }
  })
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    if (activeCheatsheet.value) closeReader()
    if (teaserItem.value) teaserItem.value = null
  }
}

watch(activeCheatsheet, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<style scoped src="../assets/css/views/CheatsheetView.css"></style>
