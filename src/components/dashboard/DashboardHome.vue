<template>
  <div class="dash-home">
    <GreetingCard />
    <BadgeCollection />
    <ContinueLearning />
    <RecentActivity />
  </div>
</template>

<script setup>
import GreetingCard from './home/GreetingCard.vue'
import BadgeCollection from './home/BadgeCollection.vue'
import ContinueLearning from './home/ContinueLearning.vue'
import RecentActivity from './home/RecentActivity.vue'
</script>

<style scoped>
/* Scoped styles are now encapsulated within individual sub-components */
</style>
