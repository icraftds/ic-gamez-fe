<template>
  <div class="challenge-weekly">
    <div class="weekly-header">
      <h2>Tantangan <span class="gradient-text">Mingguan</span></h2>
      <p>{{ currentEvent?.description || 'Tantangan eksklusif dari CTO Icraft khusus untuk member Pro. Selesaikan studi kasus minggu ini untuk hadiah uang tunai.' }}</p>

      <!-- VISUAL REWARD SHOWCASE -->
      <div class="reward-showcase-weekly">
        <div class="reward-glow"></div>
        <div class="reward-content">
          <div class="reward-icon-wrapper">
            <i class="fa-solid fa-sack-dollar reward-icon"></i>
          </div>
          <div class="reward-details">
            <span class="reward-subtitle"><i class="fa-solid fa-star"></i> WEEKLY GRAND PRIZE</span>
            <h3 class="reward-title">Rp 50.000 - Rp 100.000</h3>
            <p class="reward-desc">Selesaikan semua tantangan minggu ini dan klaim uang tunai langsung ke rekening atau e-Wallet Anda!</p>
          </div>
        </div>
      </div>
      
      <div class="progress-bar-container">
        <div class="pb-label">
          <span>Progres Anda</span>
          <span>{{ completedCount }} / {{ totalChallenges }} Selesai</span>
        </div>
        <div class="pb-bg">
          <div class="pb-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <p class="deadline">
          <i class="fa-regular fa-calendar-xmark"></i> 
          Berakhir: {{ currentEvent?.end_date ? new Date(currentEvent.end_date).toLocaleDateString('id-ID') : 'Memuat...' }}
        </p>
      </div>
      
      <div v-if="progressPercentage === 100" class="claim-section">
        <button class="btn-submit-weekly" @click="claimWeeklyReward" :disabled="isSubmitting">
          <i class="fa-solid fa-gift"></i> {{ isSubmitting ? 'Memproses...' : 'Klaim Partisipasi Mingguan!' }}
        </button>
      </div>
    </div>

    <div class="weekly-content">
      <div class="sub-challenges">
        <h3>Daftar Soal Minggu Ini</h3>
        <div class="list-cards" v-if="challenges.length > 0">
          <div 
            v-for="(task, index) in challenges" 
            :key="task.id"
            class="q-card"
            :class="{
              'completed': task.status === 'completed',
              'active': task.status === 'active',
              'locked': task.status === 'locked'
            }"
          >
            <div class="q-status" :class="{ 'pending': task.status === 'active', 'locked-st': task.status === 'locked' }">
              <i :class="task.status === 'completed' ? 'fa-solid fa-circle-check' : (task.status === 'active' ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock')"></i> 
              {{ task.status === 'completed' ? 'Selesai' : (task.status === 'active' ? 'Aktif' : 'Terkunci') }}
            </div>
            <h4>{{ index + 1 }}. {{ task.title }}</h4>
            <p>{{ task.description }}</p>
            <div class="q-footer">
              <span class="diff" :class="task.difficulty === 'hard' ? 'hard' : 'medium'">
                {{ task.difficulty === 'hard' ? 'Sulit' : 'Sedang' }}
              </span>
              <button 
                class="btn-sm" 
                :class="task.status === 'active' ? 'primary' : 'outline'" 
                :disabled="task.status !== 'active'"
                @click="openTask(task)"
              >
                {{ task.status === 'completed' ? 'Telah Dikerjakan' : (task.status === 'locked' ? 'Selesaikan soal sebelumnya' : 'Kerjakan') }}
              </button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>Belum ada soal mingguan yang aktif.</p>
        </div>
      </div>
    </div>
    
    <PremiumModal v-model="showPremiumModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { EventService } from '../../../services/eventService';
import { useToast } from '../../../composables/useToast';
import { useUserAccount } from '../../../composables/useUserAccount';
import PremiumModal from '../../common/PremiumModal.vue';

const router = useRouter();
const { showToast } = useToast();
const { isPremiumUser } = useUserAccount();

const currentEvent = ref(null);
const challenges = ref([]);
const isSubmitting = ref(false);
const showPremiumModal = ref(false);

