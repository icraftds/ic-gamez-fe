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
          <h2 class="gradient-text">Selamat Datang Kembali!</h2>
          <p>Masuk untuk melanjutkan petualangan belajarmu.</p>
        </div>

        <div class="auth-body">
          <div v-if="errorMessage" class="auth-error">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label>Email</label>
              <div class="input-wrapper">
                <input type="email" v-model="loginForm.email" placeholder="admin@example.com" required :disabled="isLoading" />
                <i class="fa-regular fa-envelope"></i>
              </div>
            </div>
            
            <div class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <input type="password" v-model="loginForm.password" placeholder="••••••••" required :disabled="isLoading" />
                <i class="fa-solid fa-lock"></i>
              </div>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" /> Ingat saya
              </label>
              <a href="#" class="forgot-password">Lupa Password?</a>
            </div>

            <button type="submit" class="btn-submit" :disabled="isLoading">
              <span v-if="!isLoading">Masuk ke Akun</span>
              <div v-else class="spinner"></div>
            </button>
          </form>

          <div class="auth-divider">
            <span>ATAU</span>
          </div>

          <button class="btn-google" @click="handleGoogleLogin" :disabled="isLoading">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" class="google-logo" />
            <span>Lanjutkan dengan Google</span>
          </button>
        </div>

        <div class="auth-footer">
          Belum punya akun? <router-link to="/register" class="link-register">Daftar sekarang</router-link>
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

const { login, isLoading } = useUserAccount()
const { showToast } = useToast()
const router = useRouter()

const errorMessage = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  errorMessage.value = ''
  
  const result = await login(loginForm.value.email, loginForm.value.password)
  if (result.success) {
    router.push('/dashboard')
  } else {
    errorMessage.value = result.message
  }
}

const handleGoogleLogin = () => {
  showToast('Fitur Login dengan Google akan segera hadir!', 'info')
}
</script>

<style src="../assets/css/pages/AuthView.css" scoped></style>
