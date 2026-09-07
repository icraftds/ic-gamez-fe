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

<style scoped>
.step-content {
  width: 100%;
  max-width: 800px;
  background: rgba(20, 15, 40, 0.7);
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-success {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-success:hover {
  background: #059669;
}

.practice-box h3 {
  margin-bottom: 15px;
}

.instruction {
  color: #cbd5e1;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(56, 189, 248, 0.1);
  border-left: 4px solid #38bdf8;
  border-radius: 4px;
}

.editor-container {
  height: 250px;
}

textarea {
  width: 100%;
  height: 100%;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #e2e8f0;
  padding: 15px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.1rem;
  resize: none;
}

textarea:focus {
  outline: none;
  border-color: var(--primary);
}
</style>
