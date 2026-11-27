import { ref } from 'vue'
import api from '../services/api'
import { resolvePlanPresentation } from '../utils/planPresentation.js'
import { prerenderData } from '../services/prerenderData'

export { resolvePlanPresentation }

const PLANS_CACHE_KEY = 'ic_plans_cache_v1'
const PLANS_CACHE_TTL_MS = 5 * 60 * 1000

const readCachedPlans = () => {
  if (typeof sessionStorage !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(PLANS_CACHE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && Array.isArray(parsed.data)) {
          if (typeof parsed.cachedAt !== 'number' || Date.now() - parsed.cachedAt <= PLANS_CACHE_TTL_MS) {
            if (parsed.data.length > 0) return parsed.data
          }
        }
      }
    } catch {
      // Fall through to prerender seed
    }
  }
  const seededPlans = typeof prerenderData !== 'undefined' ? prerenderData?.plans : null
  if (Array.isArray(seededPlans) && seededPlans.length > 0) {
    return seededPlans
  }
  return []
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

/** Build-time prerendering only: fill the shared state with public plan data. */
export function seedPlansForPrerender(planList) {
  plans.value = Array.isArray(planList) ? planList : []
  plansLoaded.value = plans.value.length > 0
}

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
