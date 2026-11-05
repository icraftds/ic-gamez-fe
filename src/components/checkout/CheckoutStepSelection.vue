<template>
  <div key="step1">
    <h2 class="section-title">Pilih Metode Pembayaran</h2>
    <p class="section-subtitle">Pilih metode yang paling nyaman untuk menyelesaikan transaksi Anda.</p>

    <!-- Order Summary -->
    <div class="order-summary">
      <div class="order-plan-name">
        <i :class="planIcon"></i>
        <span>{{ displayPlanName }}</span>
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
          <TerminalLoader v-if="isValidatingCoupon" variant="inline" />
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
        :class="{ selected: selectedMethod === 'doku' }"
        @click="selectedMethod = 'doku'"
      >
        <div class="method-radio">
          <div class="method-radio-inner"></div>
        </div>
        <div class="method-icon doku">
          <i class="fa-solid fa-credit-card"></i>
        </div>
        <div class="method-info">
          <div class="method-name">DOKU Checkout (Semua Metode)</div>
          <div class="method-desc">QRIS, Virtual Account Bank (BCA, Mandiri, BRI, BNI), E-Wallet, Kartu Kredit</div>
        </div>
        <div class="method-badge">Lengkap & Instan</div>
      </div>

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
          <div class="method-name">QRIS (DOKU)</div>
          <div class="method-desc">Scan via GoPay, OVO, Dana, ShopeePay, BCA, dll</div>
        </div>
        <div class="method-badge">Instan</div>
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
      <TerminalLoader v-if="isProcessingPayment" variant="inline" label="pembayaran" />
      <template v-else>
        <i class="fa-solid fa-arrow-right"></i>
        <span>Lanjutkan Pembayaran</span>
      </template>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '../../services/api'
import { useUserAccount } from '../../composables/useUserAccount'

const props = defineProps({
  planName: String,
  planIcon: String,
  formattedPrice: String,
  planSlug: String,
  planId: Number,
  rawPrice: Number
})

const emit = defineEmits(['instruction', 'success', 'processing'])
const { userProfile } = useUserAccount()

const displayPlanName = computed(() => {
  const name = props.planName || 'Pro'
  return name.toLowerCase().endsWith('plan') ? name : `${name} Plan`
})

const selectedMethod = ref('doku')
const isProcessingPayment = ref(false)
const couponCode = ref('')
const isValidatingCoupon = ref(false)
const couponMessage = ref('')
const couponStatus = ref(null)
const discountedPrice = ref(null)
const paymentError = ref('')

const formatNumber = (num) => {
  if (num == null) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

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
  paymentError.value = ''
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

    const paymentLink = tx.payment_details?.payment_link || tx.payment_url || tx.checkout_url
    const expiryTime = tx.payment_details?.expires_at
      ? new Date(tx.payment_details.expires_at).getTime()
      : Date.now() + 30 * 60 * 1000

    // Simpan informasi checkout ke localStorage agar persist saat redirect / refresh
    localStorage.setItem('ic_pending_checkout', JSON.stringify({
      planSlug: props.planSlug,
      planName: props.planName,
      planIcon: props.planIcon,
      planPrice: props.rawPrice,
      discountedPrice: discountedPrice.value,
      paymentDetails: {
        ...(tx.payment_details || {}),
        order_id: tx.order_id,
        amount: tx.amount,
        payment_link: paymentLink,
      },
      selectedMethod: selectedMethod.value,
      expiryTime: expiryTime,
      userId: userProfile.value?.id,
      savedAt: Date.now()
    }))

    if (paymentLink) {
      window.location.href = paymentLink
      return
    }

    emit('instruction', {
      paymentDetails: {
        ...(tx.payment_details || {}),
        order_id: tx.order_id,
        amount: tx.amount
      },
      selectedMethod: selectedMethod.value,
      discountedPrice: discountedPrice.value
    })
  } catch (err) {
    console.error('Failed to create payment', err)
    const errMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Coba lagi.'
    paymentError.value = 'Gagal memuat metode pembayaran: ' + errMessage
  } finally {
    isProcessingPayment.value = false
    emit('processing', false)
  }
}
</script>

<style scoped src="../../assets/css/components/checkout/CheckoutStepSelection.css"></style>
