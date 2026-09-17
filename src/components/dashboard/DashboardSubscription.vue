<template>
  <div class="dash-subscription">
    <h2>Pilih Paket Langganan</h2>
    <p class="subtitle">Tingkatkan pengalaman belajarmu dengan akses penuh ke semua materi premium.</p>

    <!-- Loading State -->
    <div v-if="isLoadingPlans" class="loading-state">
      <div class="spinner-large"></div>
      <p>Memuat paket langganan...</p>
    </div>

    <!-- Plan Selection -->
    <div v-else class="plans-container">
      <!-- Free Plan (Hardcoded default) -->
      <div class="plan-card free" :class="{ active: (currentPlan === 'free' || !currentPlan) && !isPremiumUser }">
        <div class="plan-header">
          <div class="plan-icon"><i class="fa-solid fa-paper-plane"></i></div>
          <h3>Free Plan</h3>
          <p class="price">Rp 0<span>/bulan</span></p>
        </div>
        <ul class="plan-benefits">
          <li><i class="fa-solid fa-check"></i> Akses modul dasar</li>
          <li><i class="fa-solid fa-check"></i> 5 Energy / hari</li>
          <li class="disabled"><i class="fa-solid fa-xmark"></i> Akses konten premium</li>
          <li class="disabled"><i class="fa-solid fa-xmark"></i> Sertifikat kelulusan</li>
          <li class="disabled"><i class="fa-solid fa-xmark"></i> 1-on-1 Mentoring</li>
        </ul>
        <div class="plan-action">
          <div v-if="(currentPlan === 'free' || !currentPlan) && !isPremiumUser" class="active-badge"><i class="fa-solid fa-check-circle"></i> Paket Saat Ini</div>
          <button v-else disabled class="btn-disabled">Paket Dasar</button>
        </div>
      </div>

      <!-- Dynamic Plans from API -->
      <div v-for="plan in plans" :key="plan.id" class="plan-card" :class="[plan.slug, { active: currentPlan === plan.slug || (isPremiumUser && (currentPlan === 'free' || !currentPlan) && plan.slug === 'pro') }]">
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
          <!-- Disabled benefits logic for visual (mocked based on slug) -->
          <li v-if="plan.slug === 'pro'" class="disabled"><i class="fa-solid fa-xmark"></i> Code Review prioritas</li>
          <li v-if="plan.slug === 'pro'" class="disabled"><i class="fa-solid fa-xmark"></i> 1-on-1 Mentoring</li>
        </ul>
        
        <div class="plan-action">
          <div v-if="currentPlan === plan.slug || (isPremiumUser && (currentPlan === 'free' || !currentPlan) && plan.slug === 'pro')" class="active-badge"><i class="fa-solid fa-check-circle"></i> Paket Saat Ini</div>
          <button v-else class="btn-upgrade" :class="plan.slug + '-btn'" @click="selectPlan(plan)">Pilih {{ plan.name }}</button>
        </div>
      </div>
    </div>

    <!-- Checkout Modal / Section -->
    <teleport to="body">
      <div v-if="showCheckout" class="checkout-overlay" @click="closeCheckout">
      <div class="checkout-modal" @click.stop>
        <h3>Selesaikan Pembayaran</h3>
        <p class="checkout-plan-name">Paket: {{ selectedPlan.name }} Plan</p>
        
        <div class="price-summary">
          <div class="summary-row total">
            <span>Harga Paket</span>
            <span>Rp {{ formatPrice(selectedPlan.price) }}</span>
          </div>
        </div>

        <div class="coupon-section">
          <label>Punya Kode Kupon?</label>
          <div class="coupon-input-group">
            <input type="text" v-model="couponCode" placeholder="Masukkan kode kupon" />
          </div>
          <p class="coupon-msg info">Diskon atau bonus durasi akan diterapkan secara otomatis saat Anda menekan tombol Bayar.</p>
        </div>

        <div v-if="isPremiumUser" class="checkout-warning-msg">
          <i class="fa-solid fa-triangle-exclamation"></i>
          Perhatian: Sisa waktu dari paket Anda sebelumnya akan hangus jika Anda menyetujui pembelian ini.
        </div>
        
        <div v-if="checkoutErrorMessage" class="checkout-error-msg">
          <i class="fa-solid fa-circle-exclamation"></i> {{ checkoutErrorMessage }}
        </div>
        <div v-if="checkoutSuccessMessage" class="checkout-success-msg">
          <i class="fa-solid fa-circle-check"></i> {{ checkoutSuccessMessage }}
        </div>

        <div class="checkout-actions">
          <button class="btn-cancel" @click="closeCheckout" :disabled="isLoading">Batal</button>
          <button class="btn-pay" @click="processCheckout" :disabled="isLoading">
            <span v-if="isLoading"><i class="fa-solid fa-spinner fa-spin"></i> Memproses...</span>
            <span v-else>Bayar Sekarang</span>
          </button>
        </div>
      </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserAccount } from '../../composables/useUserAccount'
import api from '../../services/api'

const { isPremiumUser, currentPlan, checkoutPlan, isLoading } = useUserAccount()

const plans = ref([])
const isLoadingPlans = ref(false)

const showCheckout = ref(false)
const selectedPlan = ref(null)

const couponCode = ref('')
const checkoutErrorMessage = ref('')
const checkoutSuccessMessage = ref('')

onMounted(async () => {
  try {
    isLoadingPlans.value = true
    const response = await api.get('/plans')
    // Asumsi format respons { data: [ ... ] }
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

const selectPlan = (plan) => {
  selectedPlan.value = plan
  showCheckout.value = true
  couponCode.value = ''
  checkoutErrorMessage.value = ''
}

const closeCheckout = () => {
  showCheckout.value = false
  checkoutSuccessMessage.value = ''
}

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const processCheckout = async () => {
  checkoutErrorMessage.value = ''
  checkoutSuccessMessage.value = ''
  // Panggil checkout dari composable
  const res = await checkoutPlan(selectedPlan.value.slug || selectedPlan.value.id, couponCode.value)
  if (res.success) {
    checkoutSuccessMessage.value = res.message || 'Pembayaran berhasil!'
    setTimeout(() => {
      showCheckout.value = false
      checkoutSuccessMessage.value = ''
    }, 2000)
  } else {
    checkoutErrorMessage.value = res.message
  }
}
</script>

<style scoped src="../../assets/css/components/dashboard/DashboardSubscription.css"></style>
