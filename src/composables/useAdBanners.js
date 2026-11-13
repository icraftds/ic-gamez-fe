import { ref, computed } from 'vue'
import api from '../services/api'

const STORAGE_KEY = 'gamez_banner_minimized'

const DEFAULT_BANNERS = [
  {
    id: 'icraft-ds',
    typeLabel: 'iCraft Ecosystem',
    title: 'iCraftDS — Design System & UI Kit Next-Gen',
    desc: 'Ubah prototipe desain menjadi komponen Vue & React siap produksi dalam hitungan detik.',
    ctaText: 'Jelajahi iCraftDS',
    link: 'https://icraft.id',
    accent: '#38bdf8',
    icon: 'fa-solid fa-layer-group',
    placements: ['all', 'landing', 'dashboard', 'learning'],
    priority: 1,
    isActive: true
  },
  {
    id: 'icraft-studio',
    typeLabel: 'iCraft Ecosystem',
    title: 'Bangun Sistem Digital & AI Bersama iCraft',
    desc: 'Solusi pengembangan web, aplikasi enterprise, dan integrasi AI custom untuk bisnis Anda.',
    ctaText: 'Pelajari Layanan',
    link: 'https://icraft.id',
    accent: '#a855f7',
    icon: 'fa-solid fa-rocket',
    placements: ['all', 'landing', 'dashboard', 'learning'],
    priority: 2,
    isActive: true
  },
  {
    id: 'partner-cloud',
    typeLabel: 'Partner Spotlight',
    title: 'Orbital Cloud AI — Kredit GPU Gratis $200',
    desc: 'Latih model Deep Learning & LLM lebih cepat di cluster GPU khusus member Game-Z.',
    ctaText: 'Klaim Kredit',
    link: 'https://developer.nvidia.com',
    accent: '#10b981',
    icon: 'fa-solid fa-microchip',
    placements: ['all', 'landing', 'dashboard', 'learning'],
    priority: 3,
    isActive: true
  },
  {
    id: 'partner-hackathon',
    typeLabel: 'Sponsored Event',
    title: 'Cyber-Zero Hackathon 2026 — Hadiah $50,000',
    desc: 'Ajang coding 48 jam se-Asia Tenggara dengan jalur rekrutmen ke perusahaan teknologi.',
    ctaText: 'Daftar Event',
    link: 'https://devpost.com',
    accent: '#f59e0b',
    icon: 'fa-solid fa-trophy',
    placements: ['all', 'landing', 'dashboard', 'learning'],
    priority: 4,
    isActive: true
  }
]

const banners = ref([...DEFAULT_BANNERS])
const isLoading = ref(false)
const hasFetched = ref(false)

function readInitialMinimized() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

const isMinimized = ref(readInitialMinimized())

function normalizeBanner(item, index) {
  return {
    id: item.id ?? `banner-${index}`,
    typeLabel: item.typeLabel || item.type_label || 'Sponsored',
    title: item.title || '',
    desc: item.desc || item.description || '',
    ctaText: item.ctaText || item.cta_text || 'Selengkapnya',
    link: item.link || item.url || '#',
    accent: item.accent || item.accent_color || '#38bdf8',
    icon: item.icon || 'fa-solid fa-bullhorn',
    imageUrl: item.imageUrl || item.image_url || null,
    placements: Array.isArray(item.placements) && item.placements.length ? item.placements : ['all'],
    priority: Number.isFinite(Number(item.priority)) ? Number(item.priority) : index + 1,
    isActive: item.isActive !== undefined ? Boolean(item.isActive) : (item.is_active !== undefined ? Boolean(item.is_active) : true),
    startsAt: item.startsAt || item.starts_at || null,
    endsAt: item.endsAt || item.ends_at || null
  }
}

function isWithinSchedule(banner, nowMs) {
  if (!banner.isActive) return false
  if (banner.startsAt && Date.parse(banner.startsAt) > nowMs) return false
  if (banner.endsAt && Date.parse(banner.endsAt) < nowMs) return false
  return true
}

export function useAdBanners() {
  const setBanners = (list) => {
    if (Array.isArray(list) && list.length > 0) {
      banners.value = list.map(normalizeBanner)
    }
  }

  const fetchBanners = async (endpoint = import.meta.env.VITE_BANNERS_ENDPOINT) => {
    if (!endpoint || hasFetched.value || isLoading.value) return
    isLoading.value = true
    try {
      const response = await api.get(endpoint)
      const payload = response?.data?.data ?? response?.data
      if (Array.isArray(payload) && payload.length > 0) {
        setBanners(payload)
      }
      hasFetched.value = true
    } catch {
      // Keep default ecosystem & partner banners on failure
    } finally {
      isLoading.value = false
    }
  }

  const getBannersForPlacement = (placement = 'all') => {
    return computed(() => {
      const nowMs = Date.now()
      return banners.value
        .filter((b) => isWithinSchedule(b, nowMs))
        .filter((b) => b.placements.includes('all') || b.placements.includes(placement))
        .sort((a, b) => a.priority - b.priority)
    })
  }

  const minimizeBanner = () => {
    isMinimized.value = true
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // Ignore storage errors
    }
  }

  const restoreBanner = () => {
    isMinimized.value = false
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage errors
    }
  }

  return {
    banners,
    isLoading,
    isMinimized,
    setBanners,
    fetchBanners,
    getBannersForPlacement,
    minimizeBanner,
    restoreBanner
  }
}
