<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAdBanners } from '../../composables/useAdBanners'

const props = defineProps({
  placement: {
    type: String,
    default: 'all' // 'all' | 'landing' | 'dashboard' | 'learning'
  },
  customAds: {
    type: Array,
    default: null
  },
  apiEndpoint: {
    type: String,
    default: ''
  },
  autoRotateInterval: {
    type: Number,
    default: 7000
  }
})

const {
  isMinimized,
  fetchBanners,
  getBannersForPlacement,
  minimizeBanner: minimizeGlobal,
  restoreBanner: restoreGlobal
} = useAdBanners()

const placementBanners = getBannersForPlacement(props.placement)
const ads = computed(() => (props.customAds && props.customAds.length ? props.customAds : placementBanners.value))

const currentIndex = ref(0)
const isHovered = ref(false)
let timer = null

const currentAd = computed(() => {
  if (!ads.value.length) return null
  const safeIdx = currentIndex.value % ads.value.length
  return ads.value[safeIdx] || ads.value[0]
})

const nextAd = () => {
  if (ads.value.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % ads.value.length
}

const goToAd = (idx) => {
  currentIndex.value = idx
}

const startRotation = () => {
  stopRotation()
  if (props.autoRotateInterval > 0 && ads.value.length > 1 && !isMinimized.value) {
    timer = setInterval(() => {
      if (!isHovered.value) nextAd()
    }, props.autoRotateInterval)
  }
}

const stopRotation = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const minimizeBanner = () => {
  minimizeGlobal()
  stopRotation()
}

const restoreBanner = () => {
  restoreGlobal()
  startRotation()
}

watch(isMinimized, (minimized) => {
  if (minimized) stopRotation()
  else startRotation()
})

const handleVisibilityChange = () => {
  if (document.hidden) {
    stopRotation()
  } else if (!isMinimized.value) {
    startRotation()
  }
}

onMounted(() => {
  if (props.apiEndpoint) {
    fetchBanners(props.apiEndpoint)
  } else if (import.meta.env.VITE_BANNERS_ENDPOINT) {
    fetchBanners(import.meta.env.VITE_BANNERS_ENDPOINT)
  }
  if (!isMinimized.value) {
    startRotation()
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  stopRotation()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div v-if="currentAd" class="gz-ad-wrapper">
    <!-- State 1: Minimized Bar (1-click restore without refresh) -->
    <div v-if="isMinimized" class="gz-ad-minimized">
      <div class="gz-ad-min-info">
        <i class="fa-solid fa-bullhorn"></i>
        <span>Info Ekosistem iCraft & Sponsor disembunyikan</span>
      </div>
      <button class="gz-ad-restore-btn" @click="restoreBanner" type="button">
        <i class="fa-solid fa-eye"></i>
        <span>Tampilkan kembali</span>
      </button>
    </div>

    <!-- State 2: Active Banner (Consistent Fixed Height & Game-Z Native UI) -->
    <section
      v-else
      class="gz-ad-banner"
      :style="{ '--ad-accent': currentAd.accent }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      aria-label="Promosi Ekosistem iCraft dan Sponsor"
    >
      <div class="gz-ad-glow"></div>

      <div class="gz-ad-inner">
        <!-- Left Icon Box -->
        <div class="gz-ad-icon-box">
          <img
            v-if="currentAd.imageUrl"
            :src="currentAd.imageUrl"
            :alt="currentAd.title"
            class="gz-ad-img"
          />
          <i v-else :class="currentAd.icon"></i>
        </div>

        <!-- Middle Fixed-Height Text Block -->
        <div class="gz-ad-content">
          <div class="gz-ad-meta">
            <span class="gz-ad-badge">{{ currentAd.typeLabel }}</span>
            <div v-if="ads.length > 1" class="gz-ad-dots" role="tablist">
              <button
                v-for="(ad, idx) in ads"
                :key="ad.id"
                class="gz-ad-dot"
                :class="{ active: currentIndex === idx }"
                @click="goToAd(idx)"
                :aria-label="`Slide ${idx + 1}: ${ad.title}`"
                type="button"
              ></button>
            </div>
          </div>
          <h3 class="gz-ad-title">{{ currentAd.title }}</h3>
          <p class="gz-ad-desc">{{ currentAd.desc }}</p>
        </div>

        <!-- Right CTA & Hide Controls -->
        <div class="gz-ad-actions">
          <a
            :href="currentAd.link"
            target="_blank"
            rel="noopener noreferrer"
            class="gz-ad-cta"
          >
            <span>{{ currentAd.ctaText }}</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
          <button
            class="gz-ad-close"
            @click="minimizeBanner"
            title="Sembunyikan banner"
            aria-label="Sembunyikan banner"
            type="button"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.gz-ad-wrapper {
  width: 100%;
  margin: 1.25rem 0 1.5rem 0;
  font-family: 'Poppins', sans-serif;
}

/* 1. Minimized Restore Bar */
.gz-ad-minimized {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  font-size: 0.78rem;
}

:global(body.light-mode) .gz-ad-minimized {
  background: rgba(241, 245, 249, 0.85);
  border-color: rgba(15, 23, 42, 0.12);
  color: #64748b;
}

.gz-ad-min-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.gz-ad-min-info span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gz-ad-restore-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid rgba(56, 189, 248, 0.3);
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s ease, transform 0.15s ease;
}

.gz-ad-restore-btn:hover {
  background: rgba(56, 189, 248, 0.2);
}

:global(body.light-mode) .gz-ad-restore-btn {
  color: #0284c7;
  border-color: rgba(2, 132, 199, 0.3);
  background: rgba(2, 132, 199, 0.08);
}

/* 2. Active Banner (Fixed Consistent Height) */
.gz-ad-banner {
  position: relative;
  width: 100%;
  height: 106px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  contain: layout style;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.gz-ad-banner:hover {
  border-color: color-mix(in srgb, var(--ad-accent, #38bdf8) 45%, transparent);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

:global(body.light-mode) .gz-ad-banner {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 6px 22px rgba(15, 23, 42, 0.05);
}

.gz-ad-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    circle at 92% 50%,
    color-mix(in srgb, var(--ad-accent, #38bdf8) 18%, transparent),
    transparent 48%
  );
  transition: background 0.4s ease;
}

.gz-ad-inner {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  box-sizing: border-box;
}

/* Left Icon Box */
.gz-ad-icon-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  color: var(--ad-accent, #38bdf8);
  background: color-mix(in srgb, var(--ad-accent, #38bdf8) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--ad-accent, #38bdf8) 30%, transparent);
  overflow: hidden;
  transition: color 0.3s ease, background 0.3s ease, border-color 0.3s ease;
}

.gz-ad-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Middle Text Content (Strictly Clamped for 100% Consistent Size) */
.gz-ad-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.gz-ad-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.gz-ad-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ad-accent, #38bdf8);
  background: color-mix(in srgb, var(--ad-accent, #38bdf8) 12%, transparent);
}

.gz-ad-dots {
  display: flex;
  align-items: center;
  gap: 5px;
}

.gz-ad-dot {
  width: 12px;
  height: 4px;
  border-radius: 9999px;
  border: none;
  padding: 0;
  background: rgba(255, 255, 255, 0.16);
  cursor: pointer;
  transition: width 0.25s ease, background 0.25s ease;
}

:global(body.light-mode) .gz-ad-dot {
  background: rgba(15, 23, 42, 0.14);
}

.gz-ad-dot.active {
  width: 22px;
  background: var(--ad-accent, #38bdf8);
}

.gz-ad-title {
  margin: 0 0 2px 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
  color: #f8fafc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:global(body.light-mode) .gz-ad-title {
  color: #0f172a;
}

.gz-ad-desc {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.4;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:global(body.light-mode) .gz-ad-desc {
  color: #475569;
}

/* Right Actions */
.gz-ad-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.gz-ad-cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 10px;
  background: var(--ad-accent, #38bdf8);
  color: #060913;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.gz-ad-cta:hover {
  transform: translateY(-1px);
  filter: brightness(1.08);
}

.gz-ad-cta i {
  font-size: 0.72rem;
}

.gz-ad-close {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.2s ease, color 0.2s ease;
}

.gz-ad-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #f8fafc;
}

:global(body.light-mode) .gz-ad-close {
  border-color: rgba(15, 23, 42, 0.08);
  background: rgba(15, 23, 42, 0.04);
  color: #64748b;
}

:global(body.light-mode) .gz-ad-close:hover {
  background: rgba(15, 23, 42, 0.1);
  color: #0f172a;
}

/* Responsive Mobile (Consistent Fixed Height on Mobile Too) */
@media (max-width: 768px) {
  .gz-ad-banner {
    height: auto;
    min-height: 124px;
    padding: 14px 16px;
    box-sizing: border-box;
  }

  .gz-ad-inner {
    padding: 0;
    flex-wrap: wrap;
    gap: 12px;
  }

  .gz-ad-icon-box {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    font-size: 1.1rem;
  }

  .gz-ad-content {
    flex: 1 1 calc(100% - 96px);
  }

  .gz-ad-title {
    font-size: 0.92rem;
  }

  .gz-ad-desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    font-size: 0.78rem;
  }

  .gz-ad-actions {
    width: 100%;
    justify-content: space-between;
  }

  .gz-ad-cta {
    flex: 1;
    justify-content: center;
    padding: 8px 14px;
  }

  .gz-ad-close {
    position: absolute;
    top: 0;
    right: 0;
    width: 28px;
    height: 28px;
  }

  .gz-ad-minimized {
    font-size: 0.72rem;
    padding: 0 12px;
  }
}
</style>
