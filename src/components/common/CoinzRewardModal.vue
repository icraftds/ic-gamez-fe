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

<style scoped>
.coinz-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.82);
  backdrop-filter: blur(12px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.coinz-modal {
  position: relative;
  background: linear-gradient(145deg, #1a1025, #0f0a1a);
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-radius: 28px;
  padding: 44px 36px 32px;
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow:
    0 0 0 1px rgba(245, 158, 11, 0.15),
    0 20px 60px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(245, 158, 11, 0.12);
  overflow: hidden;
}

.glow-ring {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 70%);
  pointer-events: none;
}

.sparkles { position: absolute; inset: 0; pointer-events: none; }
.sparkle {
  position: absolute;
  color: #fbbf24;
  animation: sparklePulse 1.8s ease-in-out infinite alternate;
}
@keyframes sparklePulse {
  from { opacity: 0;   transform: scale(0.5) rotate(0deg); }
  to   { opacity: 0.9; transform: scale(1.2) rotate(30deg); }
}

.coin-image-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 8px;
  animation: floatCoin 3s ease-in-out infinite;
}
.coin-img {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 50%;
  filter: drop-shadow(0 0 24px rgba(245, 158, 11, 0.65));
  border: 3px solid rgba(245, 158, 11, 0.4);
}
.coin-shine {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%);
  pointer-events: none;
}
@keyframes floatCoin {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50%       { transform: translateY(-10px) rotate(2deg); }
}

.reward-label {
  font-size: 0.85rem;
  color: #fbbf24;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.reward-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 18px;
  line-height: 1.2;
}
.coinz-text {
  background: linear-gradient(135deg, #f59e0b, #fbbf24, #fde68a);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.coinz-amount-wrap {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
  margin-bottom: 16px;
}
.plus-sign {
  font-size: 2rem;
  font-weight: 900;
  color: #10b981;
  line-height: 1;
}
.coinz-number {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #fbbf24, #f59e0b, #fcd34d);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.45));
}
.coinz-unit {
  font-size: 1rem;
  font-weight: 700;
  color: #f59e0b;
  align-self: flex-end;
  margin-bottom: 6px;
}

.plan-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 16px;
}
.badge-pro    { background: rgba(14,165,233,0.15); border: 1px solid rgba(14,165,233,0.4); color: #38bdf8; }
.badge-expert { background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.4); color: #fbbf24; }
.badge-topup  { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #34d399; }

.reward-desc {
  color: #94a3b8;
  font-size: 0.87rem;
  line-height: 1.6;
  margin-bottom: 22px;
}
.reward-desc strong { color: #f59e0b; }

.reward-actions { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
.btn-market-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
  text-decoration: none;
  padding: 14px 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.97rem;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(245,158,11,0.32);
}
.btn-market-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(245,158,11,0.5); }

.btn-later {
  background: none;
  border: 1px solid rgba(255,255,255,0.08);
  color: #64748b;
  cursor: pointer;
  padding: 10px;
  border-radius: 10px;
  font-size: 0.88rem;
  transition: all 0.2s;
}
.btn-later:hover { border-color: rgba(255,255,255,0.2); color: #94a3b8; }

.auto-close-bar {
  height: 3px;
  background: rgba(255,255,255,0.07);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 6px;
}
.auto-close-progress {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  border-radius: 2px;
  transition: width 1s linear;
}
.auto-close-text { color: #475569; font-size: 0.73rem; margin: 0; }

/* Transition */
.coinz-modal-fade-enter-active { animation: coinzIn 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.coinz-modal-fade-leave-active { animation: coinzOut 0.3s ease-in forwards; }
.coinz-modal-fade-enter-from,
.coinz-modal-fade-leave-to { opacity: 0; }

@keyframes coinzIn  {
  from { opacity: 0; transform: scale(0.75) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes coinzOut {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.9); }
}
</style>
