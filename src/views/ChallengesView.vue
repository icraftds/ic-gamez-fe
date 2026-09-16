<template>
  <div class="challenges-view">
    <SimpleBackground />
    <HomeNavbar />

    <div class="container layout">
      <!-- Sidebar Kanan (Status Langganan & Progress) -->
      <ChallengesSidebar />

      <!-- Area Utama (Daftar Tantangan) -->
      <ChallengesList @require-premium="showModal = true" />
    </div>

    <!-- Premium / Energy Modal -->
    <PremiumModal v-model="showModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SimpleBackground from "../components/common/SimpleBackground.vue";
import HomeNavbar from "../components/home/HomeNavbar.vue";
import PremiumModal from "../components/common/PremiumModal.vue";
import ChallengesSidebar from "../components/challenges/ChallengesSidebar.vue";
import ChallengesList from "../components/challenges/ChallengesList.vue";
import { useLearningPaths } from "../composables/useLearningPaths";

const showModal = ref(false);
const { paths, fetchAllPathsDetails } = useLearningPaths();

onMounted(() => {
  fetchAllPathsDetails();
});
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

@media (max-width: 1024px) {
  .layout { gap: 20px; }
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
  }
}
</style>
