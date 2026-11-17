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
import { ref, onMounted, onUnmounted } from 'vue'
import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import CoffeeModal from '../components/common/CoffeeModal.vue'
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
  if (paths.value.length === 0) {
    fetchPaths()
  }

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
  revealObserver?.disconnect()
  revealObserver = null
  window.removeEventListener('scroll', revealFallback)
})
</script>

<style scoped>
</style>
