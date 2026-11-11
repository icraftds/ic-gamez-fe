<template>
  <div class="about-view">
    <SimpleBackground />

    <div class="about-container">
      <!-- 0. Top Navigation -->
      <div class="about-top-nav">
        <router-link to="/" class="back-link">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Kembali ke Beranda</span>
        </router-link>
      </div>

      <!-- 1. Hero Header -->
      <header class="about-header">
        <div class="hero-pill">
          <i class="fa-solid fa-rocket"></i>
          <span>Visi Edukasi Koding Modern</span>
        </div>
        <h1 class="about-title"><span class="gradient-text">Tentang iC Game-Z & iCraft Studio</span></h1>
        <p class="about-subtitle">
          Mendobrak cara lama belajar coding yang kaku. Mengubah kerumitan sintaks menjadi petualangan gamifikasi yang seru, interaktif, dan terarah menuju kesiapan karir industri nyata.
        </p>
      </header>

      <!-- 2. Platform Milestones & Stats Counter -->
      <section class="about-stats-grid" aria-label="Statistik Platform">
        <div class="stat-card">
          <div class="stat-number">24+</div>
          <div class="stat-label">Modul Cheatsheet Industri</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">100+</div>
          <div class="stat-label">Interactive Coding Lessons</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">305+</div>
          <div class="stat-label">Bank Soal Tes Rekrutmen</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">100%</div>
          <div class="stat-label">In-Browser Code Sandbox</div>
        </div>
      </section>

      <!-- 3. Our Origin Story & Mission -->
      <section class="about-story-card">
        <span class="story-badge">Latar Belakang & Filosofi</span>
        <h2>Mengapa Kami Membangun iC Game-Z?</h2>
        <div class="story-paragraphs">
          <p>
            Banyak orang bermimpi menjadi software engineer, data analyst, atau web developer. Namun di tengah jalan, lebih dari <strong>70% pemula menyerah</strong> karena tutorial video satu arah yang membosankan, frustrasi saat instalasi compiler lokal yang rumit, dan minimnya feedback saat kode mengalami error.
          </p>
          <p>
            Diinisiasi oleh tim <strong>iCraft Studio</strong> (iCraft Digital Service), kami merancang <strong>iC Game-Z</strong> dengan keyakinan kuat bahwa <em>"Belajar coding harus semenyenangkan dan se-adiktif bermain game RPG"</em>. Setiap sintaks yang kamu pelajari langsung dipraktikkan di code sandbox browser, setiap baris kode diuji secara instan oleh test runner otomatis, dan setiap tantangan yang berhasil diselesaikan diganjar dengan XP, kenaikan level, dan apresiasi nyata.
          </p>
        </div>
      </section>

      <!-- 4. 4 Core Pillars of iC Game-Z -->
      <section class="pillars-section">
        <div class="section-heading-center">
          <h2>4 Pilar Fondasi Pembelajaran</h2>
          <p>Standar kualitas yang kami pegang teguh di setiap alur belajar dan tantangan.</p>
        </div>

        <div class="pillars-grid">
          <div class="pillar-card">
            <div class="pillar-icon-wrap gaming">
              <i class="fa-solid fa-gamepad"></i>
            </div>
            <div class="pillar-content">
              <h3>Gamified Progression</h3>
              <p>Mekanisme XP harian, Daily Streak, Heart Energy, dan ranking Leaderboard yang memicu motivasi belajar konsisten setiap hari.</p>
            </div>
          </div>

          <div class="pillar-card">
            <div class="pillar-icon-wrap coding">
              <i class="fa-solid fa-laptop-code"></i>
            </div>
            <div class="pillar-content">
              <h3>Hands-On First</h3>
              <p>Tanpa video berjam-jam yang pasif. Anda langsung membaca intisari teori dan mengeksekusi kode di sandbox dengan feedback instan.</p>
            </div>
          </div>

          <div class="pillar-card">
            <div class="pillar-icon-wrap career">
              <i class="fa-solid fa-briefcase"></i>
            </div>
            <div class="pillar-content">
              <h3>Industry-Ready Stack</h3>
              <p>Kurikulum dan Cheatsheet disusun berdasarkan kebutuhan nyata industri teknologi masa kini (Fullstack, Cloud, Security, AI).</p>
            </div>
          </div>

          <div class="pillar-card">
            <div class="pillar-icon-wrap community">
              <i class="fa-solid fa-users"></i>
            </div>
            <div class="pillar-content">
              <h3>Inklusif & Terjangkau</h3>
              <p>Pendidikan teknologi berkualitas tinggi yang dapat diakses dengan mudah oleh pelajar, mahasiswa, dan career switcher di seluruh Indonesia.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Ecosystem & Call to Action -->
      <footer class="ecosystem-banner">
        <div class="ecosystem-text">
          <h3>Bagian dari Ekosistem iCraft Digital Service</h3>
          <p>Selain platform edukasi, iCraft Studio mengembangkan solusi software enterprise, mobile apps, dan infrastruktur cloud modern.</p>
        </div>
        <div class="ecosystem-actions">
          <a
            href="https://www.icraftds.id/"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-eco-site"
          >
            <span>Kunjungi iCraft Digital Service</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
          <router-link to="/learning" class="btn-eco-learning">
            <i class="fa-solid fa-graduation-cap"></i>
            <span>Mulai Belajar Sekarang</span>
          </router-link>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import SimpleBackground from '../components/common/SimpleBackground.vue'
</script>

<style scoped src="../assets/css/views/AboutView.css"></style>
