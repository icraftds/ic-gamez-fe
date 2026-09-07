<template>
  <section class="reveal" id="leaderboard" style="scroll-margin-top: 100px; padding: 60px 0; width: 100%; position: relative;">
    <div class="leaderboard-container iso-leaderboard" :style="{ maxWidth: isFullView ? '1100px' : '1000px', margin: '0 auto', padding: '30px', marginBottom: '50px' }">
      <div style="text-align: center; margin-bottom: 40px;">
        <h2 style="font-size: 2.5rem;">Top <span class="gradient-text">CoderZ</span></h2>
        <p v-if="isFullView" style="color: #94a3b8; margin-top: 10px;">Kumpulkan XP dari latihan pemrograman dan jadilah yang teratas</p>
      </div>

      <!-- Podium Section (Only for Full View) -->
      <div v-if="isFullView" class="podium-container">
        <!-- Rank 2 -->
        <div class="podium-item rank-2-podium">
          <div class="podium-rank">2</div>
          <div class="podium-avatar-wrapper">
            <img :src="top3[1].avatar" alt="Avatar" class="podium-avatar">
          </div>
          <div class="podium-info">
            <h4>{{ top3[1].name }}</h4>
            <span class="podium-xp">{{ formatXP(top3[1].xp) }}</span>
          </div>
        </div>

        <!-- Rank 1 -->
        <div class="podium-item rank-1-podium">
          <div class="podium-rank winner"><i class="fa-solid fa-crown"></i></div>
          <div class="podium-avatar-wrapper winner-wrapper">
            <img :src="top3[0].avatar" alt="Avatar" class="podium-avatar">
          </div>
          <div class="podium-info">
            <h4 class="winner-name">{{ top3[0].name }}</h4>
            <span class="podium-xp winner-xp">{{ formatXP(top3[0].xp) }}</span>
          </div>
        </div>

        <!-- Rank 3 -->
        <div class="podium-item rank-3-podium">
          <div class="podium-rank">3</div>
          <div class="podium-avatar-wrapper">
            <img :src="top3[2].avatar" alt="Avatar" class="podium-avatar">
          </div>
          <div class="podium-info">
            <h4>{{ top3[2].name }}</h4>
            <span class="podium-xp">{{ formatXP(top3[2].xp) }}</span>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div :class="{'table-scroll-container': isFullView}">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Pengguna</th>
              <th>Asal Sekolah</th>
              <th>Poin Total</th>
              <th v-if="!isFullView">Tantangan Diselesaikan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in displayUsers" :key="user.id" class="leaderboard-row">
              <td :class="{'rank-1': index === 0, 'rank-2': index === 1, 'rank-3': index === 2}">
                <i v-if="index === 0" class="fa-solid fa-trophy"></i>
                <i v-else-if="index === 1 || index === 2" class="fa-solid fa-medal"></i>
                <span v-if="index > 2">{{ index + 1 }}</span>
                <span v-else> {{ index + 1 }}</span>
              </td>
              <td>
                <div class="user-cell">
                  <img v-if="isFullView" :src="user.avatar" class="sm-avatar" alt="Avatar">
                  <span style="font-weight: 700; font-size: 1.1rem;">{{ user.name }}</span>
                </div>
              </td>
              <td><span class="school-badge">{{ user.school }}</span></td>
              <td style="color: var(--primary); font-family: 'JetBrains Mono', monospace;">{{ formatXP(user.xp) }}</td>
              <td v-if="!isFullView">{{ user.challenges }} Tantangan</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isFullView: {
    type: Boolean,
    default: false
  }
})

