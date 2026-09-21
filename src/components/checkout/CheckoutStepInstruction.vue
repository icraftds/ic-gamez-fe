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
        <div v-if="discountedPrice !== null" class="discount-price-wrap">
          <span class="price-strikethrough">Rp {{ formattedPrice }}</span>
          <span class="price-final">Rp {{ formatNumber(discountedPrice) }}</span>
        </div>
        <span v-else>Rp {{ formattedPrice }}</span>
      </div>
    </div>

    <!-- QRIS Display -->
    <div v-if="selectedMethod === 'qris'" class="qr-display">
      <div class="qr-box">
        <qrcode-vue v-if="paymentDetails.qr_string" :value="paymentDetails.qr_string" :size="200" level="H" />
        <div v-else class="qr-dummy-label">
          <i class="fa-solid fa-spinner fa-spin"></i> Memuat QR...
        </div>
      </div>
      <p class="qr-hint">Buka aplikasi e-wallet atau m-banking Anda, scan kode QR di atas untuk membayar.</p>
    </div>

    <!-- VA Display -->
    <div v-else class="va-display">
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
      <div class="awaiting-pulse">
        <span class="pulse-dot"></span>
        Menunggu Pembayaran...
      </div>
      <p class="awaiting-timer">Selesaikan dalam <span class="timer-value">{{ formattedCountdown }}</span></p>
    </div>

    <button class="btn-outline" @click="$emit('back')">
      <i class="fa-solid fa-arrow-left"></i> Ganti Metode Pembayaran
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
    countdown.value = 900 // Fallback 15 mins
  }
}

const startCountdown = () => {
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
