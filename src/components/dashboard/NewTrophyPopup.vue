<template>
  <Teleport to="body">
    <div v-if="show" class="trophy-popup-overlay" @click.self="closePopup">
      <div class="trophy-popup-content">
        <div class="trophy-ambient-glow" :style="{ background: `radial-gradient(circle, ${tierColor}33 0%, transparent 70%)` }"></div>

        <h2 class="trophy-popup-title" :style="{ color: tierColor, textShadow: `0 0 25px ${tierColor}90` }">
          {{ withConfetti ? 'Piala Kejuaraan Diraih!' : 'Piala Kejuaraan' }}
        </h2>

        <!-- Grand Showcase - Large Trophy Display -->
        <div class="new-trophy-showcase">
          <CyberTrophy 
            v-if="trophy" 
            :tier="trophy.tier" 
            :icon="trophy.icon || 'none'" 
            :size="270" 
            :isAnimated="true" 
          />
        </div>

        <!-- Judul / Nama Penghargaan (No Description) -->
        <h3 class="trophy-award-title">
          {{ trophy?.title || trophy?.name }}
        </h3>

        <div v-if="trophy?.count > 1" class="trophy-multiplier-badge" :style="{ borderColor: tierColor, color: tierColor }">
          <i class="fa-solid fa-trophy"></i> Dikoleksi Sebanyak {{ trophy.count }}x
        </div>

        <div class="popup-actions">
          <button 
            class="btn-claim-trophy" 
            :style="{ background: `linear-gradient(135deg, ${tierColor}, #ffffff)`, boxShadow: `0 4px 30px ${tierColor}80` }" 
            @click="closePopup"
          >
            {{ withConfetti ? 'Klaim Piala' : 'Tutup' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue';
import confetti from 'canvas-confetti';
import CyberTrophy from '../ui/CyberTrophy.vue';

const props = defineProps({
  trophy: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  },
  withConfetti: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:show', 'closed']);

const TIER_COLORS = {
  1: '#FF8C42',
  2: '#00FF66',
  3: '#00F0FF',
  4: '#B026FF',
  5: '#FFD700',
  6: '#FF003C',
  7: '#E2E8F0',
  8: '#A855F7',
  9: '#00FFFF',
  10: '#FFD700'
};

const tierColor = computed(() => {
  if (props.trophy && props.trophy.tier) {
    return TIER_COLORS[props.trophy.tier] || '#FFD700';
  }
  return '#FFD700';
});

watch(() => props.show, (newVal) => {
  if (newVal && props.withConfetti) {
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
      particleCount: 6,
      angle: 60,
      spread: 60,
      origin: { x: 0 },
      colors: [tierColor.value, '#FFD700', '#FFFFFF'],
      zIndex: 10001
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 60,
      origin: { x: 1 },
      colors: [tierColor.value, '#FFD700', '#FFFFFF'],
      zIndex: 10001
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};
</script>

<style scoped>
.trophy-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(3, 7, 18, 0.94);
  backdrop-filter: blur(18px);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
}

.trophy-popup-content {
  padding: 40px 35px 35px 35px;
  text-align: center;
  max-width: 520px;
  width: 92%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9);
  animation: popIn 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.trophy-ambient-glow {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 380px;
  height: 380px;
  pointer-events: none;
  border-radius: 50%;
  z-index: 0;
}

.popup-header-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 5px 16px;
  border-radius: 999px;
  background: rgba(2, 6, 23, 0.7);
  border: 1px solid;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.trophy-popup-title {
  margin: 0 0 15px 0;
  font-size: 2.1rem;
  font-weight: 900;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
}

.new-trophy-showcase {
  width: 270px;
  height: 270px;
  margin: 0 auto 15px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
  animation: floatTrophy 3.5s ease-in-out infinite;
}

.trophy-award-title {
  color: #FFFFFF;
  font-size: 1.6rem;
  margin: 0 0 10px 0;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 1;
  line-height: 1.3;
}

.trophy-multiplier-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 800;
  padding: 4px 14px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid;
  margin-top: 5px;
  position: relative;
  z-index: 1;
}

.popup-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
  position: relative;
  z-index: 1;
}

.btn-claim-trophy {
  color: #020617;
  border: none;
  padding: 14px 45px;
  font-size: 1.1rem;
  font-weight: 900;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.2s, filter 0.2s;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.btn-claim-trophy:hover {
  transform: scale(1.05);
  filter: brightness(1.15);
}

@keyframes floatTrophy {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  0% { transform: scale(0.75); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
