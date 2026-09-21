<template>
  <div class="pricing-view">
    <SimpleBackground />
    <HomeNavbar />

    <div class="pricing-content">
      <div class="header-section">
        <h1 class="gradient-text">Pilih Paket Langganan</h1>
        <p class="subtitle">Tingkatkan pengalaman belajarmu dengan akses penuh ke semua materi premium.</p>
      </div>

      <!-- Pending Transaction Banner -->
      <div v-if="pendingCheckout" class="pending-banner">
        <div class="pending-info">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <div>
            <strong>Menunggu Pembayaran</strong>
            <p>Anda memiliki transaksi {{ pendingCheckout.planName }} Plan yang belum diselesaikan.</p>
          </div>
        </div>
        <button class="btn-resume" @click="resumeCheckout">Lanjutkan Pembayaran</button>
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
            <button class="btn-upgrade" :class="plan.slug + '-btn'" @click="handlePlanClick(plan.slug, plan)">Pilih {{ plan.name }}</button>
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
import { useUserAccount } from '../composables/useUserAccount'

const router = useRouter()
const { isLoggedIn } = useUserAccount()

const plans = ref([])
const isLoadingPlans = ref(false)

const showAuthModal = ref(false)
const pendingStepLabel = ref('')

const pendingCheckout = ref(null)

onMounted(async () => {
  const saved = localStorage.getItem('ic_pending_checkout')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data.expiryTime > Date.now()) {
        pendingCheckout.value = data
      } else {
        localStorage.removeItem('ic_pending_checkout')
      }
    } catch(e) {}
  }

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

const resumeCheckout = () => {
  router.push({ name: 'checkout', query: { resume: 'true' } })
}

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

/**
 * Navigasi ke halaman checkout jika sudah login,
 * atau tampilkan modal auth jika belum.
 */
const handlePlanClick = (slug, plan = null) => {
  if (slug === 'free') {
    if (isLoggedIn.value) {
      alert('Anda sudah berada di Free Plan saat ini.')
      return
    }
    pendingStepLabel.value = 'menggunakan fitur gratis'
    showAuthModal.value = true
  } else {
    if (!isLoggedIn.value) {
      pendingStepLabel.value = 'melakukan pembayaran'
      showAuthModal.value = true
    } else {
      // Arahkan ke halaman checkout dengan query params
      router.push({
        name: 'checkout',
        query: {
          plan: plan ? plan.name : slug,
          price: plan ? plan.price : 0,
          slug: plan ? plan.slug : slug
        }
      })
    }
  }
}
</script>

<style scoped src="../assets/css/views/PricingView.css"></style>

<style scoped>
.pending-banner {
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  animation: slideDown 0.4s ease-out;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.pending-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.pending-info i {
  font-size: 1.8rem;
  color: #f59e0b;
}
.pending-info strong {
  display: block;
  color: #e2e8f0;
  font-size: 1.05rem;
  margin-bottom: 4px;
}
.pending-info p {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
}
.btn-resume {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.btn-resume:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

@media (max-width: 640px) {
  .pending-banner {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  .pending-info {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
