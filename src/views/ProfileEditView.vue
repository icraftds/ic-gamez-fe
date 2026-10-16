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
<style scoped src="../assets/css/views/ProfileEditView.css"></style>

