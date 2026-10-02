<template>
  <div class="challenge-annual">
    <div class="annual-banner">
      <div class="banner-content">
        <span class="tag-pro"><i class="fa-solid fa-crown"></i> Mega Project 2026</span>
        <h2>Sistem Manajemen Rumah Sakit Terintegrasi</h2>
        <p>Acara tahunan eksklusif dari CTO Icraft untuk member Pro. Bangun aplikasi full-stack menggunakan Laravel dan Vue.js yang akan dinilai oleh panel ahli dan bisa menjadi portofolio emas Anda.</p>
        
        <!-- MEGA PRIZE POOL SHOWCASE -->
        <div class="mega-prize-pool">
          <div class="prize-glow"></div>
          <div class="prize-content">
            <i class="fa-solid fa-trophy prize-icon gold"></i>
            <div class="prize-text">
              <span class="prize-label">PRIZE POOL</span>
              <h1 class="prize-amount">Rp 5.000.000<span class="plus">+</span></h1>
            </div>
            <i class="fa-solid fa-coins prize-icon silver"></i>
          </div>
          <div class="prize-subtext-container">
            <p class="prize-subtext"><i class="fa-solid fa-money-bills"></i> Uang Tunai Jutaan Rupiah</p>
            <p class="prize-subtext"><i class="fa-solid fa-certificate"></i> Sertifikat Eksklusif Icraft</p>
            <p class="prize-subtext"><i class="fa-solid fa-handshake"></i> Tawaran Tim Inti Icraft</p>
          </div>
        </div>

        <div class="banner-meta">
          <span><i class="fa-regular fa-clock"></i> Berakhir 31 Des 2026</span>
        </div>
      </div>
    </div>
    <PremiumModal v-model="showPremiumModal" />

    <div class="annual-content">
      <div class="req-card">
        <h3><i class="fa-solid fa-list-check"></i> Spesifikasi Proyek</h3>
        <ul class="spec-list">
          <li><strong>Backend:</strong> REST API dengan Laravel 11.</li>
          <li><strong>Frontend:</strong> SPA menggunakan Vue 3 & IcraftDS.</li>
          <li><strong>Fitur Utama:</strong> Reservasi antrean realtime, rekam medis pasien, dan integrasi payment gateway.</li>
          <li><strong>Deployment:</strong> Aplikasi harus dapat diakses secara publik (hosting/VPS).</li>
        </ul>
        <div class="alert-box">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>Dilarang menggunakan template siap pakai (AdminLTE, dll) atau hasil clone dari repository publik lain. Proyek harus orisinal.</p>
        </div>
      </div>

      <div class="submit-card">
        <h3><i class="fa-solid fa-cloud-arrow-up"></i> Area Pengumpulan</h3>
        <p class="submit-desc">Pastikan Anda mengumpulkan kode sumber (Repository) dan tautan aplikasi yang sudah online (Live URL).</p>
        
        <form class="submit-form" @submit.prevent="submitProject">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { EventService } from '../../../services/eventService';
import { useToast } from '../../../composables/useToast';
import { useUserAccount } from '../../../composables/useUserAccount';
import PremiumModal from '../../common/PremiumModal.vue';

const { showToast } = useToast();
const { isPremiumUser } = useUserAccount();
const currentEvent = ref(null);
const isSubmitting = ref(false);
const showPremiumModal = ref(false);

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
  try {
    const res = await EventService.fetchEvents('annual');
    if (res.data && res.data.data && res.data.data.length > 0) {
      currentEvent.value = res.data.data[0];
    } else {
      currentEvent.value = { id: 999 }; // Mock ID
    }
  } catch (error) {
    console.warn('Backend API belum tersedia, menggunakan data mock.');
    currentEvent.value = { id: 999 };
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
<style scoped>
.mega-prize-pool {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 20px;
  padding: 30px;
  margin: 24px 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}
.mega-prize-pool:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 50px rgba(236, 72, 153, 0.25);
}
.prize-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 60%);
  animation: pulseGlow 4s alternate infinite;
  pointer-events: none;
}
@keyframes pulseGlow {
  0% { opacity: 0.5; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1.1); }
}
.prize-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  z-index: 1;
  margin-bottom: 20px;
}
.prize-icon {
  font-size: 3rem;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));
}
.prize-icon.gold {
  color: #fbbf24;
}
.prize-icon.silver {
  color: #94a3b8;
}
.prize-text {
  text-align: center;
}
.prize-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 800;
  color: #f472b6;
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-bottom: 5px;
}
.prize-amount {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(to right, #f472b6, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 5px rgba(236, 72, 153, 0.3));
}
.prize-amount .plus {
  font-size: 2.5rem;
  color: #c084fc;
  -webkit-text-fill-color: initial;
}
.prize-subtext-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  position: relative;
  z-index: 1;
}
.prize-subtext {
  font-size: 0.95rem;
  font-weight: 600;
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.prize-subtext i {
  color: #fbbf24;
}
@media (max-width: 768px) {
  .prize-amount {
    font-size: 2.5rem;
  }
  .prize-icon {
    font-size: 2rem;
  }
  .prize-subtext-container {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}
</style>
