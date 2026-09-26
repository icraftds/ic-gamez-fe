<template>
  <aside class="sidebar">
    <div class="card sub-status">
      <h3>Status Akun</h3>
      <div class="status-row">
        <span>Paket</span>
        <span class="badge" :class="isPremiumUser ? 'premium' : 'free'">{{
          subscriptionStatus
        }}</span>
      </div>

      <div v-if="!isPremiumUser" class="upgrade-box">
        <p><strong>Upgrade ke Premium untuk:</strong></p>
        <ul>
          <li>
            <i class="fa-solid fa-arrow-right"></i> Akses semua tantangan
            premium
          </li>
          <li>
            <i class="fa-solid fa-arrow-right"></i> Akses materi lanjutan
          </li>
          <li>
            <i class="fa-solid fa-arrow-right"></i> Tanpa batas kredit
            harian
          </li>
        </ul>
        <button class="btn-upgrade" @click="upgradeToPremium">
          Upgrade Ke Premium
        </button>
      </div>
    </div>

    <div class="card progress-card">
      <h3>Progress Kamu</h3>
      <div class="progress-circle">
        <svg viewBox="0 0 36 36" class="circular-chart">
          <path
            class="circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="circle"
            :stroke-dasharray="`${completionPercentage}, 100`"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" class="percentage">
            {{ completionPercentage }}%
          </text>
        </svg>
      </div>
      <p class="progress-text">
        {{ completedCount }} / {{ allChallenges.length }} selesai
      </p>

      <div class="progress-stats">
        <div class="stat-row">
          <span class="diff-mudah">Mudah</span>
          <span>{{ completedMudah }} / {{ totalMudah }}</span>
        </div>
        <div class="stat-row">
          <span class="diff-sedang">Sedang</span>
          <span>{{ completedSedang }} / {{ totalSedang }}</span>
        </div>
        <div class="stat-row">
          <span class="diff-sulit">Sulit</span>
          <span>{{ completedSulit }} / {{ totalSulit }}</span>
        </div>
      </div>
    </div>

    <div class="card history-card">
      <h3>Riwayat Event</h3>
      <div class="history-stats">
        <div class="stat-row">
          <span><i class="fa-solid fa-bolt" style="color: #f59e0b; width: 20px;"></i> Harian</span>
          <span class="count" style="color: white; font-weight: 600;">{{ userStats?.events?.daily || 0 }}x</span>
        </div>
        <div class="stat-row">
          <span><i class="fa-solid fa-calendar-week" style="color: #3b82f6; width: 20px;"></i> Mingguan</span>
          <span class="count" style="color: white; font-weight: 600;">{{ userStats?.events?.weekly || 0 }}x</span>
        </div>
        <div class="stat-row">
          <span><i class="fa-solid fa-trophy" style="color: #10b981; width: 20px;"></i> Tahunan</span>
          <span class="count" style="color: white; font-weight: 600;">{{ userStats?.events?.annual || 0 }}x</span>
        </div>
      </div>
    </div>

    <div class="card tags-card">
      <h3>Tag Populer</h3>
      <div class="tags-container">
        <span class="tag">SQL Dasar</span>
        <span class="tag">Filtering</span>
        <span class="tag">HTML</span>
        <span class="tag">Algoritma</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserAccount } from "../../composables/useUserAccount.js";
import { useChallengesStats } from "../../composables/useChallengesStats.js";
import { useLearningPaths } from "../../composables/useLearningPaths.js";

const { isPremiumUser, subscriptionStatus, upgradeToPremium, userStats, fetchUserStats } = useUserAccount();
const {
  allChallenges,
  completedCount,
  completionPercentage,
  totalMudah,
  completedMudah,
  totalSedang,
  completedSedang,
  totalSulit,
  completedSulit
} = useChallengesStats();

const { fetchAllPathsDetails } = useLearningPaths();

onMounted(async () => {
  fetchUserStats();
  await fetchAllPathsDetails();
});
</script>

<style scoped src="../../assets/css/components/challenges/ChallengesSidebar.css"></style>

