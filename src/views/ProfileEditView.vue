<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAccount } from '../composables/useUserAccount'
import api from '../services/api'
import SimpleBackground from '../components/common/SimpleBackground.vue'

const router = useRouter()
const { userProfile, fetchUser } = useUserAccount()

const isSavingProfile = ref(false)
const profileForm = ref({
  name: '',
  phone: '',
  avatar: null,
  password: ''
})

onMounted(async () => {
  if (!userProfile.value || !userProfile.value.name) {
    await fetchUser()
  }
  profileForm.value = {
    name: userProfile.value.name,
    phone: userProfile.value.phone || '',
    avatar: null,
    password: ''
  }
})

const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2 MB')
      e.target.value = ''
      return
    }
    profileForm.value.avatar = file
  }
}

const saveProfile = async () => {
  try {
    isSavingProfile.value = true
    
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('name', profileForm.value.name)
    if (profileForm.value.phone) formData.append('phone', profileForm.value.phone)
    if (profileForm.value.password) formData.append('password', profileForm.value.password)
    if (profileForm.value.avatar) formData.append('avatar', profileForm.value.avatar)

    const response = await api.post('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    userProfile.value.name = profileForm.value.name
    userProfile.value.phone = profileForm.value.phone
    
    if (response.data && response.data.data && response.data.data.avatar_url) {
      userProfile.value.avatar = response.data.data.avatar_url
    }
    
    alert('Profil berhasil diperbarui!')
    router.back()
  } catch (err) {
    alert('Gagal memperbarui profil: ' + (err.response?.data?.message || err.message))
  } finally {
    isSavingProfile.value = false
  }
}
</script>

<template>
  <div class="profile-edit-view">
    <SimpleBackground />
    
    <div class="pe-container">
      <div class="pe-card">
        <div class="pe-header">
          <button class="pe-back-btn" @click="router.back()" title="Kembali">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <h2>Edit Profil</h2>
        </div>
        
        <form @submit.prevent="saveProfile" class="pe-form">
          <div class="pe-form-group">
            <label>Foto Profil (Maks 2 MB)</label>
            <div class="pe-avatar-preview" v-if="userProfile.avatar && !profileForm.avatar">
              <img :src="userProfile.avatar" alt="Avatar Saat Ini" class="pe-current-avatar" />
            </div>
            <input type="file" @change="handleAvatarChange" accept="image/*" class="pe-input pe-file-input">
          </div>
          
          <div class="pe-form-group">
            <label>Nama Lengkap</label>
            <input type="text" v-model="profileForm.name" class="pe-input" required>
          </div>
          
          <div class="pe-form-group">
            <label>Nomor Telepon</label>
            <input type="text" v-model="profileForm.phone" class="pe-input">
          </div>
          
          <div class="pe-form-group">
            <label>Password Baru (Opsional)</label>
            <input type="password" v-model="profileForm.password" class="pe-input" placeholder="Kosongkan jika tidak ingin diubah">
          </div>
          
          <div class="pe-actions">
            <button type="submit" class="pe-save-btn" :disabled="isSavingProfile">
              {{ isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-edit-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.pe-container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  position: relative;
  z-index: 10;
}

.pe-card {
  background: var(--bg-card, #1e293b);
  border: 1px solid var(--border-color, #334155);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.pe-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--border-color, #334155);
  padding-bottom: 15px;
}

.pe-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary, #fff);
}

.pe-back-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-muted, #94a3b8);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pe-back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary, #fff);
  transform: translateX(-3px);
}

.pe-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pe-form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pe-form-group label {
  font-size: 0.9rem;
  color: var(--text-muted, #94a3b8);
  font-weight: 500;
}

.pe-input {
  background: var(--bg-body, #0f172a);
  border: 1px solid var(--border-color, #334155);
  color: var(--text-primary, #fff);
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.pe-input:focus {
  outline: none;
  border-color: var(--accent-color, #0ea5e9);
}

.pe-file-input {
  padding: 9px;
  font-size: 0.9rem;
}

.pe-avatar-preview {
  margin-bottom: 10px;
}

.pe-current-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color, #334155);
}

.pe-actions {
  margin-top: 10px;
}

.pe-save-btn {
  width: 100%;
  background: var(--accent-color, #0ea5e9);
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pe-save-btn:hover:not(:disabled) {
  background: #0284c7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.pe-save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
