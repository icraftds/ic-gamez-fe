<template>
  <div class="home-view">
    <BackgroundEffects :show-orb3="true" />
    <HomeNavbar />

    <div class="container" style="margin-top: 40px">
      <HeroSection />
      <IntroSection />
      <LearningPathStack />
      <LeaderboardTable />
    </div>

    <CoffeeModal v-model="showCoffeeModal" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import CoffeeModal from '../components/common/CoffeeModal.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'
import HeroSection from '../components/home/HeroSection.vue'
import IntroSection from '../components/home/IntroSection.vue'
import LearningPathStack from '../components/home/LearningPathStack.vue'
import LeaderboardTable from '../components/home/LeaderboardTable.vue'

const showCoffeeModal = ref(false)

/**
 * Scroll-based reveal animation.
 * Menggunakan logika yang sama persis dengan prototipe HTML asli:
 * elemen dengan class .reveal akan muncul saat posisinya
 * masuk ke viewport (windowHeight - 50px).
 */
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal')
  const windowHeight = window.innerHeight
  reveals.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top
    if (elementTop < windowHeight - 50) {
      el.classList.add('active')
    }
  })
}

onMounted(() => {
  window.addEventListener('scroll', revealOnScroll)
  // Trigger awal agar hero section langsung muncul
  setTimeout(revealOnScroll, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', revealOnScroll)
})
</script>
