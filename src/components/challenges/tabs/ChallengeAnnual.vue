<template>
  <div class="challenge-annual">
    <div class="annual-banner">
      <div class="banner-content">
        <span class="tag-pro"><i class="fa-solid fa-crown"></i> Mega Project 2026</span>
        <h2>Sistem Manajemen Rumah Sakit Terintegrasi</h2>
        <p>Acara tahunan eksklusif dari CTO Icraft untuk member Pro. Bangun aplikasi full-stack menggunakan Laravel dan Vue.js yang akan dinilai oleh panel ahli dan bisa menjadi portofolio emas Anda.</p>
        <div class="banner-meta">
          <span><i class="fa-solid fa-money-bill-wave"></i> Total Hadiah Rp 5.000.000+</span>
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
