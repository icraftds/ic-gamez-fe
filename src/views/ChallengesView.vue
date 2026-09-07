<template>
  <div class="challenges-view">
    <BackgroundEffects :show-orb3="true" />
    <HomeNavbar />

    <div class="container layout">
      <!-- Sidebar Kanan (Status Langganan & Progress) -->
      <ChallengesSidebar />

      <!-- Area Utama (Daftar Tantangan) -->
      <ChallengesList @require-premium="showModal = true" />
    </div>

    <!-- Premium / Energy Modal -->
    <PremiumModal :isOpen="showModal" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import BackgroundEffects from "../components/common/BackgroundEffects.vue";
import HomeNavbar from "../components/home/HomeNavbar.vue";
import PremiumModal from "../components/common/PremiumModal.vue";
import ChallengesSidebar from "../components/challenges/ChallengesSidebar.vue";
import ChallengesList from "../components/challenges/ChallengesList.vue";

const showModal = ref(false);
</script>

<style scoped>
.challenges-view {
  min-height: 100vh;
  padding-bottom: 50px;
}

.layout {
  display: flex;
  gap: 30px;
  margin-top: 40px;
  flex-direction: row-reverse;
}
</style>
