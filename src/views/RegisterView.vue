<template>
  <div class="auth-page">
    <!-- Back Button -->
    <router-link to="/" class="btn-back-auth">
      <i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda
    </router-link>

    <div class="auth-container">
      <!-- Left Panel: Branding / Illustration -->
      <div class="auth-panel-left">
        <div class="panel-content">
          <router-link to="/" class="logo-large">
            <i class="fa-solid fa-cube text-primary"></i>
            <span>Icraft<span class="text-secondary">DS</span></span>
          </router-link>
          <h2>Tingkatkan Skill Coding-mu</h2>
          <p>Bergabung dengan komunitas developer terbesar dan capai karir impianmu bersama kami.</p>
        </div>
        <!-- Decorative elements -->
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
      </div>

      <!-- Right Panel: Form -->
      <div class="auth-panel-right">
        <div class="auth-header">
          <h2 class="gradient-text">Bergabung Sekarang!</h2>
          <p>Mulai perjalanan belajarmu dan tingkatkan skill coding-mu.</p>
        </div>

        <div class="auth-body">
          <div v-if="errorMessage" class="auth-error">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <form v-if="step === 1" @submit.prevent="handleRegister">
            <div class="form-group">
              <label>Nama Lengkap</label>
              <div class="input-wrapper">
                <input type="text" v-model="registerForm.name" placeholder="John Doe" required :disabled="isLoading" />
                <i class="fa-regular fa-user"></i>
              </div>
              <span v-if="validationErrors.name" class="error-text text-danger">{{ validationErrors.name[0] }}</span>
            </div>

            <div class="form-group">
              <label>Email</label>
              <div class="input-wrapper">
                <input type="email" v-model="registerForm.email" placeholder="john@example.com" required :disabled="isLoading" />
                <i class="fa-regular fa-envelope"></i>
              </div>
              <span v-if="validationErrors.email" class="error-text text-danger">{{ validationErrors.email[0] }}</span>
            </div>
            
            <div class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <input type="password" v-model="registerForm.password" placeholder="Minimal 8 karakter" required minlength="8" :disabled="isLoading" />
                <i class="fa-solid fa-lock"></i>
              </div>
              <span v-if="validationErrors.password" class="error-text text-danger">{{ validationErrors.password[0] }}</span>
            </div>

            <div class="form-group">
              <label>Konfirmasi Password</label>
              <div class="input-wrapper">
                <input type="password" v-model="registerForm.password_confirmation" placeholder="Ulangi password" required minlength="8" :disabled="isLoading" />
                <i class="fa-solid fa-lock"></i>
              </div>
              <span v-if="validationErrors.password_confirmation" class="error-text text-danger">{{ validationErrors.password_confirmation[0] }}</span>
            </div>

            <button type="submit" class="btn-submit btn-register-submit" :disabled="isLoading">
              <span v-if="!isLoading">Daftar Akun</span>
              <div v-else class="spinner"></div>
            </button>
          </form>

          <form v-else @submit.prevent="handleVerifyOtp">
            <p style="margin-bottom: 20px; color: var(--text-sub-hex); text-align: center;">
              Kode OTP 6-digit telah dikirim ke email <strong>{{ registerForm.email }}</strong>.
            </p>
            
            <div class="form-group">
              <label>Kode OTP</label>
              <div class="input-wrapper">
                <input type="text" v-model="otpCode" placeholder="Masukan 6 digit OTP" required maxlength="6" :disabled="isLoading" style="letter-spacing: 5px; text-align: center; font-size: 1.2rem;" />
              </div>
            </div>

            <button type="submit" class="btn-submit btn-register-submit" :disabled="isLoading">
              <span v-if="!isLoading">Verifikasi OTP</span>
              <div v-else class="spinner"></div>
            </button>
            
            <button type="button" @click="handleResendOtp" :disabled="isLoading" style="background: transparent; color: var(--text-sub-hex); border: none; margin-top: 15px; cursor: pointer; text-decoration: underline; width: 100%; text-align: center;">
              Kirim Ulang OTP
            </button>
          </form>

          <div v-if="step === 1">
            <div class="auth-divider">
              <span>ATAU</span>
            </div>

            <button class="btn-google" @click="handleGoogleLogin" :disabled="isLoading">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" class="google-logo" />
              <span>Daftar dengan Google</span>
            </button>
          </div>
        </div>

        <div class="auth-footer">
          Sudah punya akun? <router-link to="/login" class="link-login">Masuk di sini</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAccount } from '../composables/useUserAccount'
import { useToast } from '../composables/useToast'

const { register, verifyOtp, resendOtp, isLoading } = useUserAccount()
const { showToast } = useToast()
const router = useRouter()

const step = ref(1)
const otpCode = ref('')
const errorMessage = ref('')
const validationErrors = ref({})

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const handleRegister = async () => {
  errorMessage.value = ''
  validationErrors.value = {}
  
  const result = await register(
    registerForm.value.name, 
    registerForm.value.email, 
    registerForm.value.password, 
    registerForm.value.password_confirmation
  )
  
  if (result.success) {
    step.value = 2 // Move to OTP step
    showToast('Silakan periksa email Anda untuk kode OTP.', 'success')
  } else {
    errorMessage.value = result.message
    if (result.errors) {
      validationErrors.value = result.errors
    }
  }
}

const handleVerifyOtp = async () => {
  errorMessage.value = ''
  
  const result = await verifyOtp(registerForm.value.email, otpCode.value)
  if (result.success) {
    showToast('Registrasi dan verifikasi berhasil!', 'success')
    router.push('/dashboard')
  } else {
    errorMessage.value = result.message
  }
}

const handleResendOtp = async () => {
  errorMessage.value = ''
  const result = await resendOtp(registerForm.value.email)
  if (result.success) {
    showToast(result.message, 'success')
  } else {
    errorMessage.value = result.message
  }
}

const handleGoogleLogin = () => {
  showToast('Fitur Daftar dengan Google akan segera hadir!', 'info')
}
</script>

<style src="../assets/css/pages/AuthView.css" scoped></style>
