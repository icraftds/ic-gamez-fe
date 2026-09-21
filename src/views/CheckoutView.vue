<template>
  <div class="checkout-view">
    <SimpleBackground />
    <HomeNavbar />

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
        <div class="step-line" :class="{ done: currentStep > 2 }"></div>
        <div class="step-dot" :class="{ active: currentStep >= 3, done: currentStep > 3 }">
          <i v-if="currentStep > 3" class="fa-solid fa-check"></i>
          <span v-else>3</span>
        </div>
      </div>

      <!-- Main Card -->
      <div class="checkout-card">
        <Transition name="fade-slide" mode="out-in">
          <CheckoutStepSelection
            v-if="currentStep === 1"
            :planName="planName"
            :planIcon="planIcon"
            :formattedPrice="formattedPrice"
            :planSlug="planSlug"
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
            :expiryTime="expiryTime"
            @back="goBackToSelection"
          />

          <CheckoutStepProcessing
            v-else-if="currentStep === 3"
          />

          <CheckoutStepSuccess
            v-else-if="currentStep === 4"
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
import SimpleBackground from '../components/common/SimpleBackground.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'

import CheckoutStepSelection from '../components/checkout/CheckoutStepSelection.vue'
import CheckoutStepInstruction from '../components/checkout/CheckoutStepInstruction.vue'
import CheckoutStepProcessing from '../components/checkout/CheckoutStepProcessing.vue'
import CheckoutStepSuccess from '../components/checkout/CheckoutStepSuccess.vue'

const router = useRouter()
const route = useRoute()
const { isPremiumUser, fetchUser } = useUserAccount()

const planName = ref(route.query.plan || 'Pro')
const planPrice = ref(Number(route.query.price) || 49000)
const planSlug = ref(route.query.slug || 'pro')
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

const onProcessing = (isProcessing) => {
  // Can be used if parent needs to know processing state (e.g. block navigation)
}

const onInstruction = (data) => {
  paymentDetails.value = data.paymentDetails
  selectedMethod.value = data.selectedMethod
  
  if (!expiryTime.value) {
    expiryTime.value = Date.now() + 15 * 60 * 1000 // 15 mins
  }

  localStorage.setItem('ic_pending_checkout', JSON.stringify({
    paymentDetails: data.paymentDetails,
    selectedMethod: data.selectedMethod,
    planName: planName.value,
    planPrice: planPrice.value,
    planSlug: planSlug.value,
    expiryTime: expiryTime.value
  }))
  
  currentStep.value = 2
}

const goBackToSelection = () => {
  localStorage.removeItem('ic_pending_checkout')
  expiryTime.value = null
  currentStep.value = 1
}

const handlePaymentSuccess = async () => {
  stopPolling()
  localStorage.removeItem('ic_pending_checkout')
  currentStep.value = 4

  try {
    const confettiModule = await import('canvas-confetti')
    const confetti = confettiModule.default || confettiModule
    confetti({ particleCount: 180, spread: 80, origin: { y: 0.55 }, colors: ['#00f0ff', '#7c3aed', '#ec4899', '#f59e0b', '#10b981'] })
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 120, origin: { y: 0.7, x: 0.3 }, colors: ['#00f0ff', '#7c3aed'] })
    }, 300)
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 120, origin: { y: 0.7, x: 0.7 }, colors: ['#ec4899', '#f59e0b'] })
    }, 500)
  } catch (e) {
    console.warn('canvas-confetti not available', e)
  }
}

let pollingInterval = null
const startPolling = () => {
  stopPolling()
  pollingInterval = setInterval(async () => {
    try {
      await fetchUser()
      if (isPremiumUser.value) {
        handlePaymentSuccess()
      }
    } catch (e) {
      // Ignore polling errors
    }
  }, 4000)
}
const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

onMounted(() => {
  if (route.query.resume === 'true') {
    const saved = localStorage.getItem('ic_pending_checkout')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.expiryTime > Date.now()) {
          planName.value = data.planName
          planPrice.value = data.planPrice
          planSlug.value = data.planSlug
          paymentDetails.value = data.paymentDetails
          selectedMethod.value = data.selectedMethod
          expiryTime.value = data.expiryTime
          currentStep.value = 2
        } else {
          localStorage.removeItem('ic_pending_checkout')
        }
      } catch(e) {}
    }
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
  stopPolling()
})

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped src="../assets/css/views/CheckoutView.css"></style>
