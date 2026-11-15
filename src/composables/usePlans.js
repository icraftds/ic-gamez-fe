import { ref } from 'vue'
import api from '../services/api'

const PLANS_CACHE_KEY = 'ic_plans_cache_v1'
const PLANS_CACHE_TTL_MS = 5 * 60 * 1000

const DEFAULT_PLAN_FALLBACKS = {
  free: {
    icon: 'fa-solid fa-paper-plane',
    badge: '',
    energyLabel: '',
    energyIcon: 'fa-solid fa-bolt',
    benefits: [
      { text: 'Akses modul dasar', included: true },
      { text: '10 Energy / hari', included: true },
      { text: 'Akses konten premium', included: false },
      { text: 'Sertifikat kelulusan', included: false },
      { text: '1-on-1 Mentoring', included: false },
    ],
  },
  pro: {
    icon: 'fa-solid fa-rocket',
    badge: 'Paling Populer',
    energyLabel: '20 Energi/minggu',
    energyIcon: 'fa-solid fa-infinity',
    benefits: [
      { text: 'Akses bebas pilih 12 modul alur belajar / bulan (Tidak dapat dibatalkan)', included: true },
      { text: 'Akses Global Challenge & Event Arena', included: true },
      { text: 'Sertifikat kelulusan digital', included: true },
      { text: 'Hint premium tak terbatas', included: true },
      { text: 'Leaderboard eksklusif', included: true },
      { text: 'Full Access seluruh modul tanpa batas', included: false },
      { text: 'Kesempatan Magang di ICraft DS', included: false },
      { text: '1-on-1 Mentoring bulanan', included: false },
    ],
  },
  expert: {
    icon: 'fa-solid fa-crown',
    badge: 'Premium',
    checkoutBadge: 'Paket Tertinggi',
    energyLabel: '25 Energi / minggu',
    energyIcon: 'fa-solid fa-bolt',
    benefits: [
      { text: 'Full Access semua modul alur belajar', included: true },
      { text: 'Akses 24 Cheatsheets & 300+ Soal Tes Kerja', included: true },
      { text: 'Semua fitur Pro Plan', included: true },
      { text: '25 Energi bonus setiap minggu', included: true },
      { text: 'Kesempatan Magang di ICraft DS', included: true },
      { text: '1-on-1 Mentoring bulanan', included: true },
      { text: 'Portofolio review eksklusif', included: true },
    ],
  },
}

const formatCoinz = (val) => Number(val || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

/**
 * Resolve dynamic plan badge, energy label, duration text, and benefits list
 * with safe fallbacks when backend fields are empty or still loading.
 */
export function resolvePlanPresentation(planOrSlug, selectedMonths = 1) {
  const plan = typeof planOrSlug === 'object' && planOrSlug !== null ? planOrSlug : null
  const slug = String(plan?.slug || (typeof planOrSlug === 'string' ? planOrSlug : 'pro')).toLowerCase()
  const fallback = DEFAULT_PLAN_FALLBACKS[slug] || {
    icon: 'fa-solid fa-star',
    badge: '',
    energyLabel: '',
    energyIcon: 'fa-solid fa-bolt',
    benefits: [{ text: 'Akses fitur premium', included: true }],
  }

  const rawDynamic = Array.isArray(plan?.benefits) ? plan.benefits : []
  let orderedBenefits = rawDynamic
    .map((item) => {
      if (typeof item === 'string') {
        return { text: item.trim(), included: true }
      }
      if (item && typeof item === 'object') {
        return { text: String(item.text || '').trim(), included: item.included !== false }
      }
      return null
    })
    .filter((item) => item && item.text !== '')

  if (orderedBenefits.length === 0) {
    orderedBenefits = fallback.benefits.map((b) => ({ ...b }))
    if (slug === 'pro' && plan?.max_selectable_modules) {
      orderedBenefits[0] = {
        text: `Akses bebas pilih ${plan.max_selectable_modules} modul alur belajar / bulan (Tidak dapat dibatalkan)`,
        included: true,
      }
    }
    const reward = Number(plan?.icoinz_reward || 0)
    if (reward > 0) {
      orderedBenefits.splice(1, 0, {
        text: `Bonus ${formatCoinz(reward)} iCoinZ bergabung`,
        included: true,
      })
    }
  }

  const months = Math.max(1, Number(selectedMonths) || 1)
  const daysPerPeriod = Number(plan?.duration_in_days) || (slug === 'expert' ? 180 : 30)
  const totalDays = daysPerPeriod * months
  const durationLabel = `${totalDays} Hari`

  const features = orderedBenefits.filter((b) => b.included).map((b) => b.text)
  const disabledFeatures = orderedBenefits.filter((b) => !b.included).map((b) => b.text)

  const badgeLabel = typeof plan?.badge_label === 'string' && plan.badge_label.trim() !== ''
    ? plan.badge_label.trim()
    : fallback.badge

  const checkoutBadge = typeof plan?.badge_label === 'string' && plan.badge_label.trim() !== ''
    ? plan.badge_label.trim()
    : (fallback.checkoutBadge || fallback.badge)

  const energyLabel = typeof plan?.energy_label === 'string' && plan.energy_label.trim() !== ''
    ? plan.energy_label.trim()
    : fallback.energyLabel

  return {
    slug,
    icon: fallback.icon,
    energyIcon: fallback.energyIcon,
    badgeLabel,
    checkoutBadge,
    energyLabel,
    durationLabel,
    orderedBenefits,
    features,
    disabledFeatures,
  }
}

const readCachedPlans = () => {
  if (typeof sessionStorage === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(PLANS_CACHE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.data)) return []
    if (typeof parsed.cachedAt === 'number' && Date.now() - parsed.cachedAt > PLANS_CACHE_TTL_MS) {
      return []
    }
    return parsed.data
  } catch {
    return []
  }
}

const writeCachedPlans = (list) => {
  if (typeof sessionStorage === 'undefined' || !Array.isArray(list)) return
  try {
    sessionStorage.setItem(PLANS_CACHE_KEY, JSON.stringify({
      cachedAt: Date.now(),
      data: list,
    }))
  } catch {
    // Ignore storage quota or restricted-mode errors
  }
}

const initialPlans = readCachedPlans()
const plans = ref(initialPlans)
const isLoadingPlans = ref(false)
const plansLoaded = ref(initialPlans.length > 0)
let inFlightRequest = null

/**
 * Shared subscription plans state with synchronous sessionStorage hydration
 * so Pricing and Checkout render duration tiers and benefits immediately.
 */
export function usePlans() {
  const fetchPlans = async (force = false) => {
    if (inFlightRequest && !force) {
      return inFlightRequest
    }

    isLoadingPlans.value = plans.value.length === 0

    const request = api.get('/plans')
      .then((response) => {
        const list = response.data?.data || response.data || []
        const normalized = Array.isArray(list) ? list : []
        plans.value = normalized
        writeCachedPlans(normalized)
        return normalized
      })
      .finally(() => {
        if (inFlightRequest === request) {
          inFlightRequest = null
        }
        plansLoaded.value = true
        isLoadingPlans.value = false
      })

    inFlightRequest = request
    return request
  }

  const findPlanBySlug = (slug) => {
    if (!slug) return null
    const target = String(slug).toLowerCase()
    return plans.value.find((p) => String(p?.slug || '').toLowerCase() === target) || null
  }

  return {
    plans,
    isLoadingPlans,
    plansLoaded,
    fetchPlans,
    findPlanBySlug,
  }
}
