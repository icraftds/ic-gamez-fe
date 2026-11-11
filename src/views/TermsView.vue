<template>
  <div class="terms-view">
    <SimpleBackground />

    <div class="terms-container">
      <!-- 0. Top Navigation -->
      <div class="terms-top-nav">
        <router-link to="/" class="back-link">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Kembali ke Beranda</span>
        </router-link>
      </div>

      <!-- 1. Header -->
      <header class="terms-header">
        <div class="hero-pill">
          <i class="fa-solid fa-scale-balanced"></i>
          <span>Ketentuan Layanan Resmi</span>
        </div>
        <h1 class="terms-title"><span class="gradient-text">Syarat & Ketentuan iC Game-Z</span></h1>
        <p class="terms-meta-date">
          Terakhir Diperbarui: <strong>10 November 2026</strong> &middot; Berlaku untuk Seluruh Pengguna Platform iCraft Studio
        </p>
      </header>

      <!-- 2. Section Jump Links -->
      <nav class="terms-nav-jump" aria-label="Lompat ke Klausul">
        <a href="#general-terms" class="jump-link-btn">
          <i class="fa-solid fa-circle-info"></i> 1. Ketentuan Umum
        </a>
        <a href="#account-terms" class="jump-link-btn">
          <i class="fa-solid fa-user-lock"></i> 2. Akun & Kredensial
        </a>
        <a href="#learning-integrity" class="jump-link-btn">
          <i class="fa-solid fa-code-branch"></i> 3. Integritas Belajar
        </a>
        <a href="#payment-subs" class="jump-link-btn">
          <i class="fa-solid fa-receipt"></i> 4. Pembayaran & Langganan
        </a>
        <a href="#intellectual-prop" class="jump-link-btn">
          <i class="fa-solid fa-copyright"></i> 5. Hak Kekayaan Intelektual
        </a>
        <a href="#service-availability" class="jump-link-btn">
          <i class="fa-solid fa-server"></i> 6. Ketersediaan Layanan
        </a>
      </nav>

      <!-- 3. Legal Agreement Notice -->
      <div class="terms-agreement-alert">
        <div class="alert-icon">
          <i class="fa-solid fa-file-contract"></i>
        </div>
        <div class="alert-text">
          <p>
            <strong>Persetujuan Pengguna:</strong> Dengan mendaftar akun, mengakses, atau menggunakan platform <strong>iC Game-Z</strong>, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat secara hukum oleh seluruh Syarat & Ketentuan ini.
          </p>
        </div>
      </div>

      <!-- 4. Legal Clauses List -->
      <main class="terms-clauses-stack">
        <!-- Clause 1 -->
        <article id="general-terms" class="clause-card">
          <div class="clause-header">
            <div class="clause-icon">
              <i class="fa-solid fa-circle-info"></i>
            </div>
            <h2>1. Ketentuan Umum & Definisi</h2>
          </div>
          <div class="clause-body">
            <p>
              Platform <strong>iC Game-Z</strong> ("Platform") dikelola dan dioperasikan secara resmi oleh <strong>iCraft Studio</strong> (iCraft Digital Service, "Kami").
            </p>
            <p>
              "Pengguna" atau "Anda" adalah setiap individu yang mengakses platform, baik sebagai pengguna gratis, pembeli item di GameZ Shop, maupun pelanggan paket langganan Pro atau Expert.
            </p>
            <p>
              Kami berhak sewaktu-waktu memperbarui atau mengubah Syarat & Ketentuan ini untuk menyesuaikan dengan regulasi hukum yang berlaku atau pembaruan fitur platform. Perubahan penting akan diumumkan melalui notifikasi di dalam platform atau email resmi.
            </p>
          </div>
        </article>

        <!-- Clause 2 -->
        <article id="account-terms" class="clause-card">
          <div class="clause-header">
            <div class="clause-icon">
              <i class="fa-solid fa-user-lock"></i>
            </div>
            <h2>2. Pendaftaran Akun & Tanggung Jawab Kredensial</h2>
          </div>
          <div class="clause-body">
            <ul>
              <li>Anda wajib memberikan informasi yang akurat dan sah saat mendaftarkan akun di platform.</li>
              <li>Satu akun hanya diperuntukkan bagi <strong>satu individu pengguna</strong>. Dilarang keras membagikan kredensial login (username/password/token sesi) kepada orang lain untuk digunakan secara bersamaan (account sharing).</li>
              <li>Anda bertanggung jawab penuh atas seluruh aktivitas yang terjadi di bawah akun Anda. Jika mencurigai adanya akses tanpa izin, Anda wajib segera mengubah kata sandi dan memberitahu tim dukungan kami.</li>
              <li>Kami berhak menolak pendaftaran atau menonaktifkan akun yang terindikasi menggunakan identitas palsu atau melanggar ketentuan.</li>
            </ul>
          </div>
        </article>

        <!-- Clause 3 -->
        <article id="learning-integrity" class="clause-card">
          <div class="clause-header">
            <div class="clause-icon">
              <i class="fa-solid fa-code-branch"></i>
            </div>
            <h2>3. Integritas Belajar & Aturan Komunitas</h2>
          </div>
          <div class="clause-body">
            <p>Untuk menjaga ekosistem belajar yang adil, jujur, dan menyenangkan bagi seluruh coder, Anda dilarang untuk:</p>
            <ul>
              <li>Menggunakan skrip otomatis, bot, scraper, atau alat bantu eksternal untuk mengumpulkan XP, menyelesaikan lesson, atau memanipulasi posisi di Leaderboard secara curang.</li>
              <li>Mencoba mengeksploitasi bug sistem, melakukan reverse engineering, bypass sandbox container, atau menyisipkan kode berbahaya (malware / remote code execution) pada compiler editor browser.</li>
              <li>Melakukan tindakan pelecehan, ujaran kebencian, spamming, atau peretasan terhadap akun pengguna lain.</li>
            </ul>
            <div class="clause-highlight-box">
              <i class="fa-solid fa-triangle-exclamation"></i> Akun yang terbukti melakukan kecurangan sistemik atau eksploitasi celah compiler akan dikenakan sanksi diskualifikasi dari Leaderboard hingga pemblokiran akun permanen tanpa pengembalian dana.
            </div>
          </div>
        </article>

        <!-- Clause 4 -->
        <article id="payment-subs" class="clause-card">
          <div class="clause-header">
            <div class="clause-icon">
              <i class="fa-solid fa-receipt"></i>
            </div>
            <h2>4. Paket Langganan & Kebijakan Pembayaran</h2>
          </div>
          <div class="clause-body">
            <ul>
              <li><strong>Paket Langganan (Pro & Expert):</strong> Memberikan hak akses terhadap fitur-fitur eksklusif (seperti materi tingkat lanjut, unlimited energy, 24 Cheatsheet Vault, 305+ Bank Soal, dan sertifikat resmi) selama masa aktif yang dipilih (30 hari, 90 hari, atau 365 hari).</li>
              <li><strong>Metode Pembayaran:</strong> Pembayaran diproses secara instan dan otomatis menggunakan QRIS melalui payment gateway resmi berizin Bank Indonesia.</li>
              <li><strong>Kebijakan Konten Digital & Refund:</strong> Karena akses terhadap materi digital langsung terbuka secara instan setelah pembayaran terverifikasi, transaksi yang telah berhasil pada dasarnya <strong>bersifat final dan tidak dapat dibatalkan (non-refundable)</strong>, kecuali terjadi kesalahan penagihan ganda (double charge) pada sistem kami yang dapat dibuktikan dengan mutasi perbankan.</li>
              <li><strong>Tanpa Auto-Debet Diam-diam:</strong> Kami tidak menyimpan nomor kartu kredit atau memberlakukan perpanjangan otomatis diam-diam. Anda memegang kendali penuh kapan ingin memperpanjang paket.</li>
            </ul>
          </div>
        </article>

        <!-- Clause 5 -->
        <article id="intellectual-prop" class="clause-card">
          <div class="clause-header">
            <div class="clause-icon">
              <i class="fa-solid fa-copyright"></i>
            </div>
            <h2>5. Hak Kekayaan Intelektual</h2>
          </div>
          <div class="clause-body">
            <p>
              Seluruh kurikulum alur belajar, naskah materi, soal kuis, aset visual/ilustrasi, modul cheatsheet, algoritma evaluasi kode, serta merek dagang <strong>iC Game-Z</strong> dan <strong>iCraft Studio</strong> adalah hak kekayaan intelektual eksklusif milik iCraft Studio yang dilindungi oleh undang-undang hak cipta Republik Indonesia.
            </p>
            <p>
              Pengguna diberikan lisensi terbatas, non-eksklusif, dan tidak dapat dipindahtangankan semata-mata untuk keperluan pembelajaran pribadi non-komersial. Dilarang keras mendistribusikan ulang, menyalin secara massal, menjual kembali, atau mempublikasikan materi berbayar iC Game-Z ke platform lain tanpa izin tertulis dari kami.
            </p>
          </div>
        </article>

        <!-- Clause 6 -->
        <article id="service-availability" class="clause-card">
          <div class="clause-header">
            <div class="clause-icon">
              <i class="fa-solid fa-server"></i>
            </div>
            <h2>6. Ketersediaan Layanan & Batasan Tanggung Jawab</h2>
          </div>
          <div class="clause-body">
            <p>
              Kami berupaya keras menjaga ketersediaan layanan platform (uptime) setinggi mungkin. Namun demikian, pemeliharaan sistem terencana (scheduled maintenance), pembaruan server, atau gangguan jaringan infrastruktur pihak ketiga dapat menyebabkan layanan tidak dapat diakses untuk sementara waktu.
            </p>
            <p>
              iC Game-Z disediakan berdasarkan prinsip <em>"sebagaimana adanya" (as is)</em>. Kami tidak bertanggung jawab atas kerugian tidak langsung atau kehilangan data akibat kelalaian pengguna dalam menjaga kerahasiaan kredensial akun pribadinya.
            </p>
          </div>
        </article>
      </main>

      <!-- 5. Bottom Legal Support Contact Box -->
      <footer class="terms-bottom-box">
        <div class="bottom-box-text">
          <h3>Perlu Konsultasi Terkait Ketentuan Layanan?</h3>
          <p>Untuk pertanyaan hukum, perizinan institusi, atau kemitraan edukasi, hubungi divisi legal kami.</p>
        </div>
        <router-link to="/hubungi-kami" class="btn-contact-legal">
          <i class="fa-solid fa-envelope"></i>
          <span>Hubungi Tim Legal</span>
        </router-link>
      </footer>
    </div>
  </div>
</template>

<script setup>
import SimpleBackground from '../components/common/SimpleBackground.vue'
</script>

<style scoped src="../assets/css/views/TermsView.css"></style>
