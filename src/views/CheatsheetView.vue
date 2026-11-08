<template>
  <div class="cheatsheet-view">
    <SimpleBackground />

    <div class="cheatsheet-container">
      <!-- 1. Header Vault Section -->
      <header class="vault-header">
        <div class="vault-badge-pill">
          <i class="fa-solid fa-crown"></i>
          <span>Expert Vault • Benefit Eksklusif</span>
        </div>
        <h1 class="vault-title">Career Technical Cheatsheet & Test Guide</h1>
        <p class="vault-desc">
          24 modul panduan teknis industri, kumpulan formula praktis, dan 300+ bank latihan soal interaktif berpenjelasan lengkap untuk persiapan tes kerja developer, data, dan profesional.
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
          <span>Status Akun: Expert Plan Aktif • Akses Vault Terbuka Penuh</span>
        </div>
        <div class="unlocked-stats">
          <span><i class="fa-solid fa-book-bookmark"></i> 24 Modul</span>
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
            <span class="tab-count">({{ getCategoryCount(cat.id) }})</span>
          </button>
        </div>

        <div class="vault-search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari cheatsheet, topik, rumus..."
          />
        </div>
      </div>

      <!-- 4. Cheatsheet Cards Grid -->
      <div class="cheatsheet-grid">
        <div
          v-for="item in filteredCheatsheets"
          :key="item.slug"
          class="cheat-card"
          :class="{ locked: !isExpert }"
        >
          <div class="card-top">
            <span class="card-category-badge">{{ item.categoryLabel }}</span>
            <span v-if="!isExpert" class="card-lock-badge">
              <i class="fa-solid fa-lock"></i> Expert Only
            </span>
            <span v-else class="card-lock-badge" style="color: #10b981; border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.1);">
              <i class="fa-solid fa-unlock"></i> Terbuka
            </span>
          </div>

          <div class="card-body">
            <div class="cheat-icon" :class="item.category">
              <i :class="item.icon"></i>
            </div>
            <div class="cheat-info">
              <h3 class="cheat-title">{{ item.title }}</h3>
              <p class="cheat-desc">{{ item.desc }}</p>
              
              <div class="card-meta-row">
                <span class="meta-pill questions">
                  <i class="fa-solid fa-clipboard-question"></i> {{ item.questions }} Soal
                </span>
                <span class="meta-pill">
                  <i class="fa-solid fa-bolt"></i> {{ item.highlight }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <button
              v-if="isExpert"
              class="btn-open-cheat"
              @click="openCheatsheet(item)"
            >
              <i class="fa-solid fa-book-open-reader"></i>
              <span>Buka Cheatsheet</span>
            </button>
            <button
              v-else
              class="btn-locked-cheat"
              @click="openLockedTeaser(item)"
            >
              <i class="fa-solid fa-lock"></i>
              <span>Buka Akses (Expert)</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. In-App Cheatsheet Reader Modal -->
    <div v-if="activeCheatsheet && isExpert" class="cheat-modal-overlay" @click.self="closeReader">
      <div class="cheat-modal-container">
        <div class="cheat-modal-header">
          <div class="modal-header-left">
            <span class="modal-header-badge"><i class="fa-solid fa-crown"></i> Expert Vault</span>
            <h2 class="modal-header-title">{{ activeCheatsheet.title }}</h2>
          </div>
          <div class="modal-header-actions">
            <a
              :href="`/cheatsheet/${activeCheatsheet.file}`"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-modal-action"
              title="Buka Tab Penuh"
            >
              <i class="fa-solid fa-up-right-from-square"></i>
              <span>Tab Penuh</span>
            </a>
            <button class="btn-modal-close" @click="closeReader" title="Tutup">
              <i class="fa-solid fa-xmark"></i>
              <span>Tutup</span>
            </button>
          </div>
        </div>
        <iframe
          :src="`/cheatsheet/${activeCheatsheet.file}`"
          class="cheat-modal-iframe"
          title="Cheatsheet Viewer"
        ></iframe>
      </div>
    </div>

    <!-- 6. Teaser / Upgrade Modal (Saat non-expert klik kartu) -->
    <div v-if="teaserItem" class="cheat-modal-overlay" @click.self="teaserItem = null">
      <div class="cheat-modal-container" style="max-width: 520px; height: auto; padding: 24px; text-align: center;">
        <div style="font-size: 2.5rem; color: #fbbf24; margin-bottom: 12px;">
          <i class="fa-solid fa-crown"></i>
        </div>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 8px;">
          {{ teaserItem.title }}
        </h2>
        <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.5; margin-bottom: 16px;">
          Modul ini dilengkapi <strong>{{ teaserItem.questions }} soal latihan teknis</strong> dan rangkuman komprehensif. Dapatkan akses penuh ke seluruh 24 cheatsheet industri dengan berlangganan akun <strong>Expert Plan</strong>.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn-upgrade-vault" @click="goToUpgrade">
            <i class="fa-solid fa-bolt"></i> Upgrade ke Expert Plan
          </button>
          <button class="btn-outline-plans" @click="teaserItem = null">
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
    title: 'Power BI & DAX Formulas',
    desc: 'Measure vs Calculated Column, fungsi CALCULATE, ALL, time-intelligence, dan arsitektur Star Schema.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-chart-pie',
    highlight: 'DAX & Star Schema',
    questions: 12,
    file: 'powerbi.html'
  },
  {
    slug: 'python',
    title: 'Python for Data Analysis',
    desc: 'Manipulasi Pandas DataFrame/Series, loc vs iloc, penanganan missing values, groupby, dan merge.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-brands fa-python',
    highlight: 'Pandas & GroupBy',
    questions: 15,
    file: 'python.html'
  },
  {
    slug: 'accounting',
    title: 'Akuntansi & Finansial',
    desc: 'Aturan saldo normal debit/kredit, 7 siklus akuntansi, neraca, laporan laba rugi, dan rasio keuangan.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-calculator',
    highlight: 'Debit/Kredit & 7 Siklus',
    questions: 15,
    file: 'accounting.html'
  },
  {
    slug: 'hr-payroll',
    title: 'HR, Payroll & Ketenagakerjaan',
    desc: 'Rumus PPh 21 tarif efektif TER, BPJS Ketenagakerjaan & Kesehatan, perhitungan upah lemur, dan pesangon.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-users',
    highlight: 'PPh 21 TER & Lembur',
    questions: 12,
    file: 'hr-payroll.html'
  },
  {
    slug: 'supply-chain',
    title: 'Supply Chain & Inventory',
    desc: 'Kalkulasi EOQ, Safety Stock, Reorder Point (ROP), FIFO vs Average, klasifikasi ABC Pareto, dan Incoterms.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-truck',
    highlight: 'EOQ, Safety Stock & ROP',
    questions: 12,
    file: 'supply-chain.html'
  },

  // 2. Developer & DevOps
  {
    slug: 'typescript',
    title: 'TypeScript Modern',
    desc: 'Generics, Utility Types (Partial, Omit, Pick, Record), Type Narrowing is, dan discriminated unions.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-solid fa-code',
    highlight: 'Generics & Utility Types',
    questions: 12,
    file: 'typescript.html'
  },
  {
    slug: 'javascript',
    title: 'JavaScript ES6+ & DOM',
    desc: 'Array methods (map, filter, reduce), destructuring, async/await, DOM manipulation, dan Event Loop.',
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
    desc: 'Branching strategy, merge vs rebase, stashing, reverting commit, conflict resolution, dan Conventional Commits.',
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
    desc: 'Lifecycle container, multi-stage Dockerfile, docker-compose.yml, volume binding, dan optimasi image size.',
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
    desc: 'Arsitektur control plane/worker node, Pod, Deployment, Service, Liveness/Readiness probes, dan kubectl CLI.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-solid fa-cubes',
    highlight: 'Pods, Probes & CLI',
    questions: 12,
    file: 'kubernetes.html'
  },
  {
    slug: 'http-api',
    title: 'HTTP Status & REST API',
    desc: 'Matriks status code (401 vs 403, 502), method PUT vs PATCH, standard request headers, CORS, dan REST design.',
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
    desc: 'Assertions pm.test, environment/collection variables, token chaining antar request, dan runner Newman CLI.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-solid fa-paper-plane',
    highlight: 'pm.test & Token Chaining',
    questions: 12,
    file: 'postman.html'
  },
  {
    slug: 'html-css',
    title: 'HTML5 & Modern CSS Grid',
    desc: 'Elemen semantik, box-sizing, teknik centering Flexbox, responsive CSS Grid auto-fit, dan fluid clamp().',
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
    title: 'Linux & Bash Scripting',
    desc: 'Navigasi sistem berkas, permission chmod (755/644), filter teks grep, awk, sed, crontab, dan resource monitoring.',
    category: 'sys',
    categoryLabel: 'Sistem & Keamanan',
    icon: 'fa-brands fa-linux',
    highlight: 'chmod, awk, grep & Cron',
    questions: 15,
    file: 'linux.html'
  },
  {
    slug: 'networking',
    title: 'Networking & Subnetting',
    desc: 'Model OSI 7 Layer, kalkulasi subnetting CIDR (/24 s/d /30), TCP 3-way handshake vs UDP, DNS, dan CLI ping/traceroute.',
    category: 'sys',
    categoryLabel: 'Sistem & Keamanan',
    icon: 'fa-solid fa-server',
    highlight: 'OSI, CIDR & TCP/UDP',
    questions: 12,
    file: 'networking.html'
  },
  {
    slug: 'security',
    title: 'Web Security (OWASP Top 10)',
    desc: 'Mitigasi SQL Injection, XSS, CSRF, keamanan JWT, perbedaan bcrypt vs enkripsi, dan security headers (CSP, HSTS).',
    category: 'sys',
    categoryLabel: 'Sistem & Keamanan',
    icon: 'fa-solid fa-shield-halved',
    highlight: 'OWASP, SQLi, XSS & CSP',
    questions: 12,
    file: 'security.html'
  },
  {
    slug: 'regex',
    title: 'Regular Expressions (Regex)',
    desc: 'Metakarakter, character classes, lookaround assertions, dan resep pola validasi no HP, email & NIK Indonesia.',
    category: 'sys',
    categoryLabel: 'Sistem & Keamanan',
    icon: 'fa-solid fa-asterisk',
    highlight: 'Lookaround & Pola Validasi',
    questions: 12,
    file: 'regex.html'
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
</script>

<style scoped src="../assets/css/views/CheatsheetView.css"></style>
