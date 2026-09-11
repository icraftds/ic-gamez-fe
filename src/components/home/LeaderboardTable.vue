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
import { topUsers, monthlyRanking, allTimeRanking } from '../../data/leaderboardData'

const props = defineProps({
  isFullView: {
    type: Boolean,
    default: false
  }
})

const { isLoggedIn } = useUserAccount()

const getRankClass = (index) => {
  if (index === 0) return 'row-gold'
  if (index === 1) return 'row-silver'
  if (index === 2) return 'row-bronze'
  return 'row-normal'
}
</script>

<style src="../../assets/css/components/LeaderboardTable.css" scoped></style>
