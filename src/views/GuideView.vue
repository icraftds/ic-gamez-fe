<template>
  <div class="guide-view">
    <SimpleBackground />

    <div class="guide-container">
      <!-- 0. Top Navigation -->
      <div class="guide-top-nav">
        <router-link to="/" class="back-link">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Kembali ke Beranda</span>
        </router-link>
      </div>

      <!-- 1. Hero Header -->
      <header class="guide-header">
        <div class="hero-pill">
          <i class="fa-solid fa-gamepad"></i>
          <span>Panduan Petualangan Coder</span>
        </div>
        <h1 class="guide-title"><span class="gradient-text">Panduan Pengguna iC Game-Z</span></h1>
        <p class="guide-subtitle">
          Kuasai setiap fitur platform: alur belajar berjenjang, coding sandbox in-browser, mekanisme XP & Daily Streak, hingga rahasia menembus tes kerja teknis.
        </p>
      </header>

      <!-- 2. Quick Filter / Jump Stage Buttons -->
      <nav class="guide-nav-bar" aria-label="Navigasi Tahapan">
        <button
          v-for="filter in stageFilters"
          :key="filter.id"
          class="nav-pill-btn"
          :class="{ active: selectedStage === filter.id }"
          @click="selectedStage = filter.id"
        >
          <i :class="filter.icon"></i>
          <span>{{ filter.label }}</span>
        </button>
      </nav>

      <!-- 3. Steps Timeline List -->
      <main class="guide-steps-list">
        <article
          v-for="step in filteredSteps"
          :key="step.number"
          class="step-card"
        >
          <!-- Left Badge & Icon -->
          <div class="step-left-col">
            <div class="step-number-badge">{{ step.number }}</div>
            <div class="step-icon-wrap">
              <i :class="step.icon"></i>
            </div>
          </div>

          <!-- Right Content -->
          <div class="step-content-col">
            <div class="step-header">
              <span class="step-stage-tag">{{ step.stageLabel }}</span>
              <h2 class="step-title">{{ step.title }}</h2>
            </div>

            <p class="step-desc">{{ step.desc }}</p>

            <!-- Key Checkpoints -->
            <div class="step-checkpoints-grid">
              <div
                v-for="(point, pIdx) in step.checkpoints"
                :key="pIdx"
                class="checkpoint-item"
              >
                <i class="fa-solid fa-circle-check"></i>
                <span>{{ point }}</span>
              </div>
            </div>

            <!-- Pro-tip Box -->
            <div v-if="step.proTip" class="step-tip-box">
              <i class="fa-solid fa-lightbulb"></i>
              <span><strong>Pro-Tip:</strong> {{ step.proTip }}</span>
            </div>

            <!-- Action Button -->
            <div v-if="step.action" class="step-action-row">
              <router-link :to="step.action.to" class="btn-step-action">
                <span>{{ step.action.label }}</span>
                <i class="fa-solid fa-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </article>
      </main>

      <!-- 4. Bottom Summary Banner -->
      <footer class="guide-bottom-summary">
        <div class="summary-text">
          <h3>Siap Memulai Petualangan Coding?</h3>
          <p>Tentukan alur belajar pilihanmu hari ini dan buktikan kemampuanmu di papan peringkat dunia.</p>
        </div>
        <div class="summary-actions">
          <router-link to="/learning" class="btn-summary-primary">
            <i class="fa-solid fa-graduation-cap"></i>
            <span>Jelajahi Alur Belajar</span>
          </router-link>
          <router-link to="/faq" class="btn-summary-secondary">
            <i class="fa-solid fa-circle-question"></i>
            <span>Lihat FAQ</span>
          </router-link>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'

const selectedStage = ref('all')

const stageFilters = [
  { id: 'all', label: 'Semua Langkah', icon: 'fa-solid fa-list-check' },
  { id: 'start', label: '1. Persona & Akun', icon: 'fa-solid fa-user-gear' },
  { id: 'path', label: '2. Alur Belajar', icon: 'fa-solid fa-route' },
  { id: 'coding', label: '3. Coding Sandbox', icon: 'fa-solid fa-code' },
  { id: 'gamification', label: '4. XP & Gamifikasi', icon: 'fa-solid fa-fire' },
  { id: 'cheatsheet', label: '5. Cheatsheet Vault', icon: 'fa-solid fa-bolt' },
  { id: 'shop', label: '6. Shop & Upgrade', icon: 'fa-solid fa-crown' }
]

