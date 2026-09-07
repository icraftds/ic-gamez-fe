<template>
  <section class="hero reveal">
    <template v-if="!isLoggedIn">
      <h1>
        IC Game-Z <br /><span class="gradient-text">Level up your Skill!</span>
      </h1>
      <p>
        Ready to Explore?. Selesaikan tantangan algoritma, asah logika Anda,
        dan jadilah yang terbaik di papan peringkat global.
      </p>
      <div class="hero-actions">
        <a href="#challenges" class="btn-start btn-hero">
          Lihat Tantangan
          <i class="fa-solid fa-arrow-down bounce-icon"></i>
        </a>
        <a href="#leaderboard" class="btn-start btn-gold btn-hero">
          Lihat Top Global
          <i class="fa-solid fa-trophy trophy-icon"></i>
        </a>
      </div>
    </template>
    
    <template v-else>
      <div class="welcome-row">
        <img :src="userProfile.avatar" alt="Avatar" class="welcome-avatar">
        <div class="welcome-text">
          <h1 class="welcome-heading">
            Selamat datang kembali,<br/><span class="gradient-text">{{ userProfile.name }}!</span>
          </h1>
          <p class="welcome-sub">Lanjutkan perjalanan belajarmu hari ini.</p>
        </div>
      </div>
      
      <div class="hero-actions hero-actions-logged">
        <router-link to="/learning" class="btn-start btn-hero">
          Lanjutkan Belajar
          <i class="fa-solid fa-arrow-right icon-right"></i>
        </router-link>
        <router-link to="/dashboard" class="btn-start btn-gold btn-hero">
          Dashboard Saya
        </router-link>
      </div>
    </template>
  </section>
</template>

<script setup>
import { useUserAccount } from '../../composables/useUserAccount'
const { isLoggedIn, userProfile } = useUserAccount()
</script>

<style scoped>
.btn-hero {
  padding: 16px 36px;
  font-size: 1.15rem;
  box-shadow: 0 0 30px rgba(147, 51, 234, 0.6);
  text-decoration: none;
}

.btn-gold.btn-hero {
  box-shadow: 0 0 30px rgba(147, 51, 234, 0.3);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.bounce-icon {
  animation: bounce-arrow 2s infinite;
  margin-left: 5px;
}

.trophy-icon {
  margin-left: 8px;
  color: #facc15;
}

.icon-right {
  margin-left: 5px;
}

.welcome-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.welcome-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid var(--primary);
}

.welcome-text {
  text-align: left;
}

.welcome-heading {
  font-size: 2.5rem;
  margin-bottom: 5px;
}

.welcome-sub {
  margin: 0;
  color: #94a3b8;
  font-size: 1.1rem;
}

.hero-actions-logged {
  margin-top: 30px;
}
</style>
