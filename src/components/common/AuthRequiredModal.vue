<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-backdrop" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-accent"></div>

        <div class="modal-icon">
          <i class="fa-solid fa-user-lock"></i>
        </div>

        <h2>Lanjutkan Perjalananmu!</h2>
        <p>
          Kamu sedang dalam mode <strong>preview</strong>. Untuk melanjutkan ke sesi
          <strong>{{ nextStepLabel }}</strong> dan menyimpan progres belajarmu,
          kamu perlu login atau buat akun terlebih dahulu. <em>Gratis!</em>
        </p>

        <div class="benefits">
          <div class="benefit-item">
            <i class="fa-solid fa-check-circle"></i>
            <span>Simpan progres belajar</span>
          </div>
          <div class="benefit-item">
            <i class="fa-solid fa-check-circle"></i>
            <span>Akses semua tes &amp; praktik</span>
          </div>
          <div class="benefit-item">
            <i class="fa-solid fa-check-circle"></i>
            <span>Dapatkan XP &amp; badge</span>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-register" @click="$emit('register')">
            <i class="fa-solid fa-user-plus"></i>
            Buat Akun Gratis
          </button>
          <button class="btn-login" @click="$emit('login')">
            <i class="fa-solid fa-right-to-bracket"></i>
            Login
          </button>
        </div>

        <button class="btn-close-text" @click="$emit('close')">
          Lanjut Preview Saja
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  nextStepLabel: {
    type: String,
    default: 'selanjutnya'
  }
})

defineEmits(['close', 'login', 'register'])
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: rgba(12, 8, 28, 0.98);
  border: 1px solid rgba(147, 51, 234, 0.4);
  border-radius: 20px;
  padding: 40px;
  max-width: 460px;
  width: 90%;
  text-align: center;
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(147, 51, 234, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

.modal-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #9333ea, #ec4899, #00f0ff);
}

.modal-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3));
  border: 1px solid rgba(147, 51, 234, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: #c084fc;
  margin: 0 auto 24px;
  box-shadow: 0 0 30px rgba(147, 51, 234, 0.3);
}

h2 {
  font-size: 1.6rem;
  margin-bottom: 12px;
  color: #fff;
  font-weight: 700;
}

p {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 24px;
}

p strong {
  color: #c084fc;
  font-weight: 600;
}

p em {
  color: #10b981;
  font-style: normal;
  font-weight: 600;
}

.benefits {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
  text-align: left;
  background: rgba(147, 51, 234, 0.06);
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 12px;
  padding: 16px 20px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e2e8f0;
  font-size: 0.9rem;
}

.benefit-item i {
  color: #10b981;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.btn-register {
  flex: 1;
  background: linear-gradient(135deg, #9333ea, #ec4899);
  color: white;
  border: none;
  padding: 13px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(147, 51, 234, 0.5);
}

.btn-login {
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 13px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.btn-close-text {
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s ease;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.btn-close-text:hover {
  color: #94a3b8;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
