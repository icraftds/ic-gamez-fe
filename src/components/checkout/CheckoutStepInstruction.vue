<template>
  <div key="step2" class="checkout-step-container">
    <div class="checkout-2col-layout">
      <!-- Kolom Kiri: Informasi dari Game-Z -->
      <div class="checkout-col-gamez">
        <div class="col-header">
          <div class="brand-tag">
            <span class="gamez-logo-text"><i class="fa-solid fa-gamepad"></i> iC Game-Z</span>
            <span class="plan-badge-pill">{{ currentPlanPerks.badge }}</span>
          </div>
          <h2 class="col-title">Ringkasan Pesanan</h2>
          <p class="col-desc">Paket Game-Z Anda siap diaktifkan otomatis setelah pembayaran diterima.</p>
        </div>

        <!-- Plan Info Box -->
        <div class="gamez-plan-card">
          <div class="plan-main-row">
            <div class="plan-icon-wrap">
              <i :class="planIcon"></i>
            </div>
            <div class="plan-meta-info">
              <h3 class="plan-title">{{ displayPlanName }}</h3>
              <span class="plan-duration"><i class="fa-solid fa-calendar-days"></i> Akses {{ currentPlanPerks.duration }}</span>
            </div>
            <div class="plan-energy-pill">
              <i class="fa-solid fa-bolt"></i> {{ currentPlanPerks.energy }}
            </div>
          </div>

          <!-- Feature Checklist -->
          <ul class="gamez-perks-list">
            <li v-for="(feat, idx) in currentPlanPerks.features" :key="idx">
              <i class="fa-solid fa-circle-check"></i>
              <span>{{ feat }}</span>
            </li>
          </ul>
        </div>

        <!-- Target Account Info -->
        <div v-if="userProfile" class="target-account-box">
          <div class="account-icon">
            <i class="fa-solid fa-user-astronaut"></i>
          </div>
          <div class="account-details">
            <span class="account-caption">Akun Penerima:</span>
            <span class="account-name">{{ userProfile.name || userProfile.username }}</span>
          </div>
          <span class="active-dot-indicator"></span>
        </div>

        <!-- Price Breakdown -->
        <div class="price-breakdown-card">
          <div class="breakdown-row">
            <span class="breakdown-label">Harga Paket</span>
            <span class="breakdown-value">Rp {{ formattedPrice }}</span>
          </div>
          <div v-if="discountAmount > 0" class="breakdown-row discount">
            <span class="breakdown-label">Potongan Promo</span>
            <span class="breakdown-value">-Rp {{ formatNumber(discountAmount) }}</span>
          </div>
          <div class="breakdown-divider"></div>
          <div class="breakdown-row total">
            <span class="breakdown-label">Total Pembayaran</span>
            <span class="breakdown-value highlight">Rp {{ formatNumber(finalPrice) }}</span>
          </div>
        </div>

        <!-- Cancel / Switch Button -->
        <button class="btn-cancel-checkout" @click="$emit('back')">
          <i class="fa-solid fa-arrow-left"></i> Ganti Paket / Batal Transaksi
        </button>
      </div>

      <!-- Kolom Kanan: Informasi Pembayaran DOKU -->
      <div class="checkout-col-doku">
        <div class="col-header">
          <div class="gateway-tag">
            <i class="fa-solid fa-shield-halved"></i>
            <span>DOKU Payment Gateway</span>
          </div>
          <h2 class="col-title">Instruksi Pembayaran</h2>
          <p class="col-desc">Selesaikan pembayaran sebelum batas waktu berakhir.</p>
        </div>

        <!-- Method Badge -->
        <div class="instruction-method-badge">
          <i :class="methodIcon"></i>
          <span>{{ methodLabel }}</span>
        </div>

        <!-- DOKU Hosted Checkout Display -->
        <div
          v-if="paymentDetails.payment_link && !paymentDetails.qr_string && !paymentDetails.va_number"
          class="doku-display"
          :class="{ 'is-expired': countdown === 0 }"
        >
          <div class="doku-card-wrapper">
            <div class="doku-icon-wrapper">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div class="doku-info">
              <h3 class="doku-title">Pembayaran DOKU Checkout</h3>
              <p class="doku-desc">
                Selesaikan transaksi Anda melalui portal resmi DOKU. Tersedia metode QRIS, Virtual Account (BCA, Mandiri, BRI, BNI), E-Wallet, dan Kartu Kredit.
              </p>
              <div v-if="paymentDetails.order_id" class="doku-order-meta">
                <span class="doku-order-label">Nomor Invoice:</span>
                <span class="doku-order-id">{{ paymentDetails.order_id }}</span>
              </div>
            </div>
            <a
              :href="paymentDetails.payment_link"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary doku-pay-btn"
            >
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
              <span>Buka Halaman Pembayaran DOKU</span>
            </a>
            <p class="doku-note">
              <i class="fa-solid fa-circle-info"></i>
              Halaman ini otomatis memverifikasi transaksi Anda secara real-time. Setelah pembayaran selesai, paket langsung aktif.
            </p>
          </div>
        </div>

        <!-- QRIS Display -->
        <div
          v-else-if="selectedMethod === 'qris' || paymentDetails.qr_string"
          class="qr-display"
          :class="{ 'is-expired': countdown === 0 }"
        >
          <div class="qr-box-wrapper">
            <div class="qr-box">
              <qrcode-vue v-if="paymentDetails.qr_string" :value="paymentDetails.qr_string" :size="qrSize" level="H" />
              <div v-else class="qr-dummy-label">
                <TerminalLoader size="sm" label="QR" />
              </div>
            </div>
          </div>
          <p class="qr-hint">Buka aplikasi e-wallet atau m-banking Anda, scan kode QR di atas untuk menyelesaikan pembayaran.</p>
        </div>

        <!-- VA Display -->
        <div v-else class="va-display" :class="{ 'is-expired': countdown === 0 }">
          <div class="va-bank-name">
            <i class="fa-solid fa-building-columns"></i>
            {{ methodLabel }}
          </div>
          <div class="va-number-box">
            <span class="va-number-value">{{ paymentDetails.va_number || 'Memuat...' }}</span>
            <button class="va-copy-btn" :class="{ copied: isCopied }" @click="copyVA" :title="isCopied ? 'Tersalin!' : 'Salin'">
              <i :class="isCopied ? 'fa-solid fa-check' : 'fa-solid fa-copy'"></i>
            </button>
          </div>
          <ol class="va-instructions">
            <li><span class="step-num">1</span> Buka aplikasi m-banking atau kunjungi ATM terdekat</li>
            <li><span class="step-num">2</span> Pilih menu Transfer ke Virtual Account</li>
            <li><span class="step-num">3</span> Masukkan nomor VA di atas dan selesaikan transaksi</li>
          </ol>
        </div>

        <!-- Awaiting Status Card -->
        <div class="awaiting-section">
          <div v-if="countdown > 0" class="awaiting-pulse">
            <span class="pulse-dot"></span>
            <span>Menunggu Pembayaran...</span>
          </div>
          <div v-else class="awaiting-pulse expired-text">
            <i class="fa-solid fa-circle-xmark"></i>
            <span>Waktu Pembayaran Habis</span>
          </div>
          <p v-if="countdown > 0" class="awaiting-timer">
            Selesaikan dalam <span class="timer-value">{{ formattedCountdown }}</span>
          </p>
          <p v-else class="awaiting-timer text-muted">
            Batas waktu pembayaran telah habis. Silakan batalkan transaksi untuk memilih paket baru.
          </p>

          <button class="btn-check-status" @click="$emit('check-status')">
            <i class="fa-solid fa-rotate-right"></i>
            <span>Cek Ulang Status Pembayaran</span>
          </button>
        </div>

        <!-- DOKU Trust Info -->
        <div class="doku-trust-card">
          <div class="trust-header">
            <i class="fa-solid fa-lock"></i>
            <span>Pembayaran Aman & Terenkripsi</span>
          </div>
          <div class="trust-badges-row">
            <div class="trust-pill"><i class="fa-solid fa-shield-check"></i> 256-bit SSL</div>
            <div class="trust-pill"><i class="fa-solid fa-building-columns"></i> Bank Indonesia</div>
            <div class="trust-pill"><i class="fa-solid fa-bolt"></i> Auto Aktivasi</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import QrcodeVue from 'qrcode.vue'
