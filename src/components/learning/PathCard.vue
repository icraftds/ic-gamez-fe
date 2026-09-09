<template>
  <div 
    class="path-card group" 
    :class="{ premium: path.isPremium, locked: path.isLocked }"
    @click="handleClick"
  >
    <div class="card-glow" :style="{ background: themeColor }"></div>
    <div class="path-card-inner">
      <div class="path-icon-container">
        <div class="path-icon" :style="{ color: themeColor, backgroundColor: themeColor + '20', border: `1px solid ${themeColor}50` }">
          <i :class="path.icon"></i>
        </div>
        <div v-if="path.isLocked" class="locked-badge-float">
          <i class="fa-solid fa-lock"></i> TAHAP MVP
        </div>
        <div v-else-if="path.isPremium" class="premium-badge-float">
          <i class="fa-solid fa-crown"></i> PRO
        </div>
      </div>
      
      <div class="path-content">
        <h3 class="title">{{ path.title }}</h3>
        <p class="desc">{{ path.description }}</p>
      </div>
      
      <div class="path-footer">
        <div class="path-stats">
          <div class="stat-item">
            <i class="fa-solid fa-book-open"></i> {{ path.chapters?.length || 0 }} Modul
          </div>
        </div>
        <div class="action-btn" :style="{ color: path.isLocked ? '#64748b' : themeColor }">
          <span v-if="path.isLocked">Terkunci</span>
          <span v-else>Mulai</span>
          <i v-if="!path.isLocked" class="fa-solid fa-arrow-right icon-arrow"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  path: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (!props.path.isLocked) {
    emit('click')
  }
}

const themeColor = computed(() => {
  if (props.path.isLocked) return '#475569' // Slate gray for locked
  if (props.path.isPremium) return '#f59e0b' // Amber/Gold for premium
  const colors = ['#00f0ff', '#ec4899', '#9333ea', '#10b981']
  return colors[props.index % colors.length] || '#00f0ff'
})
</script>

<style scoped>
.path-card {
  position: relative;
  border-radius: 24px;
  padding: 1px; /* space for gradient border */
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.path-card:hover {
  transform: translateY(-8px);
  z-index: 10;
}

/* Background glowing effect on hover */
.card-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  transform: translate(-50%, -50%);
  filter: blur(60px);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
  pointer-events: none;
}
.path-card:hover .card-glow {
  opacity: 0.15;
}

.path-card-inner {
  background: rgba(15, 10, 30, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 23px;
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.path-card:not(.locked):hover .path-card-inner {
  background: rgba(20, 15, 40, 0.85);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.path-card.locked {
  cursor: not-allowed;
  opacity: 0.7;
}

.path-card.locked:hover {
  transform: none;
}

.path-icon-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.path-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.path-card:not(.locked):hover .path-icon {
  transform: scale(1.1) rotate(5deg);
}

.locked-badge-float {
  background: rgba(71, 85, 105, 0.4);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.premium-badge-float {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
  display: flex;
  align-items: center;
  gap: 6px;
}

.title {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  line-height: 1.3;
}

.desc {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 30px;
}

.path-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.path-stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  color: #64748b;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn {
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  opacity: 0.8;
}

.icon-arrow {
  transition: transform 0.3s ease;
}

.path-card:hover .action-btn {
  opacity: 1;
}

.path-card:hover .icon-arrow {
  transform: translateX(5px);
}
</style>
