<template>
  <div class="challenge-annual">
    <div v-if="isLoading" class="loading-state card-glass" style="text-align: center; padding: 60px 20px; margin-top: 20px;">
      <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 3rem; color: #38bdf8; margin-bottom: 20px;"></i>
      <h3 style="color: #f8fafc; font-size: 1.5rem;">Memuat Data...</h3>
      <p style="color: #94a3b8;">Tunggu sebentar, kami sedang menyiapkan event tahunan untuk Anda.</p>
    </div>

    <div v-else-if="currentEvent && !isEventUpcoming" class="annual-active-container">
      <div class="annual-banner">
        <div class="banner-content">
          <span class="tag-pro"><i class="fa-solid fa-crown"></i> Mega Project 2026</span>
          <h2>{{ currentEvent.title }}</h2>
          <p v-html="currentEvent.description || currentEvent.description_html"></p>
          
          <!-- MEGA PRIZE POOL SHOWCASE -->
          <div class="mega-prize-pool">
            <div class="prize-glow"></div>
            <div class="prize-content">
              <i class="fa-solid fa-trophy prize-icon gold"></i>
              <div class="prize-text">
                <span class="prize-label">PRIZE POOL</span>
                <h1 class="prize-amount">{{ formattedPrize }}</h1>
              </div>
              <i class="fa-solid fa-coins prize-icon silver"></i>
            </div>
            <div class="prize-subtext-container">
              <p class="prize-subtext"><i class="fa-solid fa-money-bills"></i> Uang Tunai Jutaan Rupiah</p>
              <p class="prize-subtext"><i class="fa-solid fa-certificate"></i> Sertifikat Eksklusif iCraft</p>
              <p class="prize-subtext"><i class="fa-solid fa-handshake"></i> Slot Internship di iCraft</p>
            </div>
          </div>

          <div class="banner-meta">
            <span><i class="fa-regular fa-clock"></i> Berakhir {{ new Date(currentEvent.end_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) }}</span>
          </div>
        </div>
      </div>
      <PremiumModal v-model="showPremiumModal" />

      <div class="annual-content">
        <div class="req-card">
          <h3><i class="fa-solid fa-list-check"></i> Spesifikasi Proyek</h3>
          <div v-if="annualChallengeTask" class="spec-list-dynamic" v-html="annualChallengeTask"></div>
        </div>

        <div class="submit-card">
          <h3><i class="fa-solid fa-cloud-arrow-up"></i> Area Pengumpulan</h3>
          <p class="submit-desc">Pastikan Anda mengumpulkan kode sumber (Repository) dan tautan aplikasi yang sudah online (Live URL).</p>
          
          <form v-if="!userStatus?.is_participated" class="submit-form" @submit.prevent="submitProject">
            <div class="form-group">
              <label>Link Repository (GitHub/GitLab)</label>
              <input type="url" v-model="form.repoUrl" placeholder="https://github.com/username/project" required class="form-input" />
            </div>
            
            <div class="form-group">
              <label>Link Aplikasi Live (Opsional)</label>
              <input type="url" v-model="form.liveUrl" placeholder="https://rs-kita.com" class="form-input" />
            </div>

            <div class="form-group">
              <label>Atau Unggah Source Code (.ZIP)</label>
              <div class="file-drop-area">
                <i class="fa-solid fa-file-zipper"></i>
                <span v-if="!form.file">Tarik dan lepas file ZIP di sini, atau klik untuk memilih</span>
                <span v-else class="file-selected">{{ form.file.name }} ({{ (form.file.size / 1024 / 1024).toFixed(2) }} MB)</span>
                <input type="file" accept=".zip,.rar" class="file-input" @change="handleFileUpload" />
              </div>
            </div>
            
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Mengunggah...' : 'Kirim Proyek Tahunan' }} <i v-if="!isSubmitting" class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
          <div v-else class="already-submitted card-glass" style="margin-top: 20px; text-align: center; padding: 30px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);">
            <i class="fa-solid fa-circle-check" style="font-size: 3rem; color: #10b981; margin-bottom: 15px;"></i>
            <h3 style="color: #10b981;">Proyek Telah Dikirim!</h3>
            <p style="color: #cbd5e1; margin-top: 10px;">Terima kasih atas partisipasi Anda. Tim juri sedang meninjau proyek Anda. Pengumuman akan diinformasikan setelah masa event berakhir.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="currentEvent && isEventUpcoming" class="upcoming-event-state card-glass" style="text-align: center; padding: 50px 20px; margin-top: 20px; background: linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8)); border: 1px solid var(--glass-border); border-radius: 16px; position: relative; overflow: hidden;">
      <div class="upcoming-glow" style="position: absolute; top: -50px; left: 50%; transform: translateX(-50%); width: 200px; height: 200px; background: radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; pointer-events: none;"></div>
      
      <div class="upcoming-header" style="position: relative; z-index: 2;">
        <i class="fa-solid fa-rocket" style="font-size: 3rem; color: #38bdf8; margin-bottom: 15px; animation: float 3s ease-in-out infinite;"></i>
        <h3 style="color: #f8fafc; font-size: 1.8rem; margin-bottom: 8px;">Tantangan Segera Hadir!</h3>
        <p style="color: #cbd5e1; font-size: 1.1rem; margin-bottom: 30px;">Bersiaplah untuk Mega Project: <strong style="color: #38bdf8;">{{ currentEvent.title }}</strong></p>
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
      <h3 style="color: #f8fafc; font-size: 1.5rem; margin-bottom: 10px;">Belum Ada Event Tahunan</h3>
      <p style="color: #94a3b8; max-width: 500px; margin: 0 auto;">Saat ini belum ada Mega Project tahunan yang aktif. Nantikan informasi selanjutnya dari Icraft!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { EventService } from '../../../services/eventService';
