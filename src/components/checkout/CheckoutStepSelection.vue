<template>
  <div key="step1" class="checkout-step-container">
    <div class="checkout-2col-layout">
      <!-- Kolom Kiri: Informasi dari Game-Z -->
      <div class="checkout-col-gamez">
        <div class="col-header">
          <div v-if="currentPlanPerks.badge" class="brand-tag">
            <span class="plan-badge-pill">{{ currentPlanPerks.badge }}</span>
          </div>
          <h2 class="col-title">Detail Langganan</h2>
          <p class="col-desc">Tingkatkan progres belajarmu dengan akses fitur premium Game-Z.</p>
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

        <!-- Coupon Input Section -->
        <div class="coupon-section">
          <label for="coupon"><i class="fa-solid fa-ticket"></i> Punya Kode Promo?</label>
          <div class="coupon-input-wrapper" :class="couponStatus">
            <input
              type="text"
              id="coupon"
              v-model="couponCode"
              placeholder="Masukkan kode promo"
              autocomplete="off"
              @keyup.enter="validateCoupon"
            />
            <button
              class="btn-apply-coupon"
              @click="validateCoupon"
              :disabled="!couponCode || isValidatingCoupon"
            >
              <TerminalLoader v-if="isValidatingCoupon" variant="inline" />
              <span v-else>Terapkan</span>
            </button>
          </div>
          <div v-if="couponMessage" class="coupon-message" :class="couponStatus">
            <i class="fa-solid" :class="couponStatus === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'"></i>
            {{ couponMessage }}
          </div>
        </div>

        <!-- Price Breakdown -->
        <div class="price-breakdown-card">
          <div class="breakdown-row">
            <span class="breakdown-label">Harga Paket <span class="breakdown-plan-tag">({{ displayPlanName }})</span></span>
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
      </div>

      <!-- Kolom Kanan: Informasi Pembayaran -->
      <div class="checkout-col-doku">
        <div class="col-header">
          <div class="gateway-tag">
            <i class="fa-solid fa-shield-halved"></i>
            <span>Payment Gateway</span>
          </div>
          <h2 class="col-title">Metode Pembayaran</h2>
          <p class="col-desc">Pilih channel pembayaran resmi yang tersedia.</p>
        </div>

        <!-- Method Selection Grid -->
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
              <div class="method-name">Pembayaran Otomatis</div>
              <div class="method-desc">QRIS, VA Bank (BCA, Mandiri, BRI, BNI), E-Wallet & Kartu</div>
            </div>
            <div class="method-badge">Semua Metode</div>
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
              <div class="method-name">QRIS</div>
              <div class="method-desc">Scan via GoPay, OVO, Dana, ShopeePay, BCA mobile, dll</div>
            </div>
            <div class="method-badge">Instan</div>
          </div>
        </div>

        <!-- Trust & Security Info -->
        <div class="doku-trust-card">
          <div class="trust-header">
            <i class="fa-solid fa-lock"></i>
            <span>Jaminan Keamanan Transaksi</span>
          </div>
          <p class="trust-desc">
            Seluruh transaksi diproses secara aman dan terenkripsi berlisensi Bank Indonesia.
          </p>
          <div class="trust-badges-row">
            <div class="trust-pill"><i class="fa-solid fa-shield-check"></i> 256-bit SSL</div>
            <div class="trust-pill"><i class="fa-solid fa-building-columns"></i> Bank Indonesia</div>
            <div class="trust-pill"><i class="fa-solid fa-bolt"></i> Auto Aktivasi</div>
          </div>
        </div>

        <div v-if="paymentError" class="payment-error-message">
          <i class="fa-solid fa-circle-exclamation"></i> {{ paymentError }}
        </div>

        <!-- CTA Button -->
        <div class="doku-action-area">
          <button
            class="btn-primary btn-doku-submit"
            :disabled="!selectedMethod || isProcessingPayment"
            @click="goToInstruction"
          >
            <TerminalLoader v-if="isProcessingPayment" variant="inline" label="Memproses" />
            <template v-else>
              <span>Lanjutkan Pembayaran</span>
              <i class="fa-solid fa-arrow-right"></i>
            </template>
          </button>
          <p class="doku-terms-note">
            Dengan menekan tombol di atas, Anda akan dialihkan ke portal pembayaran resmi.
          </p>
        </div>
      </div>
    </div>
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

const finalPrice = computed(() => {
  if (discountedPrice.value !== null) return discountedPrice.value
  return props.rawPrice || 0
})

const discountAmount = computed(() => {
  if (discountedPrice.value !== null && props.rawPrice) {
    return Math.max(0, props.rawPrice - discountedPrice.value)
  }
  return 0
})

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
