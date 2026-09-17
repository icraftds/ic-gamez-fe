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

<style scoped src="../../assets/css/components/common/XpToast.css"></style>
