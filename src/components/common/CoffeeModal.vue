<template>
  <div class="modal-overlay" :class="{ active: modelValue }">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('update:modelValue', false)">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="coffee-icon">
        <img v-if="wipIcon.includes('/')" :src="wipIcon" alt="Logo" class="wip-logo-icon" />
        <i v-else class="fa-solid" :class="wipIcon"></i>
      </div>
      <h3 class="wip-title">{{ wipTitle }}</h3>
      <p class="wip-desc">{{ wipDesc }}</p>
      
      <div class="social-support">
        <p class="social-label">Support kami di sosial media:</p>
        <div class="social-buttons">
          <a href="https://instagram.com/icraft.ds" target="_blank" class="btn-social ig">
            <i class="fa-brands fa-instagram"></i> icraft.ds
          </a>
          <a href="https://tiktok.com/@icraftds.id" target="_blank" class="btn-social tiktok">
            <i class="fa-brands fa-tiktok"></i> icraft.ds
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWipModal } from '../../composables/useWipModal'

const { wipTitle, wipDesc, wipIcon } = useWipModal()

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.wip-logo-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.wip-title {
  margin-bottom: 0.5rem;
  color: var(--text-main-hex);
}

.wip-desc {
  margin-bottom: 1.5rem;
  color: var(--text-sub-hex);
}

.social-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.social-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-social {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-social.ig {
  background: rgba(225, 48, 108, 0.1);
  color: #e1306c;
  border: 1px solid rgba(225, 48, 108, 0.25);
}

.btn-social.tiktok {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.btn-social.tiktok:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Light mode support */
:global(body.light-mode) .btn-social.tiktok {
  background: #f1f5f9;
  color: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.12);
}

:global(body.light-mode) .btn-social.tiktok:hover {
  background: #e2e8f0;
}
</style>
