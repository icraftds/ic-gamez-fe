<template>
  <div class="faq-view">
    <SimpleBackground />

    <div class="faq-container">
      <!-- 0. Top Navigation -->
      <div class="faq-top-nav">
        <router-link to="/" class="back-link">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Kembali ke Beranda</span>
        </router-link>
      </div>

      <!-- 1. Hero Header -->
      <header class="faq-header">
        <div class="hero-pill">
          <i class="fa-solid fa-circle-question"></i>
          <span>Pusat Bantuan & Tanya Jawab</span>
        </div>
        <h1 class="faq-title"><span class="gradient-text">Frequently Asked Questions</span></h1>
        <p class="faq-subtitle">
          Temukan solusi dan jawaban cepat seputar akun, jalur belajar koding, mekanisme gamifikasi XP & Energy, serta akses fitur premium di iC Game-Z.
        </p>
      </header>

      <!-- 2. Controls: Search Bar & Category Chips -->
      <div class="faq-controls">
        <div class="faq-search-wrapper">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            v-model="searchQuery"
            type="text"
            class="faq-search-input"
            placeholder="Cari pertanyaan... (misal: 'Energy', 'QRIS', 'Sertifikat', 'XP')"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="clear-search-btn"
            @click="searchQuery = ''"
            title="Hapus pencarian"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="faq-categories">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="cat-chip"
            :class="{ active: selectedCategory === cat.id }"
            @click="selectedCategory = cat.id"
          >
            <i :class="cat.icon"></i>
            <span>{{ cat.label }}</span>
          </button>
        </div>
      </div>

      <!-- 3. FAQ Accordion List -->
      <div v-if="filteredFaqs.length > 0" class="faq-list">
        <div
          v-for="item in filteredFaqs"
          :key="item.id"
          class="faq-card"
          :class="{ open: openItems.includes(item.id) }"
        >
          <button
            type="button"
            class="faq-question-btn"
            @click="toggleItem(item.id)"
            :aria-expanded="openItems.includes(item.id)"
          >
            <div class="question-text-wrap">
              <div class="question-icon">
                <i :class="item.icon || 'fa-solid fa-question'"></i>
              </div>
              <span>{{ item.question }}</span>
            </div>
            <i class="fa-solid fa-chevron-down chevron-icon"></i>
          </button>

          <div v-show="openItems.includes(item.id)" class="faq-answer">
            <span class="faq-tag">{{ item.categoryLabel }}</span>
            <div v-html="item.answerHtml"></div>
          </div>
        </div>
      </div>

      <!-- 3B. Empty State -->
      <div v-else class="faq-empty-state">
        <i class="fa-solid fa-comment-slash"></i>
        <h3>Tidak Ada Pertanyaan yang Cocok</h3>
        <p>Pencarian untuk "<strong>{{ searchQuery }}</strong>" tidak menemukan pertanyaan yang relevan.</p>
        <button class="btn-reset-faq" @click="resetFilters">
          Tampilkan Semua Pertanyaan
        </button>
      </div>

      <!-- 4. Support Contact CTA -->
      <div class="faq-support-cta">
        <div class="cta-info">
          <div class="cta-icon-wrap">
            <i class="fa-solid fa-headset"></i>
          </div>
          <div class="cta-text">
            <h3>Masih memiliki pertanyaan lain?</h3>
            <p>Tim dukungan iCraft Studio siap membantu menyelesaikan kendala akun, belajar, atau pembayaranmu.</p>
          </div>
        </div>
        <div class="cta-actions">
          <router-link to="/hubungi-kami" class="btn-cta-contact">
            <i class="fa-solid fa-paper-plane"></i>
            <span>Kirim Pesan Bantuan</span>
          </router-link>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Tim%20iC%20Game-Z,%20saya%20ingin%20bertanya%20tentang..."
            target="_blank"
            rel="noopener noreferrer"
            class="btn-cta-wa"
          >
            <i class="fa-brands fa-whatsapp"></i>
            <span>Chat WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'

const searchQuery = ref('')
const selectedCategory = ref('all')
const openItems = ref([1, 2]) // Default open first 2

const categories = [
  { id: 'all', label: 'Semua', icon: 'fa-solid fa-layer-group' },
  { id: 'account', label: 'Akun & Profil', icon: 'fa-solid fa-user-shield' },
  { id: 'learning', label: 'Alur Belajar', icon: 'fa-solid fa-graduation-cap' },
  { id: 'gamification', label: 'XP & Energy', icon: 'fa-solid fa-bolt' },
  { id: 'payment', label: 'Paket & Shop', icon: 'fa-solid fa-cart-shopping' },
  { id: 'technical', label: 'Cheatsheet & Sertifikat', icon: 'fa-solid fa-file-code' }
]

