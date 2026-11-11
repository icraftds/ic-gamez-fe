<template>
  <div class="faq-view">
    <SimpleBackground />

    <div class="faq-container">
      <!-- 0. Top Navigation -->
      <div class="faq-top-nav">
        <div class="top-nav-left">
          <router-link to="/" class="brand-link" title="Beranda iC Game-Z">
            <span class="brand-ic">iC</span>
            <span class="brand-gamez">Game-Z</span>
          </router-link>
          <span class="nav-sep">/</span>
          <div class="nav-breadcrumbs">
            <span>Pusat Bantuan</span>
            <i class="fa-solid fa-chevron-right separator"></i>
            <span class="current">FAQ</span>
          </div>
        </div>

        <div class="top-nav-right">
          <router-link to="/" class="back-link">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Kembali ke Beranda</span>
          </router-link>
        </div>
      </div>

      <!-- Notion & Apple Master 2-Column Layout -->
      <div class="faq-notion-layout">
        <!-- LEFT COLUMN: Sticky Documentation / Category Navigator -->
        <aside class="faq-sidebar">
          <div class="sidebar-sticky-panel">
            <div class="sidebar-header">
              <span class="sidebar-subtitle">KATEGORI BANTUAN</span>
              <span class="total-badge">{{ faqs.length }} Q&A</span>
            </div>

            <nav class="category-menu" aria-label="Kategori FAQ">
              <button
                v-for="cat in categories"
                :key="cat.id"
                type="button"
                class="category-nav-btn"
                :class="{ active: selectedCategory === cat.id && !searchQuery }"
                @click="handleCategorySelect(cat.id)"
              >
                <div class="cat-nav-left">
                  <div class="cat-nav-icon">
                    <i :class="cat.icon"></i>
                  </div>
                  <span class="cat-nav-label">{{ cat.label }}</span>
                </div>
                <div class="cat-nav-right">
                  <span class="cat-nav-count">{{ getCategoryCount(cat.id) }}</span>
                  <i class="fa-solid fa-chevron-right cat-chevron"></i>
                </div>
              </button>
            </nav>

            <!-- Quick Diagnostic Hotline Card inside sidebar -->
            <div class="sidebar-help-box">
              <div class="sh-icon">
                <i class="fa-solid fa-bolt-lightning"></i>
              </div>
              <h4>Butuh Respon Cepat?</h4>
              <p>Kendala pembayaran QRIS atau akun diprioritaskan &lt; 15 menit via WhatsApp.</p>
              <a
                href="https://wa.me/6285174264123?text=Halo%20Tim%20iC%20Game-Z,%20saya%20butuh%20bantuan..."
                target="_blank"
                rel="noopener noreferrer"
                class="sh-btn"
              >
                <i class="fa-brands fa-whatsapp"></i>
                <span>Chat Hotline</span>
              </a>
            </div>
          </div>
        </aside>

        <!-- RIGHT COLUMN: Main Content Area (Hero + Popular Topics + Q&A + Support Dock) -->
        <main class="faq-main-content">
          <!-- 1. Hero Section (Notion & Figma Clean Style) -->
          <header class="faq-hero">
            <h1 class="hero-title">
              Ada yang bisa kami bantu?
            </h1>
            <p class="hero-subtitle">
              Temukan solusi instan, panduan alur belajar koding, mekanisme gamifikasi XP & Energy, hingga bantuan pembayaran di iC Game-Z.
            </p>

            <!-- Command / Search Pill Box (Figma & Notion Style) -->
            <div class="search-hero-box">
              <div class="search-input-pill" :class="{ focused: isSearchFocused }">
                <i class="fa-solid fa-magnifying-glass search-icon"></i>
                <input
                  ref="searchInputRef"
                  v-model="searchQuery"
                  type="text"
                  class="search-input"
                  placeholder="Cari solusi atau kata kunci (contoh: Energy, QRIS, Sertifikat, XP, Sandi)..."
                  @focus="isSearchFocused = true"
                  @blur="isSearchFocused = false"
                />
                <button
                  v-if="searchQuery"
                  type="button"
                  class="clear-btn"
                  @click="clearSearch"
                  title="Hapus pencarian"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
                <div v-else class="shortcut-pill" title="Tekan Ctrl + K untuk mencari">
                  <kbd>Ctrl</kbd> + <kbd>K</kbd>
                </div>
              </div>

              <!-- Quick Suggestion Pill Tags (Figma / Notion Style) -->
              <div class="quick-keywords">
                <span class="keywords-label">Paling Sering Dicari:</span>
                <div class="keyword-tags">
                  <button
                    v-for="kw in quickKeywords"
                    :key="kw.label"
                    type="button"
                    class="kw-tag"
                    :class="{ active: searchQuery.toLowerCase() === kw.query.toLowerCase() }"
                    @click="applyKeyword(kw.query)"
                  >
                    <i :class="kw.icon"></i>
                    <span>{{ kw.label }}</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <!-- 2. Popular Topics Section (Notion Style Grid Cards) -->
          <section v-if="!searchQuery" class="popular-topics-section">
            <div class="section-header-row">
              <h2 class="section-title">Topik Populer</h2>
            </div>

            <div class="popular-grid">
              <div
                v-for="topic in popularTopics"
                :key="topic.id"
                class="topic-card"
                :class="{ active: selectedCategory === topic.categoryId }"
                @click="selectCategoryAndScroll(topic.categoryId)"
              >
                <div class="topic-icon-wrap" :style="{ '--topic-glow': topic.glowColor }">
                  <i :class="topic.icon"></i>
                </div>
                <div class="topic-content">
                  <div class="topic-title-row">
                    <h3 class="topic-title">{{ topic.title }}</h3>
                    <i class="fa-solid fa-arrow-right topic-arrow"></i>
                  </div>
                  <p class="topic-desc">{{ topic.desc }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 3. Apple-style Q&A Section -->
          <section ref="qaSectionRef" class="qa-explorer-section">
            <!-- Active Filter Status Banner -->
            <div class="results-header">
              <div class="results-info">
                <h2 class="active-category-title">
                  <span v-if="searchQuery">
                    Hasil Pencarian "{{ searchQuery }}"
                  </span>
                  <span v-else>
                    {{ currentCategoryLabel }}
                  </span>
                </h2>
                <p class="results-count-text">
                  Menampilkan <strong>{{ filteredFaqs.length }}</strong> pertanyaan relevan
                </p>
              </div>

              <div class="header-actions">
                <button
                  v-if="searchQuery || selectedCategory !== 'all'"
                  type="button"
                  class="btn-reset-filter"
                  @click="resetFilters"
                >
                  <i class="fa-solid fa-rotate-left"></i>
                  <span>Reset Filter</span>
                </button>
                <button
                  type="button"
                  class="btn-expand-all"
                  @click="toggleExpandAll"
                  :title="isAllExpanded ? 'Tutup Semua Pertanyaan' : 'Buka Semua Pertanyaan'"
                >
                  <i :class="isAllExpanded ? 'fa-solid fa-compress' : 'fa-solid fa-expand'"></i>
                  <span>{{ isAllExpanded ? 'Tutup Semua' : 'Buka Semua' }}</span>
                </button>
              </div>
            </div>

            <!-- Featured Diagnostic Solution Callout (Apple Support Style) -->
            <div v-if="featuredCallout && !searchQuery" class="featured-solution-card">
              <div class="fs-header">
                <span class="fs-label">Solusi Cepat</span>
                <h3 class="fs-title">{{ featuredCallout.title }}</h3>
              </div>
              <p class="fs-desc">{{ featuredCallout.desc }}</p>
              <div class="fs-steps">
                <div v-for="(step, sIdx) in featuredCallout.steps" :key="sIdx" class="fs-step-item">
                  <span class="fs-step-num">{{ sIdx + 1 }}</span>
                  <div class="fs-step-text" v-html="step"></div>
                </div>
              </div>
            </div>

            <!-- Apple-style Clean Q&A Item List -->
            <div v-if="filteredFaqs.length > 0" class="qa-stream">
              <article
                v-for="(item, idx) in filteredFaqs"
                :key="item.id"
                class="qa-item"
                :class="{ 'is-open': openItems.includes(item.id) }"
              >
                <!-- Question Header Bar -->
                <button
                  type="button"
                  class="qa-question-bar"
                  @click="toggleItem(item.id)"
                  :aria-expanded="openItems.includes(item.id)"
                >
                  <div class="question-identity">
                    <span class="qa-index">{{ String(idx + 1).padStart(2, '0') }}</span>
                    <div class="qa-badge-icon" :style="{ '--icon-tint': item.tint || '#38bdf8' }">
                      <i :class="item.icon || 'fa-solid fa-circle-question'"></i>
                    </div>
                    <div class="qa-titles">
                      <span class="qa-category-tag">{{ item.categoryLabel }}</span>
                      <h3 class="qa-question-text">{{ item.question }}</h3>
                    </div>
                  </div>

                  <div class="qa-chevron-wrap">
                    <i class="fa-solid fa-chevron-down chevron-icon"></i>
                  </div>
                </button>

                <!-- Collapsible Smooth Answer (Apple Minimalist Style) -->
                <div v-show="openItems.includes(item.id)" class="qa-answer-container">
                  <div class="qa-answer-content">
                    <div class="answer-html-body" v-html="item.answerHtml"></div>

                    <!-- Pro-tip or Note callout if present -->
                    <div v-if="item.tip" class="answer-tip-box">
                      <i class="fa-solid fa-lightbulb tip-icon"></i>
                      <div class="tip-body">
                        <strong>Tips Pro:</strong>
                        <span>{{ item.tip }}</span>
                      </div>
                    </div>

                    <!-- Helpful Feedback Row (Apple & Stripe style) -->
                    <div class="feedback-row">
                      <span class="feedback-prompt">Apakah jawaban ini membantu kamu?</span>
                      <div class="feedback-actions">
                        <button
                          type="button"
                          class="feedback-btn"
                          :class="{ active: feedbackMap[item.id] === 'yes' }"
                          @click="submitFeedback(item.id, 'yes')"
                        >
                          <i class="fa-regular fa-thumbs-up"></i>
                          <span>Ya, Sangat Membantu</span>
                        </button>
                        <button
                          type="button"
                          class="feedback-btn"
                          :class="{ active: feedbackMap[item.id] === 'no' }"
                          @click="submitFeedback(item.id, 'no')"
                        >
                          <i class="fa-regular fa-thumbs-down"></i>
                          <span>Belum</span>
                        </button>
                      </div>
                      <span v-if="feedbackMap[item.id]" class="feedback-thanks">
                        <i class="fa-solid fa-circle-check"></i> Terima kasih atas tanggapanmu!
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <!-- Empty Search State -->
            <div v-else class="empty-faq-state">
              <div class="empty-icon-ring">
                <i class="fa-solid fa-magnifying-glass"></i>
              </div>
              <h3>Tidak ada pertanyaan yang cocok</h3>
              <p>
                Kami tidak menemukan hasil untuk kata kunci <strong>"{{ searchQuery }}"</strong>.
                Coba gunakan kata kunci umum lainnya atau hubungi tim support kami.
              </p>
              <div class="empty-actions">
                <button type="button" class="btn-clear-empty" @click="resetFilters">
                  <i class="fa-solid fa-arrow-rotate-left"></i>
                  <span>Tampilkan Semua Pertanyaan</span>
                </button>
                <router-link to="/hubungi-kami" class="btn-ask-admin">
                  <i class="fa-solid fa-headset"></i>
                  <span>Tanyakan Langsung</span>
                </router-link>
              </div>
            </div>
          </section>

          <!-- 4. Need More Help Dock (Apple Support Style) -->
          <section class="support-dock-section">
            <div class="dock-card">
              <div class="dock-glow"></div>
              <div class="dock-grid">
                <div class="dock-content">
                  <h2 class="dock-title">Masih butuh bantuan?</h2>
                  <p class="dock-desc">
                    Tim technical support dan kurikulum iCraft siap mendampingi kendala teknis dan alur belajarmu.
                  </p>
                </div>

                <div class="dock-buttons">
                  <a
                    href="https://wa.me/6285174264123?text=Halo%20Tim%20iC%20Game-Z,%20saya%20ingin%20berkonsultasi..."
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-dock-primary"
                  >
                    <i class="fa-brands fa-whatsapp"></i>
                    <div class="btn-dock-text">
                      <strong>WhatsApp Hotline</strong>
                      <small>Respon instan dalam hitungan menit</small>
                    </div>
                  </a>

                  <router-link to="/hubungi-kami" class="btn-dock-secondary">
                    <i class="fa-solid fa-envelope-open-text"></i>
                    <div class="btn-dock-text">
                      <strong>Kirim Tiket / Pesan</strong>
                      <small>Form keluhan akun & transaksi</small>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'

const searchQuery = ref('')
const selectedCategory = ref('all')
const openItems = ref([1, 4]) // Default open question 1 and 4
const isSearchFocused = ref(false)
const searchInputRef = ref(null)
const qaSectionRef = ref(null)
const feedbackMap = ref({})

// Quick keyword pill suggestions (Figma & Notion Style)
const quickKeywords = [
  { label: 'Energy Nyawa', query: 'energy', icon: 'fa-solid fa-heart-pulse' },
  { label: 'Bayar QRIS', query: 'qris', icon: 'fa-solid fa-qrcode' },
  { label: 'XP & Leaderboard', query: 'xp', icon: 'fa-solid fa-trophy' },
  { label: 'E-Sertifikat', query: 'sertifikat', icon: 'fa-solid fa-certificate' },
  { label: 'Cheatsheet Vault', query: 'cheatsheet', icon: 'fa-solid fa-vault' },
  { label: 'Editor Koding', query: 'editor', icon: 'fa-solid fa-laptop-code' },
  { label: 'Sandi & Akun', query: 'sandi', icon: 'fa-solid fa-key' }
]

// Category classification (Notion Reference Docs Sidebar)
const categories = [
  { id: 'all', label: 'Semua Topik', icon: 'fa-solid fa-layer-group' },
  { id: 'getting-started', label: 'Mulai Belajar & Teori', icon: 'fa-solid fa-graduation-cap' },
  { id: 'gamification', label: 'XP, Energy & Streak', icon: 'fa-solid fa-bolt' },
  { id: 'payment', label: 'Paket, Shop & QRIS', icon: 'fa-solid fa-cart-shopping' },
  { id: 'cheatsheet', label: 'Cheatsheet & Sertifikat', icon: 'fa-solid fa-file-code' },
  { id: 'account', label: 'Akun & Keamanan', icon: 'fa-solid fa-user-shield' }
]

// Popular Topic Cards (Notion Help Center style - clean, no slop badges)
const popularTopics = [
  {
    id: 'pt-1',
    categoryId: 'getting-started',
    title: 'Mulai Petualangan',
    desc: 'Workspace coding di browser, materi ramah pemula, kuis interaktif, dan cara pakai Hint AI.',
    icon: 'fa-solid fa-rocket',
    glowColor: 'rgba(56, 189, 248, 0.4)'
  },
  {
    id: 'pt-2',
    categoryId: 'gamification',
    title: 'Energy & Nyawa',
    desc: 'Aturan pengurangan nyawa, reset harian jam 00:00 WIB, isi ulang pakai iCoinz, dan Unlimited Pro.',
    icon: 'fa-solid fa-heart-pulse',
    glowColor: 'rgba(239, 68, 68, 0.4)'
  },
  {
    id: 'pt-3',
    categoryId: 'payment',
    title: 'Pembayaran & QRIS',
    desc: 'Aktivasi otomatis via QRIS (BCA, Mandiri, GoPay, OVO), paket Pro & Expert tanpa perpanjangan paksa.',
    icon: 'fa-solid fa-qrcode',
    glowColor: 'rgba(16, 185, 129, 0.4)'
  },
  {
    id: 'pt-4',
    categoryId: 'gamification',
    title: 'XP & Leaderboard',
    desc: 'Kalkulasi poin XP per lesson, multiplier daily streak, dan perebutan tahta di papan peringkat global.',
    icon: 'fa-solid fa-trophy',
    glowColor: 'rgba(251, 191, 36, 0.4)'
  },
  {
    id: 'pt-5',
    categoryId: 'cheatsheet',
    title: 'Cheatsheet Vault',
    desc: '24 modul sintaks siap kerja (Excel, SQL, Python, Docker) lengkap dengan mode fokus dan search.',
    icon: 'fa-solid fa-vault',
    glowColor: 'rgba(168, 85, 247, 0.4)'
  },
  {
    id: 'pt-6',
    categoryId: 'account',
    title: 'Akun & Keamanan',
    desc: 'Pengaturan profil coder, ganti password aman, enkripsi sesi, dan kebijakan privasi data pengguna.',
    icon: 'fa-solid fa-shield-halved',
    glowColor: 'rgba(6, 182, 212, 0.4)'
  }
]

// Diagnostic / Featured Solutions by category (Apple Support style)
const featuredSolutionsMap = {
  all: {
    title: 'Panduan Memulai: Menuntaskan Babak Pertama di iC Game-Z',
    desc: 'Tiga langkah mudah bagi coder pemula untuk langsung merasakan sensasi koding gamifikasi:',
    steps: [
      '<strong>Pilih Alur Belajar:</strong> Kunjungi menu <em>Alur Belajar</em> dan pilih track sesuai minat (misal: Dasar Web atau Python).',
      '<strong>Selesaikan Lesson & Praktik:</strong> Baca penjelasan ringkas, jawab kuis 5-dimensi, dan selesaikan tantangan koding langsung di editor browser.',
      '<strong>Kumpulkan XP & iCoinz:</strong> Raih skor tinggi untuk mendaki Leaderboard dan tukarkan reward di GameZ Shop.'
    ]
  },
  'getting-started': {
    title: 'Solusi: Kode Tidak Lolos Test Case atau Butuh Petunjuk?',
    desc: 'Jangan panik jika kode kamu menghasilkan error di terminal, lakukan pemeriksaan berikut:',
    steps: [
      '<strong>Klik Tombol Hint (Petunjuk):</strong> Gunakan tombol Hint di kanan bawah editor untuk membuka petunjuk bertahap.',
      '<strong>Periksa Pesan Error Terminal:</strong> Baca tab output terminal untuk melihat baris kode mana yang tidak memenuhi kriteria tes.',
      '<strong>Tengok Cheatsheet / Teori:</strong> Buka tab <em>Teori</em> atau modul <em>Cheatsheet Vault</em> untuk melihat contoh sintaks acuan.'
    ]
  },
  gamification: {
    title: 'Solusi Cepat: Energy (Jantung) Habis saat Tengah Menyelesaikan Tantangan',
    desc: 'Kehabisan nyawa belajar saat seru-serunya ngoding? Pilih opsi pemulihan berikut:',
    steps: [
      '<strong>Gunakan iCoinz di GameZ Shop:</strong> Buka menu Shop dan tukarkan reward belajarmu dengan paket <em>Energy Refill</em>.',
      '<strong>Tunggu Reset Harian:</strong> Energy akan terisi kembali otomatis hingga penuh setiap hari pukul 00:00 WIB.',
      '<strong>Upgrade ke Paket Pro:</strong> Nikmati fasilitas <em>Unlimited Energy</em> tanpa jeda nyawa sepanjang masa aktif paket.'
    ]
  },
  payment: {
    title: 'Solusi Cepat: Pembayaran QRIS Berhasil tapi Status Belum Ter-upgrade?',
    desc: 'Jika transfer QRIS di mobile banking sudah selesai namun akun belum aktif, ikuti diagnosis instan berikut:',
    steps: [
      '<strong>Tunggu 30 Detik & Refresh:</strong> Webhook perbankan biasanya membutuhkan 5-30 detik untuk menyelesaikan sinkronisasi mutasi.',
      '<strong>Periksa Riwayat Transaksi:</strong> Buka profil akun kamu dan pastikan transaksi terdaftar dengan nomor invoice unik.',
      '<strong>Hubungi Hotline WhatsApp Prioritas:</strong> Kirimkan nomor invoice dan bukti transfer ke tim kami untuk konfirmasi aktivasi manual &lt; 5 menit.'
    ]
  },
  cheatsheet: {
    title: 'Solusi: Cara Menemukan Rumus & Mengklaim e-Sertifikat Kelulusan',
    desc: 'Maksimalkan modul sintaks industri dan portofolio profesional kamu:',
    steps: [
      '<strong>Pencarian Instan Rumus:</strong> Ketik nama formula (misal: <code>VLOOKUP</code>, <code>JOIN</code>, <code>REGEX</code>) di Cheatsheet Vault untuk melihat cuplikan sintaks.',
      '<strong>Mode Fokus Per-Materi:</strong> Klik cheatsheet pilihan untuk membaca lembar referensi lengkap tanpa distraksi.',
      '<strong>Unduh e-Sertifikat:</strong> Setelah menyelesaikan 100% chapter alur belajar, unduh e-sertifikat ber-QR verifikasi resmi.'
    ]
  },
  account: {
    title: 'Solusi Cepat: Pemulihan Sandi dan Kustomisasi Profil Akun',
    desc: 'Kelola identitas coder dan jaga keamanan data login kamu:',
    steps: [
      '<strong>Ubah Sandi & Profil:</strong> Akses menu <em>Edit Profil</em> (atau URL <code>/profile/edit</code>) untuk memperbarui data pribadi.',
      '<strong>Lupa Kata Sandi:</strong> Klik tombol lupa sandi pada halaman masuk untuk menerima tautan pemulihan instan via email.',
      '<strong>Keamanan Enkripsi:</strong> Kata sandi dienkripsi menggunakan algoritma cryptographic hash berstandar keamanan industri.'
    ]
  }
}

// 13 Comprehensive FAQ items
const faqs = [
  {
    id: 1,
    category: 'getting-started',
    categoryLabel: 'Mulai Belajar',
    tint: '#38bdf8',
    icon: 'fa-solid fa-laptop-code',
    question: 'Apakah saya perlu menginstal text editor atau compiler di komputer?',
    answerHtml: `
      <p><strong>Tidak perlu sama sekali!</strong> iC Game-Z telah dilengkapi dengan workspace code editor terintegrasi langsung di dalam browser.</p>
      <p>Kamu bisa langsung menulis kode (HTML, CSS, JavaScript, Python, SQL), menjalankannya secara instan, dan melihat hasil terminal output serta pengujian otomatis tanpa setup lokal yang rumit.</p>
    `,
    tip: 'Kamu bisa belajar koding dari perangkat apa saja (laptop, netbook, tablet) asalkan terhubung dengan browser modern seperti Google Chrome, Brave, atau Edge.'
  },
  {
    id: 2,
    category: 'getting-started',
    categoryLabel: 'Mulai Belajar',
    tint: '#38bdf8',
    icon: 'fa-solid fa-graduation-cap',
    question: 'Apakah materi di iC Game-Z cocok untuk pemula yang belum pernah koding sama sekali?',
    answerHtml: `
      <p><strong>Sangat cocok!</strong> Kurikulum kami dirancang dari prinsip <em>zero-to-hero</em> dengan metode micro-learning bertahap.</p>
      <p>Setiap konsep teknis disajikan dengan analogi visual yang mudah dicerna, kuis pemahaman konsep, dan latihan koding interaktif berjenjang dari yang termudah.</p>
    `,
    tip: 'Bagi pemula mutlak, kami sarankan memulai petualangan dari alur "Dasar Pemrograman Web" atau "Python Fundamental".'
  },
  {
    id: 3,
    category: 'getting-started',
    categoryLabel: 'Mulai Belajar',
    tint: '#38bdf8',
    icon: 'fa-solid fa-lightbulb',
    question: 'Bagaimana jika kode saya macet atau tidak tahu cara menyelesaikan tantangan?',
    answerHtml: `
      <p>Jangan khawatir! Di setiap tantangan koding, tersedia fitur <strong>Hint (Petunjuk)</strong> pintar yang memberikan kisi-kisi bertahap tanpa langsung membocorkan jawaban utuh.</p>
      <p>Kamu juga bisa membaca tab <em>Teori</em> di sisi kiri editor atau menengok referensi di modul <em>Ensiklopedia</em> dan <em>Cheatsheet Vault</em>.</p>
    `,
    tip: 'Cobalah berpikir mandiri selama 5-10 menit sebelum menekan tombol Hint untuk melatih logika problem solving koding.'
  },
  {
    id: 4,
    category: 'gamification',
    categoryLabel: 'XP & Energy',
    tint: '#ef4444',
    icon: 'fa-solid fa-heart-pulse',
    question: 'Apa fungsi Energy (Jantung) dan bagaimana cara memulihkannya jika habis?',
    answerHtml: `
      <p><strong>Energy (Jantung)</strong> adalah mekanisme nyawa saat kamu menyelesaikan evaluasi coding dan tantangan teknis agar proses belajar lebih teliti dan menantang.</p>
      <ul>
        <li>Energy berkurang 1 poin ketika solusi koding yang kamu submit belum lolos test case.</li>
        <li><strong>Pemulihan Harian:</strong> Energy akan terisi penuh otomatis setiap malam (pukul 00:00 WIB).</li>
        <li><strong>Isi Ulang Cepat:</strong> Kamu bisa menggunakan reward <code>iCoinz</code> belajarmu di <strong>GameZ Shop</strong> untuk membeli refill kapan saja.</li>
        <li>Pengguna paket <strong>Pro</strong> dan <strong>Expert</strong> menikmati <em>Unlimited Energy</em> tanpa batasan nyawa.</li>
      </ul>
    `,
    tip: 'Kumpulkan iCoinz dari menyelesaikan chapter untuk disimpan sebagai cadangan refill saat menghadapi tantangan koding yang sulit!'
  },
  {
    id: 5,
    category: 'gamification',
    categoryLabel: 'XP & Energy',
    tint: '#fbbf24',
    icon: 'fa-solid fa-trophy',
    question: 'Bagaimana cara mendapatkan XP dan menaikkan ranking di Leaderboard?',
    answerHtml: `
      <p>XP (Experience Points) mencerminkan jam terbang dan konsistensi belajarmu di platform:</p>
      <ul>
        <li><strong>Menyelesaikan Lesson Teori:</strong> +10 XP</li>
        <li><strong>Lulus Kuis 5-Dimensi:</strong> +15 XP</li>
        <li><strong>Menuntaskan Praktik Koding:</strong> +25 XP</li>
        <li><strong>Daily Streak Multiplier:</strong> Belajar konsisten berturut-turut memberikan bonus multiplier XP harian.</li>
      </ul>
      <p>Leaderboard diperbarui secara real-time dan menampilkan coder paling aktif di tingkat mingguan maupun global.</p>
    `,
    tip: 'Selesaikan minimal 1 materi sebelum jam 23:59 WIB setiap hari untuk melipatgandakan multiplier streak belajarmu.'
  },
  {
    id: 6,
    category: 'gamification',
    categoryLabel: 'XP & Energy',
    tint: '#fbbf24',
    icon: 'fa-solid fa-fire-flame-curved',
    question: 'Apa yang terjadi jika saya melewatkan Daily Streak belajar satu hari?',
    answerHtml: `
      <p>Jika kamu melewatkan satu hari penuh tanpa aktivitas belajar, hitungan streak akan ter-reset kembali ke hari ke-1.</p>
      <p>Namun, jika kamu memiliki item <strong>Streak Freeze</strong> di inventory akun, sistem akan otomatis menggunakannya untuk melindungi rekor streak kamu selama 24 jam tanpa mereset angka.</p>
    `,
    tip: 'Dapatkan Streak Freeze di GameZ Shop dengan menukarkan iCoinz sebelum hari libur atau saat jadwalmu sedang padat.'
  },
  {
    id: 7,
    category: 'payment',
    categoryLabel: 'Paket & Shop',
    tint: '#10b981',
    icon: 'fa-solid fa-qrcode',
    question: 'Metode pembayaran apa saja yang didukung untuk GameZ Shop dan Upgrade Paket?',
    answerHtml: `
      <p>Kami mendukung pembayaran otomatis menggunakan standar nasional <strong>QRIS</strong> yang terhubung dengan seluruh ekosistem perbankan dan dompet digital di Indonesia:</p>
      <ul>
        <li><strong>M-Banking:</strong> BCA Mobile / myBCA, Livin' by Mandiri, BRImo, BNI Mobile, Permata, Danamon, Jenius, dll.</li>
        <li><strong>E-Wallet:</strong> GoPay, OVO, ShopeePay, DANA, LinkAja, AstraPay.</li>
      </ul>
      <p>Pembayaran diverifikasi secara otomatis dalam hitungan detik via gateway webhook resmi tanpa perlu kirim bukti transfer secara manual.</p>
    `,
    tip: 'Pastikan nama merchant yang muncul di aplikasi perbankan kamu adalah "iCraft Digital Service" sebelum menekan tombol konfirmasi bayar.'
  },
  {
    id: 8,
    category: 'payment',
    categoryLabel: 'Paket & Shop',
    tint: '#10b981',
    icon: 'fa-solid fa-shield-halved',
    question: 'Bagaimana jika pembayaran QRIS saya sudah berhasil tetapi status akun belum ter-upgrade?',
    answerHtml: `
      <p>Pada 99% transaksi, aktivasi berlangsung instan (&lt; 15 detik). Namun jika terjadi perlambatan jaringan gateway perbankan:</p>
      <ul>
        <li>Tunggu sekitar 30 detik lalu muat ulang (refresh) halaman aplikasi.</li>
        <li>Cek tab <strong>Riwayat Transaksi</strong> di menu profil akun kamu.</li>
        <li>Jika status belum berubah dalam 5 menit, segera hubungi tim customer success via WhatsApp Hotline dengan melampirkan Nomor Invoice kamu. Kami siap melakukan aktivasi manual prioritas.</li>
      </ul>
    `,
    tip: 'Simpan tangkapan layar bukti sukses pembayaran dari mobile banking kamu sebagai cadangan verifikasi cepat.'
  },
  {
    id: 9,
    category: 'payment',
    categoryLabel: 'Paket & Shop',
    tint: '#10b981',
    icon: 'fa-solid fa-credit-card',
    question: 'Apakah paket Pro dan Expert diperpanjang otomatis (auto-renewal) atau satu kali bayar?',
    answerHtml: `
      <p><strong>Satu Kali Bayar (No Auto-Debit)!</strong> Kami mengutamakan transparansi dan keamanan saldo pengguna tanpa pemotongan dana tersembunyi.</p>
      <p>Paket langganan hanya aktif sesuai durasi masa berlaku yang kamu pilih (misal: 1 Bulan, 6 Bulan, atau 1 Tahun). Jika durasi berakhir, akun kamu akan kembali ke status Free tanpa tagihan otomatis.</p>
    `,
    tip: 'Kamu akan menerima notifikasi pengingat di aplikasi 3 hari sebelum paket berakhir jika ingin memperpanjang akses.'
  },
  {
    id: 10,
    category: 'cheatsheet',
    categoryLabel: 'Cheatsheet & Sertifikat',
    tint: '#a855f7',
    icon: 'fa-solid fa-vault',
    question: 'Apa itu Game Z Cheatsheet Vault dan materi apa saja yang tersedia?',
    answerHtml: `
      <p><strong>Game Z Cheatsheet Vault</strong> adalah kumpulan 24 modul referensi sintaks industri dan bank soal persiapan tes teknis kerja (Technical Interview).</p>
      <p>Mencakup 4 pilar utama: <strong>Data & Bisnis</strong> (Excel 70+ rumus, Google Sheets, SQL Query, Power BI DAX), <strong>Developer & DevOps</strong> (TypeScript, JavaScript ES6+, Git, Docker, Kubernetes, REST API, Postman), <strong>Sistem & Keamanan</strong> (Linux CLI, OWASP Top 10 Web Security, Jaringan TCP/IP, Python), dan <strong>Desain & AI</strong> (Figma Design System, Prompt Engineering, SEO Metrics, Markdown).</p>
      <p>Cheatsheet dilengkapi mode fokus per-materi dan pencarian instan dengan preview rumus langsung.</p>
    `,
    tip: 'Ketik nama formula seperti "XLOOKUP" atau "GROUP BY" langsung di kotak pencarian Cheatsheet untuk preview instan tanpa harus membuka dokumen.'
  },
  {
    id: 11,
    category: 'cheatsheet',
    categoryLabel: 'Cheatsheet & Sertifikat',
    tint: '#a855f7',
    icon: 'fa-solid fa-certificate',
    question: 'Apakah saya mendapatkan sertifikat setelah menuntaskan alur belajar?',
    answerHtml: `
      <p><strong>Ya, Tentu Saja!</strong> Setelah menuntaskan seluruh chapter dan proyek akhir pada suatu Learning Path, kamu berhak mengklaim <strong>e-Sertifikat Kelulusan Resmi</strong> dari iCraft Studio.</p>
      <p>Sertifikat dilengkapi dengan QR code verifikasi keaslian daring dan <em>Credential ID</em> unik yang dapat ditautkan langsung ke profil LinkedIn atau CV kerja kamu.</p>
    `,
    tip: 'Sertifikat dapat diunduh dalam format PDF resolusi tinggi dan berlaku selamanya tanpa tanggal kedaluwarsa.'
  },
  {
    id: 12,
    category: 'account',
    categoryLabel: 'Akun & Keamanan',
    tint: '#06b6d4',
    icon: 'fa-solid fa-gift',
    question: 'Apakah iC Game-Z bisa digunakan secara gratis?',
    answerHtml: `
      <p><strong>Ya, 100% Gratis untuk memulai!</strong> Siapa pun dapat mendaftar dan menikmati modul pembelajaran dasar, mengerjakan kuis, serta berlatih koding harian.</p>
      <p>Pengguna gratis mendapatkan kuota Energy harian yang diperbarui setiap hari pukul 00:00 WIB. Untuk akses tanpa batas ke seluruh alur lanjutan, 24 Cheatsheet Vault, dan bank soal tes kerja, kamu dapat meng-upgrade ke paket <em>Pro</em> atau <em>Expert</em>.</p>
    `,
    tip: 'Akun gratis tidak memiliki batasan waktu uji coba, kamu dapat belajar selamanya dengan kuota harian yang disediakan.'
  },
  {
    id: 13,
    category: 'account',
    categoryLabel: 'Akun & Keamanan',
    tint: '#06b6d4',
    icon: 'fa-solid fa-user-pen',
    question: 'Bagaimana cara mengubah nama tampilan, bio, atau kata sandi akun?',
    answerHtml: `
      <p>Cukup klik foto profil kamu di pojok kanan atas, lalu pilih <strong>Edit Profil</strong> (atau kunjungi URL <code>/profile/edit</code>).</p>
      <p>Kamu dapat mengganti nama lengkap, username kustom, foto avatar, tautan portofolio GitHub/LinkedIn, dan memperbarui kata sandi akun secara aman.</p>
    `,
    tip: 'Gunakan kombinasi minimal 8 karakter dengan huruf kapital dan angka untuk menjamin proteksi akun maksimal.'
  }
]

// Accordion toggle
const toggleItem = (id) => {
  const idx = openItems.value.indexOf(id)
  if (idx > -1) {
    openItems.value.splice(idx, 1)
  } else {
    openItems.value.push(id)
  }
}

// Category filter
const handleCategorySelect = (catId) => {
  selectedCategory.value = catId
  searchQuery.value = ''
  // Expand first item in selected category
  const firstInCat = faqs.find(f => catId === 'all' || f.category === catId)
  if (firstInCat && !openItems.value.includes(firstInCat.id)) {
    openItems.value = [firstInCat.id]
  }
}

// Popular topic card click
const selectCategoryAndScroll = (catId) => {
  handleCategorySelect(catId)
  if (qaSectionRef.value) {
    qaSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Quick keyword click
const applyKeyword = (query) => {
  searchQuery.value = query
  selectedCategory.value = 'all'
  // Auto expand all matching items for instant discovery
  const matching = faqs.filter(f =>
    f.question.toLowerCase().includes(query.toLowerCase()) ||
    f.answerHtml.toLowerCase().includes(query.toLowerCase())
  ).map(f => f.id)
  if (matching.length > 0) {
    openItems.value = matching
  }
  if (qaSectionRef.value) {
    qaSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  if (searchInputRef.value) {
    searchInputRef.value.focus()
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  openItems.value = [1, 4]
}

// Helper: category count
const getCategoryCount = (catId) => {
  if (catId === 'all') return faqs.length
  return faqs.filter(f => f.category === catId).length
}

// Filtered FAQ list
const filteredFaqs = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return faqs.filter(item => {
    const matchesCat = selectedCategory.value === 'all' || item.category === selectedCategory.value
    if (!q) return matchesCat

    const matchesQuery = item.question.toLowerCase().includes(q) ||
      item.answerHtml.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q) ||
      (item.tip && item.tip.toLowerCase().includes(q))
    return matchesCat && matchesQuery
  })
})

const currentCategoryLabel = computed(() => {
  const found = categories.find(c => c.id === selectedCategory.value)
  return found ? found.label : 'Semua Topik'
})

const featuredCallout = computed(() => {
  return featuredSolutionsMap[selectedCategory.value] || featuredSolutionsMap.all
})

const isAllExpanded = computed(() => {
  if (filteredFaqs.value.length === 0) return false
  return filteredFaqs.value.every(f => openItems.value.includes(f.id))
})

const toggleExpandAll = () => {
  if (isAllExpanded.value) {
    openItems.value = []
  } else {
    openItems.value = filteredFaqs.value.map(f => f.id)
  }
}

// User feedback submission
const submitFeedback = (id, type) => {
  feedbackMap.value[id] = type
}

// Keyboard shortcut (Ctrl + K or / to focus search)
const handleKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    searchInputRef.value?.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped src="../assets/css/views/FaqView.css"></style>
