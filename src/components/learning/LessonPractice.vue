<template>
  <div class="step-content">
    <div class="practice-box">
      <h3>Area Praktik</h3>
      <p class="instruction">{{ instruction }}</p>
      
      <div class="editor-container">
        <textarea v-model="practiceCode" placeholder="Ketik jawaban/kode Anda di sini..."></textarea>
      </div>
    </div>
    
    <div class="action-bar">
      <button class="btn-secondary" @click="$emit('back')">Kembali</button>
      <button class="btn-success" @click="$emit('finish')">
        <i class="fa-solid fa-check"></i> Selesai & Kembali
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  instruction: {
    type: String,
    required: true
  }
})

defineEmits(['back', 'finish'])

const practiceCode = ref('')
</script>

<style scoped src="../../assets/css/components/learning/LessonPractice.css"></style>
