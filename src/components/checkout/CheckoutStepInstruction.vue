<template>
  <div key="step2">
    <h2 class="section-title">Instruksi Pembayaran</h2>
    <p class="section-subtitle">Selesaikan pembayaran sebelum waktu habis untuk mengaktifkan paket Anda.</p>

    <!-- Method Badge -->
    <div class="instruction-method-badge">
      <i :class="selectedMethod === 'qris' ? 'fa-solid fa-qrcode' : 'fa-solid fa-building-columns'"></i>
      {{ methodLabel }}
    </div>

    <!-- Order Summary -->
    <div class="order-summary">
      <div class="order-plan-name">
        <i :class="planIcon"></i>
        <span>{{ planName }} Plan</span>
      </div>
      <div class="order-price">
        <div v-if="discountedPrice != null" class="discount-price-wrap">
          <span class="price-strikethrough">Rp {{ formattedPrice }}</span>
          <span class="price-final">Rp {{ formatNumber(discountedPrice) }}</span>
        </div>
        <span v-else>Rp {{ formattedPrice }}</span>
      </div>
    </div>

    <a v-if="paymentDetails.payment_link" :href="paymentDetails.payment_link" target="_blank" rel="noopener noreferrer" class="btn-outline">Buka tautan pembayaran</a>
    <!-- QRIS Display -->
    <div v-if="selectedMethod === 'qris'" class="qr-display" :class="{ 'is-expired': countdown === 0 }">
      <div class="qr-box-wrapper">
        <div class="qr-box">
          <qrcode-vue v-if="paymentDetails.qr_string" :value="paymentDetails.qr_string" :size="200" level="H" />
          <div v-else class="qr-dummy-label">
            <i class="fa-solid fa-spinner fa-spin"></i> Memuat QR...
          </div>
        </div>
      </div>
      <p class="qr-hint">Buka aplikasi e-wallet atau m-banking Anda, scan kode QR di atas untuk membayar.</p>
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
        <li><span class="step-num">3</span> Masukkan nomor VA di atas dan selesaikan pembayaran</li>
      </ol>
    </div>

    <!-- Awaiting Section -->
    <div class="awaiting-section">
      <div v-if="countdown > 0" class="awaiting-pulse">
        <span class="pulse-dot"></span>
        Menunggu Pembayaran...
      </div>
      <div v-else class="awaiting-pulse expired-text">
        <i class="fa-solid fa-circle-xmark"></i>
        Waktu Pembayaran Habis
      </div>
      <p v-if="countdown > 0" class="awaiting-timer">Selesaikan dalam <span class="timer-value">{{ formattedCountdown }}</span></p>
      <p v-else class="awaiting-timer text-muted">Cek status aktivasi paket sebelum membuat pembayaran lain.</p>
    </div>

    <button class="btn-outline" @click="$emit('back')">
      <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import QrcodeVue from 'qrcode.vue'

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
  formattedPrice: String,
  discountedPrice: Number,
  expiryTime: Number
})

defineEmits(['back'])

const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

const methodLabel = computed(() => {
  if (props.selectedMethod === 'qris') return 'QRIS'
  if (props.selectedMethod === 'va_bca') return 'Virtual Account BCA'
  return 'Virtual Account BNI'
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
  color: #ff4757 !important;
  text-shadow: 0 0 10px rgba(255, 71, 87, 0.4) !important;
  display: flex;
  align-items: center;
  gap: 8px;
}

.text-muted {
  color: #a0a0b0;
  font-size: 0.9rem;
}
</style>
