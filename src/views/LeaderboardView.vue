<template>
  <div class="leaderboard-view">
    <BackgroundEffects :show-orb3="true" />
    <HomeNavbar />

    <div class="container" style="margin-top: 40px">
      <LeaderboardTable :is-full-view="true" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'
import LeaderboardTable from '../components/home/LeaderboardTable.vue'

onMounted(() => {
  // Trigger reveal animation instantly for standalone page
  setTimeout(() => {
    const reveals = document.querySelectorAll('.reveal')
    reveals.forEach((el) => el.classList.add('active'))
  }, 100)
})
</script>

<style scoped>
.leaderboard-view {
  min-height: 100vh;
  padding-bottom: 80px;
}
</style>
