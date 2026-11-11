<template>
  <div class="guide-view">
    <SimpleBackground />

    <div class="guide-container">
      <!-- 0. Top Navigation -->
      <div class="guide-top-nav">
        <div class="top-nav-left">
          <router-link to="/" class="brand-link" title="Beranda iC Game-Z">
            <span class="brand-ic">iC</span>
            <span class="brand-gamez">Game-Z</span>
          </router-link>
          <span class="nav-sep">/</span>
          <div class="nav-breadcrumbs">
            <span>Pusat Panduan</span>
            <i class="fa-solid fa-chevron-right separator"></i>
            <span class="current">Panduan Pengguna</span>
          </div>
        </div>

        <div class="top-nav-right">
          <router-link to="/" class="back-link">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Kembali ke Beranda</span>
          </router-link>
        </div>
      </div>

      <!-- Master 2-Column Documentation Layout -->
      <div class="guide-layout-grid">
        <!-- LEFT COLUMN: Sticky Stage Navigator -->
        <aside class="guide-sidebar">
          <div class="sidebar-sticky-panel">
            <div class="sidebar-header">
              <span class="sidebar-subtitle">TAHAPAN PETUALANGAN</span>
              <span class="total-badge">6 Tahap</span>
            </div>

            <nav class="guide-stage-menu" aria-label="Tahapan Panduan">
              <button
                v-for="filter in stageFilters"
                :key="filter.id"
                type="button"
                class="stage-nav-btn"
                :class="{ active: selectedStage === filter.id }"
                @click="selectedStage = filter.id"
              >
                <div class="stage-btn-left">
                  <div class="stage-nav-icon">
                    <i :class="filter.icon"></i>
                  </div>
                  <span class="stage-nav-label">{{ filter.label }}</span>
                </div>
                <i class="fa-solid fa-chevron-right stage-arrow"></i>
              </button>
            </nav>

            <!-- Quick Start Hotline Card -->
            <div class="sidebar-guide-box">
              <div class="sg-icon">
                <i class="fa-solid fa-gamepad"></i>
              </div>
              <h4>Bingung Mulai dari Mana?</h4>
              <p>Konsultasikan alur belajar terbaik untuk target karirmu dengan tim mentor iCraft.</p>
              <a
                href="https://wa.me/6285174264123?text=Halo%20Tim%20Mentor%20iCraft,%20saya%20butuh%20rekomendasi%20alur%20belajar%20coding..."
                target="_blank"
                rel="noopener noreferrer"
                class="btn-guide-wa"
              >
                <i class="fa-brands fa-whatsapp"></i>
                <span>Tanya Mentor WhatsApp</span>
              </a>
            </div>
          </div>
        </aside>

        <!-- RIGHT COLUMN: Main Steps Stream -->
        <main class="guide-main-stream">
          <!-- Guide Header -->
          <header class="guide-doc-header">
            <h1 class="guide-title">Panduan Pengguna iC Game-Z</h1>
            <p class="guide-subtitle">
              Kuasai alur belajar gamifikasi, coding sandbox in-browser, sistem XP & Daily Streak, hingga persiapan teknis tes kerja.
            </p>
          </header>

          <!-- Steps Stream (Clean Typographic Flow) -->
          <div class="guide-steps-stream">
            <article
              v-for="step in filteredSteps"
              :key="step.number"
              class="guide-step-card"
            >
              <div class="step-card-header">
                <div class="step-number-wrap">
                  <span class="step-number">{{ step.number }}</span>
                  <div class="step-icon-bubble">
                    <i :class="step.icon"></i>
                  </div>
                </div>
                <div class="step-header-text">
                  <span class="step-stage-name">{{ step.stageLabel }}</span>
                  <h2 class="step-card-title">{{ step.title }}</h2>
                </div>
              </div>

              <div class="step-card-body">
                <p class="step-card-desc">{{ step.desc }}</p>

                <!-- Checkpoints Grid -->
                <div class="checkpoints-container">
                  <div
                    v-for="(point, pIdx) in step.checkpoints"
                    :key="pIdx"
                    class="cp-item"
                  >
                    <i class="fa-solid fa-circle-check cp-icon"></i>
                    <span>{{ point }}</span>
                  </div>
                </div>

                <!-- Pro-tip Box -->
                <div v-if="step.proTip" class="guide-pro-tip">
                  <i class="fa-solid fa-lightbulb tip-icon"></i>
                  <div class="tip-body">
                    <strong>Tips Coder:</strong> {{ step.proTip }}
                  </div>
                </div>

                <!-- Action Button -->
                <div v-if="step.action" class="step-action-bar">
                  <router-link :to="step.action.to" class="btn-step-navigate">
                    <span>{{ step.action.label }}</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  </router-link>
                </div>
              </div>
            </article>
          </div>

          <!-- Bottom Summary Banner -->
          <footer class="guide-dock-banner">
            <div class="dock-text">
              <h3>Siap Memulai Petualangan Coding?</h3>
              <p>Tentukan alur belajar pilihanmu hari ini dan buktikan kemampuanmu di leaderboard global.</p>
            </div>
            <div class="dock-actions">
              <router-link to="/learning" class="btn-dock-action-primary">
                <i class="fa-solid fa-graduation-cap"></i>
                <span>Jelajahi Alur Belajar</span>
              </router-link>
              <router-link to="/faq" class="btn-dock-action-secondary">
                <i class="fa-solid fa-circle-question"></i>
                <span>Buka FAQ</span>
              </router-link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'

