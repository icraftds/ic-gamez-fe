<template>
  <div class="challenge-daily">
    <div class="daily-header">
      <div class="prize-badge">
        <i class="fa-solid fa-crown"></i>
        <span>Akun Pro Gratis</span>
      </div>
      <h2>Tantangan Harian <span class="gradient-text">Speedrun</span></h2>
      <p>Selesaikan tantangan kode harian. Pemenang yang paling rajin dan tercepat dalam satu minggu akan mendapatkan 1 Akun Pro Gratis (Terbuka untuk semua user)!</p>
      
      <div class="countdown">
        <span>Berakhir Dalam:</span>
        <div class="timer">
          <div class="time-box">{{ hours }}<small>JAM</small></div>
          <div class="time-box">{{ minutes }}<small>MENIT</small></div>
          <div class="time-box">{{ seconds }}<small>DETIK</small></div>
        </div>
      </div>
    </div>

    <div class="daily-content">
      <div v-if="isLoadingEvent" class="challenge-info card-glass" style="text-align: center; padding: 40px;">
        <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: #38bdf8;"></i>
        <p style="margin-top: 15px; color: #cbd5e1;">Memuat tantangan hari ini...</p>
      </div>

      <div v-else class="challenge-info card-glass">
        <h3><i class="fa-solid fa-code"></i> {{ currentEvent?.title }}</h3>
        <div class="tags">
          <span class="tag">JavaScript</span>
          <span class="tag">Algoritma</span>
          <span class="tag" :class="currentEvent?.difficulty === 'Mudah' ? 'diff-mudah' : currentEvent?.difficulty === 'Sedang' ? 'diff-sedang' : 'diff-sulit'">
            {{ currentEvent?.difficulty }}
          </span>
        </div>
        <div class="desc" v-html="currentEvent?.description_html"></div>
        
        <div class="action-box">
          <button class="btn-start" :class="{ 'btn-disabled': isAlreadyPlayedToday }" @click="startChallenge">
            <i class="fa-solid fa-play" v-if="!isAlreadyPlayedToday"></i> 
            <i class="fa-solid fa-lock" v-else></i>
            {{ isAlreadyPlayedToday ? 'Selesai / Kesempatan Habis' : 'Mulai Speedrun Sekarang' }}
          </button>
          <p class="note" v-if="!isAlreadyPlayedToday"><i class="fa-solid fa-circle-info"></i> Waktu akan dihitung mundur segera setelah Anda menekan tombol mulai.</p>
          <p class="note" style="color: #ef4444;" v-else><i class="fa-solid fa-circle-info"></i> Anda sudah menyelesaikan atau kehabisan kesempatan hari ini. Silakan coba lagi besok!</p>
        </div>
      </div>

      <div class="leaderboard-mini card-glass">
        <h3><i class="fa-solid fa-ranking-star"></i> Peringkat Sementara Hari Ini</h3>
        <ul class="ranking-list" v-if="leaderboard.length > 0">
          <li 
            v-for="(item, index) in leaderboard" 
            :key="item.id"
            class="rank-item"
            :class="{ 'first': index === 0, 'second': index === 1, 'third': index === 2 }"
          >
            <div class="rank-num">{{ index + 1 }}</div>
            <img :src="item.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'" class="avatar" alt="Avatar"/>
            <div class="user-info">
              <span class="name">{{ item.user?.name || 'Peserta' }}</span>
              <span class="time">{{ formatTime(item.duration_sec) }}</span>
            </div>
          </li>
        </ul>
        <div v-else class="empty-leaderboard">
          <p>Belum ada yang mengumpulkan hari ini.</p>
        </div>
      </div>
    </div>

    <!-- Custom Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showConfirmModal" class="speedrun-modal-overlay">
        <div class="speedrun-modal-content card-glass">
          <h3><i class="fa-solid fa-triangle-exclamation" style="color: #f59e0b;"></i> Konfirmasi Speedrun</h3>
          <p>Apakah Anda siap? Waktu (timer) akan langsung berjalan setelah Anda menekan tombol mulai.</p>
          <div class="speedrun-modal-actions">
            <button class="btn-cancel" @click="cancelStart">Batal</button>
            <button class="btn-confirm" @click="confirmStart">Mulai Sekarang!</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { EventService } from '../../../services/eventService';
import api from '../../../services/api';
import { useToast } from '../../../composables/useToast';
import { useUserAccount } from '../../../composables/useUserAccount';

const router = useRouter();
const { showToast } = useToast();
const { isLoggedIn, userProfile } = useUserAccount();

