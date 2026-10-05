<template>
  <div class="challenge-weekly">
    <div v-if="currentEvent" class="weekly-active-container">
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
              <h3 class="reward-title">{{ currentEvent.prize_pool || 'Menarik' }}</h3>
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
    
    <div v-else class="empty-event-state card-glass" style="text-align: center; padding: 60px 20px; margin-top: 20px;">
      <i class="fa-solid fa-calendar-xmark" style="font-size: 4rem; color: #475569; margin-bottom: 20px;"></i>
      <h3 style="color: #f8fafc; font-size: 1.5rem; margin-bottom: 10px;">Belum Ada Event Mingguan</h3>
      <p style="color: #94a3b8; max-width: 500px; margin: 0 auto;">Saat ini belum ada event mingguan yang aktif. Silakan kembali lagi nanti untuk mengikuti tantangan terbaru!</p>
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
const userStatus = ref(null);

const completedCount = computed(() => challenges.value.filter(c => c.status === 'completed').length);
const totalChallenges = computed(() => challenges.value.length || 1);
const progressPercentage = computed(() => Math.floor((completedCount.value / totalChallenges.value) * 100));

const fetchWeeklyData = async () => {
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
