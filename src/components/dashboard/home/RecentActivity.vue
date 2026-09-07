<template>
  <div class="section-card">
    <h2>Aktivitas Terbaru</h2>
    <div class="activity-empty" v-if="recentActivity.length === 0">
      <i class="fa-solid fa-bolt" style="font-size: 2.5rem; color: #475569; margin-bottom: 15px;"></i>
      <p><strong>Belum ada aktivitas</strong></p>
      <p class="sub-text">Latihan pertamamu bakal muncul di sini begitu kamu selesaikan.</p>
      <router-link to="/learning" class="btn-accent">Mulai Latihan Pertama</router-link>
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

<style scoped>
.section-card {
  background: rgba(15, 10, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  transform-style: preserve-3d;
}

.section-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-5px);
  box-shadow: -10px 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(147, 51, 234, 0.2);
  border-color: rgba(147, 51, 234, 0.3);
}

.section-card h2 { font-size: 1.3rem; margin-bottom: 20px; }

.activity-empty { text-align: center; padding: 40px 20px; color: #94a3b8; }
.activity-empty p { margin: 5px 0; }
.sub-text { color: #64748b; font-size: 0.9rem; }
.btn-accent {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 24px;
  background: #22d3ee;
  color: #0f0a1e;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s;
}
.btn-accent:hover { transform: translateY(-2px); }

.activity-list { display: flex; flex-direction: column; gap: 12px; }
.activity-item { 
  display: flex; 
  align-items: center; 
  gap: 15px; 
  padding: 12px; 
  background: rgba(0,0,0,0.2); 
  border-radius: 10px; 
  border: 1px solid rgba(255,255,255,0.02);
  transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
}
.activity-item:hover {
  transform: translateX(10px);
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.1);
}
.act-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: white; }
.act-icon.sql { background: #0284c7; }
.act-icon.code { background: #7c3aed; }
.act-detail { flex: 1; }
.act-detail h4 { margin: 0 0 3px 0; font-size: 0.95rem; }
.act-detail p { margin: 0; color: #64748b; font-size: 0.8rem; }
.act-time { color: #475569; font-size: 0.8rem; }
</style>
