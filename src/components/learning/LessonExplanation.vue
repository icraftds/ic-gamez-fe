<template>
  <div class="step-content">
    <div class="explanation-box" v-html="explanation"></div>
    <div class="action-bar">
      <button class="btn-primary" @click="$emit('next')">
        Lanjut ke Tes <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  explanation: {
    type: String,
    required: true
  }
})

defineEmits(['next'])
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

.explanation-box {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #e2e8f0;
  margin-bottom: 30px;
}

.explanation-box :deep(h3) {
  color: #c084fc;
  margin-bottom: 15px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.btn-primary:hover {
  opacity: 0.9;
}
</style>
