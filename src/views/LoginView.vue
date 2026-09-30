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
            <!-- <img src="/images/Favicon GameZ.png" alt="IC Game Z Icon" class="logo-icon-large" /> -->
            <img src="/images/Logo iC GameZ Lightmode.png" alt="IC Game Z" class="logo-text-img-large" />
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

          <!-- LOGIN STEP -->
          <form v-if="step === 1" @submit.prevent="handleLogin">
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
              <a href="#" class="forgot-password" @click.prevent="openWipModal">Lupa Password?</a>
            </div>

            <button type="submit" class="btn-submit" :disabled="isLoading">
              <span v-if="!isLoading">Masuk ke Akun</span>
              <div v-else class="spinner"></div>
            </button>
          </form>

          <!-- OTP STEP FOR UNVERIFIED USERS -->
          <form v-else @submit.prevent="handleVerifyOtp">
            <p style="margin-bottom: 20px; color: var(--text-sub-hex); text-align: center;">
              Kode OTP 6-digit telah dikirim ke email <strong>{{ loginForm.email }}</strong>.
            </p>
            
            <div class="form-group">
              <label style="text-align: center; display: block; margin-bottom: 10px;">Kode OTP</label>
              <div class="otp-container" :class="otpStatus">
                <input 
                  v-for="(digit, index) in otpDigits" 
                  :key="index"
                  type="text" 
                  inputmode="numeric"
                  maxlength="1"
                  v-model="otpDigits[index]"
                  :ref="(el) => { if(el) otpInputs[index] = el }"
                  @input="handleOtpInput(index, $event)"
                  @keydown="handleOtpKeydown(index, $event)"
                  @paste="handleOtpPaste"
                  :disabled="isLoading || otpStatus === 'success'"
                  class="otp-input"
                />
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

            <button class="btn-google" @click="openWipModal" :disabled="isLoading">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" class="google-logo" />
              <span>Lanjutkan dengan Google</span>
            </button>
          </div>
        </div>

        <div class="auth-footer" v-if="step === 1">
          Belum punya akun? <router-link to="/register" class="link-register">Daftar sekarang</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAccount } from '../composables/useUserAccount'
import { useWipModal } from '../composables/useWipModal'
import { useToast } from '../composables/useToast'

const { login, verifyOtp, resendOtp, isLoading } = useUserAccount()
const { openWipModal } = useWipModal()
const { showToast } = useToast()
const router = useRouter()

const errorMessage = ref('')
const step = ref(1)
const otpDigits = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const otpCode = computed(() => otpDigits.value.join(''))
const otpStatus = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  errorMessage.value = ''
  
  const result = await login(loginForm.value.email, loginForm.value.password)
  if (result.success) {
    sessionStorage.setItem('just_logged_in', 'true')
    router.push('/dashboard')
  } else {
    // Check if error is because user is unverified
    if (result.data?.errors?.is_unverified) {
      step.value = 2
      showToast('Silakan verifikasi email Anda terlebih dahulu.', 'info')
    } else {
      errorMessage.value = result.message
    }
  }
}

const handleVerifyOtp = async () => {
  errorMessage.value = ''
  otpStatus.value = ''
  
  if (otpCode.value.length < 6) {
     errorMessage.value = 'Mohon lengkapi 6 digit kode OTP.'
     otpStatus.value = 'error'
     setTimeout(() => otpStatus.value = '', 1000)
     return
  }
  
  const result = await verifyOtp(loginForm.value.email, otpCode.value)
  if (result.success) {
    otpStatus.value = 'success'
    showToast('Verifikasi dan Login berhasil!', 'success')
    setTimeout(() => {
      sessionStorage.setItem('just_logged_in', 'true')
      router.push('/dashboard')
    }, 1500)
  } else {
    otpStatus.value = 'error'
    errorMessage.value = result.message
    setTimeout(() => otpStatus.value = '', 1000)
  }
}

const handleOtpInput = (index, event) => {
  const value = event.target.value
  
  if (!/^\d*$/.test(value)) {
    otpDigits.value[index] = ''
    return
  }

  if (value && index < 5) {
    nextTick(() => {
      otpInputs.value[index + 1]?.focus()
    })
  }
}

const handleOtpKeydown = (index, event) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
}

const handleOtpPaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').slice(0, 6)
  if (!/^\d+$/.test(pastedData)) return
  
  for (let i = 0; i < pastedData.length; i++) {
    otpDigits.value[i] = pastedData[i]
  }
  
  const nextIndex = Math.min(pastedData.length, 5)
  nextTick(() => {
    otpInputs.value[nextIndex]?.focus()
  })
}

const handleResendOtp = async () => {
  errorMessage.value = ''
  const result = await resendOtp(loginForm.value.email)
  if (result.success) {
    showToast(result.message, 'success')
    otpDigits.value = ['', '', '', '', '', '']
    nextTick(() => {
      otpInputs.value[0]?.focus()
    })
  } else {
    errorMessage.value = result.message
  }
}
</script>

<style src="../assets/css/pages/AuthView.css" scoped></style>

<style scoped>
.otp-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
}

.otp-input {
  width: 50px;
  height: 60px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  transition: all 0.3s ease;
}

.otp-input:focus {
  outline: none;
  border-color: #00ffea;
  background: rgba(0, 255, 255, 0.05);
  box-shadow: 0 0 10px rgba(0, 255, 234, 0.2);
}

.otp-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Error Animation */
.otp-container.error .otp-input {
  border-color: #ff4757;
  color: #ff4757;
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

/* Success Animation */
.otp-container.success .otp-input {
  border-color: #2ed573;
  color: #2ed573;
  animation: successPop 0.5s forwards;
}

.otp-container.success .otp-input:nth-child(1) { animation-delay: 0.0s; }
.otp-container.success .otp-input:nth-child(2) { animation-delay: 0.05s; }
.otp-container.success .otp-input:nth-child(3) { animation-delay: 0.1s; }
.otp-container.success .otp-input:nth-child(4) { animation-delay: 0.15s; }
.otp-container.success .otp-input:nth-child(5) { animation-delay: 0.2s; }
.otp-container.success .otp-input:nth-child(6) { animation-delay: 0.25s; }

@keyframes successPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); background: rgba(46, 213, 115, 0.1); }
  100% { transform: scale(1); background: rgba(46, 213, 115, 0.2); border-color: #2ed573; }
}
</style>
