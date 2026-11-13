<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  customAds: {
    type: Array,
    default: null
  },
  autoRotateInterval: {
    type: Number,
    default: 7000
  }
})

const defaultAds = [
  {
    id: 'icraft-ds',
    typeLabel: 'iCraft Ecosystem',
    title: 'iCraftDS — Design System & UI Kit Next-Gen',
    desc: 'Ubah prototipe desain menjadi komponen Vue & React siap produksi dalam hitungan detik.',
    ctaText: 'Jelajahi iCraftDS',
    link: 'https://icraft.id',
    accent: '#38bdf8',
    secondaryAccent: '#818cf8',
    meshGradient: 'radial-gradient(circle at 85% 25%, rgba(56, 189, 248, 0.28), transparent 55%), radial-gradient(circle at 15% 85%, rgba(129, 140, 248, 0.22), transparent 50%)',
    icon: 'fa-solid fa-layer-group',
    visualTag: 'ICRAFT // DS'
  },
  {
    id: 'icraft-studio',
    typeLabel: 'iCraft Ecosystem',
    title: 'Bangun Sistem Digital & AI Bersama iCraft',
    desc: 'Dari aplikasi web skala enterprise hingga integrasi AI custom untuk akselerasi bisnis Anda.',
    ctaText: 'Pelajari Layanan',
    link: 'https://icraft.id',
    accent: '#a855f7',
    secondaryAccent: '#ec4899',
    meshGradient: 'radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.28), transparent 55%), radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.2), transparent 50%)',
    icon: 'fa-solid fa-rocket',
    visualTag: 'ICRAFT // STUDIO'
  },
  {
    id: 'partner-cloud',
    typeLabel: 'Sponsored',
    title: 'Orbital Cloud AI — Kredit GPU Gratis $200',
    desc: 'Latih model Deep Learning & LLM lebih cepat di cluster NVIDIA H100 khusus member Game-Z.',
    ctaText: 'Klaim Kredit',
    link: 'https://developer.nvidia.com',
    accent: '#10b981',
    secondaryAccent: '#06b6d4',
    meshGradient: 'radial-gradient(circle at 85% 30%, rgba(16, 185, 129, 0.26), transparent 55%), radial-gradient(circle at 15% 80%, rgba(6, 182, 212, 0.2), transparent 50%)',
    icon: 'fa-solid fa-microchip',
    visualTag: 'GPU // CLOUD'
  },
  {
    id: 'partner-hackathon',
    typeLabel: 'Partner Event',
    title: 'Cyber-Zero Hackathon 2026 — Hadiah $50,000',
    desc: 'Ajang coding 48 jam se-Asia Tenggara dengan jalur rekrutmen langsung ke perusahaan teknologi.',
    ctaText: 'Daftar Event',
    link: 'https://devpost.com',
    accent: '#f59e0b',
    secondaryAccent: '#f97316',
    meshGradient: 'radial-gradient(circle at 85% 25%, rgba(245, 158, 11, 0.26), transparent 55%), radial-gradient(circle at 20% 85%, rgba(249, 115, 22, 0.2), transparent 50%)',
    icon: 'fa-solid fa-trophy',
    visualTag: 'ARENA // 2026'
  }
]

const ads = computed(() => (props.customAds && props.customAds.length ? props.customAds : defaultAds))
const currentIndex = ref(0)
const isHovered = ref(false)
const isDismissed = ref(false)
let timer = null

const currentAd = computed(() => ads.value[currentIndex.value] || ads.value[0])

const nextAd = () => {
  currentIndex.value = (currentIndex.value + 1) % ads.value.length
}

const goToAd = (idx) => {
  currentIndex.value = idx
}

