<template>
  <div class="privacy-view">
    <SimpleBackground />

    <div class="privacy-container">
      <!-- 0. Top Navigation -->
      <div class="privacy-top-nav">
        <div class="top-nav-left">
          <router-link to="/" class="brand-link" title="Beranda iC Game-Z">
            <img src="/images/Logo iC GameZ Lightmode.png" alt="iC Game-Z" class="brand-logo-img logo-light" />
            <img src="/images/Logo iC GameZ darkmode.png" alt="iC Game-Z" class="brand-logo-img logo-dark" />
          </router-link>
          <span class="nav-sep">/</span>
          <div class="nav-breadcrumbs">
            <span>Pusat Kebijakan</span>
            <i class="fa-solid fa-chevron-right separator"></i>
            <span class="current">Kebijakan Privasi</span>
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
      <div class="privacy-layout-grid">
        <!-- LEFT COLUMN: Sticky Table of Contents Navigator -->
        <aside class="privacy-sidebar">
          <div class="sidebar-sticky-panel">
            <div class="sidebar-header">
              <span class="sidebar-subtitle">DAFTAR ISI KEBIJAKAN</span>
              <span class="total-badge">6 Klausul</span>
            </div>

            <!-- Quick Search inside Sidebar -->
            <div class="sidebar-search-box">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari isi klausul..."
                class="sidebar-search-input"
              />
              <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''" title="Bersihkan">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <nav class="toc-menu" aria-label="Daftar Isi Klausul">
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

            <!-- DPO Contact Help Box in Sidebar -->
            <div class="sidebar-dpo-card">
              <div class="dpo-icon">
                <i class="fa-solid fa-user-shield"></i>
              </div>
              <h4>Data Protection Officer</h4>
              <p>Pengajuan hak akses data, portabilitas, atau penghapusan akun dilayani via Hotline.</p>
              <a
                href="https://wa.me/6285174264123?text=Halo%20DPO%20iCraft,%20saya%20ingin%20mengajukan%20permohonan%20data..."
                target="_blank"
                rel="noopener noreferrer"
                class="btn-dpo-wa"
              >
                <i class="fa-brands fa-whatsapp"></i>
                <span>Hotline DPO WhatsApp</span>
              </a>
            </div>
          </div>
        </aside>

        <!-- RIGHT COLUMN: Main Document Articles Stream -->
        <main class="privacy-main-stream">
          <!-- Document Header -->
          <header class="privacy-doc-header">
            <h1 class="privacy-title">Kebijakan Privasi iC Game-Z</h1>
            <p class="privacy-meta-date">
              Terakhir Diperbarui: <strong>10 November 2026</strong> &middot; Berlaku Efektif untuk Seluruh Layanan PT. Nirmala Kreasi Bersama
            </p>
          </header>

          <!-- Trust Commitment Summary Banner -->
          <div class="privacy-trust-banner">
            <div class="trust-icon-box">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <div class="trust-text">
              <strong>Komitmen Mutlak Privasi:</strong> PT. Nirmala Kreasi Bersama (iCraft Digital Service) menghargai privasi Anda sepenuhnya. Kami <strong>tidak pernah dan tidak akan pernah menjual, menyewakan, atau memperdagangkan data pribadi Anda</strong> kepada pihak ketiga mana pun untuk tujuan periklanan eksternal.
            </div>
          </div>

          <!-- Active Focus Bar (Tampil saat memilih salah satu klausul) -->
          <div v-if="activeSection !== 'all' && !searchQuery && currentSection" class="active-clause-bar">
            <div class="clause-indicator">
              <span class="clause-pill">Klausul {{ currentSection.num }} dari {{ sections.length }}</span>
              <span class="clause-current-name">{{ currentSection.title }}</span>
            </div>
            <button class="btn-view-all" @click="selectSection('all')">
              <i class="fa-solid fa-layer-group"></i>
              <span>Tampilkan Semua Klausul</span>
            </button>
          </div>

          <!-- Search Result Bar -->
          <div v-if="searchQuery" class="active-clause-bar search-bar-result">
            <div class="clause-indicator">
              <span class="clause-pill"><i class="fa-solid fa-magnifying-glass"></i> Cari</span>
              <span class="clause-current-name">Filter: "{{ searchQuery }}" ({{ matchedSectionIds.length }} klausul cocok)</span>
            </div>
            <button class="btn-view-all" @click="searchQuery = ''">
              <i class="fa-solid fa-xmark"></i>
              <span>Bersihkan</span>
            </button>
          </div>

          <!-- Empty search state -->
          <div v-if="searchQuery && matchedSectionIds.length === 0" class="empty-search-box">
            <i class="fa-solid fa-circle-question empty-icon"></i>
            <p>Tidak ditemukan klausul yang memuat kata kunci "<strong>{{ searchQuery }}</strong>".</p>
            <button class="btn-view-all" @click="searchQuery = ''">Kembali ke Semua Klausul</button>
          </div>

          <!-- Document Articles (Clean Typographic Dividers - No Monotonous Stacked Boxes) -->
          <div class="privacy-articles-list">
            <!-- Article 1 -->
            <article
              v-show="isSectionVisible('data-collected')"
              id="data-collected"
              class="policy-article"
              :class="{ 'single-focused': activeSection === 'data-collected' && !searchQuery }"
            >
              <div class="article-header">
                <span class="article-num">01</span>
                <h2>Informasi yang Kami Kumpulkan</h2>
              </div>
              <div class="article-body">
                <p>Untuk menyelenggarakan platform pembelajaran coding yang interaktif dan memantau kemajuan belajarmu, kami mengumpulkan jenis informasi berikut:</p>
                <ul class="policy-bullets">
                  <li><strong>Informasi Akun:</strong> Nama lengkap, alamat email, username, dan foto profil yang Anda berikan saat mendaftar akun atau login via SSO Google/iCraft ID.</li>
                  <li><strong>Data Pembelajaran & Gamifikasi:</strong> Riwayat penyelesaian lesson, persentase progres alur belajar, perolehan XP (Experience Points), status streak harian, saldo iCoinz, sisa Energy, dan posisi di Leaderboard publik.</li>
                  <li><strong>Data Submission Koding:</strong> Kode solusi yang Anda kirimkan pada workspace editor untuk dievaluasi oleh test runner otomatis.</li>
                  <li><strong>Data Transaksi & Pembayaran:</strong> Catatan pembelian paket langganan (Pro / Expert) atau item Shop, meliputi nomor Invoice, nominal, tanggal transaksi, dan status verifikasi gateway. <em>(Catatan: Kami tidak pernah menyimpan nomor kartu kredit, PIN, atau kredensial perbankan Anda).</em></li>
                  <li><strong>Data Teknis Log:</strong> Alamat IP, tipe peramban (browser), sistem operasi, dan waktu akses untuk kepentingan keamanan audit server dan pencegahan fraud.</li>
                </ul>
              </div>
            </article>

            <!-- Article 2 -->
            <article
              v-show="isSectionVisible('data-usage')"
              id="data-usage"
              class="policy-article"
              :class="{ 'single-focused': activeSection === 'data-usage' && !searchQuery }"
            >
              <div class="article-header">
                <span class="article-num">02</span>
                <h2>Tujuan Penggunaan Informasi</h2>
              </div>
              <div class="article-body">
                <p>Data yang dikumpulkan dipergunakan semata-mata untuk tujuan:</p>
                <ul class="policy-bullets">
                  <li>Menyediakan, mengelola, dan memelihara seluruh fitur interaktif di platform iC Game-Z.</li>
                  <li>Menghitung perolehan XP, level kemajuan coder, dan menampilkan peringkat leaderboard yang adil.</li>
                  <li>Memproses transaksi pembayaran paket langganan secara instan melalui sistem QRIS resmi.</li>
                  <li>Mengirimkan notifikasi penting terkait keamanan akun, bukti pembayaran invoice, pembaruan kurikulum, dan pengingat streak harian.</li>
                  <li>Mendeteksi, mencegah, dan menanggulangi upaya kecurangan (seperti botting submit otomatis atau penyalahgunaan sandbox).</li>
                </ul>
              </div>
            </article>

            <!-- Article 3 -->
            <article
              v-show="isSectionVisible('data-security')"
              id="data-security"
              class="policy-article"
              :class="{ 'single-focused': activeSection === 'data-security' && !searchQuery }"
            >
              <div class="article-header">
                <span class="article-num">03</span>
                <h2>Keamanan & Enkripsi Data</h2>
              </div>
              <div class="article-body">
                <p>Kami menerapkan standar keamanan industri modern untuk melindungi data Anda dari akses yang tidak sah, pengubahan, atau kebocoran:</p>
                <ul class="policy-bullets">
                  <li><strong>Enkripsi Transport Layer:</strong> Seluruh komunikasi antara browser Anda dan server kami dilindungi oleh enkripsi <strong>HTTPS / TLS 1.3</strong> dengan sertifikat SSL 256-bit.</li>
                  <li><strong>Penyimpanan Kata Sandi:</strong> Password akun dienkripsi menggunakan algoritma cryptographic hash searah modern (Bcrypt / Argon2) dan tidak pernah disimpan dalam format teks biasa (plain text).</li>
                  <li><strong>Session Cookie Aman:</strong> Token autentikasi disimpan di browser menggunakan flag <code>HttpOnly</code>, <code>Secure</code>, dan <code>SameSite=Lax/Strict</code> guna memitigasi serangan Cross-Site Scripting (XSS).</li>
                </ul>
                <div class="policy-highlight-card">
                  <i class="fa-solid fa-shield-halved highlight-icon"></i>
                  <div>
                    <strong>Audit Keamanan Sistem:</strong> Kami memantau dan memperbarui pertahanan sistem server secara berkala dengan berpedoman pada standar keamanan OWASP Top 10.
                  </div>
                </div>
              </div>
            </article>

            <!-- Article 4 -->
            <article
              v-show="isSectionVisible('third-parties')"
              id="third-parties"
              class="policy-article"
              :class="{ 'single-focused': activeSection === 'third-parties' && !searchQuery }"
            >
              <div class="article-header">
                <span class="article-num">04</span>
                <h2>Pembagian Data kepada Pihak Ketiga</h2>
              </div>
              <div class="article-body">
                <p>Kami hanya membagikan data kepada pihak ketiga dalam batas minimum yang mutlak diperlukan untuk operasional platform:</p>
                <ul class="policy-bullets">
                  <li><strong>Penyedia Layanan Pembayaran (Payment Gateway):</strong> Kami bermitra dengan payment gateway resmi berlisensi Bank Indonesia untuk memproses transaksi QRIS. Data yang dibagikan hanyalah nominal transaksi dan ID referensi pesanan.</li>
                  <li><strong>Kewajiban Hukum:</strong> Kami hanya akan mengungkapkan data pengguna jika diwajibkan oleh proses hukum yang sah (perintah pengadilan atau lembaga penegak hukum Republik Indonesia) sesuai perundang-undangan yang berlaku.</li>
                </ul>
              </div>
            </article>

            <!-- Article 5 -->
            <article
              v-show="isSectionVisible('cookies')"
              id="cookies"
              class="policy-article"
              :class="{ 'single-focused': activeSection === 'cookies' && !searchQuery }"
            >
              <div class="article-header">
                <span class="article-num">05</span>
                <h2>Kebijakan Cookies & Local Storage</h2>
              </div>
              <div class="article-body">
                <p>iC Game-Z menggunakan cookies dan penyimpanan lokal peramban (localStorage) untuk:</p>
                <ul class="policy-bullets">
                  <li>Menjaga status sesi login Anda agar tidak perlu memasukkan email dan password berulang kali.</li>
                  <li>Menyimpan preferensi mode tampilan visual (Dark Mode vs Light Mode).</li>
                  <li>Menyimpan preferensi tampilan materi dan cache kemajuan koding lokal untuk performa yang lebih responsif.</li>
                </ul>
                <p>Anda dapat mengontrol atau menghapus cookies melalui pengaturan peramban Anda, namun penonaktifan cookies sesi dapat menyebabkan Anda tidak dapat login ke dalam platform.</p>
              </div>
            </article>

            <!-- Article 6 -->
            <article
              v-show="isSectionVisible('user-rights')"
              id="user-rights"
              class="policy-article"
              :class="{ 'single-focused': activeSection === 'user-rights' && !searchQuery }"
            >
              <div class="article-header">
                <span class="article-num">06</span>
                <h2>Hak Pengguna atas Data Pribadi (UU PDP)</h2>
              </div>
              <div class="article-body">
                <p>Sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022), Anda memiliki hak penuh untuk:</p>
                <ul class="policy-bullets">
                  <li><strong>Hak Akses & Perbaikan:</strong> Memeriksa dan memperbarui data profil akun Anda kapan saja melalui menu Edit Profil.</li>
                  <li><strong>Hak Portabilitas:</strong> Meminta ringkasan data riwayat belajar dan sertifikat kompetensi yang telah Anda raih.</li>
                  <li><strong>Hak Penghapusan Akun:</strong> Mengajukan permohonan penutupan dan penghapusan akun secara permanen beserta seluruh riwayat data terkait dari server kami.</li>
                </ul>
              </div>
            </article>
          </div>

          <!-- Bottom Clause Pagination (Hanya tampil saat mode klausul tunggal) -->
          <div v-if="activeSection !== 'all' && !searchQuery && currentSection" class="clause-pagination">
            <button
              v-if="prevSection"
              type="button"
              class="btn-clause-nav prev"
              @click="selectSection(prevSection.id)"
            >
              <i class="fa-solid fa-arrow-left"></i>
              <div class="nav-text">
                <span class="nav-label">Klausul Sebelumnya</span>
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
                <span class="nav-label">Klausul Selanjutnya</span>
                <span class="nav-title">{{ nextSection.num }}. {{ nextSection.title }}</span>
              </div>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <!-- Bottom Contact Dock -->
          <footer class="policy-contact-dock">
            <div class="dock-text">
              <h3>Pertanyaan Terkait Kebijakan Privasi?</h3>
              <p>Jika Anda memiliki pertanyaan tentang perlindungan data atau ingin menggunakan hak privasi Anda, hubungi tim kami.</p>
            </div>
            <div class="dock-actions">
              <a
                href="https://wa.me/6285174264123?text=Halo%20Tim%20Privasi%20iCraft,%20saya%20ingin%20bertanya%20tentang%20kebijakan%20data..."
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

