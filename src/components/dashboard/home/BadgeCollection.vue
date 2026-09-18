<template>
  <div class="badge-collection-wrapper">
    <div class="section-header">
      <h2 class="section-title">Pencapaian & Medali</h2>
      <router-link to="/dashboard/medali" class="link-action">Jelajahi Semua</router-link>
    </div>
    <div class="section-card">
      <div class="badges-empty" v-if="earnedBadges.length === 0">
        <i class="fa-solid fa-medal" style="font-size: 2rem; color: #475569; margin-bottom: 10px;"></i>
        <p><strong>Belum Ada Pencapaian</strong></p>
        <p class="sub-text">Kerjakan tantangan pertama kamu untuk mendapatkan medali eksklusif.</p>
        <router-link to="/challenges" class="btn-accent">Lihat Daftar Tantangan</router-link>
      </div>
      <div class="badges-grid" v-else>
        <div class="badge-item" v-for="badge in earnedBadges" :key="badge.id">
          <i :class="badge.icon" class="badge-icon"></i>
          <span>{{ badge.name }}</span>
        </div>
      </div>
      <div class="level-progress">
        <span>Target Medali Berikutnya: <strong>Level {{ userProfile.level + 1 }}: Serius Mode On</strong></span>
        <span>{{ userProfile.xp }}/{{ userProfile.nextLevelXp }}</span>
      </div>
      <div class="xp-bar-bg"><div class="xp-bar-fill" :style="{ width: xpPercentage + '%' }"></div></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserAccount } from '../../../composables/useUserAccount'

const { userProfile } = useUserAccount()

const xpPercentage = computed(() => Math.round((userProfile.value.xp / userProfile.value.nextLevelXp) * 100))
const earnedBadges = computed(() => []) // Empty for now (mock)
</script>

<style scoped src="../../../assets/css/components/dashboard/home/BadgeCollection.css"></style>
