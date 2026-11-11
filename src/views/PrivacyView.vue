<template>
  <div class="privacy-view">
    <SimpleBackground />

    <div class="privacy-container">
      <!-- 0. Top Navigation -->
      <div class="privacy-top-nav">
        <router-link to="/" class="back-link">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Kembali ke Beranda</span>
        </router-link>
      </div>

      <!-- 1. Header -->
      <header class="privacy-header">
        <div class="hero-pill">
          <i class="fa-solid fa-shield-halved"></i>
          <span>Perlindungan Data Pribadi</span>
        </div>
        <h1 class="privacy-title"><span class="gradient-text">Kebijakan Privasi iC Game-Z</span></h1>
        <p class="privacy-meta-date">
          Terakhir Diperbarui: <strong>10 November 2026</strong> &middot; Berlaku Efektif untuk Seluruh Layanan iCraft Studio
        </p>
      </header>

      <!-- 2. Section Jump Links -->
      <nav class="privacy-nav-jump" aria-label="Lompat ke Pasal">
        <a href="#data-collected" class="jump-link-btn">
          <i class="fa-solid fa-database"></i> 1. Data yang Dikumpulkan
        </a>
        <a href="#data-usage" class="jump-link-btn">
          <i class="fa-solid fa-chart-line"></i> 2. Penggunaan Data
        </a>
        <a href="#data-security" class="jump-link-btn">
          <i class="fa-solid fa-lock"></i> 3. Keamanan & Enkripsi
        </a>
        <a href="#third-parties" class="jump-link-btn">
          <i class="fa-solid fa-handshake"></i> 4. Pihak Ketiga & Pembayaran
        </a>
        <a href="#cookies" class="jump-link-btn">
          <i class="fa-solid fa-cookie"></i> 5. Cookies & Sesi
        </a>
        <a href="#user-rights" class="jump-link-btn">
          <i class="fa-solid fa-user-check"></i> 6. Hak Pengguna
        </a>
      </nav>

      <!-- 3. Trust Commitment Alert -->
      <div class="privacy-trust-alert">
        <div class="trust-icon">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <div class="trust-text">
          <p>
            <strong>Komitmen Mutlak Privasi:</strong> iCraft Studio menghargai privasi Anda sepenuhnya. Kami <strong>tidak pernah dan tidak akan pernah menjual, menyewakan, atau memperdagangkan data pribadi Anda</strong> kepada pihak ketiga mana pun untuk tujuan iklan eksternal.
          </p>
        </div>
      </div>

      <!-- 4. Legal Clauses List -->
      <main class="privacy-clauses-stack">
        <!-- Clause 1 -->
        <article id="data-collected" class="clause-card">
          <div class="clause-header">
            <div class="clause-icon">
              <i class="fa-solid fa-database"></i>
            </div>
            <h2>1. Informasi yang Kami Kumpulkan</h2>
          </div>
          <div class="clause-body">
            <p>Untuk menyelenggarakan platform pembelajaran coding yang interaktif dan memantau kemajuan belajarmu, kami mengumpulkan jenis informasi berikut:</p>
            <ul>
              <li><strong>Informasi Akun:</strong> Nama lengkap, alamat email, username, dan foto profil yang Anda berikan saat mendaftar akun atau login via SSO Google/iCraft ID.</li>
              <li><strong>Data Pembelajaran & Gamifikasi:</strong> Riwayat penyelesaian lesson, persentase progres alur belajar, perolehan XP (Experience Points), status streak harian, saldo iCoinz, sisa Energy, dan posisi di Leaderboard publik.</li>
              <li><strong>Data Submission Koding:</strong> Kode solusi yang Anda kirimkan pada workspace editor untuk dievaluasi oleh test runner otomatis.</li>
              <li><strong>Data Transaksi & Pembayaran:</strong> Catatan pembelian paket langganan (Pro / Expert) atau item Shop, meliputi nomor Invoice, nominal, tanggal transaksi, dan status verifikasi gateway. <em>(Catatan: Kami tidak pernah menyimpan nomor kartu kredit, PIN, atau kredensial perbankan Anda).</em></li>
              <li><strong>Data Teknis Log:</strong> Alamat IP, tipe peramban (browser), sistem operasi, dan waktu akses untuk kepentingan keamanan audit server dan pencegahan fraud.</li>
            </ul>
          </div>
        </article>

        <!-- Clause 2 -->
        <article id="data-usage" class="clause-card">
          <div class="clause-header">
            <div class="clause-icon">
              <i class="fa-solid fa-chart-line"></i>
            </div>
            <h2>2. Tujuan Penggunaan Informasi</h2>
          </div>
          <div class="clause-body">
            <p>Data yang dikumpulkan dipergunakan semata-mata untuk tujuan:</p>
            <ul>
              <li>Menyediakan, mengelola, dan memelihara seluruh fitur interaktif di platform iC Game-Z.</li>
              <li>Menghitung perolehan XP, level kemajuan coder, dan menampilkan peringkat leaderboard yang adil.</li>
              <li>Memproses transaksi pembayaran paket langganan secara instan melalui sistem QRIS.</li>
              <li>Mengirimkan notifikasi penting terkait keamanan akun, bukti pembayaran invoice, pembaruan kurikulum, dan pengingat streak harian.</li>
              <li>Mendeteksi, mencegah, dan menanggulangi upaya kecurangan (seperti botting submit otomatis atau penyalahgunaan sandbox).</li>
            </ul>
          </div>
        </article>

        <!-- Clause 3 -->
        <article id="data-security" class="clause-card">
          <div class="clause-header">
            <div class="clause-icon">
              <i class="fa-solid fa-lock"></i>
            </div>
            <h2>3. Keamanan & Enkripsi Data</h2>
          </div>
          <div class="clause-body">
            <p>Kami menerapkan standar keamanan industri modern untuk melindungi data Anda dari akses yang tidak sah, pengubahan, atau kebocoran:</p>
            <ul>
              <li><strong>Enkripsi Transport Layer:</strong> Seluruh komunikasi antara browser Anda dan server kami dilindungi oleh enkripsi <strong>HTTPS / TLS 1.3</strong> dengan sertifikat SSL 256-bit.</li>
              <li><strong>Penyimpanan Kata Sandi:</strong> Password akun dienkripsi menggunakan algoritma cryptographic hash searah modern (Bcrypt / Argon2) dan tidak pernah disimpan dalam format teks biasa (plain text).</li>
              <li><strong>Session Cookie Aman:</strong> Token autentikasi disimpan di browser menggunakan flag <code>HttpOnly</code>, <code>Secure</code>, dan <code>SameSite=Lax/Strict</code> guna memitigasi serangan Cross-Site Scripting (XSS).</li>
            </ul>
            <div class="clause-highlight-box">
              <i class="fa-solid fa-shield"></i> Kami mengaudit dan memantau kerentanan sistem secara berkala berpedoman pada standar keamanan OWASP Top 10.
            </div>
          </div>
        </article>

        <!-- Clause 4 -->
        <article id="third-parties" class="clause-card">
          <div class="clause-header">
            <div class="clause-icon">
              <i class="fa-solid fa-handshake"></i>
            </div>
            <h2>4. Pembagian Data kepada Pihak Ketiga</h2>
          </div>
          <div class="clause-body">
            <p>Kami hanya membagikan data kepada pihak ketiga dalam batas minimum yang mutlak diperlukan untuk operasional platform:</p>
            <ul>
              <li><strong>Penyedia Layanan Pembayaran (Payment Gateway):</strong> Kami bermitra dengan payment gateway resmi berlisensi Bank Indonesia untuk memproses transaksi QRIS. Data yang dibagikan hanyalah nominal transaksi dan ID referensi pesanan.</li>
              <li><strong>Kewajiban Hukum:</strong> Kami hanya akan mengungkapkan data pengguna jika diwajibkan oleh proses hukum yang sah (perintah pengadilan atau lembaga penegak hukum Republik Indonesia) sesuai perundang-undangan yang berlaku.</li>
            </ul>
          </div>
        </article>

        <!-- Clause 5 -->
        <article id="cookies" class="clause-card">
          <div class="clause-header">
            <div class="clause-icon">
              <i class="fa-solid fa-cookie"></i>
            </div>
            <h2>5. Kebijakan Cookies & Local Storage</h2>
          </div>
          <div class="clause-body">
            <p>iC Game-Z menggunakan cookies dan penyimpanan lokal peramban (localStorage) untuk:</p>
            <ul>
              <li>Menjaga status sesi login Anda agar tidak perlu memasukkan email dan password berulang kali.</li>
              <li>Menyimpan preferensi mode tampilan visual (Dark Mode vs Light Mode).</li>
              <li>Menyimpan preferensi tampilan materi dan cache kemajuan koding lokal untuk performa yang lebih responsif.</li>
            </ul>
            <p>Anda dapat mengontrol atau menghapus cookies melalui pengaturan peramban Anda, namun penonaktifan cookies sesi dapat menyebabkan Anda tidak dapat login ke dalam platform.</p>
          </div>
        </article>

        <!-- Clause 6 -->
        <article id="user-rights" class="clause-card">
          <div class="clause-header">
            <div class="clause-icon">
              <i class="fa-solid fa-user-check"></i>
            </div>
            <h2>6. Hak Pengguna atas Data Pribadi</h2>
          </div>
          <div class="clause-body">
            <p>Sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP), Anda memiliki hak penuh untuk:</p>
            <ul>
              <li><strong>Hak Akses & Perbaikan:</strong> Memeriksa dan memperbarui data profil akun Anda kapan saja melalui menu Edit Profil.</li>
              <li><strong>Hak Portabilitas:</strong> Meminta ringkasan data riwayat belajar dan sertifikat kompetensi yang telah Anda raih.</li>
              <li><strong>Hak Penghapusan Akun:</strong> Mengajukan permohonan penutupan dan penghapusan akun secara permanen beserta seluruh riwayat data terkait dari server kami.</li>
            </ul>
          </div>
        </article>
      </main>

      <!-- 5. Bottom DPO Contact Box -->
      <footer class="privacy-bottom-contact">
        <div class="bottom-contact-text">
          <h3>Pertanyaan Terkait Kebijakan Privasi?</h3>
          <p>Jika Anda memiliki pertanyaan atau ingin menggunakan hak privasi Anda, hubungi Data Protection Officer (DPO) kami.</p>
        </div>
        <router-link to="/hubungi-kami" class="btn-contact-dpo">
          <i class="fa-solid fa-envelope"></i>
          <span>Hubungi Tim Privasi</span>
        </router-link>
      </footer>
    </div>
  </div>
</template>

<script setup>
import SimpleBackground from '../components/common/SimpleBackground.vue'
</script>

<style scoped src="../assets/css/views/PrivacyView.css"></style>
