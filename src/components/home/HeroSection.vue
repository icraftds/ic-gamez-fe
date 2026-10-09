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
        <div class="welcome-avatar">
          <div class="welcome-avatar-wrapper">
            <CyberBorder
              :tierId="borderId"
              :accountBadge="currentBadgeStatus"
              :avatarUrl="userProfile.avatar"
            />
          </div>
        </div>
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
import { computed } from 'vue';
import { useUserAccount } from "../../composables/useUserAccount";
import CyberBorder from '../ui/CyberBorder.vue';

const { isLoggedIn, userProfile, currentPlan, isPremiumUser, activeBorderId } = useUserAccount();

const currentBadgeStatus = computed(() => {
  if (currentPlan.value === 'expert') return 'EXPERT';
  if (currentPlan.value === 'pro' || isPremiumUser.value) return 'PRO';
  return 'FREE';
});

const borderId = computed(() => {
  if (activeBorderId.value) return activeBorderId.value;
  if (currentPlan.value === 'expert') return 'D_EXPERT';
  if (currentPlan.value === 'pro' || isPremiumUser.value) return 'D_PRO';
  return 'D_FREE';
});
</script>

<style scoped src="../../assets/css/components/home/HeroSection.css"></style>