import TerminalLoader from '../common/TerminalLoader.vue'
import { useUserAccount } from '../../composables/useUserAccount'

const props = defineProps({
  paymentDetails: {
    type: Object,
    required: true
  },
  selectedMethod: {
    type: String,
    required: true
  },
  planName: String,
  planIcon: String,
  planSlug: String,
  planPrice: Number,
  formattedPrice: String,
  discountedPrice: Number,
  expiryTime: Number
})

defineEmits(['back', 'check-status'])

const { userProfile } = useUserAccount()

const formatNumber = (num) => {
  if (num == null) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const displayPlanName = computed(() => {
  const name = props.planName || 'Pro'
  return name.toLowerCase().endsWith('plan') ? name : `${name} Plan`
})

const PLAN_PERKS = {
  pro: {
    badge: 'Paling Populer',
    duration: '30 Hari',
    energy: '+20 Energi / minggu',
    features: [
      'Akses semua modul dasar & premium',
      'Sertifikat kelulusan digital resmi',
      '200.000 iCoinZ bonus langsung masuk',
      'Hint premium tak terbatas di workspace',
      'Leaderboard eksklusif coder Game-Z',
    ]
  },
  expert: {
    badge: 'Paket Tertinggi',
    duration: '180 Hari',
    energy: '+25 Energi / minggu',
    features: [
      'Semua fitur Pro Plan',
      '25 Energi bonus setiap minggu',
      '300.000 iCoinZ bonus langsung masuk',
      'Kesempatan Magang di iCraft DS',
      '1-on-1 Mentoring bulanan',
      'Review portofolio eksklusif',
    ]
  }
}

const currentPlanPerks = computed(() => {
  const slug = (props.planSlug || 'pro').toLowerCase()
  return PLAN_PERKS[slug] || PLAN_PERKS.pro
})

const finalPrice = computed(() => {
  if (props.discountedPrice != null) return props.discountedPrice
  if (props.paymentDetails?.amount) return props.paymentDetails.amount
  return props.planPrice || 0
})

const discountAmount = computed(() => {
  if (props.discountedPrice != null && props.planPrice) {
    return Math.max(0, props.planPrice - props.discountedPrice)
  }
  return 0
})

const methodLabel = computed(() => {
  if (props.selectedMethod === 'doku' || props.paymentDetails?.payment_link) return 'DOKU Checkout'
  if (props.selectedMethod === 'qris') return 'QRIS (DOKU)'
  if (props.selectedMethod === 'va_bca' || props.selectedMethod === 'bca_va') return 'Virtual Account BCA'
  if (props.selectedMethod === 'va_bni' || props.selectedMethod === 'bni_va') return 'Virtual Account BNI'
  if (props.selectedMethod === 'va_bri' || props.selectedMethod === 'bri_va') return 'Virtual Account BRI'
  if (props.selectedMethod === 'va_mandiri' || props.selectedMethod === 'mandiri_va') return 'Virtual Account Mandiri'
  return 'DOKU Payment'
})

const methodIcon = computed(() => {
  if (props.selectedMethod === 'doku' || props.paymentDetails?.payment_link) return 'fa-solid fa-credit-card'
  if (props.selectedMethod === 'qris') return 'fa-solid fa-qrcode'
  return 'fa-solid fa-building-columns'
})

const qrSize = computed(() => {
  if (typeof window !== 'undefined' && window.innerWidth < 480) {
    return 160
  }
  return 180
})

const isCopied = ref(false)
const copyVA = () => {
  const rawVA = (props.paymentDetails.va_number || '').replace(/\s/g, '')
  navigator.clipboard.writeText(rawVA).then(() => {
    isCopied.value = true
    setTimeout(() => { isCopied.value = false }, 2000)
  })
}

const countdown = ref(0)
let countdownInterval = null

const formattedCountdown = computed(() => {
  const m = Math.floor(countdown.value / 60)
  const s = countdown.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const calculateCountdown = () => {
  if (props.expiryTime) {
    const diff = Math.floor((props.expiryTime - Date.now()) / 1000)
    countdown.value = diff > 0 ? diff : 0
  } else {
    if (countdown.value > 0) {
      countdown.value--
    }
  }

  if (countdown.value === 0 && countdownInterval) {
    clearInterval(countdownInterval)
  }
}

const startCountdown = () => {
  if (!props.expiryTime) {
    countdown.value = 900 // Fallback 15 mins
  }
  calculateCountdown()
  countdownInterval = setInterval(() => {
    calculateCountdown()
  }, 1000)
}

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped src="../../assets/css/components/checkout/CheckoutStepInstruction.css"></style>

<style scoped>
.is-expired {
  opacity: 0.5;
  pointer-events: none;
  filter: grayscale(100%);
  transition: all 0.3s ease;
}

.expired-text {
  color: #ef4444 !important;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.4) !important;
  display: flex;
  align-items: center;
  gap: 8px;
}

.text-muted {
  color: #a0a0b0;
  font-size: 0.9rem;
}
</style>
