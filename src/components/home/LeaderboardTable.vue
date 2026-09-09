<template>
  <section class="reveal" id="leaderboard" style="scroll-margin-top: 100px; padding: 60px 0; width: 100%;">
    <div class="dash-leaderboard" :class="{ 'preview-mode': !isFullView }" style="max-width: 1100px; margin: 0 auto; padding: 0 20px;">
      <div class="lb-header-section">
        <h2 class="title-main">Top <span class="gradient-text">CoderZ</span></h2>
        <p class="subtitle">Kompetisi IC Game-Z – kumpulkan XP dan buktikan kemampuan coding Anda!</p>
        <div class="whos-next-badge">
          <i class="fa-solid fa-fire"></i> Who's Next?
        </div>
      </div>

      <!-- Podium Top 3 -->
      <div class="podium-container" v-if="isFullView">
        <div class="podium">
          <!-- 2nd Place -->
          <div class="podium-item second">
            <div class="podium-card silver-card">
              <div class="avatar-container">
                <img :src="topUsers[1].avatar" class="podium-avatar silver-border" />
                <div class="podium-rank silver">2</div>
              </div>
              <div class="podium-info">
                <h4>{{ topUsers[1].name }}</h4>
                <span class="podium-xp">{{ topUsers[1].xp.toLocaleString() }} XP</span>
              </div>
            </div>
          </div>
          
          <!-- 1st Place -->
          <div class="podium-item first">
            <div class="podium-card gold-card">
              <div class="avatar-container">
                <div class="crown"><i class="fa-solid fa-crown"></i></div>
                <img :src="topUsers[0].avatar" class="podium-avatar big gold-border" />
                <div class="podium-rank gold">1</div>
              </div>
              <div class="podium-info">
                <h4>{{ topUsers[0].name }}</h4>
                <span class="podium-xp">{{ topUsers[0].xp.toLocaleString() }} XP</span>
              </div>
            </div>
          </div>
          
          <!-- 3rd Place -->
          <div class="podium-item third">
            <div class="podium-card bronze-card">
              <div class="avatar-container">
                <img :src="topUsers[2].avatar" class="podium-avatar bronze-border" />
                <div class="podium-rank bronze">3</div>
              </div>
              <div class="podium-info">
                <h4>{{ topUsers[2].name }}</h4>
                <span class="podium-xp">{{ topUsers[2].xp.toLocaleString() }} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Your Rank -->
      <div class="your-rank-grid" v-if="isFullView && isLoggedIn">
        <div class="your-rank-card">
          <div class="yr-icon"><i class="fa-solid fa-rocket"></i></div>
          <div class="yr-content">
            <span class="yr-label">Peringkat Bulan Ini</span>
            <span class="yr-value">—</span>
          </div>
        </div>
        <div class="your-rank-card">
          <div class="yr-icon global"><i class="fa-solid fa-globe"></i></div>
          <div class="yr-content">
            <span class="yr-label">Top Global Rank</span>
            <span class="yr-value text-cyan">#2689</span>
          </div>
        </div>
      </div>

      <!-- Leaderboard Lists -->
      <div class="tables-grid" :style="!isFullView ? 'grid-template-columns: 1fr; max-width: 800px; margin: 0 auto;' : ''">
        
        <!-- Rising Stars -->
        <div class="section-card" v-if="isFullView">
          <div class="card-header">
            <div class="card-title-group">
              <h3>🚀 Rising Stars <span class="badge-sub">Bulan Ini</span></h3>
              <p class="table-sub">Reset tiap awal bulan - sisa 24 hari</p>
            </div>
          </div>
          
          <div class="leaderboard-list">
            <div class="lb-row lb-header-row">
              <div class="lb-col-rank">RANK</div>
              <div class="lb-col-user">PENGGUNA</div>
              <div class="lb-col-xp">XP</div>
              <div class="lb-col-level">LEVEL</div>
            </div>
            
            <div class="lb-items-wrapper">
              <div 
                class="lb-row lb-item" 
                v-for="(user, i) in monthlyRanking" 
                :key="i"
                :class="getRankClass(i)"
              >
                <div class="lb-col-rank">
                  <span class="rank-badge" :class="'badge-' + (i+1)">{{ i + 1 }}</span>
                </div>
                <div class="lb-col-user">
                  <img :src="user.avatar" class="table-avatar" /> 
                  <span class="user-name">{{ user.name }}</span>
                </div>
                <div class="lb-col-xp">{{ user.xp.toLocaleString() }}</div>
                <div class="lb-col-level"><span class="level-badge">Lvl {{ user.level }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Global Legends -->
        <div class="section-card">
          <div class="card-header">
            <div class="card-title-group">
              <h3>👑 Global Legends</h3>
              <p class="table-sub">Total XP yang dikumpulkan sejauh ini</p>
            </div>
          </div>
          
          <div class="leaderboard-list">
            <div class="lb-row lb-header-row">
              <div class="lb-col-rank">RANK</div>
              <div class="lb-col-user">PENGGUNA</div>
              <div class="lb-col-xp">XP</div>
              <div class="lb-col-level">LEVEL</div>
            </div>
            
            <div class="lb-items-wrapper">
              <div 
                class="lb-row lb-item" 
                v-for="(user, i) in (isFullView ? allTimeRanking : allTimeRanking.slice(0, 5))" 
                :key="i"
                :class="getRankClass(i)"
              >
                <div class="lb-col-rank">
                  <span class="rank-badge" :class="'badge-' + (i+1)">{{ i + 1 }}</span>
                </div>
                <div class="lb-col-user">
                  <img :src="user.avatar" class="table-avatar" /> 
                  <span class="user-name">{{ user.name }}</span>
                </div>
                <div class="lb-col-xp">{{ user.xp.toLocaleString() }}</div>
                <div class="lb-col-level"><span class="level-badge">Lvl {{ user.level }}</span></div>
              </div>
            </div>
          </div>
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

const getRankClass = (index) => {
  if (index === 0) return 'row-gold'
  if (index === 1) return 'row-silver'
  if (index === 2) return 'row-bronze'
  return 'row-normal'
}
</script>

<style scoped>
.lb-header-section {
  text-align: center;
  margin-bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-main {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(135deg, #00f0ff, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.1rem;
  margin-bottom: 24px;
  max-width: 600px;
}

.whos-next-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
  padding: 8px 24px;
  border-radius: 30px;
  font-weight: 800;
  font-size: 1.1rem;
  border: 1px solid rgba(236, 72, 153, 0.3);
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.2);
  animation: pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 20px rgba(236, 72, 153, 0.2); }
  50% { opacity: 0.8; transform: scale(1.05); box-shadow: 0 0 30px rgba(236, 72, 153, 0.4); }
}

