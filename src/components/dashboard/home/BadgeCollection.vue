<template>
  <div class="section-card">
    <div class="section-header">
      <h2>Koleksi Lencana</h2>
      <router-link to="/dashboard/medali" class="link-action">Lihat semua</router-link>
    </div>
    <div class="badges-empty" v-if="earnedBadges.length === 0">
      <i class="fa-solid fa-medal" style="font-size: 2rem; color: #475569; margin-bottom: 10px;"></i>
      <p><strong>Belum ada lencana</strong></p>
      <p class="sub-text">Selesaikan challenge pertamamu buat mulai koleksi.</p>
      <router-link to="/challenges" class="btn-accent">Cari Challenge</router-link>
    </div>
    <div class="badges-grid" v-else>
      <div class="badge-item" v-for="badge in earnedBadges" :key="badge.id">
        <i :class="badge.icon" class="badge-icon"></i>
        <span>{{ badge.name }}</span>
      </div>
    </div>
    <div class="level-progress">
      <span>Lencana berikutnya: <strong>Level {{ userProfile.level + 1 }}: Serius Mode On</strong></span>
      <span>{{ userProfile.xp }}/{{ userProfile.nextLevelXp }}</span>
    </div>
    <div class="xp-bar-bg"><div class="xp-bar-fill" :style="{ width: xpPercentage + '%' }"></div></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserAccount } from '../../../composables/useUserAccount'

const { userProfile } = useUserAccount()

const xpPercentage = computed(() => Math.round((userProfile.value.xp / userProfile.value.nextLevelXp) * 100))
const earnedBadges = computed(() => []) // Empty for now (mock)
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
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section-header h2 { margin-bottom: 0; }
.link-action { color: #22d3ee; text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: color 0.3s; }
.link-action:hover { text-decoration: underline; color: #38bdf8; text-shadow: 0 0 10px rgba(56, 189, 248, 0.5); }

.badges-empty { text-align: center; padding: 40px 20px; color: #94a3b8; }
.badges-empty p { margin: 5px 0; }
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

.level-progress { display: flex; justify-content: space-between; color: #94a3b8; font-size: 0.85rem; margin-top: 20px; margin-bottom: 8px; }
.xp-bar-bg { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
.xp-bar-fill { height: 100%; background: linear-gradient(90deg, #22d3ee, #3b82f6); border-radius: 3px; transition: width 0.5s; }

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 15px;
  margin-top: 20px;
}
.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  font-size: 0.8rem;
  color: #e2e8f0;
}
.badge-icon {
  font-size: 2rem;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  padding: 15px;
  border-radius: 50%;
  border: 1px solid rgba(245, 158, 11, 0.2);
}
</style>
