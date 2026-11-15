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

        <!-- Multi-Month Marketing Sale Selector (Halaman Pembayaran - Kelipatan 3 Tak Terbatas) -->
        <div v-if="isMultiMonthEnabled" class="checkout-duration-box">
          <div class="duration-header-row">
            <span class="duration-title">
              <i class="fa-solid fa-fire"></i> Pilih Durasi Langganan (Kelipatan 3 Bln)
            </span>
            <span v-if="multiMonthPricing.appliedTier?.badge_text" class="tier-highlight-tag">
              {{ multiMonthPricing.appliedTier.badge_text }}
            </span>
          </div>

          <div class="duration-pills-grid">
            <button
              type="button"
              class="duration-pill"
              :class="{ selected: selectedMonths === 1 }"
              @click="selectMonths(1)"
            >
              <span class="dur-months">1 Bulan</span>
              <span class="dur-sub">Rp {{ formatNumber(multiMonthPricing.baseMonthlyPrice) }}/bln</span>
            </button>

            <button
              v-for="tier in planConfig?.marketing_tiers || []"
              :key="tier.months"
              type="button"
              class="duration-pill"
              :class="{
                selected: selectedMonths === tier.months,
                popular: tier.is_popular
              }"
              @click="selectMonths(tier.months)"
            >
              <span v-if="tier.badge_text" class="dur-badge">{{ tier.badge_text }}</span>
              <span class="dur-months">{{ tier.months }} Bulan</span>
              <span class="dur-sub">Rp {{ formatNumber(tier.monthly_price) }}/bln</span>
            </button>
          </div>

          <div class="custom-stepper-row">
            <span class="stepper-label">Atau atur kelipatan 3 bulan:</span>
            <div class="stepper-controls">
              <button
                type="button"
                class="stepper-btn"
                :disabled="selectedMonths <= 1"
                @click="stepMonths(-1)"
                aria-label="Kurangi durasi"
              >
                <i class="fa-solid fa-minus"></i>
              </button>
              <span class="stepper-value">{{ selectedMonths }} Bulan</span>
              <button
                type="button"
                class="stepper-btn"
                @click="stepMonths(1)"
                aria-label="Tambah 3 bulan"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>

          <p v-if="multiMonthPricing.appliedTier?.highlight_text" class="tier-marketing-note">
            <i class="fa-solid fa-sparkles"></i>
            <span>{{ multiMonthPricing.appliedTier.highlight_text }}</span>
          </p>
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
            <span class="breakdown-label">
              Harga Paket
              <span class="breakdown-plan-tag">({{ displayPlanName }} · {{ selectedMonths }} Bln)</span>
            </span>
            <span class="breakdown-value">Rp {{ formatNumber(isMultiMonthEnabled ? multiMonthPricing.normalTotal : effectiveRawPrice) }}</span>
          </div>
          <div v-if="isMultiMonthEnabled && multiMonthPricing.savingsAmount > 0" class="breakdown-row discount">
            <span class="breakdown-label">Diskon Paket {{ selectedMonths }} Bln ({{ multiMonthPricing.discountPercent }}%)</span>
            <span class="breakdown-value">-Rp {{ formatNumber(multiMonthPricing.savingsAmount) }}</span>
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
  rawPrice: Number,
  durationMonths: {
    type: Number,
    default: 1
  },
  planConfig: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['instruction', 'success', 'processing', 'update-duration'])
const { userProfile } = useUserAccount()

const selectedMonths = ref(Math.max(1, Number(props.durationMonths) || 1))

const isMultiMonthEnabled = computed(() => Boolean(props.planConfig?.allow_multi_month))

const multiMonthPricing = computed(() => {
  const months = selectedMonths.value
  const baseMonthlyPrice = Math.round(Number(props.planConfig?.price ?? props.rawPrice) || 0)
  const tiers = Array.isArray(props.planConfig?.marketing_tiers)
    ? [...props.planConfig.marketing_tiers].sort((a, b) => Number(a.months) - Number(b.months))
    : []

  let appliedTier = null
  for (const tier of tiers) {
    if (months >= Number(tier.months)) {
      appliedTier = tier
    }
  }

  const effectiveMonthlyPrice = appliedTier ? Math.round(Number(appliedTier.monthly_price)) : baseMonthlyPrice
  const normalTotal = baseMonthlyPrice * months
  const totalPrice = effectiveMonthlyPrice * months
  const savingsAmount = Math.max(0, normalTotal - totalPrice)
  const discountPercent = normalTotal > 0 ? Math.round(((normalTotal - totalPrice) / normalTotal) * 100) : 0

  return {
    months,
    baseMonthlyPrice,
    effectiveMonthlyPrice,
    normalTotal,
    totalPrice,
    savingsAmount,
    discountPercent,
    appliedTier
  }
})

const selectMonths = (months) => {
  selectedMonths.value = Math.max(1, Number(months) || 1)
  emit('update-duration', {
    months: selectedMonths.value,
    totalPrice: multiMonthPricing.value.totalPrice
  })
  if (couponStatus.value === 'success' && couponCode.value) {
    validateCoupon()
  }
}