const hours = ref('00');
const minutes = ref('00');
const seconds = ref('00');
let timerInterval = null;

// API States
const leaderboard = ref([]);
const currentEvent = ref(null);
const isLoadingEvent = ref(true);

const isAlreadyPlayedToday = computed(() => {
  if (!currentEvent.value) return false;
  if (!isLoggedIn.value) return false; // Not logged in? Can't have played.
  
  // Use backend status if available (more secure)
  if (userStatus.value) {
    if (userStatus.value.is_played_today && userStatus.value.status === 'approved') return true;
    if (userStatus.value.attempts >= 5) return true; // Kehabisan kesempatan
  }
  
  // Local fallback
  const userId = userProfile.value?.id || 'guest';
  const completedDate = localStorage.getItem(`ic_daily_completed_${userId}_${currentEvent.value.id}`);
  if (completedDate === new Date().toDateString()) {
    return true;
  }
  return false;
});

const userStatus = ref(null);

const fetchActiveChallenge = async () => {
  isLoadingEvent.value = true;
  try {
    const res = await api.get('/events/daily/active');
    if (res.data && res.data.event) {
      currentEvent.value = res.data.event;
      userStatus.value = res.data.user_status;
    }
  } catch (error) {
    console.error('Failed to load active challenge', error);
    // Fallback if API fails
    currentEvent.value = {
      id: 1,
      title: 'Tantangan Belum Tersedia',
      difficulty: 'Sedang',
      description_html: '<p>Tantangan harian belum diatur oleh admin.</p>'
    };
  } finally {
    isLoadingEvent.value = false;
  }
};

const fetchLeaderboard = async () => {
  try {
    const res = await EventService.getDailyLeaderboard();
    if (res.data && res.data.data && res.data.data.leaderboard) {
      leaderboard.value = res.data.data.leaderboard;
    } else {
      leaderboard.value = res.data.data || res.data || [];
    }
  } catch (error) {
    console.warn('Backend API error saat mengambil leaderboard', error);
    leaderboard.value = [];
  }
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}.00`;
};

const showConfirmModal = ref(false);

const startChallenge = () => {
  if (!isLoggedIn.value) {
      showToast('Silakan Masuk atau Daftar untuk mengikuti Speedrun Harian!', 'warning');
      router.push('/login');
      return;
  }
  if (isAlreadyPlayedToday.value) {
      showToast('Anda sudah berpartisipasi hari ini. Coba lagi besok!', 'error');
      return;
  }
  showConfirmModal.value = true;
};

const confirmStart = () => {
  showConfirmModal.value = false;
  
  if (!currentEvent.value) return;
  
  // Hapus timer lama agar selalu mulai dari 00:00 saat memulai tantangan baru
  localStorage.removeItem(`speedrun_start_${currentEvent.value.id}`);
  
  // Bersihkan token & submission agar benar-benar dari 0 untuk percobaan hari ini
  const userId = userProfile.value?.id || 'guest';
  localStorage.removeItem(`ic_tokens_${userId}_stage_${currentEvent.value.id}`);
  localStorage.removeItem(`ic_submissions_${userId}_stage_${currentEvent.value.id}`);
  
  showToast('Mempersiapkan Workspace Speedrun...', 'info');
  router.push({
    path: '/workspace',
    query: {
      mode: 'speedrun',
      eventId: currentEvent.value.id,
      stage: currentEvent.value.id
    }
  });
};

const cancelStart = () => {
  showConfirmModal.value = false;
};

const updateTimer = () => {
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  const diff = endOfDay - now;
  
  if (diff > 0) {
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);
    
    hours.value = h.toString().padStart(2, '0');
    minutes.value = m.toString().padStart(2, '0');
    seconds.value = s.toString().padStart(2, '0');
  }
};

onMounted(() => {
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
  fetchActiveChallenge();
  fetchLeaderboard();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped src="../../../assets/css/components/challenges/ChallengeDaily.css"></style>

<style>
.speedrun-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
  opacity: 1 !important;
  visibility: visible !important;
}
.speedrun-modal-content {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 12px;
  max-width: 450px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  opacity: 1 !important;
}
.speedrun-modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: var(--text-main);
}
.speedrun-modal-content p {
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}
.speedrun-modal-actions {
  display: flex;
  gap: 1rem;
}
.speedrun-modal-actions button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}
.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-main);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}
.btn-confirm {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}
.btn-confirm:hover {
  background: linear-gradient(135deg, #059669, #047857);
}
.btn-disabled {
  background: #334155 !important;
  color: #94a3b8 !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
}
</style>
