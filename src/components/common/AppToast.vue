<template>
  <Teleport to="body">
    <Transition name="app-toast">
      <div v-if="isVisible" class="app-toast" :class="`toast-${toastType}`">
        <div class="toast-icon">
          <i class="fa-solid" :class="iconClass"></i>
        </div>
        <div class="toast-content">{{ toastMessage }}</div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useToast } from '../../composables/useToast'

const { isVisible, toastMessage, toastType } = useToast()

const iconClass = computed(() => {
  if (toastType.value === 'error' || toastType.value === 'danger') return 'fa-circle-xmark'
  if (toastType.value === 'warning') return 'fa-triangle-exclamation'
  if (toastType.value === 'success') return 'fa-circle-check'
  return 'fa-circle-info'
})
</script>

<style scoped>
.app-toast {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border-radius: 50px;
  background: rgba(15, 10, 31, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  color: white;
  font-weight: 500;
  pointer-events: none;
  min-width: 300px;
  justify-content: center;
}
.toast-error, .toast-danger { border-color: rgba(239, 68, 68, 0.5); }
.toast-error .toast-icon, .toast-danger .toast-icon { color: #ef4444; }
.toast-warning { border-color: rgba(245, 158, 11, 0.5); }
.toast-warning .toast-icon { color: #f59e0b; }
.toast-success { border-color: rgba(16, 185, 129, 0.5); }
.toast-success .toast-icon { color: #10b981; }
.toast-info { border-color: rgba(59, 130, 246, 0.5); }
.toast-info .toast-icon { color: #3b82f6; }

.app-toast-enter-active,
.app-toast-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.app-toast-enter-from,
.app-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