const faqs = [
  {
    id: 1,
    category: 'learning',
    categoryLabel: 'Alur Belajar',
    icon: 'fa-solid fa-laptop-code',
    question: 'Apakah saya perlu menginstal text editor atau compiler di komputer?',
    answerHtml: `
      <p><strong>Tidak perlu sama sekali!</strong> iC Game-Z telah dilengkapi dengan workspace code editor terintegrasi langsung di dalam browser.</p>
      <p>Kamu bisa langsung menulis kode (HTML, CSS, JavaScript, Python, SQL), menjalankannya secara instan, dan melihat hasil terminal output serta pengujian otomatis tanpa setup lokal yang rumit.</p>
    `
  },
  {
    id: 2,
    category: 'account',
    categoryLabel: 'Akun & Profil',
    icon: 'fa-solid fa-gift',
    question: 'Apakah iC Game-Z bisa digunakan secara gratis?',
    answerHtml: `
      <p><strong>Ya, 100% Gratis untuk memulai!</strong> Siapa pun dapat mendaftar dan menikmati modul pembelajaran dasar, mengerjakan kuis, serta berlatih koding harian.</p>
      <p>Pengguna gratis mendapatkan kuota Energy harian yang diperbarui setiap hari pukul 00:00 WIB. Untuk akses tanpa batas ke seluruh alur lanjutan, 24 Cheatsheet Vault, dan bank soal tes kerja, kamu dapat meng-upgrade ke paket <em>Pro</em> atau <em>Expert</em>.</p>
    `
  },
  {
    id: 3,
    category: 'gamification',
    categoryLabel: 'XP & Energy',
    icon: 'fa-solid fa-heart-pulse',
    question: 'Apa fungsi Energy (Jantung) dan bagaimana cara memulihkannya jika habis?',
    answerHtml: `
      <p><strong>Energy (Jantung)</strong> adalah mekanisme nyawa saat kamu menyelesaikan evaluasi coding dan tantangan teknis agar proses belajar lebih menantang dan teliti.</p>
      <ul>
        <li>Energy berkurang ketika solusi coding yang disubmit belum lolos test case.</li>
        <li><strong>Pemulihan Harian:</strong> Energy akan terisi penuh otomatis setiap malam (pukul 00:00 WIB).</li>
        <li><strong>Isi Ulang Cepat:</strong> Kamu bisa menggunakan <code>iCoinz</code> reward belajarmu di <strong>GameZ Shop</strong> untuk mengisi ulang Energy kapan saja.</li>
        <li>Pengguna paket <strong>Pro</strong> dan <strong>Expert</strong> menikmati <em>Unlimited Energy</em> tanpa batas.</li>
      </ul>
    `
  },
  {
    id: 4,
    category: 'gamification',
    categoryLabel: 'XP & Energy',
    icon: 'fa-solid fa-trophy',
    question: 'Bagaimana cara mendapatkan XP dan menaikkan ranking di Leaderboard?',
    answerHtml: `
      <p>XP (Experience Points) mencerminkan jam terbang dan konsistensi belajarmu di platform:</p>
      <ul>
        <li><strong>Menyelesaikan Lesson Teori:</strong> +10 XP</li>
        <li><strong>Lulus Kuis 5-Dimensi:</strong> +15 XP</li>
        <li><strong>Menuntaskan Praktik Koding:</strong> +25 XP</li>
        <li><strong>Daily Streak Bonus:</strong> Menjaga streak belajar berturut-turut memberikan multiplier bonus XP.</li>
      </ul>
      <p>Leaderboard diperbarui secara real-time dan menampilkan coder terbaik di tingkat mingguan maupun global.</p>
    `
  },
  {
    id: 5,
    category: 'payment',
    categoryLabel: 'Paket & Shop',
    icon: 'fa-solid fa-qrcode',
    question: 'Metode pembayaran apa saja yang didukung untuk GameZ Shop dan Upgrade Paket?',
    answerHtml: `
      <p>Kami mendukung pembayaran otomatis menggunakan standar nasional <strong>QRIS</strong> yang terhubung dengan seluruh layanan keuangan di Indonesia:</p>
      <ul>
        <li><strong>M-Banking:</strong> BCA Mobile / myBCA, Livin' by Mandiri, BRImo, BNI Mobile, Permata, dll.</li>
        <li><strong>E-Wallet:</strong> GoPay, OVO, ShopeePay, DANA, LinkAja, AstraPay.</li>
      </ul>
      <p>Pembayaran diverifikasi secara otomatis dalam hitungan detik via webhook gateway resmi, sehingga akun dan itemmu langsung aktif tanpa perlu konfirmasi manual.</p>
    `
  },
  {
    id: 6,
    category: 'technical',
    categoryLabel: 'Cheatsheet & Sertifikat',
    icon: 'fa-solid fa-vault',
    question: 'Apa itu Game Z Cheatsheet Vault dan materi apa saja yang tersedia?',
    answerHtml: `
      <p><strong>Game Z Cheatsheet Vault</strong> adalah kumpulan 24 modul referensi sintaks industri dan bank soal persiapan tes rekrutmen kerja (Technical Interview).</p>
      <p>Mencakup 4 pilar utama: <strong>Data & Bisnis</strong> (Excel 70+ rumus, Google Sheets, SQL Query, Power BI DAX), <strong>Developer & DevOps</strong> (TypeScript, JavaScript ES6+, Git, Docker, Kubernetes, HTTP API, Postman), <strong>Sistem & Keamanan</strong> (Linux CLI, OWASP Top 10 Web Security, Jaringan TCP/IP, Python), dan <strong>Desain & AI</strong> (Figma Design System, Prompt Engineering, SEO Metrics, Markdown).</p>
      <p>Cheatsheet dilengkapi mode fokus per-materi dan pencarian instan dengan preview rumus langsung.</p>
    `
  },
  {
    id: 7,
    category: 'technical',
    categoryLabel: 'Cheatsheet & Sertifikat',
    icon: 'fa-solid fa-certificate',
    question: 'Apakah saya mendapatkan sertifikat setelah menuntaskan alur belajar?',
    answerHtml: `
      <p><strong>Ya!</strong> Setelah menuntaskan seluruh chapter dan tantangan akhir proyek pada suatu Learning Path, pengguna berhak mengklaim <strong>e-Sertifikat Kelulusan Resmi</strong> dari iCraft Studio.</p>
      <p>Sertifikat dilengkapi dengan QR code verifikasi keaslian dan Credential ID unik yang dapat ditautkan langsung ke profil LinkedIn atau CV kerja kamu.</p>
    `
  },
  {
    id: 8,
    category: 'learning',
    categoryLabel: 'Alur Belajar',
    icon: 'fa-solid fa-lightbulb',
    question: 'Bagaimana jika kode saya macet atau tidak tahu cara menyelesaikan tantangan?',
    answerHtml: `
      <p>Jangan khawatir! Di setiap tantangan koding, tersedia tombol <strong>Hint (Petunjuk)</strong> cerdas yang memberikan petunjuk bertahap tanpa langsung membocorkan jawaban utuh.</p>
      <p>Kamu juga bisa membaca tab <em>Teori</em> atau menengok modul di <em>Ensiklopedia</em> dan <em>Cheatsheet</em> untuk melihat contoh sintaks serupa.</p>
    `
  },
  {
    id: 9,
    category: 'account',
    categoryLabel: 'Akun & Profil',
    icon: 'fa-solid fa-user-pen',
    question: 'Bagaimana cara mengubah nama tampilan, bio, atau kata sandi akun?',
    answerHtml: `
      <p>Cukup klik foto profil kamu di pojok kanan atas, lalu pilih <strong>Edit Profil</strong> (atau kunjungi URL <code>/profile/edit</code>).</p>
      <p>Kamu dapat mengganti nama lengkap, username kustom, foto avatar, tautan portofolio GitHub/LinkedIn, dan memperbarui kata sandi akun secara aman.</p>
    `
  },
  {
    id: 10,
    category: 'payment',
    categoryLabel: 'Paket & Shop',
    icon: 'fa-solid fa-shield-halved',
    question: 'Bagaimana jika pembayaran QRIS saya sudah berhasil tetapi status akun belum ter-upgrade?',
    answerHtml: `
      <p>Pada umumnya aktivasi berlangsung instan (< 10 detik). Namun jika terjadi gangguan jaringan perbankan:</p>
      <ul>
        <li>Coba muat ulang halaman setelah 1 menit.</li>
        <li>Buka menu <strong>Riwayat Transaksi</strong> di profil kamu.</li>
        <li>Jika status belum berubah dalam 5 menit, segera hubungi tim kami melalui <router-link to="/hubungi-kami">Hubungi Kami</router-link> atau WhatsApp dengan melampirkan bukti transfer dan nomor Invoice. Kami akan melakukan verifikasi manual prioritas.</li>
      </ul>
    `
  }
]

const toggleItem = (id) => {
  const idx = openItems.value.indexOf(id)
  if (idx > -1) {
    openItems.value.splice(idx, 1)
  } else {
    openItems.value.push(id)
  }
}

const filteredFaqs = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return faqs.filter(item => {
    const matchesCat = selectedCategory.value === 'all' || item.category === selectedCategory.value
    if (!q) return matchesCat

    const matchesQuery = item.question.toLowerCase().includes(q) ||
      item.answerHtml.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q)
    return matchesCat && matchesQuery
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
}
</script>

<style scoped src="../assets/css/views/FaqView.css"></style>
