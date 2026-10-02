<template>
  <div class="auto-login-container">
    <div class="loader-content">
      <div class="spinner-large"></div>
      <h2>Autentikasi iC-Market...</h2>
      <p>Mohon tunggu sebentar, kami sedang menghubungkan akun Anda.</p>
    </div>
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
  background-color: var(--bg);
  color: var(--text-light);
  text-align: center;
}

.loader-content {
  background: var(--bg-alt);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}
p {
  color: var(--text-muted);
  margin: 0;
}
</style>
