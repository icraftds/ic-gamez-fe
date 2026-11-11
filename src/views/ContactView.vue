<template>
  <div class="contact-view">
    <SimpleBackground />

    <div class="contact-container">
      <!-- 0. Top Navigation -->
      <div class="contact-top-nav">
        <router-link to="/" class="back-link">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Kembali ke Beranda</span>
        </router-link>
      </div>

      <!-- 1. Hero Header -->
      <header class="contact-header">
        <div class="hero-pill">
          <i class="fa-solid fa-headset"></i>
          <span>Layanan Dukungan & Bantuan</span>
        </div>
        <h1 class="contact-title"><span class="gradient-text">Hubungi Tim iC Game-Z</span></h1>
        <p class="contact-subtitle">
          Punya pertanyaan seputar materi belajar, kendala akun, transaksi QRIS, atau ide kolaborasi? Kami siap mendengarkan dan membantu Anda.
        </p>
      </header>

      <!-- 2. Main Two-Column Layout -->
      <div class="contact-grid">
        <!-- Left: Quick Direct Channels -->
        <aside class="contact-channels-col">
          <!-- WhatsApp Support -->
          <a
            href="https://wa.me/6281234567890?text=Halo%20Tim%20Support%20iC%20Game-Z,%20saya%20butuh%20bantuan%20terkait..."
            target="_blank"
            rel="noopener noreferrer"
            class="channel-card"
          >
            <div class="channel-icon-wrap wa">
              <i class="fa-brands fa-whatsapp"></i>
            </div>
            <div class="channel-info">
              <span class="channel-badge">Respon Tercepat</span>
              <h3 class="channel-title">WhatsApp Support</h3>
              <p class="channel-desc">Chat langsung dengan customer support kami (< 15 menit pada jam kerja).</p>
            </div>
            <i class="fa-solid fa-chevron-right channel-action-arrow"></i>
          </a>

          <!-- Email Support -->
          <a
            href="mailto:support@icraftds.id?subject=Bantuan%20Platform%20iC%20Game-Z"
            class="channel-card"
          >
            <div class="channel-icon-wrap email">
              <i class="fa-solid fa-envelope"></i>
            </div>
            <div class="channel-info">
              <span class="channel-badge">Resmi & Tiket</span>
              <h3 class="channel-title">support@icraftds.id</h3>
              <p class="channel-desc">Untuk kendala teknis mendalam, audit invoice, atau kerja sama bisnis.</p>
            </div>
            <i class="fa-solid fa-chevron-right channel-action-arrow"></i>
          </a>

          <!-- Social Community -->
          <a
            href="https://instagram.com/icraft.ds"
            target="_blank"
            rel="noopener noreferrer"
            class="channel-card"
          >
            <div class="channel-icon-wrap social">
              <i class="fa-brands fa-instagram"></i>
            </div>
            <div class="channel-info">
              <span class="channel-badge">Komunitas Coder</span>
              <h3 class="channel-title">@icraft.ds (Instagram / TikTok)</h3>
              <p class="channel-desc">Ikuti update rilis fitur baru, event kompetisi koding, dan tips karir.</p>
            </div>
            <i class="fa-solid fa-chevron-right channel-action-arrow"></i>
          </a>

          <!-- Operating Hours Card -->
          <div class="hours-card">
            <div class="hours-header">
              <i class="fa-solid fa-clock"></i>
              <span>Jam Operasional Layanan</span>
            </div>
            <div class="hours-list">
              <div class="hours-row">
                <span>Senin – Jumat</span>
                <strong>09:00 – 21:00 WIB</strong>
              </div>
              <div class="hours-row">
                <span>Sabtu</span>
                <strong>10:00 – 17:00 WIB</strong>
              </div>
              <div class="hours-row">
                <span>Minggu & Hari Libur</span>
                <span class="hours-status-pill">Emergency Only</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Right: Interactive Contact Form -->
        <main class="contact-form-card">
          <div v-if="!isSubmitted">
            <div class="form-header">
              <h2>Kirimkan Pesan atau Tiket Bantuan</h2>
              <p>Isi formulir di bawah ini dan tim kami akan merespons melalui email dalam kurun waktu 1x24 jam.</p>
            </div>

            <form @submit.prevent="handleSubmitForm" class="form-grid">
              <div class="form-row-two">
                <div class="form-group">
                  <label for="name">
                    Nama Lengkap <span class="required">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Contoh: Rian Pratama"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="email">
                    Alamat Email <span class="required">*</span>
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-row-two">
                <div class="form-group">
                  <label for="category">
                    Kategori Bantuan <span class="required">*</span>
                  </label>
                  <select
                    id="category"
                    v-model="form.category"
                    required
                    class="form-select"
                  >
                    <option value="" disabled>Pilih kategori masalah...</option>
                    <option value="account">Kendala Akun, Password & Login</option>
                    <option value="learning">Alur Belajar & Coding Sandbox</option>
                    <option value="payment">Pembayaran QRIS / GameZ Shop</option>
                    <option value="cheatsheet">Cheatsheet Vault & Bank Soal</option>
                    <option value="bug">Laporan Bug / Kerentanan Teknis</option>
                    <option value="partnership">Kerja Sama & B2B Partnership</option>
                    <option value="other">Pertanyaan Lainnya</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="phone">
                    Nomor WhatsApp (Opsional)
                  </label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    placeholder="Contoh: 08123456789"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="subject">
                  Subjek Pesan <span class="required">*</span>
                </label>
                <input
                  id="subject"
                  v-model="form.subject"
                  type="text"
                  required
                  placeholder="Ringkasan singkat kendala atau keperluanmu"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="message">
                  Detail Pesan / Kendala <span class="required">*</span>
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  maxlength="1500"
                  placeholder="Jelaskan secara detail pertanyaan, kendala, atau pesanmu..."
                  class="form-textarea"
                ></textarea>
                <div class="form-char-count">
                  {{ form.message.length }} / 1500 karakter
                </div>
              </div>

              <button
                type="submit"
                class="btn-submit-contact"
                :disabled="isSubmitting"
              >
                <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-paper-plane"></i>
                <span>{{ isSubmitting ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang' }}</span>
              </button>
            </form>
          </div>

          <!-- Submitted Success State -->
          <div v-else class="form-success-box">
            <div class="success-icon-wrap">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <h3>Pesan Berhasil Terkirim!</h3>
            <p>
              Terima kasih, <strong>{{ form.name }}</strong>. Tiket bantuanmu telah kami terima dan tercatat di sistem dukungan kami.
            </p>
            <div class="ticket-number-badge">
              Tiket ID: #TICKET-{{ ticketNumber }}
            </div>
            <p>
              Salinan konfirmasi telah diteruskan ke <strong>{{ form.email }}</strong>. Tim support kami akan menghubungi Anda kembali melalui email atau WhatsApp sesegera mungkin.
            </p>
            <button class="btn-send-again" @click="resetForm">
              <i class="fa-solid fa-rotate-left"></i>
              <span>Kirim Pesan Lainnya</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import { useUserAccount } from '../composables/useUserAccount'

const { user, isLoggedIn } = useUserAccount()

const form = ref({
  name: '',
  email: '',
  phone: '',
  category: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const ticketNumber = ref('')

onMounted(() => {
  if (isLoggedIn.value && user.value) {
    if (user.value.name) form.value.name = user.value.name
    if (user.value.email) form.value.email = user.value.email
  }
})

const handleSubmitForm = async () => {
  isSubmitting.value = true

  // Simulate ticket generation & safe handling
  await new Promise(resolve => setTimeout(resolve, 800))

  ticketNumber.value = Math.floor(100000 + Math.random() * 900000)
  isSubmitting.value = false
  isSubmitted.value = true
}

const resetForm = () => {
  form.value = {
    name: (isLoggedIn.value && user.value?.name) || '',
    email: (isLoggedIn.value && user.value?.email) || '',
    phone: '',
    category: '',
    subject: '',
    message: ''
  }
  isSubmitted.value = false
}
</script>

<style scoped src="../assets/css/views/ContactView.css"></style>
