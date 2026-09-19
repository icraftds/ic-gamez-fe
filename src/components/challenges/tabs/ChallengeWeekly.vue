<template>
  <div class="challenge-weekly">
    <div class="weekly-header">
      <div class="prize-badge">
        <i class="fa-solid fa-gift"></i>
        <span>Rp 50.000 - Rp 100.000</span>
      </div>
      <h2>Tantangan <span class="gradient-text">Mingguan</span></h2>
      <p>{{ currentEvent?.description || 'Tantangan eksklusif dari CTO Icraft khusus untuk member Pro. Selesaikan studi kasus minggu ini untuk hadiah uang tunai.' }}</p>
      
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
