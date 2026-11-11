<template>
  <div class="terms-view">
    <SimpleBackground />

    <div class="terms-container">
      <!-- 0. Top Navigation -->
      <div class="terms-top-nav">
        <div class="top-nav-left">
          <router-link to="/" class="brand-link" title="Beranda iC Game-Z">
            <img src="/images/Logo iC GameZ Lightmode.png" alt="iC Game-Z" class="brand-logo-img logo-light" />
            <img src="/images/Logo iC GameZ darkmode.png" alt="iC Game-Z" class="brand-logo-img logo-dark" />
          </router-link>
          <span class="nav-sep">/</span>
          <div class="nav-breadcrumbs">
            <span>Pusat Kebijakan</span>
            <i class="fa-solid fa-chevron-right separator"></i>
            <span class="current">Syarat & Ketentuan</span>
          </div>
        </div>

        <div class="top-nav-right">
          <router-link to="/" class="back-link">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Kembali ke Beranda</span>
          </router-link>
        </div>
      </div>

      <!-- Master 2-Column Documentation Layout (Stripe & Apple Legal Style) -->
      <div class="terms-layout-grid">
        <!-- LEFT COLUMN: Sticky Table of Contents Navigator -->
        <aside class="terms-sidebar">
          <div class="sidebar-sticky-panel">
            <div class="sidebar-header">
              <span class="sidebar-subtitle">DAFTAR KLAUSUL</span>
              <span class="total-badge">{{ sections.length }} Pasal</span>
            </div>

            <!-- Quick Search inside Sidebar -->
            <div class="sidebar-search-box">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari kata kunci pasal..."
                class="sidebar-search-input"
              />
              <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''" title="Bersihkan">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <nav class="toc-menu" aria-label="Daftar Isi Syarat & Ketentuan">
              <button
                type="button"
                class="toc-item-link"
                :class="{ active: activeSection === 'all' && !searchQuery }"
                @click="selectSection('all')"
              >
                <div class="toc-btn-left">
                  <span class="toc-icon"><i class="fa-solid fa-layer-group"></i></span>
                  <span class="toc-label">Semua Klausul (Lengkap)</span>
                </div>
                <span class="toc-badge-all">{{ sections.length }}</span>
              </button>

              <div class="toc-divider"></div>

              <button
                v-for="item in sections"
                :key="item.id"
                type="button"
                class="toc-item-link"
                :class="{ active: activeSection === item.id && !searchQuery }"
                @click="selectSection(item.id)"
              >
                <div class="toc-btn-left">
                  <span class="toc-num">{{ item.num }}</span>
                  <span class="toc-label">{{ item.title }}</span>
                </div>
                <i class="fa-solid fa-chevron-right toc-arrow"></i>
              </button>
            </nav>

            <!-- Legal Inquiry Box in Sidebar -->
            <div class="sidebar-legal-card">
              <div class="legal-icon">
                <i class="fa-solid fa-scale-balanced"></i>
              </div>
              <h4>Bantuan & Kepatuhan Legal</h4>
              <p>Pertanyaan seputar lisensi edukasi atau syarat institusi dapat dikonsultasikan via WhatsApp Hotline.</p>
              <a
                href="https://wa.me/6285174264123?text=Halo%20Tim%20Legal%20iCraft,%20saya%20ingin%20berkonsultasi%20terkait%20ketentuan%20layanan..."
                target="_blank"
                rel="noopener noreferrer"
                class="btn-legal-wa"
              >
                <i class="fa-brands fa-whatsapp"></i>
                <span>Hotline Legal WhatsApp</span>
              </a>
            </div>
          </div>
        </aside>

        <!-- RIGHT COLUMN: Main Document Articles Stream -->
        <main class="terms-main-stream">
          <!-- Document Header -->
          <header class="terms-doc-header">
            <h1 class="terms-title">Syarat & Ketentuan Layanan iC Game-Z</h1>
            <p class="terms-meta-date">
              Terakhir Diperbarui: <strong>10 November 2026</strong> &middot; Berlaku untuk Seluruh Pengguna Platform PT. Nirmala Kreasi Bersama
            </p>
          </header>

          <!-- Agreement Notice Banner -->
          <div class="terms-agreement-banner">
            <div class="agreement-icon-box">
              <i class="fa-solid fa-file-contract"></i>
            </div>
            <div class="agreement-text">
              <strong>Persetujuan Pengguna:</strong> Dengan mendaftar akun, mengakses, atau menggunakan platform <strong>iC Game-Z</strong>, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat secara sah oleh seluruh Syarat & Ketentuan ini.
            </div>
          </div>

          <!-- Active Focus Bar (Tampil saat memilih salah satu pasal) -->
          <div v-if="activeSection !== 'all' && !searchQuery && currentSection" class="active-clause-bar">
            <div class="clause-indicator">
              <span class="clause-pill">Pasal {{ currentSection.num }} dari {{ sections.length }}</span>
              <span class="clause-current-name">{{ currentSection.title }}</span>
            </div>
            <button class="btn-view-all" @click="selectSection('all')">
              <i class="fa-solid fa-layer-group"></i>
              <span>Tampilkan Semua Pasal</span>
            </button>
          </div>

          <!-- Search Result Bar -->
          <div v-if="searchQuery" class="active-clause-bar search-bar-result">
            <div class="clause-indicator">
              <span class="clause-pill"><i class="fa-solid fa-magnifying-glass"></i> Cari</span>
              <span class="clause-current-name">Filter: "{{ searchQuery }}" ({{ matchedSectionIds.length }} pasal cocok)</span>
            </div>
            <button class="btn-view-all" @click="searchQuery = ''">
              <i class="fa-solid fa-xmark"></i>
              <span>Bersihkan</span>
            </button>
          </div>

          <!-- Empty search state -->
          <div v-if="searchQuery && matchedSectionIds.length === 0" class="empty-search-box">
            <i class="fa-solid fa-circle-question empty-icon"></i>
            <p>Tidak ditemukan pasal yang memuat kata kunci "<strong>{{ searchQuery }}</strong>".</p>
            <button class="btn-view-all" @click="searchQuery = ''">Kembali ke Semua Pasal</button>
          </div>

          <!-- Document Articles (Clean Typographic Dividers - No Box Monotony) -->
          <div class="terms-articles-list">
            <!-- Article 1 -->
            <article
              v-show="isSectionVisible('general-terms')"
              id="general-terms"
              class="policy-article"
              :class="{ 'single-focused': activeSection === 'general-terms' && !searchQuery }"
            >
              <div class="article-header">
                <span class="article-num">01</span>
                <h2>Ketentuan Umum & Definisi</h2>
              </div>
              <div class="article-body">
                <p>
                  Platform <strong>iC Game-Z</strong> ("Platform") dikelola dan dioperasikan secara resmi oleh <strong>PT. Nirmala Kreasi Bersama</strong> melalui divisi teknologi <strong>iCraft Digital Service</strong> ("Kami").
                </p>
                <p>
                  "Pengguna" atau "Anda" adalah setiap individu yang mengakses platform, baik sebagai pengguna gratis, pembeli item di GameZ Shop, maupun pelanggan paket langganan Pro atau Expert.
                </p>
                <p>
                  Kami berhak sewaktu-waktu memperbarui atau mengubah Syarat & Ketentuan ini untuk menyesuaikan dengan regulasi hukum yang berlaku atau pembaruan fitur platform. Perubahan penting akan diumumkan melalui notifikasi di dalam platform atau email resmi.
                </p>
              </div>
            </article>

            <!-- Article 2 -->
            <article
              v-show="isSectionVisible('account-terms')"
              id="account-terms"
              class="policy-article"
              :class="{ 'single-focused': activeSection === 'account-terms' && !searchQuery }"
            >
              <div class="article-header">
                <span class="article-num">02</span>
                <h2>Pendaftaran Akun & Tanggung Jawab Kredensial</h2>
              </div>
              <div class="article-body">
                <ul class="policy-bullets">
                  <li>Anda wajib memberikan informasi yang akurat dan sah saat mendaftarkan akun di platform.</li>
                  <li>Satu akun hanya diperuntukkan bagi <strong>satu individu pengguna</strong>. Dilarang keras membagikan kredensial login (username/password/token sesi) kepada orang lain untuk digunakan secara bersamaan (account sharing).</li>
                  <li>Anda bertanggung jawab penuh atas seluruh aktivitas yang terjadi di bawah akun Anda. Jika mencurigai adanya akses tanpa izin, Anda wajib segera mengubah kata sandi dan memberitahu tim dukungan kami.</li>
                  <li>Kami berhak menolak pendaftaran atau menonaktifkan akun yang terindikasi menggunakan identitas palsu atau melanggar ketentuan.</li>
                </ul>
              </div>
            </article>

            <!-- Article 3 -->
            <article
              v-show="isSectionVisible('learning-integrity')"
              id="learning-integrity"
              class="policy-article"
              :class="{ 'single-focused': activeSection === 'learning-integrity' && !searchQuery }"
            >
              <div class="article-header">
                <span class="article-num">03</span>
                <h2>Integritas Belajar & Aturan Komunitas</h2>
              </div>
              <div class="article-body">
                <p>Untuk menjaga ekosistem belajar yang adil, jujur, dan menyenangkan bagi seluruh coder, Anda dilarang untuk:</p>
                <ul class="policy-bullets">
                  <li>Menggunakan skrip otomatis, bot, scraper, atau alat bantu eksternal untuk mengumpulkan XP, menyelesaikan lesson, atau memanipulasi posisi di Leaderboard secara curang.</li>
                  <li>Mencoba mengeksploitasi celah sistem, melakukan reverse engineering, bypass sandbox container, atau menyisipkan kode berbahaya (malware / remote code execution) pada compiler editor browser.</li>
                  <li>Melakukan tindakan pelecehan, ujaran kebencian, spamming, atau peretasan terhadap akun pengguna lain.</li>
                </ul>
                <div class="policy-warning-card">
                  <i class="fa-solid fa-triangle-exclamation warning-icon"></i>
                  <div>
                    <strong>Sanksi Pelanggaran:</strong> Akun yang terbukti melakukan kecurangan sistemik atau eksploitasi celah compiler akan dikenakan sanksi diskualifikasi dari Leaderboard hingga pemblokiran akun permanen tanpa pengembalian dana.
                  </div>
                </div>
              </div>
            </article>

            <!-- Article 4 -->
            <article
              v-show="isSectionVisible('payment-subs')"
              id="payment-subs"
              class="policy-article"
              :class="{ 'single-focused': activeSection === 'payment-subs' && !searchQuery }"
            >
              <div class="article-header">
                <span class="article-num">04</span>
                <h2>Paket Langganan & Kebijakan Pembayaran</h2>
              </div>
              <div class="article-body">
                <ul class="policy-bullets">
                  <li><strong>Paket Langganan (Pro & Expert):</strong> Memberikan hak akses terhadap fitur eksklusif (alur materi lanjutan, unlimited energy, 24 Cheatsheet Vault, bank soal tes kerja, dan sertifikat resmi) selama durasi yang dipilih.</li>
                  <li><strong>Metode Pembayaran:</strong> Pembayaran diproses secara instan dan otomatis menggunakan standar QRIS nasional melalui gateway berlisensi Bank Indonesia.</li>
                  <li><strong>Kebijakan Konten Digital & Refund:</strong> Karena akses terhadap materi langsung terbuka instan setelah pembayaran terverifikasi, transaksi pada dasarnya <strong>bersifat final dan tidak dapat dibatalkan (non-refundable)</strong>, kecuali terjadi kesalahan penagihan ganda (double charge) pada sistem kami yang terbukti mutasi perbankan.</li>
                  <li><strong>Tanpa Auto-Debet Diam-diam:</strong> Kami tidak menyimpan nomor kartu kredit atau memberlakukan perpanjangan otomatis tanpa persetujuan. Anda memegang kendali penuh kapan ingin memperpanjang paket.</li>
                </ul>
              </div>
            </article>

            <!-- Article 5 -->
            <article
              v-show="isSectionVisible('intellectual-prop')"
              id="intellectual-prop"
              class="policy-article"
              :class="{ 'single-focused': activeSection === 'intellectual-prop' && !searchQuery }"
            >
              <div class="article-header">
                <span class="article-num">05</span>
                <h2>Hak Kekayaan Intelektual</h2>
              </div>
              <div class="article-body">
                <p>
                  Seluruh kurikulum alur belajar, naskah materi, soal kuis, aset visual/ilustrasi, modul cheatsheet, algoritma evaluasi kode, serta merek dagang <strong>iC Game-Z</strong> dan <strong>iCraft Digital Service</strong> adalah hak kekayaan intelektual eksklusif milik <strong>PT. Nirmala Kreasi Bersama</strong> yang dilindungi undang-undang hak cipta Republik Indonesia.
                </p>
                <p>
                  Pengguna diberikan lisensi terbatas, non-eksklusif, dan tidak dapat dipindahtangankan semata-mata untuk keperluan pembelajaran pribadi non-komersial. Dilarang keras mendistribusikan ulang, menyalin secara massal, menjual kembali, atau mempublikasikan materi berbayar iC Game-Z ke platform lain tanpa izin tertulis dari kami.
                </p>
              </div>
            </article>

            <!-- Article 6 -->
            <article
              v-show="isSectionVisible('service-availability')"
              id="service-availability"
              class="policy-article"
              :class="{ 'single-focused': activeSection === 'service-availability' && !searchQuery }"
            >
              <div class="article-header">
                <span class="article-num">06</span>
                <h2>Ketersediaan Layanan & Batasan Tanggung Jawab</h2>
              </div>
              <div class="article-body">
                <p>
                  Kami berupaya keras menjaga ketersediaan layanan platform setinggi mungkin. Namun demikian, pemeliharaan sistem terencana (scheduled maintenance), pembaruan server, atau gangguan jaringan infrastruktur pihak ketiga dapat menyebabkan layanan tidak dapat diakses untuk sementara waktu.
                </p>
                <p>
                  iC Game-Z disediakan berdasarkan prinsip <em>"sebagaimana adanya" (as is)</em>. Kami tidak bertanggung jawab atas kerugian tidak langsung atau kehilangan data akibat kelalaian pengguna dalam menjaga kerahasiaan kredensial akun pribadinya.
                </p>
              </div>
            </article>
          </div>

          <!-- Bottom Clause Pagination (Hanya tampil saat mode pasal tunggal) -->
          <div v-if="activeSection !== 'all' && !searchQuery && currentSection" class="clause-pagination">
            <button
              v-if="prevSection"
              type="button"
              class="btn-clause-nav prev"
              @click="selectSection(prevSection.id)"
            >
              <i class="fa-solid fa-arrow-left"></i>
              <div class="nav-text">
                <span class="nav-label">Pasal Sebelumnya</span>
                <span class="nav-title">{{ prevSection.num }}. {{ prevSection.title }}</span>
              </div>
            </button>
            <div v-else class="pagination-spacer"></div>

            <button
              v-if="nextSection"
              type="button"
              class="btn-clause-nav next"
              @click="selectSection(nextSection.id)"
            >
              <div class="nav-text">
                <span class="nav-label">Pasal Selanjutnya</span>
                <span class="nav-title">{{ nextSection.num }}. {{ nextSection.title }}</span>
              </div>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <!-- Bottom Contact Dock -->
          <footer class="policy-contact-dock">
            <div class="dock-text">
              <h3>Perlu Konsultasi Terkait Ketentuan Layanan?</h3>
              <p>Untuk pertanyaan hukum, perizinan institusi, atau kemitraan edukasi, hubungi divisi legal kami.</p>
            </div>
            <div class="dock-actions">
              <a
                href="https://wa.me/6285174264123?text=Halo%20Tim%20Legal%20iCraft,%20saya%20ingin%20berkonsultasi..."
                target="_blank"
                rel="noopener noreferrer"
                class="btn-dock-wa"
              >
                <i class="fa-brands fa-whatsapp"></i>
                <span>Hotline WhatsApp</span>
              </a>
              <router-link to="/hubungi-kami" class="btn-dock-mail">
                <i class="fa-solid fa-paper-plane"></i>
                <span>Kirim Tiket / Pesan</span>
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

