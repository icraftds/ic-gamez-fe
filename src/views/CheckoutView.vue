<template>
  <div class="checkout-view">
    <SimpleBackground />
    
    <div class="checkout-wrapper">
      <!-- Breadcrumb -->
      <div class="checkout-breadcrumb">
        <router-link to="/pricing">Paket</router-link>
        <span class="separator"><i class="fa-solid fa-chevron-right"></i></span>
        <span class="current">Pembayaran</span>
      </div>

      <!-- Step Indicator -->
      <div class="step-indicator">
        <div class="step-dot" :class="{ active: currentStep === 1, done: currentStep > 1 }">
          <i v-if="currentStep > 1" class="fa-solid fa-check"></i>
          <span v-else>1</span>
        </div>
        <div class="step-line" :class="{ done: currentStep > 1 }"></div>
        <div class="step-dot" :class="{ active: currentStep === 2, done: currentStep > 2 }">
          <i v-if="currentStep > 2" class="fa-solid fa-check"></i>
          <span v-else>2</span>
        </div>
        <div class="step-line" :class="{ done: currentStep >= 4 }"></div>
        <div class="step-dot" :class="{ active: currentStep >= 4 }">
          <i v-if="currentStep >= 4" class="fa-solid fa-check"></i>
          <span v-else>3</span>
        </div>
      </div>

      <p v-if="pollingMessage" role="status">{{ pollingMessage }}</p>
      <button v-if="currentStep === 2" class="btn-outline" @click="startPolling">Cek ulang pembayaran</button>
      <!-- Main Card -->
      <div class="checkout-card">
        <Transition name="fade-slide" mode="out-in">
          <CheckoutStepSelection
            v-if="currentStep === 1"
            :planName="planName"
            :planIcon="planIcon"
            :formattedPrice="formattedPrice"
            :planSlug="planSlug"
            :planId="planId"
            :rawPrice="planPrice"
            @instruction="onInstruction"
            @success="handlePaymentSuccess"
            @processing="onProcessing"
          />

          <CheckoutStepInstruction
            v-else-if="currentStep === 2"
            :paymentDetails="paymentDetails"
            :selectedMethod="selectedMethod"
            :planName="planName"
            :planIcon="planIcon"
            :formattedPrice="formattedPrice"
            :discountedPrice="discountedPrice"
            :expiryTime="expiryTime"
            @back="goBackToSelection"
          />

          <CheckoutStepSuccess
            v-else-if="currentStep >= 3"
            :planName="planName"
            :planSlug="planSlug"
            @dashboard="goToDashboard"
          />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserAccount } from '../composables/useUserAccount'
import api from '../services/api'
import { createPaymentPoll } from '../utils/paymentPoll'
import SimpleBackground from '../components/common/SimpleBackground.vue'

import CheckoutStepSelection from '../components/checkout/CheckoutStepSelection.vue'
import CheckoutStepInstruction from '../components/checkout/CheckoutStepInstruction.vue'
import CheckoutStepSuccess from '../components/checkout/CheckoutStepSuccess.vue'

const router = useRouter()
const route = useRoute()
const { userProfile, isPremiumUser, currentPlan, bootstrapSession, fetchUser, fetchWallet, isLoggedIn } = useUserAccount()

const planName = ref(route.query.plan || 'Pro')
const planPrice = ref(Number(route.query.price) || 49000)
const planSlug = ref(route.query.slug || 'pro')
const planId = ref(Number(route.query.id) || 2)
const expiryTime = ref(null)

const planIcon = computed(() => {
  if (planSlug.value === 'expert') return 'fa-solid fa-crown'
  if (planSlug.value === 'pro') return 'fa-solid fa-rocket'
  return 'fa-solid fa-star'
})

const formattedPrice = computed(() => {
  return planPrice.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
})

const currentStep = ref(1)
const paymentDetails = ref({})
const selectedMethod = ref('')
const discountedPrice = ref(null)

