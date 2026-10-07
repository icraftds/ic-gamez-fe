<template>
  <div class="challenge-weekly">
    <div v-if="isLoading" class="loading-state card-glass" style="text-align: center; padding: 60px 20px; margin-top: 20px;">
      <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 3rem; color: #38bdf8; margin-bottom: 20px;"></i>
      <h3 style="color: #f8fafc; font-size: 1.5rem;">Memuat Data...</h3>
      <p style="color: #94a3b8;">Tunggu sebentar, kami sedang menyiapkan event mingguan untuk Anda.</p>
    </div>

    <div v-else-if="currentEvent && !isEventUpcoming" class="weekly-active-container">
      <div class="weekly-header">
        <h2>Tantangan <span class="gradient-text">Mingguan</span></h2>
        <p>{{ currentEvent.description || 'Tantangan eksklusif dari CTO Icraft khusus untuk member Pro. Selesaikan studi kasus minggu ini untuk hadiah uang tunai.' }}</p>

        <!-- VISUAL REWARD SHOWCASE -->
        <div class="reward-showcase-weekly">
          <div class="reward-glow"></div>
          <div class="reward-content">
            <div class="reward-icon-wrapper">
              <i class="fa-solid fa-sack-dollar reward-icon"></i>
            </div>
            <div class="reward-details">
              <span class="reward-subtitle"><i class="fa-solid fa-star"></i> WEEKLY GRAND PRIZE</span>
              <h3 class="reward-title">{{ formattedPrize }}</h3>
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
            Berakhir: {{ new Date(currentEvent.end_date).toLocaleDateString('id-ID') }}
          </p>
        </div>
        
        <div v-if="progressPercentage === 100" class="claim-section">
          <button 
            class="btn-submit-weekly" 
            @click="claimWeeklyReward" 
            :disabled="isSubmitting || userStatus?.is_participated"
            :class="{'btn-disabled': userStatus?.is_participated}"
          >
            <i class="fa-solid fa-gift"></i> 
            {{ userStatus?.is_participated ? 'Telah Diklaim!' : (isSubmitting ? 'Memproses...' : 'Klaim Partisipasi Mingguan!') }}
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
    </div>
    
    <div v-else-if="currentEvent && isEventUpcoming" class="upcoming-event-state card-glass" style="text-align: center; padding: 50px 20px; margin-top: 20px; background: linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8)); border: 1px solid var(--glass-border); border-radius: 16px; position: relative; overflow: hidden;">
      <div class="upcoming-glow" style="position: absolute; top: -50px; left: 50%; transform: translateX(-50%); width: 200px; height: 200px; background: radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; pointer-events: none;"></div>
      
      <div class="upcoming-header" style="position: relative; z-index: 2;">
        <i class="fa-solid fa-rocket" style="font-size: 3rem; color: #38bdf8; margin-bottom: 15px; animation: float 3s ease-in-out infinite;"></i>
        <h3 style="color: #f8fafc; font-size: 1.8rem; margin-bottom: 8px;">Tantangan Segera Hadir!</h3>
        <p style="color: #cbd5e1; font-size: 1.1rem; margin-bottom: 30px;">Bersiaplah untuk Tantangan Mingguan: <strong style="color: #38bdf8;">{{ currentEvent.title }}</strong></p>
      </div>
      
      <div class="countdown-container" style="display: flex; justify-content: center; gap: 15px; margin-bottom: 40px; position: relative; z-index: 2;">
        <div class="countdown-box" style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 15px 20px; min-width: 90px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
          <div class="countdown-value" style="font-size: 2.5rem; font-weight: 800; color: #f8fafc; font-family: 'Courier New', monospace; line-height: 1;">{{ countdown.days }}</div>
          <div class="countdown-label" style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; margin-top: 5px; font-weight: 600; letter-spacing: 1px;">Hari</div>
        </div>
        <div class="countdown-separator" style="font-size: 2.5rem; font-weight: bold; color: #475569; align-self: center; margin-top: -20px;">:</div>
        <div class="countdown-box" style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 15px 20px; min-width: 90px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
          <div class="countdown-value" style="font-size: 2.5rem; font-weight: 800; color: #f8fafc; font-family: 'Courier New', monospace; line-height: 1;">{{ String(countdown.hours).padStart(2, '0') }}</div>
          <div class="countdown-label" style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; margin-top: 5px; font-weight: 600; letter-spacing: 1px;">Jam</div>
        </div>
        <div class="countdown-separator" style="font-size: 2.5rem; font-weight: bold; color: #475569; align-self: center; margin-top: -20px;">:</div>
        <div class="countdown-box" style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 15px 20px; min-width: 90px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
          <div class="countdown-value" style="font-size: 2.5rem; font-weight: 800; color: #f8fafc; font-family: 'Courier New', monospace; line-height: 1;">{{ String(countdown.minutes).padStart(2, '0') }}</div>
          <div class="countdown-label" style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; margin-top: 5px; font-weight: 600; letter-spacing: 1px;">Menit</div>
        </div>
        <div class="countdown-separator" style="font-size: 2.5rem; font-weight: bold; color: #475569; align-self: center; margin-top: -20px;">:</div>
        <div class="countdown-box" style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 15px 20px; min-width: 90px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
          <div class="countdown-value" style="font-size: 2.5rem; font-weight: 800; color: #38bdf8; font-family: 'Courier New', monospace; line-height: 1;">{{ String(countdown.seconds).padStart(2, '0') }}</div>
          <div class="countdown-label" style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; margin-top: 5px; font-weight: 600; letter-spacing: 1px;">Detik</div>
        </div>
      </div>
      
      <div class="upcoming-footer" style="display: inline-block; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.2); padding: 10px 25px; border-radius: 20px; position: relative; z-index: 2;">
        <p style="color: #94a3b8; font-size: 0.9rem; margin: 0;">
          Total Hadiah: <span style="color: #fbbf24; font-weight: bold; font-size: 1.1rem; margin-left: 5px;"><i class="fa-solid fa-trophy"></i> {{ formattedPrize }}</span>
        </p>
      </div>
    </div>
    
    <div v-else-if="!isLoading && !currentEvent" class="empty-event-state card-glass" style="text-align: center; padding: 60px 20px; margin-top: 20px;">
      <i class="fa-solid fa-calendar-xmark" style="font-size: 4rem; color: #475569; margin-bottom: 20px;"></i>
      <h3 style="color: #f8fafc; font-size: 1.5rem; margin-bottom: 10px;">Belum Ada Event Mingguan</h3>
      <p style="color: #94a3b8; max-width: 500px; margin: 0 auto;">Saat ini belum ada event mingguan yang aktif. Silakan kembali lagi nanti untuk mengikuti tantangan terbaru!</p>
    </div>
    
    <PremiumModal v-model="showPremiumModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { EventService } from '../../../services/eventService';
