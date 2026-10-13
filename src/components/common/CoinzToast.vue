<template>
  <Transition name="coinz-toast">
    <div v-if="visible" class="coinz-toast">
      <div class="coinz-toast-icon-wrap">
        <img src="/images/icoinz.svg" alt="iCoinZ" class="coinz-toast-svg" />
      </div>
      <div class="coinz-toast-body">
        <span class="coinz-toast-label">{{ displayLabel }}</span>
        <span class="coinz-toast-amount">+{{ displayAmount }} iCoinZ</span>
      </div>
      <div class="coinz-toast-shine"></div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  amount: { type: Number, default: 0 },
  label: { type: String, default: 'Bonus iCoinZ!' },
  duration: { type: Number, default: 3200 },
})

const visible = ref(false)
const localAmount = ref(0)
const localLabel = ref('')
let hideTimer = null

const displayAmount = computed(() => localAmount.value || props.amount)
const displayLabel = computed(() => localLabel.value || props.label)

const show = (customAmount = null, customLabel = null) => {
  if (customAmount !== null) localAmount.value = customAmount
  if (customLabel !== null) localLabel.value = customLabel

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

// Expose methods agar bisa dipanggil imperatif: coinzToastRef.value.show(15, 'Tantangan Selesai!')
defineExpose({
  show,
  hide,
  visible,
})
</script>

<style scoped src="../../assets/css/components/common/CoinzToast.css"></style>