const onProcessing = (isProcessing) => {
  // Can be used if parent needs to know processing state (e.g. block navigation)
}

const onInstruction = (data) => {
  paymentDetails.value = data.paymentDetails
  selectedMethod.value = data.selectedMethod
  discountedPrice.value = data.discountedPrice
  
  if (!expiryTime.value) {
    expiryTime.value = Date.now() + 15 * 60 * 1000 // 15 mins default
  }

  // Simpan ke local storage
  localStorage.setItem('ic_pending_checkout', JSON.stringify({
    planSlug: planSlug.value,
    planName: planName.value,
    planIcon: planIcon.value,
    planPrice: planPrice.value,
    discountedPrice: discountedPrice.value,
    paymentDetails: paymentDetails.value,
    selectedMethod: selectedMethod.value,
    expiryTime: expiryTime.value,
    userId: userProfile.value.id,
    savedAt: Date.now()
  }))
  
  currentStep.value = 2
}

const goBackToSelection = () => {
  router.push('/pricing')
}

const handlePaymentSuccess = async () => {
  stopPolling()
  localStorage.removeItem('ic_pending_checkout')
  currentStep.value = 4

  try {
    const confettiModule = await import('canvas-confetti')
    const confetti = confettiModule.default || confettiModule
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#00f0ff', '#7c3aed', '#ec4899', '#f59e0b', '#10b981'] })
    setTimeout(() => {
      confetti({ particleCount: 50, spread: 100, origin: { y: 0.65, x: 0.3 }, colors: ['#00f0ff', '#7c3aed'] })
    }, 250)
    setTimeout(() => {
      confetti({ particleCount: 50, spread: 100, origin: { y: 0.65, x: 0.7 }, colors: ['#ec4899', '#f59e0b'] })
    }, 450)
  } catch (e) {
    console.warn('canvas-confetti not available', e)
  }
}

const pollingMessage = ref('')
const poll = createPaymentPoll(async (isCurrent) => {
  const [user, subscription] = await Promise.all([fetchUser(true), api.get('/subscription')])
  if (!isCurrent()) return false
  const active = subscription.data.data
  const baseline = paymentDetails.value.baselineSubscription
  const newGrant = !baseline || (active && (active.id !== baseline.id || active.expires_at !== baseline.expires_at))
  if (newGrant && user && isPremiumUser.value && currentPlan.value === planSlug.value && active?.status === 'active') {
    await fetchWallet()
    await handlePaymentSuccess()
    return true
  }
  return false
}, { isAuthenticated: () => isLoggedIn.value, onTimeout: () => { pollingMessage.value = 'Pembayaran masih diproses. Cek ulang untuk melihat aktivasi paket.' } })
const startPolling = () => { pollingMessage.value = ''; poll.start() }
const stopPolling = () => poll.stop()

onMounted(async () => {
  await bootstrapSession()
  if (localStorage.getItem('ic_returning_from_payment') === 'true') {
    localStorage.removeItem('ic_returning_from_payment')
    router.replace('/payment/success')
    return
  }

  // Selalu coba restore dari localStorage jika ada pending checkout (agar QR tetap muncul saat refresh)
  const saved = localStorage.getItem('ic_pending_checkout')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data.userId === userProfile.value.id) {
        planName.value = data.planName || planName.value
        planPrice.value = data.planPrice || planPrice.value
        planSlug.value = data.planSlug || planSlug.value
        discountedPrice.value = data.discountedPrice || null
        paymentDetails.value = data.paymentDetails || {}
        selectedMethod.value = data.selectedMethod || 'qris'
        expiryTime.value = data.expiryTime
        currentStep.value = 2
      } else {
        localStorage.removeItem('ic_pending_checkout')
      }
    } catch(e) {}
  }
})

watch(currentStep, (step) => {
  if (step === 2) {
    startPolling()
  } else {
    stopPolling()
  }
})

onUnmounted(() => {
  poll.dispose()
})

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped src="../assets/css/views/CheckoutView.css"></style>
