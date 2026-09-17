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

<style scoped>
.dash-subscription h2 { font-size: 1.6rem; margin-bottom: 5px; color: white; }
.subtitle { color: #94a3b8; margin-bottom: 30px; }

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #94a3b8;
}
.spinner-large {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.plans-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.plan-card {
  background: rgba(15, 10, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s ease;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
}

.plan-card.active {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.03);
}

.plan-card.pro {
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.1);
}

.plan-card.pro:hover {
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.2);
}

.plan-card.expert {
  border-color: rgba(139, 92, 246, 0.3);
}

.plan-card.expert:hover {
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
}

.badge-popular {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.badge-premium {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(139, 92, 246, 0.4);
}

.plan-header {
  text-align: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.plan-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #94a3b8;
}

.pro-icon {
  color: #f59e0b;
  text-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
}

.expert-icon {
  color: #8b5cf6;
  text-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
}

.plan-header h3 {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 10px;
  font-weight: 700;
}

.price {
  font-size: 2.2rem;
  font-weight: 800;
  color: white;
}

.price span {
  font-size: 1rem;
  color: #64748b;
  font-weight: 400;
}

.plan-benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
  flex: 1;
}

.plan-benefits li {
  padding: 10px 0;
  color: #cbd5e1;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.plan-benefits li i.fa-check { color: #10b981; }
.plan-benefits li.disabled { color: #64748b; }
.plan-benefits li.disabled i { color: #475569; }

.plan-action {
  text-align: center;
}

.btn-upgrade {
  width: 100%;
  padding: 14px;
  background: #f59e0b;
  color: #0f0a1e;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-upgrade:hover { background: #fbbf24; transform: translateY(-2px); }

.expert-btn {
  background: #8b5cf6;
  color: white;
}
.expert-btn:hover { background: #a78bfa; }

.btn-disabled {
  width: 100%;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: #64748b;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: not-allowed;
}

.active-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #10b981;
  font-weight: 700;
  padding: 14px;
}

/* Checkout Modal */
.checkout-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.checkout-modal {
  background: #1e1b4b;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.checkout-modal h3 {
  color: white;
  font-size: 1.6rem;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 700;
}

.checkout-plan-name {
  color: #cbd5e1;
  margin-bottom: 25px;
  text-align: center;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px;
  border-radius: 8px;
}

.price-summary {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #cbd5e1;
}

.summary-row.total {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0;
}

.coupon-section {
  margin-bottom: 20px;
}

.coupon-section label {
  display: block;
  color: #cbd5e1;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.coupon-input-group {
  display: flex;
  gap: 10px;
}

.coupon-input-group input {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 10px 15px;
  border-radius: 8px;
  color: white;
  outline: none;
}
.coupon-input-group input:focus { border-color: #8b5cf6; }

.coupon-msg.info {
  font-size: 0.85rem;
  margin-top: 8px;
  color: #94a3b8;
}

.checkout-warning-msg {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #fbbf24;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.4;
}
.checkout-warning-msg i {
  margin-top: 2px;
}

.checkout-error-msg {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkout-success-msg {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkout-actions {
  display: flex;
  gap: 15px;
}

.btn-cancel {
  flex: 1;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  color: #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}
.btn-cancel:hover:not(:disabled) { background: rgba(255,255,255,0.05); }

.btn-pay {
  flex: 2;
  padding: 12px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}
.btn-pay:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); transform: translateY(-1px); }
.btn-pay:disabled { opacity: 0.7; cursor: not-allowed; }
</style>
