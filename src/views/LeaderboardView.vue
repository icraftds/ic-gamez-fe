<template>
  <div class="leaderboard-view">
    <BackgroundEffects :show-orb3="true" />
    <HomeNavbar />

    <div class="container" style="margin-top: 40px">
      <LeaderboardTable />
    </div>
  </div>
</template>

<script setup>
import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'
import LeaderboardTable from '../components/home/LeaderboardTable.vue'
</script>

<style scoped>
.leaderboard-view {
  min-height: 100vh;
  padding-bottom: 80px;
}
</style>
