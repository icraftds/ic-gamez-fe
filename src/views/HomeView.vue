<template>
  <div class="home-view">
    <BackgroundEffects :show-orb3="true" />
    
    <div class="container" style="margin-top: 40px">
      <HeroSection />
      <IntroSection />
      <CyberAdBanner placement="landing" />
      <LearningPathShowcase />
      <!-- Card Stack disimpan dan dimatikan sementara:
      <LearningPathStack />
      -->
    </div>
    <CoffeeModal v-model="showCoffeeModal" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, onMounted, onUnmounted } from 'vue'
import BackgroundEffects from '../components/common/BackgroundEffects.vue'
const CoffeeModal = defineAsyncComponent(() => import('../components/common/CoffeeModal.vue'))
import HeroSection from '../components/home/HeroSection.vue'
import IntroSection from '../components/home/IntroSection.vue'
import LearningPathShowcase from '../components/home/LearningPathShowcase.vue'
// Card Stack disimpan dan dimatikan sementara:
// import LearningPathStack from '../components/home/LearningPathStack.vue'
import CyberAdBanner from '../components/ui/CyberAdBanner.vue'

import { useLearningPaths } from '../composables/useLearningPaths'

const showCoffeeModal = ref(false)
const { paths, isLoading, fetchPaths } = useLearningPaths()

let revealObserver = null
let deferredPathsHandle = null
let deferredPathsUsesIdle = false

function scheduleFetchPaths() {
  if (paths.value.length > 0 || typeof window === 'undefined') return
  const run = () => {
    deferredPathsHandle = null
    if (paths.value.length === 0) fetchPaths()
  }
  if (typeof window.requestIdleCallback === 'function') {
    deferredPathsUsesIdle = true
    deferredPathsHandle = window.requestIdleCallback(run, { timeout: 400 })
  } else {
    deferredPathsUsesIdle = false
    deferredPathsHandle = window.setTimeout(run, 80)
  }
}

function revealFallback() {
  const reveals = document.querySelectorAll('.reveal:not(.active)')
  const windowHeight = window.innerHeight
  reveals.forEach((el) => {
    if (el.getBoundingClientRect().top < windowHeight - 50) {
      el.classList.add('active')
    }
  })
}

onMounted(() => {
  scheduleFetchPaths()

  if (typeof IntersectionObserver !== 'undefined') {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
            revealObserver?.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.01 }
    )
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))
  } else {
    window.addEventListener('scroll', revealFallback, { passive: true })
    setTimeout(revealFallback, 100)
  }
})

onUnmounted(() => {
  if (deferredPathsHandle !== null && typeof window !== 'undefined') {
    if (deferredPathsUsesIdle && typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(deferredPathsHandle)
    } else {
      clearTimeout(deferredPathsHandle)
    }
    deferredPathsHandle = null
  }
  revealObserver?.disconnect()
  revealObserver = null
  window.removeEventListener('scroll', revealFallback)
})
</script>

<style scoped>
</style>
