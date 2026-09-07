<template>
  <div v-if="isOpen" class="modal-backdrop" @click="close">
    <div class="modal-content" @click.stop>
      <div class="modal-icon">
        <i class="fa-solid fa-crown"></i>
      </div>
      <h2>Konten Premium</h2>
      <p>Modul pembelajaran ini berbayar. Silakan berlangganan Premium terlebih dahulu untuk mengakses seluruh materi secara lengkap.</p>
      
      <div class="modal-actions">
        <button class="btn-cancel" @click="close">Batal</button>
        <button class="btn-subscribe" @click="subscribe">Berlangganan Sekarang</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

const subscribe = () => {
  // Sementara hanya menutup modal
  emit('close')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(20, 15, 40, 0.95);
  border: 1px solid rgba(245, 158, 11, 0.5);
  border-radius: 16px;
  padding: 40px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.2);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #b45309, #f59e0b);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: white;
  margin: 0 auto 20px;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #fff;
}

p {
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 30px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-subscribe {
  background: linear-gradient(135deg, #d97706, #f59e0b);
  color: white;
  flex: 1;
}

.btn-subscribe:hover {
  opacity: 0.9;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
}
</style>
