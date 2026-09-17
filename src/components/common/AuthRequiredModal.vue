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

<style scoped src="../../assets/css/components/common/AuthRequiredModal.css"></style>