const startRotation = () => {
  stopRotation()
  if (props.autoRotateInterval > 0 && ads.value.length > 1) {
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

const dismissBanner = () => {
  isDismissed.value = true
  try {
    sessionStorage.setItem('gamez_banner_dismissed', 'true')
  } catch {
    // ignore storage error
  }
}

onMounted(() => {
  try {
    if (sessionStorage.getItem('gamez_banner_dismissed') === 'true') {
      isDismissed.value = true
      return
    }
  } catch {
    // ignore
  }
  startRotation()
})

onUnmounted(() => {
  stopRotation()
})
</script>

<template>
  <section
    v-if="!isDismissed"
    class="eco-banner"
    :style="{
      '--ad-accent': currentAd.accent,
      '--ad-secondary': currentAd.secondaryAccent
    }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    aria-label="Promosi Ekosistem & Sponsor"
  >
    <!-- Atmospheric Nebula Mesh Backdrop -->
    <div class="eco-banner-bg" :style="{ backgroundImage: currentAd.meshGradient }"></div>
    <div class="eco-banner-stars"></div>

    <!-- Minimal Dismiss Button -->
    <button
      class="eco-dismiss-btn"
      @click="dismissBanner"
      title="Sembunyikan banner"
      aria-label="Sembunyikan banner"
      type="button"
    >
      <i class="fa-solid fa-xmark"></i>
    </button>

    <!-- Asymmetric Split Layout -->
    <div class="eco-banner-inner">
      <!-- Left: Editorial Content -->
      <transition name="eco-fade" mode="out-in">
        <div :key="currentAd.id" class="eco-content">
          <div class="eco-eyebrow">
            <span class="eco-pill">
              <span class="eco-pill-dot"></span>
              {{ currentAd.typeLabel }}
            </span>
          </div>

          <h3 class="eco-title">{{ currentAd.title }}</h3>
          <p class="eco-desc">{{ currentAd.desc }}</p>

          <div class="eco-actions-row">
            <a
              :href="currentAd.link"
              target="_blank"
              rel="noopener noreferrer"
              class="eco-cta-btn"
            >
              <span>{{ currentAd.ctaText }}</span>
              <i class="fa-solid fa-arrow-right eco-cta-arrow"></i>
            </a>

            <!-- Minimal Progress Indicators -->
            <div v-if="ads.length > 1" class="eco-indicators" role="tablist">
              <button
                v-for="(ad, idx) in ads"
                :key="ad.id"
                class="eco-indicator"
                :class="{ active: currentIndex === idx }"
                @click="goToAd(idx)"
                :aria-label="`Tampilkan ${ad.title}`"
                type="button"
              ></button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Right: Floating Orbital Visual Stage (Supports custom imageUrl or sleek vector stage) -->
      <transition name="eco-visual-fade" mode="out-in">
        <div :key="currentAd.id" class="eco-visual-stage" aria-hidden="true">
          <img
            v-if="currentAd.imageUrl"
            :src="currentAd.imageUrl"
            :alt="currentAd.title"
            class="eco-sponsor-img"
          />
          <div v-else class="eco-orbital-art">
            <div class="orbital-ring ring-outer"></div>
            <div class="orbital-ring ring-inner"></div>
            <div class="orbital-core">
              <i :class="currentAd.icon"></i>
            </div>
            <span class="orbital-float-tag">{{ currentAd.visualTag }}</span>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<style scoped>
.eco-banner {
  position: relative;
  width: 100%;
  margin: 1.25rem 0 1.75rem 0;
  border-radius: 20px;
  background: rgba(13, 17, 28, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.32);
  overflow: hidden;
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.25s ease;
  font-family: 'Poppins', sans-serif;
}

.eco-banner:hover {
  border-color: color-mix(in srgb, var(--ad-accent, #38bdf8) 45%, transparent);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.42),
              0 0 28px color-mix(in srgb, var(--ad-accent, #38bdf8) 14%, transparent);
}

:global(body.light-mode) .eco-banner {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

:global(body.light-mode) .eco-banner:hover {
  border-color: color-mix(in srgb, var(--ad-accent, #0284c7) 40%, transparent);
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.09);
}

/* Atmospheric Background */
.eco-banner-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: background-image 0.6s ease;
  z-index: 0;
}

.eco-banner-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.35;
  background-image:
    radial-gradient(1px 1px at 12% 28%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 38% 72%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1.5px 1.5px at 64% 22%, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(1px 1px at 88% 65%, rgba(255, 255, 255, 0.6), transparent);
  z-index: 0;
}

:global(body.light-mode) .eco-banner-stars {
  display: none;
}

/* Dismiss Button */
.eco-dismiss-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 4;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.eco-dismiss-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #f8fafc;
  transform: scale(1.06);
}

:global(body.light-mode) .eco-dismiss-btn {
  background: rgba(15, 23, 42, 0.05);
  color: #64748b;
}

:global(body.light-mode) .eco-dismiss-btn:hover {
  background: rgba(15, 23, 42, 0.1);
  color: #0f172a;
}

/* Inner Split Layout */
.eco-banner-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 22px 28px;
}

.eco-content {
  flex: 1;
  min-width: 0;
  max-width: 640px;
}

.eco-eyebrow {
  margin-bottom: 8px;
}

.eco-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ad-accent, #38bdf8);
  background: color-mix(in srgb, var(--ad-accent, #38bdf8) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--ad-accent, #38bdf8) 28%, transparent);
}

.eco-pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ad-accent, #38bdf8);
  box-shadow: 0 0 8px var(--ad-accent, #38bdf8);
}

.eco-title {
  margin: 0 0 6px 0;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.015em;
  color: #f8fafc;
}

:global(body.light-mode) .eco-title {
  color: #0f172a;
}

.eco-desc {
  margin: 0 0 16px 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: #94a3b8;
}

:global(body.light-mode) .eco-desc {
  color: #475569;
}

.eco-actions-row {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.eco-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 9999px;
  background: var(--ad-accent, #38bdf8);
  color: #060913;
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, filter 0.2s ease;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--ad-accent, #38bdf8) 35%, transparent);
}

.eco-cta-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.08);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--ad-accent, #38bdf8) 45%, transparent);
}

.eco-cta-arrow {
  font-size: 0.78rem;
  transition: transform 0.2s ease;
}

.eco-cta-btn:hover .eco-cta-arrow {
  transform: translateX(3px);
}

/* Minimal Indicators */
.eco-indicators {
  display: flex;
  align-items: center;
  gap: 6px;
}

.eco-indicator {
  width: 16px;
  height: 4px;
  border-radius: 9999px;
  border: none;
  padding: 0;
  background: rgba(255, 255, 255, 0.16);
  cursor: pointer;
  transition: width 0.3s ease, background 0.3s ease;
}

:global(body.light-mode) .eco-indicator {
  background: rgba(15, 23, 42, 0.14);
}

.eco-indicator.active {
  width: 30px;
  background: var(--ad-accent, #38bdf8);
}

/* Right Visual Stage */
.eco-visual-stage {
  position: relative;
  width: 190px;
  height: 130px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
}

.eco-sponsor-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
  mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
  -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
}

.eco-orbital-art {
  position: relative;
  width: 124px;
  height: 124px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.eco-banner:hover .eco-orbital-art {
  transform: scale(1.06) rotate(-3deg);
}

.orbital-ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.ring-outer {
  inset: 0;
  border: 1px dashed color-mix(in srgb, var(--ad-accent, #38bdf8) 40%, transparent);
  animation: ecoOrbitSpin 24s linear infinite;
}

.ring-inner {
  inset: 14px;
  border: 1px solid color-mix(in srgb, var(--ad-secondary, #818cf8) 30%, transparent);
  animation: ecoOrbitSpin 16s linear infinite reverse;
}

@keyframes ecoOrbitSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.orbital-core {
  width: 62px;
  height: 62px;
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--ad-accent, #38bdf8) 22%, transparent),
    color-mix(in srgb, var(--ad-secondary, #818cf8) 12%, transparent)
  );
  border: 1px solid color-mix(in srgb, var(--ad-accent, #38bdf8) 45%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.55rem;
  color: var(--ad-accent, #38bdf8);
  box-shadow: 0 0 24px color-mix(in srgb, var(--ad-accent, #38bdf8) 25%, transparent);
}

.orbital-float-tag {
  position: absolute;
  bottom: 4px;
  right: -12px;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(13, 17, 28, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
}

:global(body.light-mode) .orbital-float-tag {
  background: #ffffff;
  color: #0f172a;
  border-color: rgba(15, 23, 42, 0.12);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

/* Transitions */
.eco-fade-enter-active,
.eco-fade-leave-active,
.eco-visual-fade-enter-active,
.eco-visual-fade-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.eco-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.eco-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.eco-visual-fade-enter-from,
.eco-visual-fade-leave-to {
  opacity: 0;
  transform: scale(0.94);
}

/* Responsive */
@media (max-width: 768px) {
  .eco-banner-inner {
    padding: 18px 20px;
    gap: 16px;
  }

  .eco-visual-stage {
    display: none;
  }

  .eco-title {
    font-size: 1.08rem;
  }

  .eco-desc {
    font-size: 0.82rem;
    margin-bottom: 14px;
  }

  .eco-cta-btn {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
}
</style>
