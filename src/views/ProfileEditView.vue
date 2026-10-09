<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAccount } from '../composables/useUserAccount'
import api from '../services/api'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import ChangeNameUsn from '../components/common/ChangeNameUsn.vue'

const router = useRouter()
const { userProfile, fetchUser } = useUserAccount()

const isSavingProfile = ref(false)
const isSuccess = ref(false)
const profileForm = ref({
  name: '',
  phone: '',
  avatar: null,
  password: ''
})

const previewAvatarUrl = ref('')

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
  if (userProfile.value.avatar) {
    previewAvatarUrl.value = userProfile.value.avatar
  }
})

const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    // Check file type
    const isJpeg = file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')
    if (!isJpeg) {
      alert('Hanya format .jpg dan .jpeg yang diperbolehkan!')
      e.target.value = ''
      return
    }

    // Check file size (Max 1MB)
    if (file.size > 1 * 1024 * 1024) {
      alert('Ukuran file maksimal 1 MB!')
      e.target.value = ''
      return
    }
    
    profileForm.value.avatar = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      previewAvatarUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = async () => {
  try {
    isSavingProfile.value = true
    isSuccess.value = false
    
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('name', profileForm.value.name)
    // Phone cannot be changed, so we don't send it or send it as is
    if (profileForm.value.password) formData.append('password', profileForm.value.password)
    if (profileForm.value.avatar) formData.append('avatar', profileForm.value.avatar)

    const response = await api.post('/user/profile', formData)
    
    userProfile.value.name = profileForm.value.name
    
    if (response.data && response.data.data && response.data.data.avatar_url) {
      userProfile.value.avatar = response.data.data.avatar_url
    }
    
    isSuccess.value = true
    alert('Profil berhasil diperbarui!')
    
    // Optional: go back after short delay
    setTimeout(() => {
      router.back()
    }, 1500)
    
  } catch (err) {
    alert('Gagal memperbarui profil: ' + (err.response?.data?.message || err.message))
  } finally {
    isSavingProfile.value = false
  }
}

const handleUsernameUpdate = (updatedUser) => {
  if (userProfile.value) {
    userProfile.value.username = updatedUser.username
    userProfile.value.tag_id = updatedUser.tag_id
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
          <h2>Pengaturan Profil</h2>
        </div>
        
        <form @submit.prevent="saveProfile" class="pe-form">
          
          <!-- Avatar Upload Area -->
          <div class="pe-avatar-section">
            <div class="pe-avatar-wrapper" :class="{ 'is-success': isSuccess }">
              <img v-if="previewAvatarUrl" :src="previewAvatarUrl" alt="Avatar Preview" class="pe-avatar-img" />
              <div v-else class="pe-avatar-placeholder">
                <i class="fa-solid fa-user"></i>
              </div>
              <div class="pe-avatar-overlay">
                <i class="fa-solid fa-camera"></i>
              </div>
              <input type="file" @change="handleAvatarChange" accept=".jpg,.jpeg" class="pe-file-input-hidden" title="Ganti Foto">
            </div>
            <div class="pe-avatar-info">
              <h4>Ganti Foto Profil</h4>
              <p>Format <strong>.jpg / .jpeg</strong> (Maks. 1MB)</p>
            </div>
          </div>
          
          <hr class="pe-divider" />

          <!-- Name Field -->
          <div class="pe-form-group">
            <label>Nama Lengkap <span class="pe-badge-locked"><i class="fa-solid fa-lock"></i> Terkunci</span></label>
            <div class="pe-input-wrapper is-disabled">
              <i class="fa-solid fa-id-card pe-input-icon"></i>
              <input type="text" :value="profileForm.name" class="pe-input" disabled placeholder="Nama dari SSO">
            </div>
            <small class="pe-help-text">Nama disinkronisasi dari akun pusat dan tidak dapat diubah di sini.</small>
          </div>
          
          <!-- Change Username Component -->
          <ChangeNameUsn @updated="handleUsernameUpdate" />
          
          <!-- Phone Field (Disabled) -->
          <div class="pe-form-group">
            <label>Nomor Telepon <span class="pe-badge-locked"><i class="fa-solid fa-lock"></i> Terkunci</span></label>
            <div class="pe-input-wrapper is-disabled">
              <i class="fa-solid fa-phone pe-input-icon"></i>
              <input type="text" :value="profileForm.phone" class="pe-input" disabled placeholder="Nomor belum diatur">
            </div>
            <small class="pe-help-text">Nomor telepon tidak dapat diubah demi keamanan akun.</small>
          </div>
          
          <!-- Password Field -->
          <div class="pe-form-group">
            <label>Password Baru <span class="pe-badge-optional">Opsional</span></label>
            <div class="pe-input-wrapper">
              <i class="fa-solid fa-key pe-input-icon"></i>
              <input type="password" v-model="profileForm.password" class="pe-input" :class="{ 'is-success': isSuccess && profileForm.password }" placeholder="Biarkan kosong jika tidak ingin mengubah">
            </div>
          </div>
          
          <!-- Submit Button -->
          <div class="pe-actions">
            <button type="submit" class="pe-save-btn" :class="{ 'btn-success': isSuccess }" :disabled="isSavingProfile">
              <i v-if="isSavingProfile" class="fa-solid fa-circle-notch fa-spin"></i>
              <i v-else-if="isSuccess" class="fa-solid fa-check"></i>
              <i v-else class="fa-solid fa-floppy-disk"></i>
              {{ isSavingProfile ? 'Menyimpan...' : isSuccess ? 'Tersimpan!' : 'Simpan Perubahan' }}
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
  padding: 40px 20px;
}

.pe-container {
  width: 100%;
  max-width: 520px;
  position: relative;
  z-index: 10;
}

.pe-card {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.pe-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 35px;
}

.pe-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary, #fff);
  letter-spacing: -0.5px;
}

