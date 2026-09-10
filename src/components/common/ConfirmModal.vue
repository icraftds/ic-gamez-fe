<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="onCancel">
      <div class="modal-content">
        <div class="modal-header">
          <div class="icon-wrapper" :class="type">
            <i :class="iconClass"></i>
          </div>
          <h3 class="modal-title">{{ title }}</h3>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="onCancel">Batal</button>
          <button class="btn-confirm" :class="type" @click="onConfirm">{{ confirmText }}</button>
        </div>
      </div>
    </div>
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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: var(--glass-bg, rgba(15, 10, 30, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  padding: 30px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 15px;
}

.icon-wrapper.danger {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.icon-wrapper.warning {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.icon-wrapper.info {
  background: rgba(0, 240, 255, 0.15);
  color: #00f0ff;
  border: 1px solid rgba(0, 240, 255, 0.3);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.modal-body {
  text-align: center;
  color: #94a3b8;
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 30px;
}

.modal-footer {
  display: flex;
  gap: 15px;
}

.modal-footer button {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-confirm {
  border: none;
  color: white;
}

.btn-confirm.danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.btn-confirm.warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.btn-confirm.info {
  background: linear-gradient(135deg, #00f0ff, #0ea5e9);
  color: #05050f;
  box-shadow: 0 4px 15px rgba(0, 240, 255, 0.3);
}

.btn-confirm:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}
</style>
