<template>
  <div class="pe-form-group" style="margin-bottom: 20px;">
    <label>Username</label>
    <div style="display: flex; gap: 10px;">
      <div class="pe-input-wrapper" style="flex: 1; position: relative; display: flex; align-items: center;">
        <i class="fa-solid fa-at pe-input-icon" style="position: absolute; left: 16px; color: #94a3b8; font-size: 1.1rem;"></i>
        <input 
          v-model="newUsername" 
          @input="formatUsername"
          type="text" 
          placeholder="Masukkan username baru" 
          class="pe-input" 
          style="width: 100%; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 14px 16px 14px 45px; border-radius: 12px; font-size: 1rem; box-sizing: border-box;"
        />
      </div>
      <div class="pe-input-wrapper is-disabled" style="width: 90px;">
        <input 
          type="text" 
          :value="'#' + (userProfile.tag_id || '0000')" 
          disabled 
          class="pe-input" 
          style="width: 100%; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.4); padding: 14px 0; border-radius: 12px; font-size: 1rem; text-align: center; box-sizing: border-box;"
        />
      </div>
    </div>
    
    <button @click.prevent="handleChange" :disabled="isButtonDisabled" class="btn-change" style="margin-top: 10px; background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.3); color: #0ea5e9; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s; width: 100%;">
      {{ buttonText }}
    </button>
    
    <p v-if="errorMsg" class="error-msg" style="color: #ef4444; margin: 5px 0 0 0; font-size: 0.85rem;">{{ errorMsg }}</p>
    <p v-if="successMsg" class="success-msg" style="color: #10b981; margin: 5px 0 0 0; font-size: 0.85rem;">{{ successMsg }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import api from '../../services/api'
import { useUserAccount } from '../../composables/useUserAccount'

const { userProfile } = useUserAccount()
const newUsername = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const timeRemaining = ref(0)
let timer = null

const emit = defineEmits(['updated'])

const calculateTimeRemaining = () => {
  if (!userProfile.value || !userProfile.value.last_username_change_at) {
    timeRemaining.value = 0
    return
  }
  
  const lastChange = new Date(userProfile.value.last_username_change_at).getTime()
  // Waktu sekarang dalam UTC/lokal (pastikan konversi benar jika last_change dari backend)
  // Backend menyimpan waktu dalam UTC, jadi kita gunakan Date.parse yang otomatis menyesuaikan jika format ISO.
  const now = Date.now()
  const diff = now - lastChange
  const cooldown = 60 * 1000 // 1 menit (60000 ms)
  
  if (diff < cooldown) {
    timeRemaining.value = Math.ceil((cooldown - diff) / 1000)
  } else {
    timeRemaining.value = 0
  }
}

onMounted(() => {
  if (userProfile.value && userProfile.value.username) {
    newUsername.value = userProfile.value.username
  }
  
  calculateTimeRemaining()
  timer = setInterval(() => {
    if (timeRemaining.value > 0) {
      calculateTimeRemaining()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const formatUsername = (event) => {
  // Hanya ambil alphanumeric (huruf dan angka), hapus spasi dan karakter spesial
  newUsername.value = event.target.value.replace(/[^a-zA-Z0-9]/g, '')
}

const buttonText = computed(() => {
  if (loading.value) return 'Memproses...'
  if (timeRemaining.value > 0) {
    return `Tunggu (${timeRemaining.value}s)`
  }
  return 'Ganti Username'
})

const isButtonDisabled = computed(() => {
  return loading.value || timeRemaining.value > 0
})

const handleChange = async () => {
  if (!newUsername.value || isButtonDisabled.value) return
  if (newUsername.value === userProfile.value.username) {
    errorMsg.value = 'Username masih sama.'
    return
  }
  
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  
  try {
    const res = await api.post('/user/change-username', { 
      username: newUsername.value 
    })
    successMsg.value = res.data.message
    if (res.data.data) {
      // update local user state
      userProfile.value.username = res.data.data.username
      userProfile.value.tag_id = res.data.data.tag_id
      userProfile.value.last_username_change_at = res.data.data.last_username_change_at
      
      calculateTimeRemaining()
      
      emit('updated', res.data.data)
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.pe-form-group label {
  font-size: 0.95rem;
  color: #cbd5e1;
  font-weight: 600;
  display: block;
  margin-bottom: 10px;
}
.pe-input:focus {
  outline: none;
  border-color: #0ea5e9 !important;
  background: rgba(15, 23, 42, 0.6) !important;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}
.btn-change:hover:not(:disabled) {
  background: rgba(14, 165, 233, 0.2) !important;
  transform: translateY(-2px);
}
.btn-change:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}
</style>
