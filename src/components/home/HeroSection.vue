<template>
  <section class="hero reveal">
    <template v-if="!isLoggedIn">
      <h1>
        IC Game-Z <br /><span class="gradient-text">Level up your Skill!</span>
      </h1>
      <p>
        Ready to Explore?. Selesaikan tantangan algoritma, asah logika Anda, dan
        jadilah yang terbaik di papan peringkat global.
      </p>
      <div class="hero-actions">
        <router-link to="/challenges" class="btn-start btn-hero">
          Lihat Tantangan
          <i class="fa-solid fa-arrow-right bounce-icon"></i>
        </router-link>
        <router-link to="/leaderboard" class="btn-start btn-gold btn-hero">
          Lihat Top Global
          <i class="fa-solid fa-trophy trophy-icon"></i>
        </router-link>
      </div>
    </template>

    <template v-else>
      <div class="welcome-row">
        <img :src="userProfile.avatar" alt="Avatar" class="welcome-avatar" />
        <div class="welcome-text">
          <h1 class="welcome-heading">
            Selamat datang kembali,<br /><span class="gradient-text"
              >{{ userProfile.name }}!</span
            >
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
import { useUserAccount } from "../../composables/useUserAccount";
const { isLoggedIn, userProfile } = useUserAccount();
</script>

<style scoped src="../../assets/css/components/home/HeroSection.css"></style>
