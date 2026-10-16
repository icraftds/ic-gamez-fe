<template>
  <div class="leaderboard-view">
    <SimpleBackground />
    
    <div class="leaderboard-container">
      <LeaderboardTable :is-full-view="true" />
    </div>
  </div>
</template>

<script setup>
import SimpleBackground from '../components/common/SimpleBackground.vue'
import LeaderboardTable from '../components/home/LeaderboardTable.vue'
</script>

<style scoped src="../assets/css/views/LeaderboardView.css"></style>
