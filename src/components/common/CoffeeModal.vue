<template>
  <div class="modal-overlay" :class="{ active: modelValue }">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('update:modelValue', false)">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="coffee-icon">
        <i class="fa-solid" :class="wipIcon"></i>
      </div>
      <h3 style="margin-bottom: 0.5rem;">{{ wipTitle }}</h3>
      <p style="margin-bottom: 1.5rem; color: #94a3b8;">{{ wipDesc }}</p>
      
      <div class="social-support">
        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.75rem;">Support kami di sosial media:</p>
        <div class="social-buttons" style="display: flex; gap: 10px; justify-content: center;">
          <a href="https://instagram.com/icraft.ds" target="_blank" class="btn-social ig" style="display: flex; align-items: center; gap: 8px; padding: 10px 15px; border-radius: 12px; text-decoration: none; background: rgba(225, 48, 108, 0.1); color: #e1306c; border: 1px solid rgba(225, 48, 108, 0.2); font-weight: 600; font-size: 0.9rem; transition: all 0.3s;">
            <i class="fa-brands fa-instagram" style="font-size: 1.1rem;"></i> icraft.ds
          </a>
          <a href="https://tiktok.com/@icraft.ds" target="_blank" class="btn-social tiktok" style="display: flex; align-items: center; gap: 8px; padding: 10px 15px; border-radius: 12px; text-decoration: none; background: rgba(255, 255, 255, 0.05); color: #fff; border: 1px solid rgba(255, 255, 255, 0.1); font-weight: 600; font-size: 0.9rem; transition: all 0.3s;">
            <i class="fa-brands fa-tiktok" style="font-size: 1.1rem;"></i> icraft.ds
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
