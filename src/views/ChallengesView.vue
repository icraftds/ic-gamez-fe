<template>
  <div class="challenges-view">
    <SimpleBackground />
    <HomeNavbar />

    <div class="container layout">
      <!-- Sidebar Kiri (Status Langganan & Progress) -->
      <ChallengesSidebar />

      <!-- Area Utama -->
      <div class="main-content">
        <!-- Tab Navigation -->
        <div class="tabs-nav">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="tab-btn" 
            :class="{ active: activeTab === tab.id }"
            @click="setActiveTab(tab.id)"
          >
            <i :class="tab.icon"></i> {{ tab.label }}
          </button>
        </div>

        <!-- Konten Tab Dinamis -->
        <div class="tab-content-wrapper">
          <component 
            :is="currentTabComponent" 
            @require-premium="showModal = true" 
            @require-auth="showAuthModal = true" 
          />
        </div>
      </div>
    </div>

    <!-- Premium / Energy Modal -->
    <PremiumModal v-model="showModal" />
    <AuthRequiredModal :isOpen="showAuthModal" @close="showAuthModal = false" @login="$router.push('/login')" @register="$router.push('/register')" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import SimpleBackground from "../components/common/SimpleBackground.vue";
import HomeNavbar from "../components/home/HomeNavbar.vue";
import PremiumModal from "../components/common/PremiumModal.vue";
import AuthRequiredModal from "../components/common/AuthRequiredModal.vue";
import ChallengesSidebar from "../components/challenges/ChallengesSidebar.vue";

// Tabs
import ChallengeModul from "../components/challenges/tabs/ChallengeModul.vue";
import ChallengeDaily from "../components/challenges/tabs/ChallengeDaily.vue";
import ChallengeWeekly from "../components/challenges/tabs/ChallengeWeekly.vue";
import ChallengeAnnual from "../components/challenges/tabs/ChallengeAnnual.vue";

import { useLearningPaths } from "../composables/useLearningPaths";

const route = useRoute();
const router = useRouter();

const showModal = ref(false);
const showAuthModal = ref(false);
const { paths, fetchAllPathsDetails } = useLearningPaths();

const tabs = [
  { id: 'modul', label: 'Modul', icon: 'fa-solid fa-book' },
  { id: 'harian', label: 'Harian', icon: 'fa-solid fa-bolt' },
  { id: 'mingguan', label: 'Mingguan', icon: 'fa-solid fa-calendar-week' },
  { id: 'tahunan', label: 'Tahunan', icon: 'fa-solid fa-trophy' },
];

const activeTab = ref(route.query.tab || 'modul');

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
  router.replace({ query: { ...route.query, tab: tabId } });
};

watch(() => route.query.tab, (newTab) => {
  if (newTab && newTab !== activeTab.value) {
    activeTab.value = newTab;
  }
});

const currentTabComponent = computed(() => {
  switch (activeTab.value) {
    case 'harian': return ChallengeDaily;
    case 'mingguan': return ChallengeWeekly;
    case 'tahunan': return ChallengeAnnual;
    case 'modul':
    default: return ChallengeModul;
  }
});

onMounted(() => {
  fetchAllPathsDetails();
});
</script>

<style scoped src="../assets/css/views/ChallengesView.css"></style>