// Default to Pasal 01 so the page opens cleanly in a focused single-clause view
const activeSection = ref('data-collected')
const searchQuery = ref('')

const sections = [
  { id: 'data-collected', num: '01', title: 'Data yang Dikumpulkan', keywords: 'informasi akun username nama email gamifikasi koding transaksi pembayaran log ip peramban' },
  { id: 'data-usage', num: '02', title: 'Tujuan Penggunaan Data', keywords: 'tujuan penggunaan alur belajar kelola xp leaderboard qris notifikasi cegah botting fraud' },
  { id: 'data-security', num: '03', title: 'Keamanan & Enkripsi', keywords: 'keamanan enkripsi https ssl 256 bcrypt argon2 cookie httponly xss owasp' },
  { id: 'third-parties', num: '04', title: 'Pembagian Pihak Ketiga', keywords: 'pihak ketiga payment gateway bank indonesia kewajiban hukum pengadilan' },
  { id: 'cookies', num: '05', title: 'Cookies & Penyimpanan Sesi', keywords: 'cookies local storage sesi login dark mode light mode cache' },
  { id: 'user-rights', num: '06', title: 'Hak Pengguna (UU PDP)', keywords: 'uu pdp hak akses perbaikan portabilitas penghapusan data permohonan tutup akun' }
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

<style scoped src="../assets/css/views/PrivacyView.css"></style>