/* Podium */
.podium-container {
  position: relative;
  margin-bottom: 70px;
  display: flex;
  justify-content: center;
  margin-top: 90px; /* Add margin top to account for overlapping avatars and crown */
}

.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 25px;
  z-index: 1;
}

.podium-item {
  text-align: center;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.podium-item:hover {
  transform: translateY(-8px);
}
.podium-item.first { order: 2; z-index: 3; }
.podium-item.second { order: 1; z-index: 2; }
.podium-item.third { order: 3; z-index: 1; }

.podium-card {
  background: var(--glass-bg, rgba(15, 10, 30, 0.6));
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 0 20px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 170px;
  position: relative;
  box-shadow: 0 15px 35px rgba(0,0,0,0.4);
}

.gold-card {
  width: 200px;
  padding: 0 20px 30px;
  background: linear-gradient(180deg, rgba(251, 191, 36, 0.08) 0%, rgba(15, 10, 30, 0.8) 100%);
  border: 1px solid rgba(255,255,255,0.05);
  border-top: 1px solid rgba(251, 191, 36, 0.4);
  box-shadow: 0 0 40px rgba(251, 191, 36, 0.15), 0 20px 40px rgba(0,0,0,0.6);
}

.silver-card {
  background: linear-gradient(180deg, rgba(203, 213, 225, 0.05) 0%, rgba(15, 10, 30, 0.7) 100%);
  border: 1px solid rgba(255,255,255,0.05);
  border-top: 1px solid rgba(203, 213, 225, 0.3);
}

.bronze-card {
  background: linear-gradient(180deg, rgba(180, 83, 9, 0.05) 0%, rgba(15, 10, 30, 0.7) 100%);
  border: 1px solid rgba(255,255,255,0.05);
  border-top: 1px solid rgba(180, 83, 9, 0.3);
}

.avatar-container {
  position: relative;
  margin-top: -45px; /* Pull the avatar up to overlap the card */
  margin-bottom: 25px;
}
.first .avatar-container {
  margin-top: -60px;
}

.podium-avatar {
  width: 90px; height: 90px; 
  border-radius: 50%; 
  border: 4px solid #475569;
  background: #1e293b;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  display: block;
}
.podium-avatar.big { 
  width: 120px; height: 120px; 
}

.gold-border { border-color: #fbbf24; box-shadow: 0 0 30px rgba(251, 191, 36, 0.3); }
.silver-border { border-color: #cbd5e1; box-shadow: 0 0 20px rgba(203, 213, 225, 0.2); }
.bronze-border { border-color: #b45309; box-shadow: 0 0 20px rgba(180, 83, 9, 0.2); }

.crown {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2.5rem;
  color: #fbbf24;
  filter: drop-shadow(0 2px 10px rgba(251, 191, 36, 0.6));
  z-index: 10;
}

.podium-rank {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px; height: 30px; 
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 0.9rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  border: 2px solid #0f0a1e;
}
.podium-rank.gold { background: linear-gradient(135deg, #fbbf24, #d97706); color: #fff; width: 36px; height: 36px; font-size: 1.1rem; bottom: -15px; }
.podium-rank.silver { background: linear-gradient(135deg, #f8fafc, #94a3b8); color: #0f0a1e; }
.podium-rank.bronze { background: linear-gradient(135deg, #f59e0b, #92400e); color: #fff; }

.podium-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.podium-info h4 { font-size: 1.05rem; font-weight: 700; margin: 0; color: #f8fafc; }
.podium-xp { color: #00f0ff; font-weight: 800; font-size: 0.9rem; }

/* Your Rank Cards */
.your-rank-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 50px;
}
.your-rank-card {
  background: linear-gradient(145deg, rgba(30, 20, 50, 0.6), rgba(15, 10, 30, 0.8));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.your-rank-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 240, 255, 0.3);
}
.yr-icon {
  width: 50px; height: 50px; border-radius: 14px;
  background: rgba(255,255,255,0.05); color: #94a3b8;
  display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
}
.yr-icon.global { background: rgba(0, 240, 255, 0.1); color: #00f0ff; }
.yr-content { display: flex; flex-direction: column; gap: 4px; }
.yr-label { color: #94a3b8; font-size: 0.95rem; font-weight: 500; }
.yr-value { font-size: 1.8rem; font-weight: 900; color: white; }
.text-cyan { color: #00f0ff; }

/* Leaderboard Lists */
.tables-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 30px;
}
.section-card {
  background: var(--glass-bg, rgba(15, 10, 30, 0.85));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 28px;
  padding: 36px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
}

.card-header {
  margin-bottom: 24px;
}
.card-title-group h3 {
  font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; color: white;
  display: flex; align-items: center; gap: 12px;
}
.badge-sub {
  font-size: 0.85rem; font-weight: 700; color: #ec4899; background: rgba(236, 72, 153, 0.15);
  padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px;
}
.table-sub { color: #94a3b8; font-size: 0.95rem; }

.leaderboard-list {
  display: flex; flex-direction: column;
}
.lb-items-wrapper {
  display: flex; flex-direction: column;
  /* Add seamless borders between items */
}

.lb-row {
  display: flex; align-items: center;
  padding: 16px 20px; 
}
.lb-header-row {
  padding: 0 20px 12px 20px; color: #64748b; font-size: 0.8rem; font-weight: 700; letter-spacing: 1px;
  border-bottom: 2px solid rgba(255,255,255,0.05);
  margin-bottom: 8px;
}
.lb-item {
  border-radius: 16px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  position: relative;
}
.lb-item:not(:last-child) {
  border-bottom: 1px solid rgba(255,255,255,0.03);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.lb-item:hover {
  background: rgba(255,255,255,0.03);
  transform: translateX(4px);
  border-color: rgba(255,255,255,0.05);
  z-index: 2;
}

/* Glowing rows for top 3 */
.row-gold { background: linear-gradient(90deg, rgba(251, 191, 36, 0.08), transparent); border-left: 3px solid #fbbf24; }
.row-silver { background: linear-gradient(90deg, rgba(203, 213, 225, 0.08), transparent); border-left: 3px solid #cbd5e1; }
.row-bronze { background: linear-gradient(90deg, rgba(180, 83, 9, 0.08), transparent); border-left: 3px solid #b45309; }

.lb-col-rank { width: 50px; flex-shrink: 0; }
.lb-col-user { flex: 1; display: flex; align-items: center; gap: 12px; overflow: hidden; }
.lb-col-xp { width: 90px; font-weight: 800; color: #f8fafc; text-align: right; }
.lb-col-level { width: 80px; text-align: right; }

.rank-badge {
  width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 0.9rem; background: #1e293b; color: #94a3b8;
}
.badge-1 { background: #fbbf24; color: #78350f; }
.badge-2 { background: #cbd5e1; color: #334155; }
.badge-3 { background: #b45309; color: white; }

.table-avatar { width: 36px; height: 36px; border-radius: 50%; background: #333; flex-shrink: 0; border: 2px solid rgba(255,255,255,0.1); }
.user-name { font-weight: 600; font-size: 1.05rem; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.level-badge { background: rgba(0, 240, 255, 0.15); color: #00f0ff; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; }

@media (max-width: 1024px) {
  .tables-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .podium { gap: 15px; flex-direction: column; align-items: center; }
  .podium-item { width: 100%; max-width: 300px; }
  .podium-card { width: 100%; }
  .gold-card { width: 100%; }
  .podium-item.first, .podium-item.second, .podium-item.third { margin-bottom: 0; order: initial; margin-top: 40px; }
  .podium-item.first { order: -1; }
  .podium-avatar { width: 70px; height: 70px; }
  .podium-avatar.big { width: 90px; height: 90px; }
  .your-rank-grid { grid-template-columns: 1fr; }
  .section-card { padding: 24px; }
  .lb-col-level { display: none; } /* Hide level on small screens */
  .title-main { font-size: 2.2rem; }
}
</style>
