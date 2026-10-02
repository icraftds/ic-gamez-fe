<template>
  <Teleport to="body">
    <Transition name="coinz-modal-fade">
      <div v-if="modelValue" class="coinz-overlay" @click.self="handleClose">
        <div class="coinz-modal">
          <!-- Sparkle particles -->
          <div class="sparkles">
            <span v-for="i in 12" :key="i" class="sparkle" :style="sparkleStyle(i)">✦</span>
          </div>

          <!-- Glow ring behind coin -->
          <div class="glow-ring"></div>

          <!-- Coin image -->
          <div class="coin-image-wrap">
            <img src="/images/coinz-reward.jpg" alt="iCoinZ" class="coin-img" />
            <div class="coin-shine"></div>
          </div>

          <!-- Title -->
          <div class="reward-label">🎉 Selamat!</div>
          <h2 class="reward-title">Kamu Mendapatkan <span class="coinz-text">iCoinZ!</span></h2>

          <!-- Coin amount counter -->
          <div class="coinz-amount-wrap">
            <span class="plus-sign">+</span>
            <span class="coinz-number">{{ displayAmount.toLocaleString('id-ID') }}</span>
            <span class="coinz-unit">iCoinZ</span>
          </div>

          <!-- Plan badge -->
          <div class="plan-badge" :class="planBadgeClass">
            <i :class="planIcon"></i>
            Bonus dari Paket {{ planName }}
          </div>

          <!-- Description -->
          <p class="reward-desc">
            iCoinZ-mu telah ditambahkan ke wallet dan siap digunakan di
            <strong>IC Market</strong> untuk ditukarkan hadiah menarik!
          </p>

          <!-- CTA Buttons -->
          <div class="reward-actions">
            <a href="https://market.icraftds.id/" target="_blank" class="btn-market-cta">
              <i class="fa-solid fa-store"></i> Tukarkan di IC Market
            </a>
            <button class="btn-later" @click="handleClose">
              Nanti saja
            </button>
          </div>

          <!-- Auto close indicator -->
          <div class="auto-close-bar">
            <div class="auto-close-progress" :style="{ width: progressWidth + '%' }"></div>
          </div>
          <p class="auto-close-text">Menutup otomatis dalam {{ countdown }} detik</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  amount:     { type: Number, default: 0 },
  plan:       { type: String, default: 'pro' }, // 'pro' | 'expert' | 'topup'
})

const emit = defineEmits(['update:modelValue', 'close'])

// Animated counter
const displayAmount = ref(0)
let counterInterval = null

const startCounter = () => {
  displayAmount.value = 0
  const target = props.amount
  const steps = 60
  const increment = target / steps
  let current = 0
  counterInterval = setInterval(() => {
    current += increment
    if (current >= target) {
      displayAmount.value = target
      clearInterval(counterInterval)
    } else {
      displayAmount.value = Math.floor(current)
    }
  }, 1500 / steps)
}

// Auto-close countdown
const AUTO_CLOSE_SECONDS = 15
const countdown    = ref(AUTO_CLOSE_SECONDS)
const progressWidth = ref(100)
let countdownInterval = null

const startCountdown = () => {
  countdown.value    = AUTO_CLOSE_SECONDS
  progressWidth.value = 100
  countdownInterval = setInterval(() => {
    countdown.value--
    progressWidth.value = (countdown.value / AUTO_CLOSE_SECONDS) * 100
    if (countdown.value <= 0) handleClose()
  }, 1000)
}

const clearTimers = () => {
  if (counterInterval)  clearInterval(counterInterval)
  if (countdownInterval) clearInterval(countdownInterval)
}

const handleClose = () => {
  clearTimers()
  emit('update:modelValue', false)
  emit('close')
}

watch(() => props.modelValue, (val) => {
  if (val) {
    clearTimers()
    setTimeout(() => startCounter(), 400)
    startCountdown()
    import('canvas-confetti').then(mod => {
      const confetti = mod.default || mod
      confetti({
        particleCount: 200, spread: 90, origin: { y: 0.5 },
        colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#10b981', '#00f0ff'],
      })
    }).catch(() => {})
  } else {
    clearTimers()
  }
})

onUnmounted(() => clearTimers())

const planName = computed(() => {
  if (props.plan === 'expert') return 'Expert'
  if (props.plan === 'topup')  return 'Top Up'
  return 'Pro'
})
const planBadgeClass = computed(() => ({
  'badge-pro':    props.plan === 'pro',
  'badge-expert': props.plan === 'expert',
  'badge-topup':  props.plan === 'topup',
}))
const planIcon = computed(() => {
  if (props.plan === 'expert') return 'fa-solid fa-crown'
  if (props.plan === 'topup')  return 'fa-solid fa-plus'
  return 'fa-solid fa-bolt'
})

const sparkleStyle = (i) => {
  const angle  = (i / 12) * 360
  const rx     = 48 + (i % 3) * 5
  const ry     = 44 + (i % 3) * 5
  const x      = 50 + Math.cos((angle * Math.PI) / 180) * rx
  const y      = 50 + Math.sin((angle * Math.PI) / 180) * ry
  const delay  = ((i - 1) * 0.13) % 1.5
  const fsize  = 0.55 + (i % 3) * 0.25
  return { left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s`, fontSize: `${fsize}rem`, opacity: 0 }
}
</script>

<style scoped src="../../assets/css/components/common/CoinzRewardModal.css"></style>
