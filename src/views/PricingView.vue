<template>
  <div class="pricing-view" :class="{ 'is-embedded': isEmbedded }">
    <SimpleBackground v-if="!isEmbedded" />
    
    <div class="pricing-content">
      <div class="header-section">
        <h1 class="gradient-text">Pilih Paket Langganan</h1>
        <p class="subtitle">Tingkatkan pengalaman belajarmu dengan akses penuh ke semua materi premium.</p>
      </div>

      <!-- Pending Transaction Banner -->
      <div v-if="pendingCheckout && isLoggedIn" class="pending-banner">
        <div class="pending-info">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <div>
            <strong>Menunggu Pembayaran</strong>
            <p>Anda memiliki transaksi {{ (pendingCheckout.planName || 'Pro').replace(/\s*Plan$/i, '') }} Plan yang belum diselesaikan.</p>
          </div>
        </div>
        <div class="pending-actions">
          <button class="btn-cancel-pending" @click="cancelPendingCheckout">Batalkan</button>
          <button class="btn-resume" @click="resumeCheckout">Lanjutkan Pembayaran</button>
        </div>
      </div>

      <!-- Loading State -->
      <TerminalLoader v-if="isLoadingPlans" label="paket langganan" />

      <!-- Plan Selection -->
      <div v-else class="plans-container">
        <!-- Free Plan -->
        <div class="plan-card free">
          <div class="plan-header">
            <div class="plan-icon"><i class="fa-solid fa-paper-plane"></i></div>
            <h3>Free Plan</h3>
            <p class="price">Rp 0<span>/bulan</span></p>
          </div>
          <ul class="plan-benefits">
            <li><i class="fa-solid fa-check"></i> Akses modul dasar</li>
            <li><i class="fa-solid fa-check"></i> 10 Energy / hari</li>
            <li class="disabled"><i class="fa-solid fa-xmark"></i> Akses konten premium</li>
            <li class="disabled"><i class="fa-solid fa-xmark"></i> Sertifikat kelulusan</li>
            <li class="disabled"><i class="fa-solid fa-xmark"></i> 1-on-1 Mentoring</li>
          </ul>
          <div class="plan-action">
            <div v-if="(currentPlan === 'free' || !currentPlan) && !isPremiumUser" class="active-badge"><i class="fa-solid fa-check-circle"></i> Paket Saat Ini</div>
            <button v-else class="btn-disabled" @click="handlePlanClick('free')">Klaim Gratis</button>
          </div>
        </div>

        <!-- Dynamic Plans from API -->
        <div v-for="plan in plans" :key="plan.id" class="plan-card" :class="[plan.slug, { active: isPlanOwned(plan.slug) }]">
          <!-- Optional Badges based on slug -->
          <div v-if="plan.slug === 'pro'" class="badge-popular">Paling Populer</div>
          <div v-else-if="plan.slug === 'expert'" class="badge-premium">Premium</div>
          
          <div class="plan-header">
            <div class="plan-icon" :class="plan.slug + '-icon'">
              <i :class="getPlanIcon(plan.slug)"></i>
            </div>
            <h3>{{ plan.name }}</h3>

            <!-- Dynamic Price Display (Multi-month aware) -->
            <template v-if="plan.allow_multi_month">
              <div class="price-multi-wrap">
                <p class="price">
                  Rp {{ formatPrice(getPlanPricing(plan).effectiveMonthlyPrice) }}<span>/bulan</span>
                </p>
                <div v-if="getPlanPricing(plan).discountPercent > 0" class="price-discount-meta">
                  <span class="price-strike">Rp {{ formatPrice(getPlanPricing(plan).baseMonthlyPrice) }}/bln</span>
                  <span class="discount-pill">Hemat {{ getPlanPricing(plan).discountPercent }}%</span>
                </div>
                <p class="total-billing-note">
                  Total {{ getPlanPricing(plan).months }} bulan:
                  <strong>Rp {{ formatPrice(getPlanPricing(plan).totalPrice) }}</strong>
                  <span v-if="getPlanPricing(plan).savingsAmount > 0" class="savings-text">
                    (Hemat Rp {{ formatPrice(getPlanPricing(plan).savingsAmount) }})
                  </span>
                </p>
              </div>
            </template>
            <template v-else>
              <p class="price">Rp {{ formatPrice(plan.price) }}<span>/{{ plan.duration_in_days }} hari</span></p>
            </template>
          </div>

          <!-- Multi-Month Marketing Sale Selector (Kelipatan 3 Tak Terbatas) -->
          <div v-if="plan.allow_multi_month" class="duration-selector-box">
            <div class="duration-header-row">
              <span class="duration-title"><i class="fa-solid fa-fire"></i> Pilih Durasi (Kelipatan 3 Bln)</span>
              <span v-if="getPlanPricing(plan).appliedTier?.badge_text" class="tier-highlight-tag">
                {{ getPlanPricing(plan).appliedTier.badge_text }}
              </span>
            </div>

            <div class="duration-pills-grid">
              <button
                type="button"
                class="duration-pill"
                :class="{ selected: getSelectedMonths(plan) === 1 }"
                @click="setSelectedMonths(plan, 1)"
              >
                <span class="dur-months">1 Bln</span>
                <span class="dur-sub">Normal</span>
              </button>

              <button
                v-for="tier in plan.marketing_tiers || []"
                :key="tier.months"
                type="button"
                class="duration-pill"
                :class="{
                  selected: getSelectedMonths(plan) === tier.months,
                  popular: tier.is_popular
                }"
                @click="setSelectedMonths(plan, tier.months)"
              >
                <span v-if="tier.badge_text" class="dur-badge">{{ tier.badge_text }}</span>
                <span class="dur-months">{{ tier.months }} Bln</span>
                <span class="dur-sub">Rp {{ formatPrice(tier.monthly_price) }}/bln</span>
              </button>
            </div>

            <!-- Unlimited Multiple-of-3 Stepper -->
            <div class="custom-stepper-row">
              <span class="stepper-label">Atau atur kelipatan 3:</span>
              <div class="stepper-controls">
                <button
                  type="button"
                  class="stepper-btn"
                  :disabled="getSelectedMonths(plan) <= 1"
                  @click="stepMonths(plan, -1)"
                  aria-label="Kurangi durasi"
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="stepper-value">{{ getSelectedMonths(plan) }} Bulan</span>
                <button
                  type="button"
                  class="stepper-btn"
                  @click="stepMonths(plan, 1)"
                  aria-label="Tambah 3 bulan"
                >
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

            <p v-if="getPlanPricing(plan).appliedTier?.highlight_text" class="tier-marketing-note">
              <i class="fa-solid fa-sparkles"></i>
              {{ getPlanPricing(plan).appliedTier.highlight_text }}
            </p>
          </div>
          
          <!-- Energy badge -->
          <div class="plan-energy-badge" :class="'energy-' + plan.slug">
            <i :class="getPlanEnergyIcon(plan.slug)"></i>
            {{ getPlanEnergyLabel(plan.slug) }}
          </div>
          
          <ul class="plan-benefits">
            <li v-for="(benefit, index) in getPlanBenefits(plan)" :key="'b-' + index">
              <i class="fa-solid fa-check"></i> {{ benefit }}
            </li>
            <li v-for="(item, index) in getPlanDisabled(plan.slug)" :key="'d-' + index" class="disabled">
              <i class="fa-solid fa-xmark"></i> {{ item }}
            </li>
          </ul>
          
          <div class="plan-action">
            <template v-if="isPlanOwned(plan.slug)">
              <div class="active-badge">
                <i class="fa-solid fa-check-circle"></i>
                <span>
                  Paket Aktif
                  <template v-if="subscriptionInfo?.days_remaining > 0">
                    (Sisa {{ subscriptionInfo.days_remaining }} hari)
                  </template>
                </span>
              </div>
              <button
                class="btn-upgrade btn-renew-plan"
                :class="plan.slug + '-btn'"
                @click="handlePlanClick(plan.slug, plan, true)"
                :disabled="isNavigating"
              >
                <TerminalLoader v-if="isNavigating && navTargetSlug === plan.slug" variant="inline" label="perpanjang" />
                <span v-else><i class="fa-solid fa-rotate-right"></i> Perpanjang Paket</span>
              </button>
            </template>
            <button v-else class="btn-upgrade" :class="plan.slug + '-btn'" @click="handlePlanClick(plan.slug, plan)" :disabled="isNavigating">
              <TerminalLoader v-if="isNavigating && navTargetSlug === plan.slug" variant="inline" label="paket" />
              <span v-else>Pilih {{ plan.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Auth Modal -->
    <AuthRequiredModal
      :isOpen="showAuthModal"
      :nextStepLabel="pendingStepLabel"
      @close="showAuthModal = false"
      @login="$router.push('/login')"
      @register="$router.push('/register')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import AuthRequiredModal from '../components/common/AuthRequiredModal.vue'
import { useUserAccount } from '../composables/useUserAccount'
import { useToast } from '../composables/useToast'

const props = defineProps({
  isEmbedded: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const { isLoggedIn, isPremiumUser, currentPlan, subscriptionInfo } = useUserAccount()
const { showToast } = useToast()

const plans = ref([])
const isLoadingPlans = ref(false)
const selectedMonthsByPlan = ref({})

const isPlanOwned = (slug) => {
  return currentPlan.value === slug || (isPremiumUser.value && (currentPlan.value === 'free' || !currentPlan.value) && slug === 'pro')
}

const getSelectedMonths = (plan) => {
  if (!plan?.allow_multi_month) return 1
  return selectedMonthsByPlan.value[plan.slug] || 1
}

const setSelectedMonths = (plan, months) => {
  const m = Math.max(1, Number(months) || 1)
  selectedMonthsByPlan.value = {
    ...selectedMonthsByPlan.value,
    [plan.slug]: m
  }
}

const stepMonths = (plan, delta) => {
  const cur = getSelectedMonths(plan)
  let next
  if (delta > 0) {
    next = cur === 1 ? 3 : cur + 3
  } else {
    next = cur <= 3 ? 1 : cur - 3
  }
  setSelectedMonths(plan, next)
}

const getPlanPricing = (plan) => {
  const months = getSelectedMonths(plan)
  const baseMonthlyPrice = Math.round(Number(plan?.price) || 0)
  const tiers = Array.isArray(plan?.marketing_tiers) ? [...plan.marketing_tiers].sort((a, b) => a.months - b.months) : []

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
}

const showAuthModal = ref(false)
const pendingStepLabel = ref('')

const pendingCheckout = ref(null)
const isNavigating = ref(false)
const navTargetSlug = ref(null)

onMounted(async () => {
  const saved = localStorage.getItem('ic_pending_checkout')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data.expiryTime > Date.now()) {
        pendingCheckout.value = data
      } else {
        localStorage.removeItem('ic_pending_checkout')
      }
    } catch(e) {}
  }

  try {
    isLoadingPlans.value = true
    const response = await api.get('/plans')
    plans.value = response.data.data || response.data
  } catch (error) {
    console.error('Failed to fetch plans', error)
  } finally {
    isLoadingPlans.value = false
  }
})

const resumeCheckout = () => {
  router.push({ name: 'checkout', query: { resume: 'true' } })
}

const cancelPendingCheckout = () => {
  localStorage.removeItem('ic_pending_checkout')
  pendingCheckout.value = null
}

const PLAN_CONFIG = {
  pro: {
    icon: 'fa-solid fa-rocket',
    energyLabel: '20 Energi/minggu',
    energyIcon: 'fa-solid fa-infinity',
    benefits: [
      'Akses bebas pilih 12 modul alur belajar / bulan (Tidak dapat dibatalkan)',
      'Akses Global Challenge & Event Arena',
      'Sertifikat kelulusan digital',
      'Hint premium tak terbatas',
      'Leaderboard eksklusif',
    ],
    disabled: [
      'Full Access seluruh modul tanpa batas',
      'Kesempatan Magang di ICraft DS',
      '1-on-1 Mentoring bulanan',
    ],
  },
  expert: {
    icon: 'fa-solid fa-crown',
    energyLabel: '25 Energi / minggu',
    energyIcon: 'fa-solid fa-bolt',
    benefits: [
      'Full Access semua modul alur belajar',
      'Akses 24 Cheatsheets & 300+ Soal Tes Kerja',
      'Semua fitur Pro Plan',
      '25 Energi bonus setiap minggu',
      'Kesempatan Magang di ICraft DS',
      '1-on-1 Mentoring bulanan',
      'Portofolio review eksklusif',
    ],
    disabled: [],
  },
}

const getPlanIcon = (slug) => PLAN_CONFIG[slug]?.icon ?? 'fa-solid fa-star'
const getPlanBenefits = (planOrSlug) => {
  const plan = typeof planOrSlug === 'object' && planOrSlug !== null ? planOrSlug : null
  const slug = plan ? plan.slug : planOrSlug
  const base = [...(PLAN_CONFIG[slug]?.benefits ?? ['Akses fitur premium'])]
  if (slug === 'pro' && plan?.max_selectable_modules) {
    base[0] = `Akses bebas pilih ${plan.max_selectable_modules} modul alur belajar / bulan (Tidak dapat dibatalkan)`
  }
  const reward = Number(plan?.icoinz_reward || 0)
  if (reward > 0) {
    base.splice(1, 0, `Bonus ${formatPrice(reward)} iCoinZ bergabung`)
  }
  return base
}
const getPlanDisabled = (slug) => PLAN_CONFIG[slug]?.disabled ?? []
const getPlanEnergyLabel  = (slug) => PLAN_CONFIG[slug]?.energyLabel ?? ''
const getPlanEnergyIcon   = (slug) => PLAN_CONFIG[slug]?.energyIcon ?? 'fa-solid fa-bolt'

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

/**
 * Navigasi ke halaman checkout jika sudah login,
 * atau tampilkan modal auth jika belum.
 */
const handlePlanClick = async (slug, plan = null, isRenewal = false) => {
  if (isNavigating.value) return;

  if (slug === 'free') {
    if (isLoggedIn.value) {
      showToast('Anda sudah berada di Free Plan saat ini.', 'info')
      return
    }
    pendingStepLabel.value = 'menggunakan fitur gratis'
    showAuthModal.value = true
  } else {
    if (!isLoggedIn.value) {
      pendingStepLabel.value = 'melakukan pembayaran'
      showAuthModal.value = true
    } else {
      isNavigating.value = true
      navTargetSlug.value = slug
      const pricing = plan ? getPlanPricing(plan) : { months: 1, totalPrice: 0 }
      // Arahkan ke halaman checkout dengan query params
      try {
        await router.push({
          name: 'checkout',
          query: {
            id: plan ? plan.id : undefined,
            plan: plan ? plan.name : slug,
            price: plan ? pricing.totalPrice : 0,
            slug: plan ? plan.slug : slug,
            months: pricing.months,
            renew: isRenewal ? '1' : undefined
          }
        })
      } finally {
        isNavigating.value = false
        navTargetSlug.value = null
      }
    }
  }
}
</script>

<style scoped src="../assets/css/views/PricingView.css"></style>

<style scoped>
.pending-banner {
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  animation: slideDown 0.4s ease-out;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.pending-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.pending-info i {
  font-size: 1.8rem;
  color: #f59e0b;
}
.pending-info strong {
  display: block;
  color: #e2e8f0;
  font-size: 1.05rem;
  margin-bottom: 4px;
}
.pending-info p {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
}
.pending-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.btn-cancel-pending {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel-pending:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}
.btn-resume {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.btn-resume:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

@media (max-width: 640px) {
  .pending-banner {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  .pending-info {
    flex-direction: column;
    gap: 10px;
  }
  .pending-actions {
    width: 100%;
    justify-content: center;
  }
  .pending-actions button {
    flex: 1;
  }
}

/* Multi-Month Marketing Sale & Renewal UI */
.price-multi-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.price-discount-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.price-strike {
  font-size: 0.85rem;
  color: #64748b;
  text-decoration: line-through;
}

.discount-pill {
  font-size: 0.72rem;
  font-weight: 700;
  color: #10b981;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
}

.total-billing-note {
  margin: 0;
  font-size: 0.82rem;
  color: #cbd5e1;
}

.total-billing-note strong {
  color: #f8fafc;
}

.savings-text {
  color: #34d399;
  font-weight: 600;
  margin-left: 4px;
}

.duration-selector-box {
  margin: 14px 0 16px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.duration-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.duration-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #e2e8f0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.duration-title i {
  color: #f59e0b;
}

.tier-highlight-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.14);
  border: 1px solid rgba(56, 189, 248, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
}

.duration-pills-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.duration-pill {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 10px 8px;
  border-radius: 10px;
  background: rgba(30, 41, 59, 0.7);
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
  font-size: 0.72rem;
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
}

.stepper-label {
  font-size: 0.76rem;
  color: #94a3b8;
}

.stepper-controls {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.stepper-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid rgba(56, 189, 248, 0.35);
  background: rgba(30, 41, 59, 0.85);
  color: #e2e8f0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
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
  min-width: 68px;
  text-align: center;
  font-size: 0.82rem;
  font-weight: 700;
  color: #f8fafc;
}

.tier-marketing-note {
  margin: 8px 0 0;
  font-size: 0.76rem;
  color: #bae6fd;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tier-marketing-note i {
  color: #38bdf8;
}

.plan-action {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-renew-plan {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

@media (max-width: 640px) {
  .duration-header-row,
  .custom-stepper-row {
    flex-wrap: wrap;
  }
  .duration-pills-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
