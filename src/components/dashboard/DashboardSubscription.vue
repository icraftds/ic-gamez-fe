<template>
  <div class="dash-subscription">
    <h2>Pilih Paket Langganan</h2>
    <p class="subtitle">Tingkatkan pengalaman belajarmu dengan akses penuh ke semua materi premium.</p>

    <!-- Plan Selection -->
    <div class="plans-container">
      <!-- Free Plan -->
      <div class="plan-card free" :class="{ active: currentPlan === 'free' }">
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
          <div v-if="currentPlan === 'free'" class="active-badge"><i class="fa-solid fa-check-circle"></i> Paket Saat Ini</div>
          <button v-else disabled class="btn-disabled">Paket Dasar</button>
        </div>
      </div>

      <!-- Pro Plan -->
      <div class="plan-card pro" :class="{ active: currentPlan === 'pro' }">
        <div class="badge-popular">Paling Populer</div>
        <div class="plan-header">
          <div class="plan-icon pro-icon"><i class="fa-solid fa-rocket"></i></div>
          <h3>Pro Plan</h3>
          <p class="price">Rp 99.000<span>/bulan</span></p>
        </div>
        <ul class="plan-benefits">
          <li><i class="fa-solid fa-check"></i> Semua modul dasar & premium</li>
          <li><i class="fa-solid fa-check"></i> Unlimited Energy</li>
          <li><i class="fa-solid fa-check"></i> Sertifikat kelulusan</li>
          <li class="disabled"><i class="fa-solid fa-xmark"></i> Code Review prioritas</li>
          <li class="disabled"><i class="fa-solid fa-xmark"></i> 1-on-1 Mentoring</li>
        </ul>
        <div class="plan-action">
          <div v-if="currentPlan === 'pro'" class="active-badge"><i class="fa-solid fa-check-circle"></i> Paket Saat Ini</div>
          <button v-else-if="currentPlan === 'expert'" disabled class="btn-disabled">Paket Dibawah</button>
          <button v-else class="btn-upgrade" @click="selectPlan('pro', 99000)">Pilih Pro</button>
        </div>
      </div>

      <!-- Expert Plan -->
      <div class="plan-card expert" :class="{ active: currentPlan === 'expert' }">
        <div class="badge-premium">Premium</div>
        <div class="plan-header">
          <div class="plan-icon expert-icon"><i class="fa-solid fa-crown"></i></div>
          <h3>Expert Plan</h3>
          <p class="price">Rp 150.000<span>/bulan</span></p>
        </div>
        <ul class="plan-benefits">
          <li><i class="fa-solid fa-check"></i> Semua fitur Pro Plan</li>
          <li><i class="fa-solid fa-check"></i> Akses awal ke modul baru</li>
          <li><i class="fa-solid fa-check"></i> Code Review prioritas</li>
          <li><i class="fa-solid fa-check"></i> 1-on-1 Mentoring bulanan</li>
          <li><i class="fa-solid fa-check"></i> Portofolio review</li>
        </ul>
        <div class="plan-action">
          <div v-if="currentPlan === 'expert'" class="active-badge"><i class="fa-solid fa-check-circle"></i> Paket Saat Ini</div>
          <button v-else class="btn-upgrade expert-btn" @click="selectPlan('expert', 150000)">Pilih Expert</button>
        </div>
      </div>
    </div>

    <!-- Checkout Modal / Section -->
    <teleport to="body">
      <div v-if="showCheckout" class="checkout-overlay" @click="closeCheckout">
      <div class="checkout-modal" @click.stop>
        <h3>Selesaikan Pembayaran</h3>
        <p class="checkout-plan-name">Paket: {{ selectedPlan.toUpperCase() }} Plan</p>
        
        <div class="price-summary">
          <div class="summary-row">
            <span>Harga Normal</span>
            <span>Rp {{ formatPrice(selectedPlanPrice) }}</span>
          </div>
          <div v-if="discountAmount > 0" class="summary-row discount">
            <span>Diskon Kupon</span>
            <span>- Rp {{ formatPrice(discountAmount) }}</span>
          </div>
          <hr />
          <div class="summary-row total">
            <span>Total Bayar</span>
            <span>Rp {{ formatPrice(finalPrice) }}</span>
          </div>
        </div>

        <div class="coupon-section">
          <label>Punya Kode Kupon?</label>
          <div class="coupon-input-group">
            <input type="text" v-model="couponCode" placeholder="Masukkan kupon (misal: ICRAFTPRO)" :disabled="isCouponApplied" />
            <button v-if="!isCouponApplied" @click="applyCoupon" class="btn-apply-coupon" :disabled="!couponCode">Terapkan</button>
            <button v-else @click="removeCoupon" class="btn-remove-coupon">Batal</button>
          </div>
          <p v-if="couponMessage" :class="['coupon-msg', isCouponApplied ? 'success' : 'error']">{{ couponMessage }}</p>
        </div>

        <div class="checkout-actions">
          <button class="btn-cancel" @click="closeCheckout">Batal</button>
          <button class="btn-pay" @click="processCheckout" :disabled="isLoading">
            <span v-if="isLoading"><i class="fa-solid fa-spinner fa-spin"></i> Memproses...</span>
            <span v-else>{{ finalPrice === 0 ? 'Tukar Kupon' : 'Bayar Sekarang' }}</span>
          </button>
        </div>
      </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserAccount } from '../../composables/useUserAccount'

