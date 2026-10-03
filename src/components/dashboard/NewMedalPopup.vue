<template>
  <div v-if="show" class="medal-popup-overlay">
    <div class="medal-popup-content">
      <div class="confetti-bg"></div>
      <h2 class="popup-title">Pencapaian Baru!</h2>
      
      <div class="new-medal-showcase">
        <div class="badge-glow pulse-animation"></div>
        <div class="badge-hexagon gold-hex">
          <i :class="medal.icon" class="b-icon popup-icon"></i>
        </div>
      </div>
      
      <h3 class="medal-name">{{ medal.name }}</h3>
      <p class="medal-desc">{{ medal.description }}</p>
      
      <button class="btn-claim" @click="closePopup">Keren!</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import confetti from 'canvas-confetti';

const props = defineProps({
  medal: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:show', 'closed']);

watch(() => props.show, (newVal) => {
  if (newVal) {
    fireConfetti();
  }
});

const closePopup = () => {
  emit('update:show', false);
  emit('closed');
};

const fireConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#fbbf24', '#f59e0b', '#22d3ee']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#fbbf24', '#f59e0b', '#22d3ee']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};
</script>

<style scoped>
.medal-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
}

.medal-popup-content {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: 1px solid #fbbf24;
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 50px rgba(245, 158, 11, 0.2);
  position: relative;
  overflow: hidden;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.popup-title {
  color: #fbbf24;
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 1.8rem;
  text-shadow: 0 2px 10px rgba(245, 158, 11, 0.5);
}

.new-medal-showcase {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pulse-animation {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulseGlow 2s infinite alternate;
}

.badge-hexagon {
  width: 100px;
  height: 100px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  position: relative;
}

.gold-hex {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border: 3px solid #fcd34d;
  box-shadow: inset 0 0 20px rgba(255,255,255,0.4);
}

.popup-icon {
  font-size: 3rem;
  color: #fff;
  text-shadow: 1px 2px 4px rgba(0,0,0,0.3);
}

.medal-name {
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.medal-desc {
  color: #94a3b8;
  margin-bottom: 30px;
  line-height: 1.5;
}

.btn-claim {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
  transition: transform 0.2s;
}

.btn-claim:hover {
  transform: scale(1.05);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes pulseGlow {
  0% { transform: scale(0.9); opacity: 0.6; }
  100% { transform: scale(1.2); opacity: 1; }
}
</style>
