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
            <img src="/images/Favicon GameZ.png" alt="IcraftDS Icon" class="logo-icon-large" />
            <img src="/images/logo-icgamez.png" alt="IC Game Z" class="logo-text-img-large" />
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
              <label>No. Telepon</label>
              <div class="input-wrapper">
                <input type="tel" v-model="registerForm.phone" placeholder="081234567890" required :disabled="isLoading" />
                <i class="fa-solid fa-phone"></i>
              </div>
              <span v-if="validationErrors.phone" class="error-text text-danger">{{ validationErrors.phone[0] }}</span>
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
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAccount } from '../composables/useUserAccount'
import { useToast } from '../composables/useToast'

const { register, verifyOtp, resendOtp, isLoading } = useUserAccount()
const { showToast } = useToast()
const router = useRouter()

const step = ref(1)
const otpDigits = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const otpCode = computed(() => otpDigits.value.join(''))
const otpStatus = ref('')
const errorMessage = ref('')
const validationErrors = ref({})

const registerForm = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: ''
})

const handleRegister = async () => {
  errorMessage.value = ''
  validationErrors.value = {}
  
  const result = await register(
    registerForm.value.name, 
    registerForm.value.email, 
    registerForm.value.phone,
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
  otpStatus.value = ''
  
  if (otpCode.value.length < 6) {
     errorMessage.value = 'Mohon lengkapi 6 digit kode OTP.'
     otpStatus.value = 'error'
     setTimeout(() => otpStatus.value = '', 1000)
     return
  }
  
  const result = await verifyOtp(registerForm.value.email, otpCode.value)
  if (result.success) {
    otpStatus.value = 'success'
    showToast('Registrasi dan verifikasi berhasil!', 'success')
    setTimeout(() => {
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
  const result = await resendOtp(registerForm.value.email)
  if (result.success) {
    showToast(result.message, 'success')
    // Kosongkan kotak OTP
    otpDigits.value = ['', '', '', '', '', '']
    // Pindahkan kursor ke kotak pertama
    nextTick(() => {
      otpInputs.value[0]?.focus()
    })
  } else {
    errorMessage.value = result.message
  }
}

const handleGoogleLogin = () => {
  showToast('Fitur Daftar dengan Google akan segera hadir!', 'info')
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

