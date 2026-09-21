<template>
  <div key="step1">
    <h2 class="section-title">Pilih Metode Pembayaran</h2>
    <p class="section-subtitle">Pilih metode yang paling nyaman untuk menyelesaikan transaksi Anda.</p>

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

    <!-- Coupon Input -->
    <div class="coupon-section">
      <label for="coupon">Punya Kode Promo?</label>
      <div class="coupon-input-wrapper" :class="couponStatus">
        <i class="fa-solid fa-ticket"></i>
        <input type="text" id="coupon" v-model="couponCode" placeholder="Masukkan kode promo" autocomplete="off" @keyup.enter="validateCoupon">
        <button class="btn-apply-coupon" @click="validateCoupon" :disabled="!couponCode || isValidatingCoupon">
          <i class="fa-solid fa-spinner fa-spin" v-if="isValidatingCoupon"></i>
          <span v-else>Terapkan</span>
        </button>
      </div>
      <div v-if="couponMessage" class="coupon-message" :class="couponStatus">
        <i class="fa-solid" :class="couponStatus === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'"></i>
        {{ couponMessage }}
      </div>
    </div>

    <!-- Method List -->
    <div class="method-grid">
      <div
        class="method-card"
        :class="{ selected: selectedMethod === 'qris' }"
        @click="selectedMethod = 'qris'"
      >
        <div class="method-radio">
          <div class="method-radio-inner"></div>
        </div>
        <div class="method-icon qris">
          <i class="fa-solid fa-qrcode"></i>
        </div>
        <div class="method-info">
          <div class="method-name">QRIS</div>
          <div class="method-desc">Scan QR menggunakan e-wallet / m-banking</div>
        </div>
        <div class="method-badge">Instan</div>
      </div>

      <div
        class="method-card"
        :class="{ selected: selectedMethod === 'va_bca' }"
        @click="selectedMethod = 'va_bca'"
      >
        <div class="method-radio">
          <div class="method-radio-inner"></div>
        </div>
        <div class="method-icon va">
          <i class="fa-solid fa-building-columns"></i>
        </div>
        <div class="method-info">
          <div class="method-name">Virtual Account BCA</div>
          <div class="method-desc">Transfer melalui ATM, iBanking, atau mBanking</div>
        </div>
      </div>

      <div
        class="method-card"
        :class="{ selected: selectedMethod === 'va_bni' }"
        @click="selectedMethod = 'va_bni'"
      >
        <div class="method-radio">
          <div class="method-radio-inner"></div>
        </div>
        <div class="method-icon va">
          <i class="fa-solid fa-building-columns"></i>
        </div>
        <div class="method-info">
          <div class="method-name">Virtual Account BNI</div>
          <div class="method-desc">Transfer melalui ATM, iBanking, atau mBanking</div>
        </div>
      </div>

      <!-- Payment Link Option -->
      <div
        class="method-card"
        :class="{ selected: selectedMethod === 'payment_link' }"
        @click="selectedMethod = 'payment_link'"
      >
        <div class="method-radio">
          <div class="method-radio-inner"></div>
        </div>
        <div class="method-icon link">
          <i class="fa-solid fa-link"></i>
        </div>
        <div class="method-info">
          <div class="method-name">E-Wallet & Bank Lainnya</div>
          <div class="method-desc">Ovo, Dana, LinkAja, Mandiri, dll. (Diarahkan)</div>
        </div>
        <div class="method-badge alt">Fleksibel</div>
      </div>
    </div>

    <button
      class="btn-primary"
      :disabled="!selectedMethod || isProcessingPayment"
      @click="goToInstruction"
    >
      <i class="fa-solid fa-spinner fa-spin" v-if="isProcessingPayment"></i>
      <i class="fa-solid fa-arrow-right" v-else></i>
      {{ isProcessingPayment ? 'Memproses...' : 'Lanjutkan Pembayaran' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../../services/api'

const props = defineProps({
  planName: String,
  planIcon: String,
  formattedPrice: String,
  planSlug: String
})

const emit = defineEmits(['instruction', 'success', 'processing'])

const selectedMethod = ref(null)
const isProcessingPayment = ref(false)
const couponCode = ref('')
const isValidatingCoupon = ref(false)
const couponMessage = ref('')
const couponStatus = ref(null)
const discountedPrice = ref(null)

const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

const validateCoupon = async () => {
  if (!couponCode.value) return
  
  isValidatingCoupon.value = true
  couponMessage.value = ''
  couponStatus.value = null
  
  try {
    const res = await api.post('/coupons/validate', {
      code: couponCode.value,
      plan_slug: props.planSlug
    })
    
    discountedPrice.value = res.data.data.final_price
    couponMessage.value = res.data.message || 'Kupon berhasil diterapkan!'
    couponStatus.value = 'success'
  } catch (err) {
    discountedPrice.value = null
    couponStatus.value = 'error'
    couponMessage.value = err.response?.data?.message || err.response?.data?.error || 'Kupon tidak valid.'
  } finally {
    isValidatingCoupon.value = false
  }
}

const goToInstruction = async () => {
  isProcessingPayment.value = true
  emit('processing', true)
  
  try {
    const res = await api.post('/payments/create', {
      item_type: 'premium_plan',
      payment_method: selectedMethod.value,
      plan_slug: props.planSlug,
      coupon_code: couponCode.value
    })
    
    const tx = res.data?.data
    if (!tx) throw new Error('Data transaksi tidak ditemukan dari server.')

    if (tx.status === 'completed' || tx.amount === 0) {
      emit('success')
      return
    }

    if (tx.payment_method === 'payment_link' && tx.payment_details?.payment_link) {
      window.location.href = tx.payment_details.payment_link
      return
    }

    emit('instruction', {
      paymentDetails: tx.payment_details || {},
      selectedMethod: selectedMethod.value
    })
  } catch (err) {
    console.error('Failed to create payment', err)
    const errMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Coba lagi.'
    alert('Gagal memuat metode pembayaran: ' + errMessage)
  } finally {
    isProcessingPayment.value = false
    emit('processing', false)
  }
}
</script>

<style scoped src="../../assets/css/components/checkout/CheckoutStepSelection.css"></style>
