<template>
  <div class="fixed-bg">
    <div ref="particlesContainer" id="tech-particles"></div>
    <div ref="orb1" class="orb orb-1"></div>
    <div ref="orb2" class="orb orb-2"></div>
    <div ref="orb3" class="orb orb-3" v-if="showOrb3"></div>
    <div class="grid-bg"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useOrbParallax } from '../../composables/useMouseTracking'
import { useTechParticles } from '../../composables/useTechParticles'

defineProps({
  showOrb3: {
    type: Boolean,
    default: false
  }
})

const orb1 = ref(null)
const orb2 = ref(null)
const orb3 = ref(null)
const particlesContainer = ref(null)

// Orb parallax effect (matches prototype exactly)
useOrbParallax([orb1, orb2, orb3])

// Floating tech particles effect
useTechParticles(particlesContainer)
</script>
