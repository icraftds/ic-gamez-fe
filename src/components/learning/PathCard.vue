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

<style scoped src="../../assets/css/components/learning/PathCard.css"></style>
