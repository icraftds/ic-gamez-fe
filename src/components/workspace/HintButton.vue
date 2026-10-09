<template>
  <button 
    class="nav-btn hint-btn" 
    @click="$emit('click')" 
    :disabled="isLoading"
    style="display: flex; align-items: center; justify-content: center; gap: 4px; padding-right: 8px;"
  >
    <i v-if="isLoading" class="fa-solid fa-spinner fa-spin" style="margin-right: 4px;"></i>
    <i v-else class="fa-solid fa-lightbulb" style="margin-right: 4px;"></i> 
    <span style="font-weight: 600; font-size: 0.95rem;">Buka Hint : 1</span>
    <div style="width: 20px; height: 30px; display: flex; align-items: center; justify-content: flex-start; overflow: visible;">
      <CyberEnergy :pkgId="1" :isAnimated="false" style="width: 45px; height: 45px; transform: translateX(-7px);" />
    </div>
  </button>
</template>

<script setup>
import CyberEnergy from '../ui/CyberEnergy.vue'

defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>