// Default to general-terms (Pasal 01) so the page is focused and clean on initial open
const activeSection = ref('general-terms')
const searchQuery = ref('')

const sections = [
  { id: 'general-terms', num: '01', title: 'Ketentuan Umum & Definisi', keywords: 'platform icraft definisi pengguna perubahan ketentuan hukum regulasi' },
  { id: 'account-terms', num: '02', title: 'Akun & Kredensial', keywords: 'pendaftaran akun password kredensial login account sharing tanggung jawab' },
  { id: 'learning-integrity', num: '03', title: 'Integritas Belajar & Komunitas', keywords: 'kecurangan bot scraper manipulasi xp compiler reverse engineering peretasan sanksi diskualifikasi' },
  { id: 'payment-subs', num: '04', title: 'Pembayaran & Langganan', keywords: 'qris pro expert langganan refund invoice perpanjangan mutasi perbankan' },
  { id: 'intellectual-prop', num: '05', title: 'Hak Kekayaan Intelektual', keywords: 'hak cipta lisensi materi modul kurikulum naskah karya intelektual pt nirmala kreasi bersama icraft digital service' },
  { id: 'service-availability', num: '06', title: 'Ketersediaan Layanan', keywords: 'maintenance ketersediaan downtime server as is gangguan pihak ketiga' }
]

const currentIndex = computed(() => sections.findIndex(s => s.id === activeSection.value))
const currentSection = computed(() => sections[currentIndex.value] || null)
const prevSection = computed(() => currentIndex.value > 0 ? sections[currentIndex.value - 1] : null)
const nextSection = computed(() => (currentIndex.value >= 0 && currentIndex.value < sections.length - 1) ? sections[currentIndex.value + 1] : null)

const matchedSectionIds = computed(() => {
  if (!searchQuery.value.trim()) return sections.map(s => s.id)
  const q = searchQuery.value.toLowerCase().trim()
  return sections
    .filter(s => s.title.toLowerCase().includes(q) || s.keywords.toLowerCase().includes(q) || s.num.includes(q))
    .map(s => s.id)
})

const isSectionVisible = (id) => {
  if (searchQuery.value.trim()) {
    return matchedSectionIds.value.includes(id)
  }
  if (activeSection.value === 'all') return true
  return activeSection.value === id
}

const selectSection = (id) => {
  searchQuery.value = ''
  activeSection.value = id
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped src="../assets/css/views/TermsView.css"></style>
