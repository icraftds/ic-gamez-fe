<template>
  <Teleport to="body">
    <Transition name="expired-modal-fade">
      <div v-if="isOpen" class="expired-modal-overlay" @click.self="dismiss">
        <div class="expired-modal-card" role="dialog" aria-modal="true" aria-labelledby="expired-modal-title">
          <button class="expired-close-btn" @click="dismiss" aria-label="Tutup">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="expired-icon-badge">
            <i class="fa-solid fa-hourglass-end"></i>
          </div>

          <span class="expired-eyebrow">Masa Aktif Berakhir</span>
          <h2 id="expired-modal-title" class="expired-title">
            Paket {{ planLabel }} Kamu Sudah Habis
          </h2>

          <p class="expired-desc">
            Langganan <strong>{{ planLabel }}</strong> kamu telah berakhir
            <span v-if="formattedExpiredDate">pada <strong>{{ formattedExpiredDate }}</strong></span>.
            Perpanjang sekarang agar akses modul pilihan, bonus energi mingguan, dan fitur eksklusif tetap aktif kembali!
          </p>

          <div class="expired-perks-preview">
            <div class="perk-pill">
              <i class="fa-solid fa-bolt"></i>
              <span>Bonus Energi Mingguan</span>
            </div>
            <div class="perk-pill">
              <i class="fa-solid fa-layer-group"></i>
              <span>Akses Modul Premium</span>
            </div>
            <div class="perk-pill">
              <i class="fa-solid fa-tags"></i>
              <span>Hemat hingga 40% (3/6/12 Bln)</span>
            </div>
          </div>

          <div class="expired-actions">
            <button class="btn-renew-primary" @click="goToPricing">
              <i class="fa-solid fa-crown"></i>
              <span>Perpanjang Paket di Halaman Langganan</span>
            </button>
            <button class="btn-renew-secondary" @click="dismiss">
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserAccount } from '../../composables/useUserAccount'

const route = useRoute()
const router = useRouter()
const { isLoggedIn, userProfile, subscriptionInfo, isBootstrapping } = useUserAccount()

const isOpen = ref(false)

const dismissKey = computed(() => {
  const uid = userProfile.value?.id
  const exp = subscriptionInfo.value?.last_expired_at || 'expired'
  return uid ? `ic_expired_sub_dismissed_${uid}_${exp}` : null
})

const planLabel = computed(() => {
  const name = subscriptionInfo.value?.last_expired_plan_name
  if (name) return name
  const slug = subscriptionInfo.value?.last_expired_plan_slug
  if (slug === 'expert') return 'Expert Plan'
  return 'Pro Plan'
})

const formattedExpiredDate = computed(() => {
  const raw = subscriptionInfo.value?.last_expired_at
  if (!raw) return ''
  try {
    return new Date(raw).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return ''
  }
})

const shouldHideOnRoute = computed(() => {
  const hidden = ['pricing', 'checkout', 'payment-success', 'login', 'register', 'auto-login']
  return hidden.includes(route.name)
})

const evaluateModal = () => {
  if (
    isBootstrapping.value ||
    !isLoggedIn.value ||
    shouldHideOnRoute.value ||
    !subscriptionInfo.value?.has_expired_subscription
  ) {
    return
  }

  const key = dismissKey.value
  if (key && typeof window !== 'undefined' && localStorage.getItem(key) === '1') {
    return
  }

  isOpen.value = true
}

watch([isBootstrapping, isLoggedIn, subscriptionInfo, () => route.name], evaluateModal, { immediate: true })

const dismiss = () => {
  isOpen.value = false
  const key = dismissKey.value
  if (key && typeof window !== 'undefined') {
    localStorage.setItem(key, '1')
  }
}

const goToPricing = () => {
  dismiss()
  router.push({ name: 'pricing' })
}
</script>

<style scoped>
.expired-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 99990;
  background: rgba(2, 6, 23, 0.72);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.expired-modal-card {
  position: relative;
  width: 100%;
  max-width: 460px;
  background: linear-gradient(155deg, rgba(15, 23, 42, 0.98) 0%, rgba(17, 24, 39, 0.98) 100%);
  border: 1px solid rgba(56, 189, 248, 0.28);
  border-radius: 20px;
  padding: 32px 28px 26px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), 0 0 36px rgba(56, 189, 248, 0.14);
  color: #f8fafc;
}

.expired-close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(30, 41, 59, 0.65);
  color: #94a3b8;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.expired-close-btn:hover {
  color: #fff;
  border-color: rgba(148, 163, 184, 0.5);
}

.expired-icon-badge {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(234, 88, 12, 0.18));
  border: 1px solid rgba(245, 158, 11, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.65rem;
  color: #fbbf24;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2);
}

.expired-eyebrow {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.25);
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 12px;
}

.expired-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0 0 10px;
  line-height: 1.3;
}

.expired-desc {
  font-size: 0.92rem;
  line-height: 1.6;
  color: #cbd5e1;
  margin: 0 0 20px;
}

.expired-perks-preview {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.perk-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #bae6fd;
  background: rgba(14, 165, 233, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.22);
  padding: 6px 10px;
  border-radius: 999px;
}

.perk-pill i {
  color: #38bdf8;
}

.expired-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-renew-primary {
  width: 100%;
  padding: 13px 18px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-renew-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(14, 165, 233, 0.45);
}

.btn-renew-secondary {
  width: 100%;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: transparent;
  color: #94a3b8;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.btn-renew-secondary:hover {
  color: #e2e8f0;
  border-color: rgba(148, 163, 184, 0.45);
}

.expired-modal-fade-enter-active,
.expired-modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.expired-modal-fade-enter-from,
.expired-modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .expired-modal-overlay {
    padding: 14px;
  }
  .expired-modal-card {
    padding: 24px 18px 20px;
    border-radius: 16px;
    max-height: 90dvh;
    overflow-y: auto;
  }
  .expired-title {
    font-size: 1.15rem;
  }
  .expired-desc {
    font-size: 0.86rem;
  }
}
</style>
