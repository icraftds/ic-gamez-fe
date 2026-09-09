<template>
  <Transition name="xp-toast">
    <div v-if="visible" class="xp-toast" :class="toastClass">
      <div class="xp-toast-icon">
        <i :class="iconClass"></i>
      </div>
      <div class="xp-toast-body">
        <span class="xp-toast-label">{{ label }}</span>
        <span class="xp-toast-amount">+{{ amount }} XP</span>
      </div>
      <div class="xp-toast-shine"></div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  amount: { type: Number, default: 0 },
  label: { type: String, default: '' },
  type: { type: String, default: 'quiz' }, // 'quiz' | 'practice'
})

const visible = ref(false)
let hideTimer = null

const toastClass = computed(() => props.type === 'practice' ? 'toast-practice' : 'toast-quiz')
const iconClass = computed(() =>
  props.type === 'practice'
    ? 'fa-solid fa-code'
    : 'fa-solid fa-circle-check'
)

watch(() => props.amount, (newVal) => {
  if (newVal > 0) {
    visible.value = true
    clearTimeout(hideTimer)
    hideTimer = setTimeout(() => { visible.value = false }, 3000)
  }
})

</script>

<style scoped>
.xp-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 22px;
  border-radius: 14px;
  backdrop-filter: blur(16px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  overflow: hidden;
  min-width: 240px;
}

.toast-quiz {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(6, 182, 212, 0.18));
  border: 1px solid rgba(124, 58, 237, 0.35);
}

.toast-practice {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(34, 211, 238, 0.18));
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.xp-toast-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.toast-quiz .xp-toast-icon {
  background: rgba(124, 58, 237, 0.3);
  color: #c084fc;
}
.toast-practice .xp-toast-icon {
  background: rgba(16, 185, 129, 0.3);
  color: #6ee7b7;
}

.xp-toast-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.xp-toast-label {
  font-size: 0.78rem;
  color: #94a3b8;
  font-weight: 500;
}

.xp-toast-amount {
  font-size: 1.2rem;
  font-weight: 800;
  background: linear-gradient(90deg, #22d3ee, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.xp-toast-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    115deg,
    transparent 30%,
    rgba(255, 255, 255, 0.06) 45%,
    rgba(255, 255, 255, 0.12) 50%,
    rgba(255, 255, 255, 0.06) 55%,
    transparent 70%
  );
  animation: shine-sweep 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shine-sweep {
  0% { transform: translateX(-100%) rotate(0deg); }
  100% { transform: translateX(100%) rotate(0deg); }
}

/* ── Transition ── */
.xp-toast-enter-active {
  animation: toast-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.xp-toast-leave-active {
  animation: toast-out 0.4s ease-in forwards;
}

@keyframes toast-in {
  0% { opacity: 0; transform: translateX(80px) scale(0.85); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes toast-out {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}
</style>
