<template>
  <Teleport to="body">
    <div v-if="show" class="medal-popup-overlay">
      <div class="medal-popup-content">
        <div class="confetti-bg"></div>
        <h2 class="popup-title" :style="{ color: medalColor, textShadow: `0 2px 15px ${medalColor}80` }">
          {{ medal?.category === 'borders' ? 'Apakah Cocok denganmu?' : 'Pencapaian Baru!' }}
        </h2>
        
        <div class="new-medal-showcase">
          <CyberBorder v-if="medal?.category === 'borders'" :tierId="medal.tierId" accountBadge="PRO" class="popup-cyber-medal" />
          <CyberMedal v-else-if="medal" :tierId="medal.tierId" :iconType="medal.iconType" class="popup-cyber-medal" />
        </div>
        
        <h3 class="medal-name">{{ medal?.name }}</h3>
        <p class="medal-desc">{{ medal?.description }}</p>
        
        <div class="popup-actions" style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
          <button class="btn-claim" :style="{ background: medalColor, boxShadow: `0 4px 25px ${medalColor}60` }" @click="closePopup">
            {{ medal?.category === 'borders' ? 'Tutup' : 'Keren!' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue';
import confetti from 'canvas-confetti';
import CyberMedal from '../ui/CyberMedal.vue';
import CyberBorder from '../ui/CyberBorder.vue';
import { TIERS } from '../../utils/tiers.js';

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

const medalColor = computed(() => {
  if (props.medal && props.medal.tierId) {
    const t = TIERS.find(t => t.id === props.medal.tierId);
    if (t) return t.accent;
  }
  return '#fbbf24';
});

watch(() => props.show, (newVal) => {
  if (newVal && props.medal?.category !== 'borders') {
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
      colors: [medalColor.value, '#FFFFFF'],
      zIndex: 10001
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: [medalColor.value, '#FFFFFF'],
      zIndex: 10001
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
  background: rgba(5, 7, 11, 0.95);
  backdrop-filter: blur(15px);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
}

.medal-popup-content {
  padding: 40px;
  text-align: center;
  max-width: 500px;
  width: 90%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.popup-title {
  margin-top: 0;
  margin-bottom: 40px;
  font-size: 2.4rem;
  font-weight: 900;
  letter-spacing: 1px;
}

.new-medal-showcase {
  width: 240px;
  height: 240px;
  margin: 0 auto 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: floatMedal 3s ease-in-out infinite;
}

.popup-cyber-medal {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.medal-name {
  color: #fff;
  font-size: 2rem;
  margin-bottom: 15px;
  font-weight: 800;
  text-shadow: 0 2px 10px rgba(0,0,0,0.8);
}

.medal-desc {
  color: #94a3b8;
  margin-bottom: 40px;
  font-size: 1.15rem;
  line-height: 1.6;
}

.btn-claim {
  color: #000;
  border: none;
  padding: 16px 50px;
  font-size: 1.2rem;
  font-weight: 900;
  border-radius: 40px;
  cursor: pointer;
  transition: transform 0.2s, filter 0.2s;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.btn-claim:hover {
  transform: scale(1.05);
  filter: brightness(1.2);
}

@keyframes floatMedal {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
