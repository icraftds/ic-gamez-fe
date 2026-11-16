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
      { text: '20 Energi bonus setiap minggu', included: true },
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
  lifetime: {
    icon: 'fa-solid fa-infinity',
    badge: 'Best Value · Selamanya',
    checkoutBadge: 'Akses Seumur Hidup',
    energyLabel: '25 Energi / minggu',
    energyIcon: 'fa-solid fa-bolt',
    benefits: [
      { text: 'Akses seumur hidup semua modul alur belajar', included: true },
      { text: 'Sekali bayar, tidak pernah kedaluwarsa', included: true },
      { text: 'Akses 24 Cheatsheets & 300+ Soal Tes Kerja', included: true },
      { text: 'Seluruh modul baru & update masa depan gratis', included: true },
      { text: '25 Energi bonus setiap minggu selamanya', included: true },
      { text: 'Kesempatan Magang di ICraft DS', included: true },
      { text: 'Portofolio review & jalur prioritas mentoring', included: true },
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

  const isLifetime = Boolean(plan?.is_lifetime)
    || slug === 'lifetime'
    || (plan?.duration_in_days !== undefined && plan?.duration_in_days !== null && Number(plan.duration_in_days) === 0 && slug !== 'free')

  const months = isLifetime ? 1 : Math.max(1, Number(selectedMonths) || 1)
  const daysPerPeriod = isLifetime ? 0 : (Number(plan?.duration_in_days) || (slug === 'expert' ? 180 : 30))
  const totalDays = isLifetime ? 0 : daysPerPeriod * months
  const durationLabel = isLifetime ? 'Selamanya (Lifetime)' : `${totalDays} Hari`

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
    isLifetime,
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
