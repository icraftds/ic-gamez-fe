<template>
  <div class="section-card">
    <h2>Aktivitas Terbaru</h2>
    <div class="activity-empty" v-if="recentActivity.length === 0">
      <i class="fa-solid fa-bolt" style="font-size: 2.5rem; color: #475569; margin-bottom: 15px;"></i>
      <p><strong>Belum ada aktivitas</strong></p>
      <p class="sub-text">Latihan pertamamu bakal muncul di sini begitu kamu selesaikan.</p>
      <button @click="$router.push('/learning')" class="btn-accent">Mulai Latihan Pertama</button>
    </div>
    <div class="activity-list" v-else>
      <div class="activity-item" v-for="(act, i) in recentActivity" :key="i">
        <div class="act-icon" :class="act.type"><i :class="act.icon"></i></div>
        <div class="act-detail">
          <h4>{{ act.title }}</h4>
          <p>{{ act.category }} • {{ act.xpGained ? '+' + act.xpGained + ' XP' : '' }}</p>
        </div>
        <span class="act-time">{{ act.timeAgo }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const recentActivity = computed(() => []) // Empty for now (mock)
</script>

<style scoped src="../../../assets/css/components/dashboard/home/RecentActivity.css"></style>