const { isPremiumUser, currentPlan, checkoutPlan, isLoading } = useUserAccount()

const showCheckout = ref(false)
const selectedPlan = ref('')
const selectedPlanPrice = ref(0)

const couponCode = ref('')
const isCouponApplied = ref(false)
const discountAmount = ref(0)
const couponMessage = ref('')

const finalPrice = computed(() => {
  return Math.max(0, selectedPlanPrice.value - discountAmount.value)
})

const selectPlan = (plan, price) => {
  selectedPlan.value = plan
  selectedPlanPrice.value = price
  showCheckout.value = true
  // Reset coupon state
  couponCode.value = ''
  isCouponApplied.value = false
  discountAmount.value = 0
  couponMessage.value = ''
}

const closeCheckout = () => {
  showCheckout.value = false
}

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const applyCoupon = () => {
  const code = couponCode.value.toUpperCase()
  
  if (code === 'ICRAFTPRO') {
    isCouponApplied.value = true
    discountAmount.value = selectedPlanPrice.value * 0.2 // 20% discount
    couponMessage.value = 'Kupon berhasil diterapkan! Diskon 20%.'
  } else if (code === 'EXPERT100') {
    isCouponApplied.value = true
    discountAmount.value = selectedPlanPrice.value // 100% discount
    couponMessage.value = 'Kupon berhasil diterapkan! Diskon 100%.'
  } else if (code === 'FREEBIE') {
    isCouponApplied.value = true
    discountAmount.value = 50000 // Rp 50.000 discount
    couponMessage.value = 'Kupon berhasil diterapkan! Potongan Rp 50.000.'
  } else {
    isCouponApplied.value = false
    discountAmount.value = 0
    couponMessage.value = 'Kupon tidak valid atau kadaluarsa.'
  }
}

const removeCoupon = () => {
  couponCode.value = ''
  isCouponApplied.value = false
  discountAmount.value = 0
  couponMessage.value = ''
}

const processCheckout = async () => {
  if (isCouponApplied.value) {
    const res = await checkoutPlan(selectedPlan.value, couponCode.value)
    if (res.success) {
      showCheckout.value = false
    }
  } else {
    // Mock normal payment
    const res = await checkoutPlan(selectedPlan.value)
    if (res.success) {
      showCheckout.value = false
    }
  }
}
</script>

<style scoped>
.dash-subscription h2 { font-size: 1.6rem; margin-bottom: 5px; color: white; }
.subtitle { color: #94a3b8; margin-bottom: 30px; }

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

.summary-row.discount { color: #10b981; }

.price-summary hr {
  border: none;
  border-top: 1px dashed rgba(255,255,255,0.1);
  margin: 15px 0;
}

.summary-row.total {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0;
}

.coupon-section {
  margin-bottom: 30px;
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

.btn-apply-coupon {
  background: #3730a3;
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}
.btn-apply-coupon:hover:not(:disabled) { background: #4338ca; }
.btn-apply-coupon:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-remove-coupon {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.coupon-msg {
  font-size: 0.85rem;
  margin-top: 8px;
}
.coupon-msg.success { color: #10b981; }
.coupon-msg.error { color: #ef4444; }

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
.btn-cancel:hover { background: rgba(255,255,255,0.05); }

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
