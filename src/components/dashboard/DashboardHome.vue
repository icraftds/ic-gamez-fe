<template>
  <div class="dash-home-grid">
    <div class="dash-main-col">
      <GreetingCard />
      <ContinueLearning />
    </div>
    <div class="dash-side-col">
      <BadgeCollection />
      <RecentActivity />
    </div>
  </div>
</template>

<script setup>
import GreetingCard from './home/GreetingCard.vue'
import BadgeCollection from './home/BadgeCollection.vue'
import ContinueLearning from './home/ContinueLearning.vue'
import RecentActivity from './home/RecentActivity.vue'
</script>

<style scoped>
.dash-home-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  padding-bottom: 2rem;
}

.dash-main-col, .dash-side-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .dash-home-grid {
    grid-template-columns: 1fr;
  }
}
</style>
