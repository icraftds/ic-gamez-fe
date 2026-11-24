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
              <div class="dur-badge-row">
                <span class="dur-discount-pill neutral">Reguler</span>
              </div>
              <div class="dur-head">
                <span class="dur-months">1 Bulan</span>
                <span class="dur-subtitle">Coba 1 bulan</span>
              </div>
              <div class="dur-price-block">
                <div
                  v-if="anchorMonthlyPrice > multiMonthPricing.baseMonthlyPrice"
                  class="dur-compare-row"
                >
                  <span class="dur-price-strike">
                    Rp {{ formatNumber(anchorMonthlyPrice) }}
                  </span>
                </div>
                <div class="dur-price-main">
                  <span class="dur-amount">Rp {{ formatNumber(multiMonthPricing.baseMonthlyPrice) }}</span>
                  <span class="dur-unit">/bln</span>
                </div>
              </div>
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
              <div class="dur-badge-row">
                <span
                  v-if="getTierDiscountPercent(tier) > 0"
                  class="dur-discount-pill"
                  :class="{ hot: tier.is_popular }"
                >
                  {{ tier.is_popular ? `Penawaran spesial • ${getTierDiscountPercent(tier)}% off` : `${getTierDiscountPercent(tier)}% off` }}
                </span>
              </div>
              <div class="dur-head">
                <span class="dur-months">
                  <i v-if="tier.is_popular" class="fas fa-sparkles dur-sparkle"></i>
                  {{ tier.months }} Bulan
                </span>
                <span v-if="tier.badge_text" class="dur-subtitle">{{ tier.badge_text }}</span>
              </div>
              <div class="dur-price-block">
                <div v-if="getTierDiscountPercent(tier) > 0" class="dur-compare-row">
                  <span class="dur-price-strike">
                    Rp {{ formatNumber(anchorMonthlyPrice) }}
                  </span>
                  <span class="dur-savings-note">
                    Hemat Rp {{ formatNumber(getTierSavingsPerMonth(tier)) }}/bln
                  </span>
                </div>
                <div class="dur-price-main">
                  <span class="dur-amount">Rp {{ formatNumber(tier.monthly_price) }}</span>
                  <span class="dur-unit">/bln</span>
                </div>
              </div>
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

        <div
          v-else-if="showDurationSkeleton"
          class="checkout-duration-box checkout-duration-skeleton"
          aria-hidden="true"
        >
          <div class="duration-header-row">
            <span class="skel-bar skel-title"></span>
            <span class="skel-bar skel-chip"></span>
          </div>
          <div class="duration-pills-grid">
            <div v-for="n in 4" :key="n" class="duration-pill skel-pill">
              <span class="skel-bar skel-badge"></span>
              <span class="skel-bar skel-heading"></span>
              <span class="skel-bar skel-sub"></span>
              <span class="skel-bar skel-price"></span>
            </div>
          </div>
          <div class="custom-stepper-row">
            <span class="skel-bar skel-stepper-label"></span>
            <span class="skel-bar skel-stepper-controls"></span>
          </div>
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
              <span class="breakdown-plan-tag">({{ displayPlanName }} · {{ isMultiMonthEnabled ? `${selectedMonths} Bln` : currentPlanPerks.duration }})</span>
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
import { resolvePlanPresentation } from '../../composables/usePlans'

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
  },
  isPlanConfigLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['instruction', 'success', 'processing', 'update-duration'])
const { userProfile } = useUserAccount()

const selectedMonths = ref(Math.max(1, Number(props.durationMonths) || 1))

const isMultiMonthEnabled = computed(() => Boolean(props.planConfig?.allow_multi_month))
const showDurationSkeleton = computed(() =>
  props.isPlanConfigLoading && (props.planSlug || 'pro').toLowerCase() === 'pro'
)

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

const anchorMonthlyPrice = computed(() => {
  const cmp = Math.round(Number(props.planConfig?.compare_price) || 0)
  return cmp > 0 ? cmp : multiMonthPricing.value.baseMonthlyPrice
})

const getTierDiscountPercent = (tier) => {
  const base = anchorMonthlyPrice.value
  const price = Math.round(Number(tier?.monthly_price) || 0)
  if (!base || base <= price) return 0
  return Math.round(((base - price) / base) * 100)
}

const getTierSavingsPerMonth = (tier) => {
  const base = anchorMonthlyPrice.value
  const price = Math.round(Number(tier?.monthly_price) || 0)
  return Math.max(0, base - price)
}

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

