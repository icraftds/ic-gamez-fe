<template>
  <div class="contact-view">
    <SimpleBackground />

    <div class="contact-container">
      <!-- 0. Top Navigation -->
      <div class="contact-top-nav">
        <div class="top-nav-left">
          <router-link to="/" class="brand-link" title="Beranda iC Game-Z">
            <img src="/images/Logo iC GameZ Lightmode.png" alt="iC Game-Z" class="brand-logo-img logo-light" />
            <img src="/images/Logo iC GameZ darkmode.png" alt="iC Game-Z" class="brand-logo-img logo-dark" />
          </router-link>
          <span class="nav-sep">/</span>
          <div class="nav-breadcrumbs">
            <span>Pusat Bantuan</span>
            <i class="fa-solid fa-chevron-right separator"></i>
            <span class="current">Hubungi Kami</span>
          </div>
        </div>

        <div class="top-nav-right">
          <router-link to="/" class="back-link">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Kembali ke Beranda</span>
          </router-link>
        </div>
      </div>

      <!-- 1. Hero Header -->
      <header class="contact-header">
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
            href="https://wa.me/6285174264123?text=Halo%20Tim%20Support%20iC%20Game-Z,%20saya%20butuh%20bantuan%20terkait..."
            target="_blank"
            rel="noopener noreferrer"
            class="channel-card"
          >
            <div class="channel-icon-wrap wa">
              <i class="fa-brands fa-whatsapp"></i>
            </div>
            <div class="channel-info">
              <span class="channel-badge">Respon Tercepat</span>
              <h3 class="channel-title">WhatsApp Hotline</h3>
              <p class="channel-desc">+62 851-7426-4123 (Chat langsung respon &lt; 15 menit pada jam operasional).</p>
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
              <p>Isi formulir di bawah ini. Pesan Anda akan langsung diformat secara rapi dan diteruskan ke WhatsApp Hotline Resmi PT. Nirmala Kreasi Bersama (iCraft Digital Service).</p>
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
                class="btn-submit-contact btn-submit-wa"
                :disabled="isSubmitting"
              >
                <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-brands fa-whatsapp"></i>
                <span>{{ isSubmitting ? 'Membuka WhatsApp...' : 'Kirim via WhatsApp' }}</span>
              </button>
            </form>
          </div>

          <!-- Submitted Success State -->
          <div v-else class="form-success-box">
            <div class="success-icon-wrap">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <h3>Pesan Siap & Terhubung ke WhatsApp!</h3>
            <p>
              Terima kasih, <strong>{{ form.name }}</strong>. Tiket bantuan telah berhasil dibuat dan disiapkan untuk diteruskan ke WhatsApp Hotline Resmi.
            </p>
            <div class="ticket-number-badge">
              Tiket ID: #TICKET-{{ ticketNumber }}
            </div>
            <p class="success-hint">
              Jika jendela WhatsApp tidak terbuka otomatis, silakan klik tombol di bawah ini:
            </p>
            <div class="success-actions">
              <a
                :href="lastWaUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-open-wa"
              >
                <i class="fa-brands fa-whatsapp"></i>
                <span>Buka WhatsApp Sekarang</span>
              </a>
              <button class="btn-send-again" @click="resetForm">
                <i class="fa-solid fa-rotate-left"></i>
                <span>Kirim Pesan Lainnya</span>
              </button>
            </div>
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

const categoryLabels = {
  account: 'Kendala Akun, Password & Login',
  learning: 'Alur Belajar & Coding Sandbox',
  payment: 'Pembayaran QRIS / GameZ Shop',
  cheatsheet: 'Cheatsheet Vault & Bank Soal',
  bug: 'Laporan Bug / Kerentanan Teknis',
  partnership: 'Kerja Sama & B2B Partnership',
  other: 'Pertanyaan Lainnya'
}

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const ticketNumber = ref('')
const lastWaUrl = ref('')

onMounted(() => {
  if (isLoggedIn.value && user.value) {
    if (user.value.name) form.value.name = user.value.name
    if (user.value.email) form.value.email = user.value.email
  }
})

const handleSubmitForm = async () => {
  isSubmitting.value = true

  const ticketId = Math.floor(100000 + Math.random() * 900000)
  ticketNumber.value = String(ticketId)

  const catName = categoryLabels[form.value.category] || form.value.category || 'Pertanyaan Umum'
  const phoneText = form.value.phone ? form.value.phone : '-'

  const waText = [
    `*TIKET BANTUAN RESMI - iC GAME-Z*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 *No. Tiket:* #TICKET-${ticketId}`,
    `👤 *Nama Lengkap:* ${form.value.name}`,
    `📧 *Email:* ${form.value.email}`,
    `📱 *No. WhatsApp:* ${phoneText}`,
    `📂 *Kategori:* ${catName}`,
    `📝 *Subjek:* ${form.value.subject}`,
    ``,
    `💬 *Detail Pesan / Kendala:*`,
    `${form.value.message}`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `_Pesan otomatis via Form Bantuan iC Game-Z_`
  ].join('\n')

  const waUrl = `https://wa.me/6285174264123?text=${encodeURIComponent(waText)}`
  lastWaUrl.value = waUrl

  await new Promise(resolve => setTimeout(resolve, 350))

  try {
    window.open(waUrl, '_blank')
  } catch (err) {
    console.error('Failed to auto open window:', err)
  }

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
  lastWaUrl.value = ''
}
</script>

<style scoped src="../assets/css/views/ContactView.css"></style>
