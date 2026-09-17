<template>
  <div class="pricing-view">
    <SimpleBackground />
    <HomeNavbar />

    <div class="pricing-content">
      <div class="header-section">
        <h1 class="gradient-text">Pilih Paket Langganan</h1>
        <p class="subtitle">Tingkatkan pengalaman belajarmu dengan akses penuh ke semua materi premium.</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingPlans" class="loading-state">
        <div class="spinner-large"></div>
        <p>Memuat paket langganan...</p>
      </div>

      <!-- Plan Selection -->
      <div v-else class="plans-container">
        <!-- Free Plan -->
        <div class="plan-card free">
          <div class="plan-header">
            <div class="plan-icon"><i class="fa-solid fa-paper-plane"></i></div>
            <h3>Free Plan</h3>
            <p class="price">Rp 0<span>/bulan</span></p>
          </div>
          <ul class="plan-benefits">
            <li><i class="fa-solid fa-check"></i> Akses modul dasar</li>
            <li><i class="fa-solid fa-check"></i> 10 Energy / hari</li>
            <li class="disabled"><i class="fa-solid fa-xmark"></i> Akses konten premium</li>
            <li class="disabled"><i class="fa-solid fa-xmark"></i> Sertifikat kelulusan</li>
            <li class="disabled"><i class="fa-solid fa-xmark"></i> 1-on-1 Mentoring</li>
          </ul>
          <div class="plan-action">
            <button class="btn-disabled" @click="handlePlanClick('free')">Klaim Gratis</button>
          </div>
        </div>

        <!-- Dynamic Plans from API -->
        <div v-for="plan in plans" :key="plan.id" class="plan-card" :class="[plan.slug]">
          <!-- Optional Badges based on slug -->
          <div v-if="plan.slug === 'pro'" class="badge-popular">Paling Populer</div>
          <div v-else-if="plan.slug === 'expert'" class="badge-premium">Premium</div>
          
          <div class="plan-header">
            <div class="plan-icon" :class="plan.slug + '-icon'">
              <i :class="getPlanIcon(plan.slug)"></i>
            </div>
            <h3>{{ plan.name }}</h3>
            <p class="price">Rp {{ formatPrice(plan.price) }}<span>/{{ plan.duration_in_days }} hari</span></p>
          </div>
          
          <ul class="plan-benefits">
            <li v-for="(benefit, index) in getPlanBenefits(plan.slug)" :key="index">
              <i class="fa-solid fa-check"></i> {{ benefit }}
            </li>
            <li v-if="plan.slug === 'pro'" class="disabled"><i class="fa-solid fa-xmark"></i> Code Review prioritas</li>
            <li v-if="plan.slug === 'pro'" class="disabled"><i class="fa-solid fa-xmark"></i> 1-on-1 Mentoring</li>
          </ul>
          
          <div class="plan-action">
            <button class="btn-upgrade" :class="plan.slug + '-btn'" @click="handlePlanClick(plan.slug)">Pilih {{ plan.name }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Auth Modal -->
    <AuthRequiredModal
      :isOpen="showAuthModal"
      :nextStepLabel="pendingStepLabel"
      @close="showAuthModal = false"
      @login="$router.push('/login')"
      @register="$router.push('/register')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'
import AuthRequiredModal from '../components/common/AuthRequiredModal.vue'

const router = useRouter()

const plans = ref([])
const isLoadingPlans = ref(false)

const showAuthModal = ref(false)
const pendingStepLabel = ref('')

onMounted(async () => {
  try {
    isLoadingPlans.value = true
    const response = await api.get('/plans')
    plans.value = response.data.data || response.data
  } catch (error) {
    console.error('Failed to fetch plans', error)
  } finally {
    isLoadingPlans.value = false
  }
})

const getPlanIcon = (slug) => {
  if (slug === 'pro') return 'fa-solid fa-rocket'
  if (slug === 'expert') return 'fa-solid fa-crown'
  return 'fa-solid fa-star'
}

const getPlanBenefits = (slug) => {
  if (slug === 'pro') {
    return [
      'Semua modul dasar & premium',
      'Unlimited Energy',
      'Sertifikat kelulusan'
    ]
  }
  if (slug === 'expert') {
    return [
      'Semua fitur Pro Plan',
      'Akses awal ke modul baru',
      'Code Review prioritas',
      '1-on-1 Mentoring bulanan',
      'Portofolio review'
    ]
  }
  return ['Akses fitur premium', 'Unlimited Energy', 'Sertifikat kelulusan']
}

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const handlePlanClick = (slug) => {
  if (slug === 'free') {
    pendingStepLabel.value = 'menggunakan fitur gratis'
  } else {
    pendingStepLabel.value = 'melakukan pembayaran'
  }
  showAuthModal.value = true
}
</script>

<style scoped src="../assets/css/views/PricingView.css"></style>