.pe-back-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary, #fff);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.1rem;
}

.pe-back-btn:hover {
  background: var(--text-primary, #fff);
  color: var(--bg-main, #0f172a);
  transform: translateX(-4px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
}

/* Avatar Section */
.pe-avatar-section {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 30px;
}

.pe-avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.2);
}

.pe-avatar-wrapper.is-success {
  border-color: #10b981;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
}

.pe-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1/1;
  display: block;
}

.pe-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.2);
}

.pe-avatar-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.pe-avatar-wrapper:hover .pe-avatar-overlay {
  opacity: 1;
}

.pe-file-input-hidden {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.pe-avatar-info h4 {
  margin: 0 0 5px 0;
  color: var(--text-primary, #fff);
  font-size: 1.1rem;
}

.pe-avatar-info p {
  margin: 0;
  color: var(--text-muted, #94a3b8);
  font-size: 0.9rem;
}

.pe-divider {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 0 0 25px 0;
}

.pe-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pe-form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pe-form-group label {
  font-size: 0.95rem;
  color: var(--text-sub-hex, #cbd5e1);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pe-badge-locked {
  font-size: 0.75rem;
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  padding: 3px 8px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pe-badge-optional {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-muted, #94a3b8);
  padding: 3px 8px;
  border-radius: 12px;
}

.pe-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.pe-input-icon {
  position: absolute;
  left: 16px;
  color: var(--text-muted, #94a3b8);
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.pe-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary, #fff);
  padding: 14px 16px 14px 45px;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.pe-input::placeholder {
  color: rgba(255, 255, 255, 0.2);
}

.pe-input:focus {
  outline: none;
  border-color: var(--accent-color, #0ea5e9);
  background: rgba(15, 23, 42, 0.6);
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}

.pe-input:focus ~ .pe-input-icon,
.pe-input:not(:placeholder-shown) ~ .pe-input-icon {
  color: var(--accent-color, #0ea5e9);
}

/* Success State for Inputs */
.pe-input.is-success {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}
.pe-input.is-success:focus {
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

/* Disabled State */
.pe-input-wrapper.is-disabled .pe-input {
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
}
.pe-input-wrapper.is-disabled .pe-input-icon {
  color: rgba(255, 255, 255, 0.2);
}

.pe-help-text {
  font-size: 0.85rem;
  color: var(--text-muted, #94a3b8);
  margin-top: -2px;
}

.pe-actions {
  margin-top: 20px;
}

.pe-save-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--accent-color, #0ea5e9), #3b82f6);
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 20px rgba(14, 165, 233, 0.3);
}

.pe-save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px rgba(14, 165, 233, 0.4);
}

.pe-save-btn.btn-success {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
}

.pe-save-btn.btn-success:hover:not(:disabled) {
  box-shadow: 0 15px 25px rgba(16, 185, 129, 0.4);
}

.pe-save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 600px) {
  .pe-card {
    padding: 25px 20px;
  }
  .pe-avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  .pe-header h2 {
    font-size: 1.5rem;
  }
}
</style>
