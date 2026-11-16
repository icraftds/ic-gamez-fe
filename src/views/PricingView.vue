<template>
  <div class="pricing-view" :class="{ 'is-embedded': isEmbedded }">
    <SimpleBackground v-if="!isEmbedded" />

    <div class="pricing-content">
      <!-- Medium Hero Section -->
      <section class="pricing-hero">
        <div class="hero-glow" aria-hidden="true"></div>
        <div class="hero-badge-pill">
          <i class="fa-solid fa-bolt"></i>
          <span>INVESTASI SKILL GAME &amp; ENGINEERING</span>
        </div>
        <h1 class="gradient-text">Pilih Paket Langganan</h1>
        <p class="subtitle">
          Tingkatkan pengalaman belajarmu dengan akses penuh ke seluruh alur belajar interaktif, tantangan arena, dan mentoring eksklusif.
        </p>

        <div class="hero-highlights">
          <span class="hero-chip"><i class="fa-solid fa-layer-group"></i> Kurikulum Terstruktur</span>
          <span class="hero-chip"><i class="fa-solid fa-coins"></i> Bonus iCoinZ Instan</span>
          <span class="hero-chip"><i class="fa-solid fa-certificate"></i> Sertifikat &amp; Arena</span>
        </div>

        <div class="hero-actions" v-if="lifetimePlan || carouselPlans.length > 0">
          <button v-if="lifetimePlan" type="button" class="btn-hero-primary" @click="scrollToSection('lifetime-offer-anchor')">
            <i class="fa-solid fa-infinity"></i>
            <span>Lihat Penawaran Lifetime</span>
          </button>
          <button type="button" class="btn-hero-secondary" @click="scrollToSection('plans-carousel-anchor')">
            <i class="fa-solid fa-layer-group"></i>
            <span>Bandingkan Semua Paket</span>
          </button>
        </div>
      </section>

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
      <TerminalLoader v-if="isLoadingPlans && plans.length === 0" label="paket langganan" />

      <template v-else>
        <!-- Featured Lifetime Offer Banner -->
        <section
          v-if="lifetimePlan"
          id="lifetime-offer-anchor"
          class="lifetime-offer-card"
        >
          <div class="lifetime-offer-orb" aria-hidden="true"></div>

          <div class="lifetime-offer-main">
            <div class="lifetime-eyebrow-row">
              <span class="lifetime-pill-badge">
                <i class="fa-solid fa-infinity"></i>
                PENAWARAN LIFETIME · {{ getPlanBadge(lifetimePlan) || 'AKSES SELAMANYA' }}
              </span>
              <span v-if="lifetimeSavingsPercent > 0" class="lifetime-save-pill">
                Hemat {{ lifetimeSavingsPercent }}%
              </span>
            </div>

            <h2 class="lifetime-offer-title">{{ lifetimePlan.name }}</h2>
            <p class="lifetime-offer-desc">
              {{ lifetimePlan.description || 'Sekali bayar untuk selamanya. Buka seluruh modul belajar, Cheatsheet Pro, energi mingguan, serta update materi baru tanpa biaya langganan lagi.' }}
            </p>

            <div class="lifetime-perks-grid">
              <div
                v-for="(item, idx) in lifetimePreviewBenefits"
                :key="'lo-' + idx"
                class="lifetime-perk-chip"
              >
                <i class="fa-solid fa-circle-check"></i>
                <span>{{ item.text }}</span>
              </div>
            </div>
          </div>

          <div class="lifetime-offer-pricing">
            <div class="lifetime-price-box">
              <span class="lifetime-price-kicker">Sekali Bayar · Tidak Kedaluwarsa</span>
              <span v-if="Number(lifetimePlan.compare_price) > Number(lifetimePlan.price)" class="lifetime-compare-price">
                Rp {{ formatPrice(lifetimePlan.compare_price) }}
              </span>
              <div class="lifetime-current-price">
                Rp {{ formatPrice(lifetimePlan.price) }}
                <span class="lifetime-duration-unit">/ Selamanya</span>
              </div>
            </div>

            <div v-if="isPlanOwned(lifetimePlan.slug)" class="lifetime-owned-status">
              <i class="fa-solid fa-shield-check"></i>
              <span>Akses Lifetime Aktif</span>
            </div>
            <button
              v-else
              type="button"
              class="btn-lifetime-cta"
              :disabled="isNavigating"
              @click="handlePlanClick(lifetimePlan.slug, lifetimePlan)"
            >
              <TerminalLoader v-if="isNavigating && navTargetSlug === lifetimePlan.slug" variant="inline" label="lifetime" />
              <template v-else>
                <span>Klaim Akses Lifetime</span>
                <i class="fa-solid fa-arrow-right"></i>
              </template>
            </button>
          </div>
        </section>

        <!-- Responsive Plan Carousel -->
        <section id="plans-carousel-anchor" class="plans-carousel-section">
          <div class="carousel-toolbar">
            <div class="carousel-heading-group">
              <h2 class="carousel-title">Daftar Paket Langganan</h2>
              <p class="carousel-subtitle">Geser atau gunakan tombol navigasi untuk membandingkan detail setiap paket.</p>
            </div>

            <div class="carousel-nav-controls" v-if="maxIndex > 0">
              <span class="carousel-counter">{{ activeIndex + 1 }}–{{ Math.min(activeIndex + visibleCards, carouselPlans.length) }} dari {{ carouselPlans.length }}</span>
              <button
                type="button"
                class="carousel-arrow-btn"
                :disabled="activeIndex <= 0"
                @click="prevSlide"
                aria-label="Paket sebelumnya"
              >
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <button
                type="button"
                class="carousel-arrow-btn"
                :disabled="activeIndex >= maxIndex"
                @click="nextSlide"
                aria-label="Paket berikutnya"
              >
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div
            class="plans-carousel-viewport"
            @touchstart.passive="onTouchStart"
            @touchend.passive="onTouchEnd"
          >
            <div
              class="plans-carousel-track"
              :style="carouselTrackStyle"
            >
              <div
                v-for="item in carouselPlans"
                :key="item.key"
                class="plan-slide"
              >
                <div
                  class="plan-card"
                  :class="[
                    item.slugClass,
                    {
                      'is-lifetime-card': item.presentation.isLifetime,
                      'active': item.slug === 'free'
                        ? (currentPlan === 'free' || !currentPlan) && !isPremiumUser
                        : isPlanOwned(item.slug)
                    }
                  ]"
                >
                  <!-- Floating Badge -->
                  <div
                    v-if="item.presentation.badgeLabel"
                    :class="getBadgeClass(item)"
                  >
                    {{ item.presentation.badgeLabel }}
                  </div>

                  <div class="plan-header">
                    <div class="plan-icon" :class="item.slugClass + '-icon'">
                      <i :class="item.presentation.icon"></i>
                    </div>
                    <h3>{{ item.displayName }}</h3>

                    <div v-if="item.comparePrice > item.price" class="plan-compare-price">
                      Rp {{ formatPrice(item.comparePrice) }}
                    </div>

                    <p class="price">
                      Rp {{ formatPrice(item.price) }}<span>{{ getPricePeriodSuffix(item) }}</span>
                    </p>
                  </div>

                  <!-- Energy Badge -->
                  <div
                    v-if="item.presentation.energyLabel"
                    class="plan-energy-badge"
                    :class="'energy-' + item.slugClass"
                  >
                    <i :class="item.presentation.energyIcon"></i>
                    {{ item.presentation.energyLabel }}
                  </div>

                  <ul class="plan-benefits">
                    <li
                      v-for="(benefit, index) in item.presentation.orderedBenefits"
                      :key="`${item.key}-b-${index}`"
                      :class="{ disabled: !benefit.included }"
                    >
                      <i :class="benefit.included ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"></i>
                      <span>{{ benefit.text }}</span>
                    </li>
                  </ul>

                  <div class="plan-action">
                    <template v-if="item.slug === 'free'">
                      <div v-if="(currentPlan === 'free' || !currentPlan) && !isPremiumUser" class="active-badge">
                        <i class="fa-solid fa-check-circle"></i> Paket Saat Ini
                      </div>
                      <button v-else class="btn-disabled" @click="handlePlanClick('free')">Klaim Gratis</button>
                    </template>

                    <template v-else-if="isPlanOwned(item.slug)">
                      <div class="active-badge">
                        <i class="fa-solid fa-check-circle"></i>
                        <span>
                          Paket Aktif
                          <template v-if="item.presentation.isLifetime || subscriptionInfo?.is_lifetime">
                            (Selamanya)
                          </template>
                          <template v-else-if="subscriptionInfo?.days_remaining > 0">
                            (Sisa {{ subscriptionInfo.days_remaining }} hari)
                          </template>
                        </span>
                      </div>
                      <button
                        v-if="!item.presentation.isLifetime && !subscriptionInfo?.is_lifetime"
                        class="btn-upgrade btn-renew-plan"
                        :class="item.slugClass + '-btn'"
                        @click="handlePlanClick(item.slug, item.rawPlan, true)"
                        :disabled="isNavigating"
                      >
                        <TerminalLoader v-if="isNavigating && navTargetSlug === item.slug" variant="inline" label="perpanjang" />
                        <span v-else><i class="fa-solid fa-rotate-right"></i> Perpanjang Paket</span>
                      </button>
                    </template>

                    <button
                      v-else
                      class="btn-upgrade"
                      :class="item.slugClass + '-btn'"
                      @click="handlePlanClick(item.slug, item.rawPlan)"
                      :disabled="isNavigating"
                    >
                      <TerminalLoader v-if="isNavigating && navTargetSlug === item.slug" variant="inline" label="paket" />
                      <span v-else>{{ item.presentation.isLifetime ? 'Dapatkan Lifetime' : `Pilih ${item.displayName}` }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination Dots -->
          <div v-if="maxIndex > 0" class="carousel-dots" role="tablist" aria-label="Navigasi halaman paket">
            <button
              v-for="dotIdx in maxIndex + 1"
              :key="'dot-' + dotIdx"
              type="button"
              class="carousel-dot"
              :class="{ active: activeIndex === dotIdx - 1 }"
              @click="goToSlide(dotIdx - 1)"
              :aria-label="`Halaman paket ${dotIdx}`"
            ></button>
          </div>
        </section>
      </template>
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import AuthRequiredModal from '../components/common/AuthRequiredModal.vue'
import { useUserAccount } from '../composables/useUserAccount'
import { usePlans, resolvePlanPresentation } from '../composables/usePlans'
import { useToast } from '../composables/useToast'

const props = defineProps({
  isEmbedded: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const { isLoggedIn, isPremiumUser, currentPlan, subscriptionInfo } = useUserAccount()
const { plans, isLoadingPlans, fetchPlans, findPlanBySlug } = usePlans()
const { showToast } = useToast()

const freePlan = computed(() => findPlanBySlug('free'))
const freePlanDisplay = computed(() => resolvePlanPresentation(freePlan.value || 'free'))
const paidPlans = computed(() => plans.value.filter((p) => String(p?.slug || '').toLowerCase() !== 'free'))

const lifetimePlan = computed(() =>
  plans.value.find((p) => Boolean(p?.is_lifetime) || String(p?.slug || '').toLowerCase() === 'lifetime') || null
)

const lifetimeSavingsPercent = computed(() => {
  const lp = lifetimePlan.value
  if (!lp) return 0
  const compare = Number(lp.compare_price || 0)
  const price = Number(lp.price || 0)
  if (!compare || compare <= price) return 0
  return Math.round(((compare - price) / compare) * 100)
})

const lifetimePreviewBenefits = computed(() => {
  if (!lifetimePlan.value) return []
  return resolvePlanPresentation(lifetimePlan.value).orderedBenefits
    .filter((b) => b.included)
    .slice(0, 4)
})

const carouselPlans = computed(() => {
  const list = []
  const freeRaw = freePlan.value
  list.push({
    key: `plan-free-${freeRaw?.id || 'default'}`,
    slug: 'free',
    slugClass: 'free',
    displayName: freeRaw?.name || 'Free Plan',
    price: Number(freeRaw?.price ?? 0),
    comparePrice: Number(freeRaw?.compare_price || 0),
    durationInDays: Number(freeRaw?.duration_in_days ?? 30),
    rawPlan: freeRaw,
    presentation: freePlanDisplay.value,
  })

  for (const plan of paidPlans.value) {
    const slug = String(plan?.slug || 'pro').toLowerCase()
    const presentation = resolvePlanPresentation(plan)
    list.push({
      key: `plan-${plan.id}-${slug}`,
      slug,
      slugClass: presentation.isLifetime ? 'lifetime' : (['pro', 'expert'].includes(slug) ? slug : 'custom'),
      displayName: plan.name,
      price: Number(plan.price ?? 0),
      comparePrice: Number(plan.compare_price || 0),
      durationInDays: Number(plan.duration_in_days ?? 30),
      rawPlan: plan,
      presentation,
    })
  }

  return list
})

// Responsive carousel state
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)
const activeIndex = ref(0)

const updateViewportWidth = () => {
  if (typeof window !== 'undefined') {
    viewportWidth.value = window.innerWidth
  }
}

const visibleCards = computed(() => {
  const w = viewportWidth.value
  if (props.isEmbedded) {
    if (w >= 1200) return 3
    if (w >= 768) return 2
    return 1
  }
  if (w >= 1024) return 3
  if (w >= 640) return 2
  return 1
})

const maxIndex = computed(() => Math.max(0, carouselPlans.value.length - visibleCards.value))

watch(maxIndex, (max) => {
  if (activeIndex.value > max) {
    activeIndex.value = max
  }
})

const carouselTrackStyle = computed(() => ({
  '--visible-cards': visibleCards.value,
  '--active-index': activeIndex.value,
  '--carousel-gap': viewportWidth.value < 640 ? '14px' : '22px',
}))

const prevSlide = () => {
  activeIndex.value = Math.max(0, activeIndex.value - 1)
}

const nextSlide = () => {
  activeIndex.value = Math.min(maxIndex.value, activeIndex.value + 1)
}

const goToSlide = (idx) => {
  activeIndex.value = Math.min(maxIndex.value, Math.max(0, idx))
}

let touchStartX = 0
const onTouchStart = (e) => {
  touchStartX = e.changedTouches?.[0]?.clientX || 0
}
const onTouchEnd = (e) => {
  const dx = (e.changedTouches?.[0]?.clientX || 0) - touchStartX
  if (Math.abs(dx) > 45) {
    if (dx < 0) nextSlide()
    else prevSlide()
  }
}

const scrollToSection = (id) => {
  const el = typeof document !== 'undefined' ? document.getElementById(id) : null
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const isPlanOwned = (slug) => {
  return currentPlan.value === slug || (isPremiumUser.value && (currentPlan.value === 'free' || !currentPlan.value) && slug === 'pro')
}

const getBadgeClass = (item) => {
  if (item.presentation.isLifetime) return 'badge-lifetime'
  if (item.slug === 'expert') return 'badge-premium'
  return 'badge-popular'
}

const getPricePeriodSuffix = (item) => {
  if (item.presentation.isLifetime) return ' / Selamanya'
  if (item.slug === 'free') return item.durationInDays ? `/${item.durationInDays} hari` : '/bulan'
  return `/${item.durationInDays || 30} hari`
}

const getPlanBadge = (plan) => resolvePlanPresentation(plan).badgeLabel

const showAuthModal = ref(false)
const pendingStepLabel = ref('')
const pendingCheckout = ref(null)
const isNavigating = ref(false)
const navTargetSlug = ref(null)

onMounted(async () => {
  updateViewportWidth()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateViewportWidth)
  }

  const saved = localStorage.getItem('ic_pending_checkout')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data.expiryTime > Date.now()) {
        pendingCheckout.value = data
      } else {
        localStorage.removeItem('ic_pending_checkout')
      }
    } catch (e) {}
  }

  try {
    await fetchPlans()
  } catch (error) {
    console.error('Failed to fetch plans', error)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateViewportWidth)
  }
})