const completedCount = computed(() => challenges.value.filter(c => c.status === 'completed').length);
const totalChallenges = computed(() => challenges.value.length || 1);
const progressPercentage = computed(() => Math.floor((completedCount.value / totalChallenges.value) * 100));

const fetchWeeklyData = async () => {
  try {
    const resList = await EventService.fetchEvents('weekly');
    if (resList.data && resList.data.data && resList.data.data.length > 0) {
      const eventId = resList.data.data[0].id;
      const resDetail = await EventService.getEventDetail(eventId);
      currentEvent.value = resDetail.data.data || resDetail.data;
      challenges.value = currentEvent.value.challenges || [];
    } else {
      loadMockData();
    }
  } catch (error) {
    console.warn('Backend API belum tersedia, menggunakan data statis.');
    loadMockData();
  }
};

const loadMockData = () => {
  currentEvent.value = {
    id: 99,
    description: 'Tantangan eksklusif dari CTO Icraft khusus untuk member Pro. Selesaikan studi kasus minggu ini untuk hadiah uang tunai.',
    end_date: '2026-09-24T23:59:59'
  };
  challenges.value = [
    { id: 1, title: 'Struktur Database e-Commerce', description: 'Rancang struktur tabel Relasional (SQL) untuk menyimpan riwayat transaksi dengan metode Normalisasi tingkat 3.', difficulty: 'medium', status: 'completed' },
    { id: 2, title: 'API Rate Limiting', description: 'Implementasikan pembatasan akses API menggunakan Redis di Node.js untuk mencegah serangan DDoS ringan.', difficulty: 'hard', status: 'active' },
    { id: 3, title: 'Frontend DOM Security', description: 'Perbaiki celah XSS (Cross-Site Scripting) pada form komentar ini dengan teknik sanitasi yang tepat.', difficulty: 'medium', status: 'locked' },
  ];
};

const openTask = (task) => {
  if (!isPremiumUser.value) {
    showPremiumModal.value = true;
    return;
  }
  
  if (task.status === 'active') {
    showToast('Membuka materi soal...', 'info');
    router.push({
      path: '/workspace',
      query: {
        mode: 'weekly',
        eventId: currentEvent.value.id,
        taskId: task.id,
        stage: task.id // Pass task id as stage for workspace mockup
      }
    });
  }
};

const claimWeeklyReward = async () => {
  if (progressPercentage.value < 100) return;
  isSubmitting.value = true;
  try {
    if (currentEvent.value && currentEvent.value.id) {
      await EventService.submitWeekly(currentEvent.value.id);
      showToast('Selamat! Anda telah masuk kualifikasi hadiah mingguan.', 'success');
    }
  } catch (error) {
    // TANGKAP ERROR DARI BACKEND
    if (error.response && error.response.status === 403) {
      showToast(error.response.data.message || 'Fitur ini khusus pengguna PRO.', 'error');
    } else {
      showToast('Gagal mengklaim hadiah. Silakan coba lagi.', 'error');
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchWeeklyData();
});
</script>

<style scoped src="../../../assets/css/components/challenges/ChallengeWeekly.css"></style>
<style scoped>
.reward-showcase-weekly {
  position: relative;
  background: linear-gradient(145deg, rgba(16, 185, 129, 0.1), rgba(6, 95, 70, 0.4));
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 20px;
  padding: 24px;
  margin: 30px 0;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}
.reward-showcase-weekly:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.2);
}
.reward-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
  animation: rotateGlow 10s linear infinite;
  pointer-events: none;
}
@keyframes rotateGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.reward-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 24px;
}
.reward-icon-wrapper {
  background: linear-gradient(135deg, #10b981, #059669);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
  flex-shrink: 0;
}
.reward-icon {
  font-size: 2rem;
  color: #fff;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
.reward-details {
  text-align: left;
}
.reward-subtitle {
  font-size: 0.8rem;
  font-weight: 800;
  color: #34d399;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.reward-title {
  font-size: 2.2rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(16, 185, 129, 0.4);
}
.reward-desc {
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}
@media (max-width: 768px) {
  .reward-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  .reward-details {
    text-align: center;
  }
  .reward-title {
    font-size: 1.8rem;
  }
}
</style>
