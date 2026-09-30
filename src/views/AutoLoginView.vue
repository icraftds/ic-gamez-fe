<template>
  <div class="auto-login-container">
    <div class="spinner">
      <i class="fa-solid fa-circle-notch fa-spin"></i>
    </div>
    <h2>Authenticating...</h2>
    <p>Please wait while we log you in securely.</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserAccount } from '../composables/useUserAccount'

const route = useRoute()
const router = useRouter()
const { fetchUser } = useUserAccount()

onMounted(async () => {
  const token = route.query.token
  
  if (token) {
    // 1. Simpan token ke localStorage
    localStorage.setItem('auth_token', token)
    
    // 2. Fetch data user terbaru agar status login di state Vue terupdate
    try {
      await fetchUser()
      // 3. Arahkan ke dashboard
      sessionStorage.setItem('just_logged_in', 'true')
      router.replace('/dashboard')
    } catch (e) {
      console.error('Auto login failed to fetch user', e)
      router.replace('/login?error=auto_login_failed')
    }
  } else {
    // Jika tidak ada token
    router.replace('/login')
  }
})
</script>

<style scoped>
.auto-login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #0f172a;
  color: #f8fafc;
  text-align: center;
}
.spinner {
  font-size: 3rem;
  color: #3b82f6;
  margin-bottom: 20px;
}
h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}
p {
  color: #94a3b8;
}
</style>