import { useToast } from '../../../composables/useToast';
import { useUserAccount } from '../../../composables/useUserAccount';
import PremiumModal from '../../common/PremiumModal.vue';
import { useEventCountdown } from '../../../composables/useEventCountdown';

const router = useRouter();
const { showToast } = useToast();
const { isPremiumUser } = useUserAccount();

const currentEvent = ref(null);
const challenges = ref([]);
const isSubmitting = ref(false);
const showPremiumModal = ref(false);
const userStatus = ref(null);
const isLoading = ref(true);

const formattedPrize = computed(() => {
  if (!currentEvent.value || !currentEvent.value.prize_pool) return 'Menarik';
  const prize = currentEvent.value.prize_pool;
  if (!isNaN(prize)) {
    return 'Rp ' + Number(prize).toLocaleString('id-ID');
  }
  return prize;
});

const { isEventUpcoming, countdown } = useEventCountdown(currentEvent);

const completedCount = computed(() => challenges.value.filter(c => c.status === 'completed').length);
const totalChallenges = computed(() => challenges.value.length || 1);
const progressPercentage = computed(() => Math.floor((completedCount.value / totalChallenges.value) * 100));

const fetchWeeklyData = async () => {
  isLoading.value = true;
  try {
    const res = await EventService.getActiveWeekly();
    if (res.data && res.data.event) {
      currentEvent.value = res.data.event;
      userStatus.value = res.data.user_status;
      
      const backendChallenges = currentEvent.value.challenges || [];
      const completedIds = res.data.user_status?.completed_challenges || [];
      
      let foundActive = false;
      
      challenges.value = backendChallenges.map((ch, index) => {
        let status = 'locked';
        let isCompleted = completedIds.includes(ch.id);
        
        if (isCompleted) {
          status = 'completed';
        } else if (!foundActive) {
          status = 'active';
          foundActive = true;
        }
        
        return {
          id: ch.id,
          title: ch.lesson?.title || ch.custom_task || `Tantangan ${index + 1}`,
          description: ch.lesson?.explanation || ch.custom_task || 'Selesaikan tantangan ini.',
          difficulty: ch.lesson?.difficulty || 'medium',
          status: status
        };
      });
    } else {
      currentEvent.value = null;
      challenges.value = [];
    }
  } catch (error) {
    console.error('Failed to load active weekly event', error);
    currentEvent.value = null;
    challenges.value = [];
  } finally {
    isLoading.value = false;
  }
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
      if (userStatus.value) userStatus.value.is_participated = true;
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

<style scoped src="../../../assets/css/components/challenges/tabs/ChallengeWeekly.css"></style>