const currentPlanPerks = computed(() => {
  const presentation = resolvePlanPresentation(
    props.planConfig || props.planSlug || 'pro',
    selectedMonths.value
  )
  const months = selectedMonths.value
  return {
    badge: presentation.checkoutBadge,
    duration: presentation.isLifetime
      ? 'Selamanya (Lifetime)'
      : (months > 1 ? `${presentation.durationLabel} (${months} Bulan)` : presentation.durationLabel),
    energy: presentation.energyLabel,
    features: presentation.features,
  }
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
  let isRedirecting = false
  
  try {
    const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `pay-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const [res] = await Promise.all([
      api.post('/payments/create', {
        item_type: 'premium_plan',
        payment_method: selectedMethod.value,
        plan_slug: props.planSlug,
        duration_months: selectedMonths.value,
        coupon_code: couponCode.value
      }, {
        headers: { 'Idempotency-Key': idempotencyKey }
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

    const currentSub = userProfile.value?.subscription || null
    const baselineSubscription = currentSub ? {
      id: currentSub.id,
      expires_at: currentSub.expires_at,
      starts_at: currentSub.starts_at,
      updated_at: currentSub.updated_at,
      status: currentSub.status
    } : null

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
        baselineSubscription,
      },
      selectedMethod: selectedMethod.value,
      expiryTime: expiryTime,
      userId: userProfile.value?.id,
      savedAt: Date.now()
    }))

    if (paymentLink) {
      isRedirecting = true
      window.location.href = paymentLink
      return
    }

    emit('instruction', {
      paymentDetails: {
        ...(tx.payment_details || {}),
        order_id: tx.order_id,
        amount: tx.amount,
        baselineSubscription,
      },
      selectedMethod: selectedMethod.value,
      discountedPrice: discountedPrice.value
    })
  } catch (err) {
    console.error('Failed to create payment', err)
    const rawMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Coba lagi.'
    if (err.response?.status === 503 && String(rawMsg).toLowerCase() === 'service unavailable') {
      paymentError.value = 'Server sedang melakukan pemeliharaan singkat. Silakan tunggu beberapa detik lalu coba lagi.'
    } else {
      paymentError.value = 'Gagal memproses pembayaran: ' + rawMsg
    }
  } finally {
    if (!isRedirecting) {
      isProcessingPayment.value = false
      emit('processing', false)
    }
  }
}
</script>

<style scoped src="../../assets/css/components/checkout/CheckoutStepSelection.css"></style>

<style scoped>
.checkout-duration-box {
  font-family: 'Plus Jakarta Sans', 'Poppins', system-ui, -apple-system, sans-serif;
  font-variant-numeric: tabular-nums;
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
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.duration-title {
  font-size: 0.84rem;
  font-weight: 600;
  color: #f1f5f9;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  letter-spacing: -0.01em;
}

.duration-title i {
  color: #f59e0b;
}

.tier-highlight-tag {
  font-size: 0.72rem;
  font-weight: 600;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.14);
  border: 1px solid rgba(56, 189, 248, 0.35);
  padding: 3px 9px;
  border-radius: 999px;
}

.duration-pills-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.duration-pill {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  text-align: left;
  gap: 4px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.18);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.duration-pill:hover {
  border-color: rgba(56, 189, 248, 0.5);
  background: rgba(30, 41, 59, 0.8);
}

.duration-pill.selected {
  background: rgba(14, 165, 233, 0.14);
  border-color: #38bdf8;
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.35), 0 8px 18px -8px rgba(56, 189, 248, 0.4);
}

.duration-pill.popular:not(.selected) {
  border-color: rgba(244, 63, 94, 0.38);
}

.dur-badge-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 20px;
}

.dur-head {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dur-months {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.96rem;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.01em;
}

.dur-sparkle {
  font-size: 0.78rem;
  color: #a78bfa;
}

.dur-discount-pill {
  font-size: 0.66rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f43f5e;
  color: #ffffff;
  border: 1px solid #f43f5e;
  white-space: nowrap;
}

.dur-discount-pill.hot {
  background: #f43f5e;
  color: #ffffff;
  border-color: #f43f5e;
  box-shadow: 0 2px 10px rgba(244, 63, 94, 0.35);
}

.dur-discount-pill.neutral {
  background: rgba(148, 163, 184, 0.14);
  color: #94a3b8;
  border-color: rgba(148, 163, 184, 0.22);
}

.dur-subtitle {
  font-size: 0.72rem;
  font-weight: 500;
  color: #94a3b8;
  line-height: 1.3;
}

.dur-price-block {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.dur-compare-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.dur-price-strike {
  font-size: 0.72rem;
  font-weight: 500;
  color: #64748b;
  text-decoration: line-through;
}

.dur-savings-note {
  font-size: 0.68rem;
  font-weight: 600;
  color: #34d399;
}

.dur-price-main {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.dur-amount {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.dur-unit {
  font-size: 0.72rem;
  font-weight: 500;
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

.checkout-duration-skeleton .skel-bar {
  display: block;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    rgba(51, 65, 85, 0.45) 25%,
    rgba(100, 116, 139, 0.5) 50%,
    rgba(51, 65, 85, 0.45) 75%
  );
  background-size: 200% 100%;
  animation: dur-skel-shimmer 1.35s ease-in-out infinite;
}

.checkout-duration-skeleton .skel-title {
  width: 62%;
  height: 16px;
}

.checkout-duration-skeleton .skel-chip {
  width: 82px;
  height: 22px;
  border-radius: 999px;
}

.checkout-duration-skeleton .skel-pill {
  cursor: default;
  gap: 8px;
  min-height: 108px;
}

.checkout-duration-skeleton .skel-badge {
  width: 58px;
  height: 16px;
  border-radius: 999px;
  align-self: flex-end;
}

.checkout-duration-skeleton .skel-heading {
  width: 48%;
  height: 16px;
}

.checkout-duration-skeleton .skel-sub {
  width: 66%;
  height: 12px;
}

.checkout-duration-skeleton .skel-price {
  width: 78%;
  height: 20px;
  margin-top: auto;
}

.checkout-duration-skeleton .skel-stepper-label {
  width: 44%;
  height: 14px;
}

.checkout-duration-skeleton .skel-stepper-controls {
  width: 148px;
  height: 30px;
}

@keyframes dur-skel-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 640px) {
  .checkout-duration-box {
    padding: 12px;
  }
  .duration-pills-grid {
    gap: 8px;
  }
  .duration-pill {
    padding: 10px 9px;
  }
  .dur-card-top {
    flex-wrap: wrap;
    gap: 4px;
  }
  .dur-months {
    font-size: 0.86rem;
  }
  .dur-amount {
    font-size: 0.94rem;
  }
  .dur-discount-pill {
    font-size: 0.62rem;
    padding: 1px 6px;
  }
}

@media (max-width: 360px) {
  .duration-pills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
