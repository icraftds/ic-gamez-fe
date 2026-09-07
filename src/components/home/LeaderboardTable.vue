<template>
  <section class="reveal" id="leaderboard" style="scroll-margin-top: 100px; padding: 60px 0; width: 100%;">
    <div class="dash-leaderboard" :class="{ 'preview-mode': !isFullView }" style="max-width: 1100px; margin: 0 auto; padding: 0 20px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h2 style="font-size: 2.5rem;">Top <span class="gradient-text">CoderZ</span></h2>
        <p class="subtitle" style="margin-top: 10px;">Kompetisi IC Game-Z – kumpulkan XP dan jadi yang teratas!</p>
      </div>

      <!-- Podium Top 3 -->
      <div class="podium" v-if="isFullView">
        <div class="podium-item second">
          <div class="podium-rank">2</div>
          <img :src="topUsers[1].avatar" class="podium-avatar" />
          <h4>{{ topUsers[1].name }}</h4>
          <span class="podium-xp">{{ topUsers[1].xp.toLocaleString() }} XP</span>
        </div>
        <div class="podium-item first">
          <div class="podium-rank gold">1</div>
          <img :src="topUsers[0].avatar" class="podium-avatar big" />
          <h4>{{ topUsers[0].name }}</h4>
          <span class="podium-xp">{{ topUsers[0].xp.toLocaleString() }} XP</span>
        </div>
        <div class="podium-item third">
          <div class="podium-rank">3</div>
          <img :src="topUsers[2].avatar" class="podium-avatar" />
          <h4>{{ topUsers[2].name }}</h4>
          <span class="podium-xp">{{ topUsers[2].xp.toLocaleString() }} XP</span>
        </div>
      </div>

      <!-- Your Rank -->
      <div class="your-rank-grid" v-if="isFullView && isLoggedIn">
        <div class="your-rank-card">
          <i class="fa-solid fa-calendar"></i>
          <span class="yr-label">Peringkat kamu bulan ini</span>
          <span class="yr-value">—</span>
        </div>
        <div class="your-rank-card">
          <i class="fa-solid fa-infinity"></i>
          <span class="yr-label">Peringkat kamu sepanjang masa</span>
          <span class="yr-value text-cyan">#2689</span>
        </div>
      </div>

      <!-- Leaderboard Tables -->
      <div class="tables-grid" :style="!isFullView ? 'grid-template-columns: 1fr; max-width: 800px; margin: 0 auto;' : ''">
        <div class="section-card" v-if="isFullView">
          <h3>Bulan Ini</h3>
          <p class="table-sub">XP bulan ini<br/>Reset tiap awal bulan - sisa 24 hari</p>
          <table class="lb-table">
            <thead><tr><th>RANK</th><th>PENGGUNA</th><th>XP</th><th>LEVEL</th></tr></thead>
            <tbody>
              <tr v-for="(user, i) in monthlyRanking" :key="i" :class="{ 'top-3': i < 3 }">
                <td><span class="rank-badge" :class="'rank-' + (i+1)">{{ i + 1 }}</span></td>
                <td class="user-cell"><img :src="user.avatar" class="table-avatar" /> {{ user.name }}</td>
                <td>{{ user.xp.toLocaleString() }}</td>
                <td><span class="level-badge">Lvl {{ user.level }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section-card">
          <h3>Sepanjang Masa</h3>
          <p class="table-sub">Total XP</p>
          <table class="lb-table">
            <thead><tr><th>RANK</th><th>PENGGUNA</th><th>XP</th><th>LEVEL</th></tr></thead>
            <tbody>
              <tr v-for="(user, i) in (isFullView ? allTimeRanking : allTimeRanking.slice(0, 5))" :key="i" :class="{ 'top-3': i < 3 }">
                <td><span class="rank-badge" :class="'rank-' + (i+1)">{{ i + 1 }}</span></td>
                <td class="user-cell"><img :src="user.avatar" class="table-avatar" /> {{ user.name }}</td>
                <td>{{ user.xp.toLocaleString() }}</td>
                <td><span class="level-badge">Lvl {{ user.level }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useUserAccount } from '../../composables/useUserAccount'

const props = defineProps({
  isFullView: {
    type: Boolean,
    default: false
  }
})

const { isLoggedIn } = useUserAccount()

const makeUser = (name, xp, level, seed) => ({
  name,
  xp,
  level,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
})

const topUsers = [
  makeUser('Anonim', 3875, 39, 'topuser1'),
  makeUser('Muhammad Daffa U.', 3567, 119, 'topuser2'),
  makeUser('Irfan Yasin', 2328, 24, 'topuser3')
]

const monthlyRanking = [
  makeUser('Anonymous', 3875, 39, 'mu1'),
  makeUser('Muhammad Daffa U.', 3567, 119, 'mu2'),
  makeUser('Irfan Yasin', 2328, 24, 'mu3'),
  makeUser('Raasyid Abdul Ra\'uf', 2085, 28, 'mu4'),
  makeUser('Riki Winardi Gama', 2009, 23, 'mu5'),
  makeUser('Arlinda Swandaru', 1865, 19, 'mu6'),
  makeUser('Ilham', 1855, 55, 'mu7'),
  makeUser('Athaya Rayassa Insyi...', 1855, 19, 'mu8'),
]

const allTimeRanking = [
  makeUser('Anonymous', 12523, 124, 'au1'),
  makeUser('Alfa', 12182, 122, 'au2'),
  makeUser('Muhammad Daffa U.', 11884, 119, 'au3'),
  makeUser('Dara Mahardika', 11601, 118, 'au4'),
  makeUser('Ahmad Paqih', 11601, 107, 'au5'),
  makeUser('Erza', 11438, 115, 'au6'),
  makeUser('Fuad Hidayat Ardian...', 11224, 113, 'au7'),
  makeUser('Khairul Rohman', 11000, 111, 'au8'),
]
</script>

<style scoped>
.subtitle { color: #94a3b8; margin-bottom: 30px; }

.podium { display: flex; justify-content: center; align-items: flex-end; gap: 20px; margin-bottom: 30px; }
.podium-item { text-align: center; padding: 20px; }
.podium-item.first { order: 2; }
.podium-item.second { order: 1; }
.podium-item.third { order: 3; }
.podium-rank {
  width: 30px; height: 30px; border-radius: 50%;
  background: #475569; color: white; display: flex; align-items: center; justify-content: center;
  font-weight: bold; margin: 0 auto 10px; font-size: 0.85rem;
}
.podium-rank.gold { background: #22d3ee; color: #0f0a1e; }
.podium-avatar { width: 70px; height: 70px; border-radius: 50%; border: 3px solid #475569; margin-bottom: 10px; background: #222; }
.podium-avatar.big { width: 90px; height: 90px; border-color: #22d3ee; }
.podium-item h4 { font-size: 0.9rem; margin: 0 0 5px 0; }
.podium-xp { color: #22d3ee; font-weight: 700; font-size: 0.85rem; }

.your-rank-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
.your-rank-card {
  background: rgba(15, 10, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  transform-style: preserve-3d;
}

.your-rank-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-5px);
  box-shadow: -10px 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(34, 211, 238, 0.2);
  border-color: rgba(34, 211, 238, 0.3);
}
.your-rank-card i { font-size: 1.3rem; color: #475569; }
.yr-label { flex: 1; color: #94a3b8; font-size: 0.9rem; }
.yr-value { font-size: 1.5rem; font-weight: 900; color: white; }
.text-cyan { color: #22d3ee; }

.tables-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.section-card {
  background: rgba(15, 10, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  transform-style: preserve-3d;
}

.section-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-5px);
  box-shadow: -10px 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(34, 211, 238, 0.2);
  border-color: rgba(34, 211, 238, 0.3);
}
.section-card h3 { font-size: 1.2rem; margin-bottom: 5px; }
.table-sub { color: #64748b; font-size: 0.8rem; margin-bottom: 20px; }

.lb-table { width: 100%; border-collapse: collapse; }
.lb-table th { text-align: left; padding: 10px 12px; color: #475569; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.05); }
.lb-table td { padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.03); color: #cbd5e1; font-size: 0.9rem; }
.lb-table tr:hover { background: rgba(255,255,255,0.03); }

.rank-badge {
  width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
  font-weight: bold; font-size: 0.8rem; background: #1e293b; color: #94a3b8;
}
.rank-1 { background: #22d3ee; color: #0f0a1e; }
.rank-2 { background: #64748b; color: white; }
.rank-3 { background: #b45309; color: white; }

.user-cell { display: flex; align-items: center; gap: 10px; }
.table-avatar { width: 28px; height: 28px; border-radius: 50%; background: #333; }
.level-badge { background: rgba(34,211,238,0.15); color: #22d3ee; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; }
</style>
