<template>
  <Teleport to="body">
    <Transition name="confirm-modal">
      <div v-if="modelValue" class="confirm-modal-overlay" @click.self="onCancel">
        <div class="confirm-modal-content">
          <div class="confirm-modal-header">
            <div class="confirm-icon-wrapper" :class="type">
              <i :class="iconClass"></i>
            </div>
            <h3 class="confirm-modal-title">{{ title }}</h3>
          </div>
          <div class="confirm-modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="confirm-modal-footer">
            <button class="confirm-btn-cancel" @click="onCancel">Batal</button>
            <button class="confirm-btn-confirm" :class="type" @click="onConfirm">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: 'Konfirmasi'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Ya, Lanjutkan'
  },
  type: {
    type: String,
    default: 'warning', // 'warning', 'danger', 'info'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const iconClass = computed(() => {
  if (props.type === 'danger') return 'fa-solid fa-triangle-exclamation'
  if (props.type === 'warning') return 'fa-solid fa-circle-exclamation'
  return 'fa-solid fa-circle-info'
})

const onCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const onConfirm = () => {
  emit('update:modelValue', false)
  emit('confirm')
}
</script>

<style src="../../assets/css/components/common/ConfirmModal.css"></style>
