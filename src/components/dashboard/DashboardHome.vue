<template>
  <div class="dash-home-grid">
    <div class="dash-main-col">
      <GreetingCard />
      <ContinueLearning />
    </div>
    <div class="dash-side-col">
      <BadgeCollection />

      <!-- Expert Cheatsheet Vault Shortcut Widget -->
      <router-link to="/cheatsheet" class="dash-vault-card">
        <div class="dash-vault-badge">
          <i class="fa-solid fa-crown"></i>
          <span>Expert Vault</span>
        </div>
        <div class="dash-vault-content">
          <h4>24 Cheatsheets & Test Prep</h4>
          <p>Kumpulan panduan teknis karir, formula praktis, dan 305+ bank soal ujian rekrutmen kerja.</p>
        </div>
        <div class="dash-vault-action">
          <span>Akses Cheatsheet</span>
          <i class="fa-solid fa-arrow-right"></i>
        </div>
      </router-link>

      <RecentActivity />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserAccount } from '../../composables/useUserAccount'
import GreetingCard from './home/GreetingCard.vue'
import BadgeCollection from './home/BadgeCollection.vue'
import ContinueLearning from './home/ContinueLearning.vue'
import RecentActivity from './home/RecentActivity.vue'

const { userProfile } = useUserAccount()
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

.dash-vault-card {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(124, 58, 237, 0.12) 100%);
  border: 1.5px solid rgba(245, 158, 11, 0.35);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
  color: #fff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.dash-vault-card:hover {
  transform: translateY(-3px);
  border-color: #fbbf24;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.25);
}

.dash-vault-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.45);
  color: #fbbf24;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dash-vault-content h4 {
  font-size: 1rem;
  font-weight: 800;
  margin: 0 0 4px 0;
  color: #f1f5f9;
}

.dash-vault-content p {
  font-size: 0.78rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}

.dash-vault-action {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #fbbf24;
  margin-top: 2px;
}

.dash-vault-card:hover .dash-vault-action i {
  transform: translateX(4px);
  transition: transform 0.2s ease;
}

@media (max-width: 1024px) {
  .dash-home-grid {
    grid-template-columns: 1fr;
  }
}
</style>