import { useToast } from '../../../composables/useToast';
import { useUserAccount } from '../../../composables/useUserAccount';
import PremiumModal from '../../common/PremiumModal.vue';
import { useEventCountdown } from '../../../composables/useEventCountdown';

const { showToast } = useToast();
const { isPremiumUser } = useUserAccount();
const currentEvent = ref(null);
const isSubmitting = ref(false);
const showPremiumModal = ref(false);
const userStatus = ref(null);
const annualChallengeTask = ref('');
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

const form = reactive({
  repoUrl: '',
  liveUrl: '',
  file: null
});

const handleFileUpload = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    form.file = selectedFile;
  }
};

const fetchAnnualEvent = async () => {
  isLoading.value = true;
  try {
    const res = await EventService.getActiveAnnual();
    if (res.data && res.data.event) {
      currentEvent.value = res.data.event;
      userStatus.value = res.data.user_status;
      
      if (res.data.event.challenges && res.data.event.challenges.length > 0) {
        annualChallengeTask.value = res.data.event.challenges[0].custom_task || res.data.event.challenges[0].lesson?.explanation || '';
      }
    } else {
      currentEvent.value = null;
    }
  } catch (error) {
    currentEvent.value = null;
  } finally {
    isLoading.value = false;
  }
};

const submitProject = async () => {
  if (!isPremiumUser.value) {
    showPremiumModal.value = true;
    return;
  }

  if (!currentEvent.value || !currentEvent.value.id) return;
  
  isSubmitting.value = true;
  try {
    await EventService.submitAnnual(currentEvent.value.id, form);
    showToast('Proyek Tahunan berhasil dikirim! Menunggu ulasan juri.', 'success');
    
    // Reset Form
    form.repoUrl = '';
    form.liveUrl = '';
    form.file = null;
    if (userStatus.value) {
      userStatus.value.is_participated = true;
    } else {
      userStatus.value = { is_participated: true };
    }
  } catch (error) {
    // TANGKAP ERROR DARI BACKEND
    if (error.response && error.response.status === 403) {
      showToast(error.response.data.message || 'Akses ditolak. Fitur ini khusus pengguna PRO.', 'error');
    } else {
      showToast('Gagal mengirimkan proyek. Periksa koneksi Anda.', 'error');
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchAnnualEvent();
});
</script>

<style scoped src="../../../assets/css/components/challenges/ChallengeAnnual.css"></style>

<style scoped src="../../../assets/css/components/challenges/tabs/ChallengeAnnual.css"></style>
