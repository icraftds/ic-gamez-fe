<template>
  <div class="dash-home">
    <!-- Greeting Card -->
    <div class="greeting-card">
      <div class="greeting-left">
        <h1>Halo, <span class="highlight-name">{{ userProfile.name }}</span> 👋</h1>
        <p>Yuk lanjutin streak-mu! 5 menit konsisten lebih efektif daripada maraton sehari.</p>
        <div class="quick-stats">
          <div class="qs-item"><span class="qs-value text-cyan">{{ userProfile.xp }}</span> <span class="qs-label">XP</span></div>
          <div class="qs-item"><span class="qs-value text-orange">{{ userProfile.streak }}</span> <span class="qs-label">hari streak</span></div>
          <div class="qs-item"><span class="qs-value">{{ completedLessons }}</span> <span class="qs-label">latihan selesai</span></div>
          <div class="qs-item"><span class="qs-value">0</span> <span class="qs-label">sertifikat</span></div>
        </div>
      </div>
      <button v-if="!isPremiumUser" class="btn-upgrade-sm" @click="upgradeToPremium">Upgrade Premium</button>
    </div>

    <!-- Koleksi Lencana -->
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

    <!-- Lanjut Belajar -->
    <div class="section-card">
      <h2>Lanjut Belajar</h2>
      <div class="continue-grid">
        <div class="continue-card" v-for="path in paths" :key="path.id">
          <div class="cc-header">
            <div class="cc-icon"><i :class="path.icon"></i></div>
            <div class="cc-info">
              <h4>{{ path.title }}</h4>
              <p>{{ path.description }}</p>
            </div>
            <span class="cc-progress">{{ getPathProgress(path) }}%</span>
          </div>
          <div class="cc-bar-bg"><div class="cc-bar-fill" :style="{ width: getPathProgress(path) + '%' }"></div></div>
          <div class="cc-stats">
            <span>{{ getCompletedLessonsForPath(path) }} dari {{ getTotalLessonsForPath(path) }} latihan selesai</span>
          </div>
          <router-link :to="`/learning/${path.id}`" class="btn-continue">
            Mulai Belajar {{ path.title.split(' ')[0] }} →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Aktivitas Terbaru -->
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserAccount } from '../../composables/useUserAccount'
import { useLearningPaths } from '../../composables/useLearningPaths'

const { userProfile, isPremiumUser, upgradeToPremium } = useUserAccount()
const { paths } = useLearningPaths()

const xpPercentage = computed(() => Math.round((userProfile.value.xp / userProfile.value.nextLevelXp) * 100))

const completedLessons = computed(() => {
  let count = 0
  paths.value.forEach(p => p.chapters.forEach(c => c.lessons.forEach(l => { if (l.isCompleted) count++ })))
  return count
})

const getPathProgress = (path) => {
  const total = getTotalLessonsForPath(path)
  if (total === 0) return 0
  return Math.round((getCompletedLessonsForPath(path) / total) * 100)
}
const getCompletedLessonsForPath = (path) => {
  let count = 0
  path.chapters.forEach(c => c.lessons.forEach(l => { if (l.isCompleted) count++ }))
  return count
}
const getTotalLessonsForPath = (path) => {
  let count = 0
  path.chapters.forEach(c => { count += c.lessons.length })
  return count
}

const earnedBadges = computed(() => []) // Empty for now (mock)
const recentActivity = computed(() => []) // Empty for now (mock)
</script>

<style scoped>
.greeting-card {
  background: rgba(15, 10, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  transform-style: preserve-3d;
}

.greeting-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-5px);
  box-shadow: -10px 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.3);
}
.greeting-card h1 { font-size: 2rem; margin-bottom: 8px; }
.highlight-name {
  background: linear-gradient(135deg, #f59e0b, #fcd34d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: underline;
  text-decoration-color: #f59e0b;
  text-underline-offset: 4px;
}
.greeting-card > .greeting-left > p { color: #94a3b8; margin-bottom: 20px; }
.quick-stats { display: flex; gap: 30px; }
.qs-item { display: flex; align-items: baseline; gap: 6px; }
.qs-value { font-size: 1.5rem; font-weight: 800; color: white; }
.qs-label { color: #64748b; font-size: 0.9rem; }
.text-cyan { color: #22d3ee; }
.text-orange { color: #f97316; }

.btn-upgrade-sm {
  background: transparent;
  border: 1.5px solid #f59e0b;
  color: #f59e0b;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
}
.btn-upgrade-sm:hover { background: rgba(245, 158, 11, 0.1); }

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

.badges-empty, .activity-empty { text-align: center; padding: 40px 20px; color: #94a3b8; }
.badges-empty p, .activity-empty p { margin: 5px 0; }
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

.continue-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.continue-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  transform-style: preserve-3d;
}

.continue-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-5px);
  box-shadow: -5px 10px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(34, 211, 238, 0.2);
  border-color: rgba(34, 211, 238, 0.3);
}
.cc-header { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
.cc-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--primary); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.1rem; }
.cc-info { flex: 1; }
.cc-info h4 { margin: 0 0 3px 0; font-size: 1rem; }
.cc-info p { margin: 0; color: #64748b; font-size: 0.8rem; }
.cc-progress { font-size: 1.3rem; font-weight: 800; color: white; }
.cc-bar-bg { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-bottom: 12px; }
.cc-bar-fill { height: 100%; background: linear-gradient(90deg, #10b981, #22d3ee); border-radius: 2px; }
.cc-stats { color: #64748b; font-size: 0.85rem; margin-bottom: 15px; }
.btn-continue {
  display: block;
  text-align: center;
  padding: 12px;
  background: linear-gradient(135deg, #22d3ee, #3b82f6);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s;
}
.btn-continue:hover { transform: translateY(-2px); }

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
