<template>
  <div class="modal-overlay" :class="{ active: modelValue }">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('update:modelValue', false)">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="coffee-icon">
        <i class="fa-solid fa-mug-hot"></i>
      </div>
      <h3>Fitur Segera Hadir!</h3>
      <p>Dukung developer kami dengan secangkir kopi agar fitur ini lebih cepat rilis.</p>
      <a href="#" class="btn-start" style="width: 100%; justify-content: center; margin-top: 25px; text-decoration: none;" @click.prevent="$emit('update:modelValue', false)">
        Buy us a Coffee <i class="fa-solid fa-heart" style="color: #ec4899;"></i>
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
defineEmits(['update:modelValue'])
</script>