const stepMonths = (delta) => {
  const cur = selectedMonths.value
  const next = delta > 0 ? (cur === 1 ? 3 : cur + 3) : (cur <= 3 ? 1 : cur - 3)
  selectMonths(next)
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
      'Akses bebas pilih 12 modul alur belajar / bulan (Tidak dapat dibatalkan)',
      'Akses penuh Global Challenge & Event Arena',
      'Sertifikat kelulusan digital resmi',
      'Bonus iCoinZ sesuai konfigurasi paket aktif',
      'Hint premium tak terbatas di workspace',
      'Leaderboard eksklusif coder Game-Z',
    ]
  },
  expert: {
    badge: 'Paket Tertinggi',
    duration: '180 Hari',
    energy: '+25 Energi / minggu',
    features: [
      'Full Access seluruh modul & alur belajar',
      'Akses 24 Cheatsheets & 300+ Soal Tes Kerja',
      'Semua fitur Pro Plan tanpa batas pilihan modul',
      '25 Energi bonus setiap minggu',
      'Bonus iCoinZ VIP langsung masuk',
      'Kesempatan Magang di iCraft DS & 1-on-1 Mentoring',
    ]
  }
}

const currentPlanPerks = computed(() => {
  const slug = (props.planSlug || 'pro').toLowerCase()
  const base = PLAN_PERKS[slug] || PLAN_PERKS.pro
  const months = selectedMonths.value
  const daysPerPeriod = Number(props.planConfig?.duration_in_days) || (slug === 'expert' ? 180 : 30)
  if (months > 1) {
    return {
      ...base,
      duration: `${months * daysPerPeriod} Hari (${months} Bulan)`
    }
  }
  return base
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

const effectiveRawPrice = computed(() => {
  if (isMultiMonthEnabled.value) {
    return multiMonthPricing.value.totalPrice
  }
  return props.rawPrice || 0
})

const finalPrice = computed(() => {
  if (discountedPrice.value !== null) return discountedPrice.value
  return effectiveRawPrice.value
})

const discountAmount = computed(() => {
  if (discountedPrice.value !== null && effectiveRawPrice.value) {
    return Math.max(0, effectiveRawPrice.value - discountedPrice.value)
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
      plan_slug: props.planSlug,
      duration_months: selectedMonths.value
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
  if (isProcessingPayment.value) return
  paymentError.value = ''
  isProcessingPayment.value = true
  emit('processing', true)
  
  try {
    const [res] = await Promise.all([
      api.post('/payments/create', {
        item_type: 'premium_plan',
        payment_method: selectedMethod.value,
        plan_slug: props.planSlug,
        duration_months: selectedMonths.value,
        coupon_code: couponCode.value
      }),
      new Promise((resolve) => setTimeout(resolve, 1500))
    ])
    
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
      planPrice: effectiveRawPrice.value,
      durationMonths: selectedMonths.value,
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

<style scoped>
.checkout-duration-box {
  margin: 14px 0 18px;
  padding: 14px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.58);
  border: 1px solid rgba(56, 189, 248, 0.24);
}

.duration-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.duration-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #f1f5f9;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.duration-title i {
  color: #f59e0b;
}

.tier-highlight-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.14);
  border: 1px solid rgba(56, 189, 248, 0.35);
  padding: 3px 9px;
  border-radius: 999px;
}

.duration-pills-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.duration-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 10px 8px;
  border-radius: 10px;
  background: rgba(30, 41, 59, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.22);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.duration-pill:hover {
  border-color: rgba(56, 189, 248, 0.55);
}

.duration-pill.selected {
  background: rgba(14, 165, 233, 0.18);
  border-color: #38bdf8;
  box-shadow: 0 0 14px rgba(56, 189, 248, 0.22);
}

.duration-pill.popular:not(.selected) {
  border-color: rgba(245, 158, 11, 0.45);
}

.dur-badge {
  font-size: 0.65rem;
  font-weight: 700;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.dur-months {
  font-size: 0.9rem;
  font-weight: 800;
  color: #f8fafc;
}

.dur-sub {
  font-size: 0.73rem;
  color: #94a3b8;
}

.custom-stepper-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed rgba(148, 163, 184, 0.2);
  flex-wrap: wrap;
}

.stepper-label {
  font-size: 0.78rem;
  color: #94a3b8;
}

.stepper-controls {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.stepper-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid rgba(56, 189, 248, 0.35);
  background: rgba(30, 41, 59, 0.85);
  color: #e2e8f0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  transition: all 0.2s ease;
}

.stepper-btn:hover:not(:disabled) {
  background: rgba(14, 165, 233, 0.25);
  border-color: #38bdf8;
}

.stepper-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.stepper-value {
  min-width: 72px;
  text-align: center;
  font-size: 0.84rem;
  font-weight: 700;
  color: #f8fafc;
}

.tier-marketing-note {
  margin: 8px 0 0;
  font-size: 0.78rem;
  color: #bae6fd;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tier-marketing-note i {
  color: #38bdf8;
}

@media (max-width: 640px) {
  .checkout-duration-box {
    padding: 12px;
  }
  .duration-pills-grid {
    gap: 6px;
  }
  .duration-pill {
    padding: 8px 6px;
  }
  .dur-months {
    font-size: 0.84rem;
  }
}
</style>