const steps = [
  {
    number: '01',
    category: 'start',
    stageLabel: 'Tahap 1: Persiapan Akun & Persona',
    icon: 'fa-solid fa-user-astronaut',
    title: 'Registrasi & Konfigurasi Persona Coder',
    desc: 'Langkah pertama sebelum memulai petualangan koding adalah menyiapkan identitas dan target karirmu.',
    checkpoints: [
      'Daftar akun gratis atau login cepat menggunakan Google / SSO iCraft ID.',
      'Buka menu Edit Profil untuk memilih avatar karakter dan menuliskan bio developer impian.',
      'Tautkan tautan akun GitHub, LinkedIn, atau portofolio publikmu ke kartu profil Coder.'
    ],
    proTip: 'Username yang unik dan foto profil menarik akan muncul di Leaderboard global saat kamu menduduki peringkat teratas.',
    action: {
      to: '/dashboard',
      label: 'Buka Dashboard Coder'
    }
  },
  {
    number: '02',
    category: 'path',
    stageLabel: 'Tahap 2: Navigasi Kurikulum',
    icon: 'fa-solid fa-map-location-dot',
    title: 'Memilih Jalur Belajar (Learning Path)',
    desc: 'iC Game-Z menyusun kurikulum bertahap agar kamu tidak tersesat di lautan tutorial yang membingungkan.',
    checkpoints: [
      'Buka menu Alur Belajar untuk memilih spesialisasi (Frontend, Backend, Database SQL, Python Data, DevOps).',
      'Setiap alur terdiri dari Chapter tematik berjenjang mulai dari level dasar hingga studi kasus industri.',
      'Sistem otomatis menyimpan progres checkpoint belajarmu di cloud sehingga kamu bisa melanjutkan kapan saja.'
    ],
    proTip: 'Fokus tuntaskan satu alur belajar terlebih dahulu sebelum beralih untuk membentuk pemahaman fundamental yang kuat.',
    action: {
      to: '/learning',
      label: 'Pilih Jalur Belajar'
    }
  },
  {
    number: '03',
    category: 'coding',
    stageLabel: 'Tahap 3: Pelajaran Interaktif',
    icon: 'fa-solid fa-display',
    title: 'Menuntaskan Teori & Kuis 5-Dimensi',
    desc: 'Setiap lesson dirancang padat tanpa basa-basi: kombinasi konsep teori inti dan validasi pemahaman langsung.',
    checkpoints: [
      'Baca ringkasan konsep esensial pada tab Teori dengan diagram dan contoh kode bersih.',
      'Jawab Kuis 5-Dimensi yang menguji logika algoritma, sintaks, pemecahan bug, arsitektur, dan best practice.',
      'Dapatkan ulasan langsung pada setiap jawaban kuis untuk memahami letak kesalahan secara cepat.'
    ],
    proTip: 'Setiap jawaban kuis yang benar memberikan tambahan +15 XP dan membantu memperkuat rantai pemahaman sebelum menulis kode.',
    action: null
  },
  {
    number: '04',
    category: 'coding',
    stageLabel: 'Tahap 4: Praktik Koding Nyata',
    icon: 'fa-solid fa-terminal',
    title: 'Menguasai Coding Sandbox & Evaluasi Otomatis',
    desc: 'Bukan sekadar menonton video! Kamu langsung menulis kode di editor terintegrasi dengan validasi instan.',
    checkpoints: [
      'Tulis kode pada workspace editor browser dengan dukungan syntax highlighting dan auto-complete.',
      'Klik tombol "Jalankan Kode" untuk melihat output live di terminal console.',
      'Gunakan tombol "Uji Solusi" untuk mengevaluasi kode terhadap test cases otomatis yang teruji.',
      'Jika mengalami kebuntuan, gunakan tombol Hint cerdas untuk memandu langkah demi langkah.'
    ],
    proTip: 'Perhatikan pesan error pada terminal console; pesan error dibuat deskriptif untuk melatih kebiasaan debugging profesional.',
    action: {
      to: '/challenges',
      label: 'Coba Tantangan Coding'
    }
  },
  {
    number: '05',
    category: 'gamification',
    stageLabel: 'Tahap 5: Mekanisme Gamifikasi',
    icon: 'fa-solid fa-fire-flame-curved',
    title: 'Menaikkan Level XP, Daily Streak & Mengelola Energy',
    desc: 'Belajar coding dengan adrenalin layaknya bermain game RPG bersama ribuan coder Indonesia.',
    checkpoints: [
      'XP (Experience Points): Kumpulkan XP dari setiap lesson untuk meningkatkan rank Coder dan bersaing di Leaderboard.',
      'Daily Streak: Belajar minimal 1 lesson setiap hari agar streak tidak patah dan mendapatkan multiplier bonus XP.',
      'Energy (Jantung): Alokasi nyawa harian saat submit evaluasi. Terisi penuh otomatis setiap tengah malam.',
      'iCoinz: Koin reward yang kamu kumpulkan bisa dibelanjakan untuk avatar eksklusif atau refill energy instan.'
    ],
    proTip: 'Gunakan fitur pengingat belajar harian agar Daily Streak-mu tetap menyala dan tidak ter-reset ke angka 0.',
    action: {
      to: '/leaderboard',
      label: 'Pantau Leaderboard'
    }
  },
  {
    number: '06',
    category: 'cheatsheet',
    stageLabel: 'Tahap 6: Persiapan Karir Industri',
    icon: 'fa-solid fa-vault',
    title: 'Memaksimalkan Game Z Cheatsheet Vault & Bank Soal',
    desc: 'Referensi senjata wajib kerja: 24 modul cheatsheet sintaks lengkap dengan bank soal simulasi tes wawancara kerja.',
    checkpoints: [
      'Gunakan fitur Deep Search untuk mencari rumus spesifik (misal: "Count", "VLOOKUP", "Docker", "JWT").',
      'Preview langsung formula dan sintaks pada kartu cheatsheet sebelum masuk ke modul.',
      'Pelajari cheatsheet dengan mode baca per-materi yang nyaman dan bebas distraksi.',
      'Kerjakan latihan soal tes rekrutmen kerja dengan pembahasan mendalam di setiap akhir modul.'
    ],
    proTip: 'Simpan cheatsheet yang sering kamu gunakan sebagai PDF via tombol print atau bookmark di browser untuk acuan kerja harian.',
    action: {
      to: '/cheatsheet',
      label: 'Buka Cheatsheet Vault'
    }
  },
  {
    number: '07',
    category: 'shop',
    stageLabel: 'Tahap 7: Peningkatan Kapabilitas',
    icon: 'fa-solid fa-cart-shopping',
    title: 'GameZ Shop & Peningkatan Paket Langganan',
    desc: 'Buka seluruh potensi belajarmu dengan akses Pro atau Expert untuk persiapan karir tanpa hambatan.',
    checkpoints: [
      'Kunjungi GameZ Shop untuk menukarkan iCoinz dengan item boost atau booster pemulih Energy.',
      'Upgrade ke Pro Plan untuk menikmati seluruh alur belajar lanjutan, unlimited energy, dan e-Sertifikat resmi.',
      'Upgrade ke Expert Plan untuk akses tanpa batas ke 24 Cheatsheet Vault Full Page dan 305+ Bank Soal Teknis.',
      'Pembayaran otomatis instan via QRIS (BCA, Mandiri, BRI, GoPay, OVO, ShopeePay, DANA) aktif < 1 menit.'
    ],
    proTip: 'Paket langganan tidak menggunakan auto-debit diam-diam, kamu memiliki kontrol penuh kapan ingin memperpanjang akses.',
    action: {
      to: '/shop',
      label: 'Kunjungi GameZ Shop'
    }
  }
]

const filteredSteps = computed(() => {
  if (selectedStage.value === 'all') return steps
  return steps.filter(s => s.category === selectedStage.value)
})
</script>

<style scoped src="../assets/css/views/GuideView.css"></style>