const leaderboardData = ref([
  { id: 1, name: 'Randi Zakaria Putra', school: 'MAN 2 Kota Bandung', xp: 14500, challenges: 42, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Randi' },
  { id: 2, name: 'Kanzler', school: 'Kenzia Frozen Food', xp: 13200, challenges: 38, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kanzler' },
  { id: 3, name: 'Blak', school: 'Ciwastra Boys', xp: 12850, challenges: 36, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Blak' },
  { id: 4, name: 'Nanda Kusuma', school: 'SMK Telkom Purwokerto', xp: 11400, challenges: 31, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nanda' },
  { id: 5, name: 'Dika Prayoga', school: 'SMKN 1 Tasikmalaya', xp: 10900, challenges: 29, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dika' },
  { id: 6, name: 'Siti Aminah', school: 'SMAN 3 Jakarta', xp: 10500, challenges: 27, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti' },
  { id: 7, name: 'Budi Santoso', school: 'SMK 1 Budi Utomo', xp: 9800, challenges: 25, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
  { id: 8, name: 'Arief Rahman', school: 'SMAIT Nurul Fikri', xp: 9200, challenges: 23, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arief' },
  { id: 9, name: 'Dewi Lestari', school: 'SMAN 1 Bandung', xp: 8700, challenges: 21, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi' },
  { id: 10, name: 'Fajar Nugraha', school: 'SMKN 4 Malang', xp: 8100, challenges: 19, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fajar' },
  { id: 11, name: 'Agus Setiawan', school: 'SMAN 5 Surabaya', xp: 7500, challenges: 17, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agus' },
  { id: 12, name: 'Rina Melati', school: 'SMK Kesehatan', xp: 7200, challenges: 16, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina' },
  { id: 13, name: 'Hendra Saputra', school: 'SMAN 2 Semarang', xp: 6800, challenges: 15, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra' },
  { id: 14, name: 'Diana Putri', school: 'SMA Taruna Nusantara', xp: 6400, challenges: 13, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana' },
  { id: 15, name: 'Rizky Pratama', school: 'SMKN 2 Yogyakarta', xp: 6100, challenges: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rizky' },
  { id: 16, name: 'Bayu Anggara', school: 'SMAN 1 Depok', xp: 5800, challenges: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bayu' },
  { id: 17, name: 'Citra Kirana', school: 'SMK 3 Bogor', xp: 5500, challenges: 9, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citra' },
  { id: 18, name: 'Dimas Aditya', school: 'SMAN 4 Bekasi', xp: 5200, challenges: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dimas' },
  { id: 19, name: 'Eka Saputri', school: 'SMK 5 Tangerang', xp: 4900, challenges: 7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eka' },
  { id: 20, name: 'Fikri Haikal', school: 'SMAN 6 Jakarta', xp: 4600, challenges: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fikri' }
])

const top3 = computed(() => leaderboardData.value.slice(0, 3))
// Di Full View, kita juga bisa mengecualikan top 3 dari tabel jika mau, 
// tapi berdasarkan referensi desain (dan untuk UX yang baik), top 3 tetap ada di tabel.
const displayUsers = computed(() => props.isFullView ? leaderboardData.value : leaderboardData.value.slice(0, 5))

const formatXP = (xp) => {
  return new Intl.NumberFormat('id-ID').format(xp) + ' XP'
}
</script>

<style scoped>
.podium-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 60px;
  margin-top: 40px;
}

.podium-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(20, 15, 40, 0.6);
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  transition: transform 0.3s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.podium-item:hover {
  transform: translateY(-5px);
}

.rank-1-podium {
  width: 220px;
  height: 260px;
  border-color: #fcd34d;
  background: linear-gradient(to top, rgba(245, 158, 11, 0.1), rgba(20, 15, 40, 0.6));
  z-index: 2;
  box-shadow: 0 10px 40px rgba(245, 158, 11, 0.2);
}

.rank-2-podium {
  width: 180px;
  height: 220px;
  border-color: #e2e8f0;
}

.rank-3-podium {
  width: 180px;
  height: 200px;
  border-color: #d97706;
}

.podium-rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: absolute;
  top: -16px;
  border: 2px solid var(--bg-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.rank-1-podium .podium-rank {
  background: #f59e0b;
  color: #fff;
  width: 44px;
  height: 44px;
  top: -22px;
  font-size: 1.2rem;
  border-color: #fcd34d;
}

.rank-2-podium .podium-rank { background: #e2e8f0; color: #000; }
.rank-3-podium .podium-rank { background: #d97706; color: #fff; }

.podium-avatar-wrapper {
  margin-top: 15px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  padding: 4px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 15px;
}

.winner-wrapper {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #fcd34d, #f59e0b);
}

.podium-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #1e1e2e;
}

.podium-info {
  text-align: center;
  margin-top: auto;
}

.podium-info h4 {
  font-size: 1rem;
  margin-bottom: 5px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.winner-name {
  font-size: 1.2rem !important;
  color: #fcd34d !important;
  max-width: 180px !important;
}

.podium-xp {
  color: var(--primary);
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  font-size: 0.9rem;
}

.winner-xp {
  font-size: 1.1rem;
}

.table-scroll-container {
  max-height: 500px;
  overflow-y: auto;
  border-radius: 12px;
  background: rgba(20, 15, 40, 0.4);
  border: 1px solid rgba(147, 51, 234, 0.2);
}

.table-scroll-container::-webkit-scrollbar {
  width: 8px;
}
.table-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.5);
  border-radius: 10px;
}
.table-scroll-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sm-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #333;
  border: 1px solid rgba(255,255,255,0.1);
}

/* Base table adjustments */
.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

/* Sticky Header for scrollable table */
.table-scroll-container .leaderboard-table thead th {
  position: sticky;
  top: 0;
  background: rgba(15, 10, 30, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}
</style>
