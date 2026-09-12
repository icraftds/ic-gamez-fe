<template>
  <Teleport to="body">
    <div v-if="modelValue" class="auth-modal-overlay" @click.self="closeModal">
      <div class="auth-modal-container">
        <button class="btn-close" @click="closeModal">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="auth-modal-header">
          <h2 class="gradient-text">IC Game-Z</h2>
        </div>

        <div class="auth-tabs">
          <div 
            class="auth-tab" 
            :class="{ active: activeTab === 'login' }"
            @click="activeTab = 'login'"
          >
            Masuk
          </div>
          <div 
            class="auth-tab" 
            :class="{ active: activeTab === 'register' }"
            @click="activeTab = 'register'"
          >
            Daftar
          </div>
        </div>

        <div class="auth-modal-body">
          <!-- Error Message -->
          <div v-if="errorMessage" class="auth-error">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Login Form -->
          <form v-if="activeTab === 'login'" @submit.prevent="handleLogin">
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

            <button type="submit" class="btn-submit" :disabled="isLoading">
              <span v-if="!isLoading">Masuk ke Akun</span>
              <div v-else class="spinner"></div>
            </button>
          </form>

          <!-- Register Form -->
          <form v-else @submit.prevent="handleRegister">
            <div class="form-group">
              <label>Nama Lengkap</label>
              <div class="input-wrapper">
                <input type="text" v-model="registerForm.name" placeholder="John Doe" required :disabled="isLoading" />
                <i class="fa-regular fa-user"></i>
              </div>
              <span v-if="validationErrors.name" class="error-text text-danger" style="font-size: 0.8rem; margin-top: 5px; display: block;">{{ validationErrors.name[0] }}</span>
            </div>

            <div class="form-group">
              <label>Email</label>
              <div class="input-wrapper">
                <input type="email" v-model="registerForm.email" placeholder="john@example.com" required :disabled="isLoading" />
                <i class="fa-regular fa-envelope"></i>
              </div>
              <span v-if="validationErrors.email" class="error-text text-danger" style="font-size: 0.8rem; margin-top: 5px; display: block;">{{ validationErrors.email[0] }}</span>
            </div>
            
            <div class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <input type="password" v-model="registerForm.password" placeholder="Minimal 8 karakter" required minlength="8" :disabled="isLoading" />
                <i class="fa-solid fa-lock"></i>
              </div>
              <span v-if="validationErrors.password" class="error-text text-danger" style="font-size: 0.8rem; margin-top: 5px; display: block;">{{ validationErrors.password[0] }}</span>
            </div>

            <button type="submit" class="btn-submit" :disabled="isLoading">
              <span v-if="!isLoading">Buat Akun Baru</span>
              <div v-else class="spinner"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserAccount } from '../../composables/useUserAccount'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  defaultTab: {
    type: String,
    default: 'login' // 'login' or 'register'
  }
})

const emit = defineEmits(['update:modelValue'])

const { login, register, isLoading } = useUserAccount()

const activeTab = ref(props.defaultTab)
const errorMessage = ref('')
const validationErrors = ref({})

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  name: '',
  email: '',
  password: ''
})

// Watchers to reset errors on tab change
watch(activeTab, () => {
  errorMessage.value = ''
  validationErrors.value = {}
})

// Update local tab when prop changes
watch(() => props.defaultTab, (newVal) => {
  activeTab.value = newVal
})

const closeModal = () => {
  emit('update:modelValue', false)
  errorMessage.value = ''
  validationErrors.value = {}
}

const handleLogin = async () => {
  errorMessage.value = ''
  validationErrors.value = {}
  
  const result = await login(loginForm.value.email, loginForm.value.password)
  if (result.success) {
    closeModal()
  } else {
    errorMessage.value = result.message
  }
}

const handleRegister = async () => {
  errorMessage.value = ''
  validationErrors.value = {}
  
  const result = await register(registerForm.value.name, registerForm.value.email, registerForm.value.password)
  if (result.success) {
    closeModal()
  } else {
    errorMessage.value = result.message
    if (result.errors) {
      validationErrors.value = result.errors
    }
  }
}
</script>

<style src="../../assets/css/components/AuthModal.css" scoped></style>
