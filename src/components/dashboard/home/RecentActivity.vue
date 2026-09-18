<template>
  <div class="recent-activity-wrapper">
    <h2 class="section-title">Jejak Aktivitasmu</h2>
    <div class="section-card">
      <div class="activity-empty" v-if="recentActivity.length === 0">
        <i class="fa-solid fa-bolt" style="font-size: 2.5rem; color: #475569; margin-bottom: 15px;"></i>
        <p><strong>Belum Ada Riwayat Aktivitas</strong></p>
        <p class="sub-text">Aktivitas belajarmu akan tercatat secara otomatis di sini.</p>
        <button @click="$router.push('/learning')" class="btn-accent">Mulai Sesi Belajar Pertamamu</button>
      </div>
      <div class="activity-list" v-else>
        <div class="activity-item" v-for="(act, i) in recentActivity" :key="i">
          <div class="act-icon" :class="act.type"><i :class="act.icon"></i></div>
          <div class="act-detail">
            <h4>{{ act.title }}</h4>
            <p>{{ act.category }} <span v-if="act.xpGained" class="xp-text">• +{{ act.xpGained }} XP</span></p>
          </div>
          <span class="act-time">{{ act.timeAgo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useDashboardStats } from '../../../composables/useDashboardStats'

const { statsData, fetchStats } = useDashboardStats()

onMounted(() => {
  if (!statsData.value) {
    fetchStats()
  }
})

const recentActivity = computed(() => {
  return statsData.value?.recent_activities || []
})
</script>

<style scoped src="../../../assets/css/components/dashboard/home/RecentActivity.css"></style>
