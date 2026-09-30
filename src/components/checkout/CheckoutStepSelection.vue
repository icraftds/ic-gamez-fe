<template>
  <div key="step1">
    <h2 class="section-title">Pilih Metode Pembayaran</h2>
    <p class="section-subtitle">Pilih metode yang paling nyaman untuk menyelesaikan transaksi Anda.</p>

    <!-- Order Summary -->
    <div class="order-summary">
      <div class="order-plan-name">
        <i :class="planIcon"></i>
        <span>{{ planName }}</span>
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
    
    <div v-if="paymentError" class="payment-error-message">
      <i class="fa-solid fa-circle-exclamation"></i> {{ paymentError }}
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
import axios from 'axios'
import api from '../../services/api'
import { useUserAccount } from '../../composables/useUserAccount'

const { userProfile } = useUserAccount()

const props = defineProps({
  planName: String,
  planIcon: String,
  formattedPrice: String,
  planSlug: String,
  planId: Number,
  rawPrice: Number
})

const emit = defineEmits(['instruction', 'success', 'processing'])

const selectedMethod = ref(null)
const isProcessingPayment = ref(false)
const couponCode = ref('')
const isValidatingCoupon = ref(false)
const couponMessage = ref('')
const couponStatus = ref(null)
const discountedPrice = ref(null)
const paymentError = ref('')

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
    const userId = userProfile.value?.id || 1 // fallback to 1 if not found
    
    const amountToPay = discountedPrice.value !== null ? discountedPrice.value : props.rawPrice

    const payload = { 
      item_type: "premium_plan", 
      plan_slug: props.planSlug || "pro", 
      payment_method: selectedMethod.value, 
      coupon_code: couponCode.value || null,
      user_id: userId,
      plan_id: props.planId,
      amount: amountToPay
    }
    
    // Hit Payment Gateway Service Directly
    const paymentBaseUrl = (import.meta.env.VITE_PAYMENT_GATEWAY_URL || 'https://ic-pg.unikom.my.id').replace(/\/+$/, '')
    const res = await axios.post(`${paymentBaseUrl}/api/payment/checkout`, payload, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    const tx = res.data?.data || {}
    
    let redirectUrl = tx.checkout_url || tx.payment_url;
    
    // Jika metode adalah payment_link tapi URL kosong, coba konstruksi manual
    if (selectedMethod.value === 'payment_link' && !redirectUrl && tx.pakasir_txn_id) {
      redirectUrl = `https://app.pakasir.com/pay-v2/${tx.pakasir_txn_id}`
    }

    if (redirectUrl && selectedMethod.value === 'payment_link') {
      localStorage.setItem('ic_returning_from_payment', 'true')
      window.location.href = redirectUrl
      return
    }

    // Untuk QRIS dan VA, teruskan data (termasuk qr_string / va_number) ke layar instruksi
    emit('instruction', {
      paymentDetails: tx,
      selectedMethod: selectedMethod.value,
      discountedPrice: discountedPrice.value
    })
  } catch (err) {
    console.error('Failed to create payment in Payment Gateway:', err)
    paymentError.value = err.response?.data?.message || 'Gagal memproses pembayaran ke Payment Gateway'
  } finally {
    isProcessingPayment.value = false
    emit('processing', false)
  }
}
</script>

<style scoped src="../../assets/css/components/checkout/CheckoutStepSelection.css"></style>

