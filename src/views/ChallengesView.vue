<template>
  <div class="challenges-view">
    <SimpleBackground />
    <HomeNavbar />

    <div class="container layout">
      <!-- Sidebar Kanan (Status Langganan & Progress) -->
      <ChallengesSidebar />

      <!-- Area Utama (Daftar Tantangan) -->
      <ChallengesList @require-premium="showModal = true" @require-auth="showAuthModal = true" />
    </div>

    <!-- Premium / Energy Modal -->
    <PremiumModal v-model="showModal" />
    <AuthRequiredModal :isOpen="showAuthModal" @close="showAuthModal = false" @login="$router.push('/login')" @register="$router.push('/register')" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SimpleBackground from "../components/common/SimpleBackground.vue";
import HomeNavbar from "../components/home/HomeNavbar.vue";
import PremiumModal from "../components/common/PremiumModal.vue";
import AuthRequiredModal from "../components/common/AuthRequiredModal.vue";
import ChallengesSidebar from "../components/challenges/ChallengesSidebar.vue";
import ChallengesList from "../components/challenges/ChallengesList.vue";
import { useLearningPaths } from "../composables/useLearningPaths";

const showModal = ref(false);
const showAuthModal = ref(false);
const { paths, fetchAllPathsDetails } = useLearningPaths();

onMounted(() => {
  fetchAllPathsDetails();
});
</script>

<style scoped src="../assets/css/views/ChallengesView.css"></style>