const resumeCheckout = () => {
  router.push({ name: 'checkout', query: { resume: 'true' } })
}

const cancelPendingCheckout = () => {
  localStorage.removeItem('ic_pending_checkout')
  pendingCheckout.value = null
}

const formatPrice = (price) => {
  return Number(price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const handlePlanClick = async (slug, plan = null, isRenewal = false) => {
  if (isNavigating.value) return

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
      try {
        await router.push({
          name: 'checkout',
          query: {
            id: plan ? plan.id : undefined,
            plan: plan ? plan.name : slug,
            price: plan ? plan.price : 0,
            slug: plan ? plan.slug : slug,
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
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
}
.pending-info {
  display: flex;
  align-items: center;
  gap: 14px;
}
.pending-info i {
  font-size: 1.65rem;
  color: #f59e0b;
}
.pending-info strong {
  display: block;
  color: #e2e8f0;
  font-size: 1rem;
  margin-bottom: 3px;
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
  padding: 9px 15px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
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
  padding: 9px 17px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-resume:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

@media (max-width: 640px) {
  .pending-banner {
    flex-direction: column;
    text-align: center;
  }
  .pending-info {
    flex-direction: column;
    gap: 8px;
  }
  .pending-actions {
    width: 100%;
  }
  .pending-actions button {
    flex: 1;
  }
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
</style>