const selectedStage = ref('all')

const stageFilters = [
  { id: 'all', label: 'Semua Tahapan', icon: 'fa-solid fa-list-check' },
  { id: 'start', label: 'Persona & Akun', icon: 'fa-solid fa-user-gear' },
  { id: 'path', label: 'Alur Belajar', icon: 'fa-solid fa-route' },
  { id: 'coding', label: 'Coding Sandbox', icon: 'fa-solid fa-code' },
  { id: 'gamification', label: 'XP & Gamifikasi', icon: 'fa-solid fa-fire' },
  { id: 'cheatsheet', label: 'Cheatsheet Vault', icon: 'fa-solid fa-vault' },
  { id: 'shop', label: 'Shop & Upgrade', icon: 'fa-solid fa-cart-shopping' }
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
      'Tautkan akun GitHub, LinkedIn, atau portofolio publikmu ke kartu profil Coder.'
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
      'Buka menu Alur Belajar untuk memilih spesialisasi (Frontend, Backend, SQL Database, Python Data, DevOps).',
      'Setiap alur terdiri dari Chapter tematik berjenjang mulai dari level dasar hingga studi kasus industri.',
      'Sistem otomatis menyimpan progres checkpoint belajarmu di cloud sehingga kamu bisa melanjutkan kapan saja.'
    ],
    proTip: 'Fokus tuntaskan satu alur belajar terlebih dahulu sebelum beralih untuk membentuk fondasi logika koding yang kokoh.',
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
    proTip: 'Setiap jawaban kuis yang benar memberikan tambahan +15 XP dan membantu memperkuat pemahaman sebelum menulis kode.',
    action: null
  },
  {
    number: '04',
    category: 'coding',
    stageLabel: 'Tahap 4: Praktik Koding Nyata',
    icon: 'fa-solid fa-laptop-code',
    title: 'Coding Sandbox & Automated Test Cases',
    desc: 'Tulis kode sesungguhnya di workspace editor browser tanpa perlu setup compiler lokal yang rumit.',
    checkpoints: [
      'Tulis kode solusi pada panel editor (mendukung HTML, CSS, JavaScript, Python, dan SQL Query).',
      'Tekan tombol Jalankan Kode untuk melihat output terminal instan dan verifikasi test case otomatis.',
      'Jika mengalami kebuntuan logika, gunakan tombol Hint AI untuk memperoleh petunjuk bertahap tanpa membocorkan jawaban.'
    ],
    proTip: 'Perhatikan pesan error terminal dengan teliti; debugging adalah keterampilan paling berharga seorang software engineer.',
    action: null
  },
  {
    number: '05',
    category: 'gamification',
    stageLabel: 'Tahap 5: Mekanisme XP & Energy',
    icon: 'fa-solid fa-bolt',
    title: 'Mempertahankan Daily Streak & Papan Peringkat',
    desc: 'Konsistensi adalah kunci utama menjadi developer handal. Sistem gamifikasi menjaga api semangat belajarmu.',
    checkpoints: [
      'Setiap aktivitas belajar menyumbang XP untuk menaikkan level rank dan memanjat Leaderboard global.',
      'Selesaikan minimal 1 lesson setiap hari sebelum pukul 23:59 WIB untuk mempertahankan Daily Streak.',
      'Energy (Jantung) berkurang bila solusi salah. Energy pulih otomatis setiap pukul 00:00 WIB atau melalui refill di GameZ Shop.'
    ],
    proTip: 'Daily Streak yang panjang memberikan bonus multiplier XP sehingga kamu lebih cepat menembus peringkat top 10.',
    action: {
      to: '/leaderboard',
      label: 'Cek Leaderboard'
    }
  },
  {
    number: '06',
    category: 'cheatsheet',
    stageLabel: 'Tahap 6: Cheatsheet & Sertifikasi',
    icon: 'fa-solid fa-award',
    title: 'Cheatsheet Vault & Klaim e-Sertifikat Resmi',
    desc: 'Persiapkan dirimu menembus technical interview dan lengkapi portofolio kredensial profesional.',
    checkpoints: [
      'Gunakan Cheatsheet Vault (24 modul rumus industri) untuk referensi cepat saat bekerja atau belajar.',
      'Latih pemahamanmu dengan bank soal ujian technical screening rekrutmen kerja.',
      'Klaim e-Sertifikat resmi ber-Credential ID dan QR verification setelah menuntaskan alur belajar.'
    ],
    proTip: 'Tautkan link e-Sertifikat ke profil LinkedIn dan CV kamu untuk meningkatkan daya tawar saat melamar kerja.',
    action: {
      to: '/cheatsheet',
      label: 'Buka Cheatsheet Vault'
    }
  }
]

const filteredSteps = computed(() => {
  if (selectedStage.value === 'all') return steps
  return steps.filter(s => s.category === selectedStage.value)
})
</script>

<style scoped src="../assets/css/views/GuideView.css"></style>
