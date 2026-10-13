<template>
  <Transition name="xp-toast">
    <div v-if="visible" class="xp-toast" :class="toastClass">
      <div class="xp-toast-icon">
        <i :class="iconClass"></i>
      </div>
      <div class="xp-toast-body">
        <span class="xp-toast-label">{{ displayLabel }}</span>
        <span class="xp-toast-amount">+{{ displayAmount }} XP</span>
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
  type: { type: String, default: 'quiz' }, // 'quiz' | 'practice' | 'challenge'
  duration: { type: Number, default: 3200 },
})

const visible = ref(false)
const localAmount = ref(0)
const localLabel = ref('')
const localType = ref('')
let hideTimer = null

const displayAmount = computed(() => localAmount.value || props.amount)
const displayLabel = computed(() => localLabel.value || props.label)
const activeType = computed(() => localType.value || props.type)

const toastClass = computed(() => {
  if (activeType.value === 'practice' || activeType.value === 'challenge') {
    return 'toast-practice'
  }
  return 'toast-quiz'
})

const iconClass = computed(() => {
  if (activeType.value === 'practice' || activeType.value === 'challenge') {
    return 'fa-solid fa-code'
  }
  return 'fa-solid fa-circle-check'
})

const show = (customAmount = null, customLabel = null, customType = null) => {
  if (customAmount !== null) localAmount.value = customAmount
  if (customLabel !== null) localLabel.value = customLabel
  if (customType !== null) localType.value = customType

  visible.value = true
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    visible.value = false
  }, props.duration)
}

const hide = () => {
  clearTimeout(hideTimer)
  visible.value = false
}

// Watcher untuk reaktivitas via props
watch(() => props.amount, (newVal) => {
  if (newVal > 0) {
    localAmount.value = newVal
    show()
  }
})

// Expose methods agar bisa dipanggil imperatif: toastRef.value.show(50, 'Selamat!')
defineExpose({
  show,
  hide,
  visible,
})
</script>

<style scoped src="../../assets/css/components/common/XpToast.css"></style>
