<template>
  <div class="cyber-energy-wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-30 -30 260 260" width="100%" height="100%" style="overflow: visible;">
      <defs>

        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFD700" />
          <stop offset="100%" stop-color="#FF8C00" />
        </linearGradient>
        <filter id="boltGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#FFB800" flood-opacity="0.55"/>
        </filter>
        <filter id="epicGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#FF8C00" flood-opacity="0.8"/>
          <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#FFD700" flood-opacity="1"/>
        </filter>
        
        <!-- Base Reusable Bolt -->
        <g id="baseBolt">
          <path d="M 105,30 L 55,105 L 90,105 L 80,170 L 145,90 L 105,90 Z" 
                fill="url(#boltGrad)" 
                stroke="url(#boltGrad)" 
                stroke-width="12" 
                stroke-linejoin="round" 
                stroke-linecap="round"
                filter="url(#boltGlow)"/>
        </g>
      </defs>
      
      <g v-html="svgContent"></g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pkgId: {
    type: Number,
    default: 1
  },
  isAnimated: {
    type: Boolean,
    default: true
  }
})

const svgContent = computed(() => {
  const id = props.pkgId
  const a = props.isAnimated
  
  if (id === 1) {
    return `<use href="#baseBolt" class="${a ? 'float-energy' : ''}"/>`
  } else if (id === 2) {
    return `
      <g class="${a ? 'float-energy' : ''}">
        <use href="#baseBolt" transform="translate(-25, 10) scale(0.85)" opacity="0.8"/>
        <use href="#baseBolt" transform="translate(15, -10) scale(1)"/>
      </g>`
  } else if (id === 3) {
    return `
      <g class="${a ? 'float-energy' : ''}">
        <use href="#baseBolt" transform="translate(-45, 20) scale(0.7) rotate(-15 100 100)" opacity="0.75"/>
        <use href="#baseBolt" transform="translate(45, 20) scale(0.7) rotate(15 100 100)" opacity="0.75"/>
        <use href="#baseBolt" transform="translate(0, -15) scale(1.05)"/>
      </g>`
  } else if (id === 4) {
    return `
      <g class="${a ? 'float-energy' : ''}">
        <rect x="60" y="45" width="80" height="110" rx="15" fill="#1E293B" stroke="#475569" stroke-width="4"/>
        <rect x="85" y="30" width="30" height="15" rx="4" fill="#64748B"/>
        <rect x="65" y="80" width="70" height="70" rx="10" fill="#FFB800" opacity="0.2" class="${a ? 'pulse-glow-energy' : ''}"/>
        <use href="#baseBolt" transform="translate(0, -5) scale(0.65) translate(25, 30)"/>
        <rect x="65" y="50" width="70" height="25" fill="#0F172A" opacity="0.6"/>
      </g>`
  } else if (id === 5) {
    return `
      <g class="${a ? 'float-energy' : ''}">
        <ellipse cx="100" cy="145" rx="60" ry="25" fill="#B45309" stroke="#F59E0B" stroke-width="3"/>
        <ellipse cx="100" cy="125" rx="60" ry="25" fill="#D97706" stroke="#FBBF24" stroke-width="3"/>
        <ellipse cx="100" cy="105" rx="60" ry="25" fill="#F59E0B" stroke="#FDE047" stroke-width="3"/>
        <ellipse cx="100" cy="85" rx="60" ry="25" fill="#FFB800" stroke="#FEF08A" stroke-width="3"/>
        <use href="#baseBolt" transform="translate(0, -35) scale(0.4) translate(75, 120)"/>
      </g>`
  } else if (id === 6) {
    return `
      <g class="${a ? 'float-energy' : ''}">
        <polygon points="100,20 140,80 120,170 100,190 80,170 60,80" fill="#7C2D12" opacity="0.6"/>
        <polygon points="100,30 130,80 110,160 100,175 90,160 70,80" fill="#B45309" opacity="0.8"/>
        <polygon points="100,40 120,80 105,150 100,160 95,150 80,80" fill="#F59E0B"/>
        <use href="#baseBolt" transform="translate(0, 0) scale(0.8) translate(12, 10)" class="${a ? 'pulse-glow-energy' : ''}"/>
        <polygon points="40,60 50,70 45,85 35,75" fill="#FFD700" class="${a ? 'float-delay-energy' : ''}"/>
        <polygon points="160,110 175,120 165,135 150,125" fill="#FFD700" class="${a ? 'float-delay-energy' : ''}"/>
      </g>`
  } else if (id === 7) {
    return `
      <g class="${a ? 'float-energy' : ''}">
        <polygon points="50,60 150,60 150,150 50,150" fill="#0F172A" stroke="#334155" stroke-width="6"/>
        <rect x="60" y="70" width="80" height="70" fill="#FFB800" opacity="0.4" class="${a ? 'pulse-glow-energy' : ''}"/>
        <use href="#baseBolt" transform="translate(0, -20) scale(0.6) translate(30, 40)"/>
        <polygon points="45,110 155,110 155,155 45,155" fill="#1E293B" stroke="#475569" stroke-width="4"/>
        <polygon points="45,110 155,110 145,125 55,125" fill="#FFD700" opacity="0.8"/>
        <polygon points="55,155 145,155 135,165 65,165" fill="#0F172A"/>
      </g>`
  } else if (id === 8) {
    return `
      <g class="${a ? 'float-energy' : ''}">
        <circle cx="100" cy="100" r="75" fill="#0F172A" stroke="#475569" stroke-width="12"/>
        <circle cx="100" cy="100" r="60" fill="#B45309" stroke="#FFD700" stroke-width="4" opacity="0.5" class="${a ? 'pulse-glow-energy' : ''}"/>
        <path d="M 40,100 A 60 60 0 0 1 100 40 L 100,100 Z" fill="#1E293B" stroke="#94A3B8" stroke-width="2" transform="translate(-10, -10)"/>
        <path d="M 160,100 A 60 60 0 0 1 100 160 L 100,100 Z" fill="#1E293B" stroke="#94A3B8" stroke-width="2" transform="translate(10, 10)"/>
        <path d="M 100,160 A 60 60 0 0 1 40 100 L 100,100 Z" fill="#1E293B" stroke="#94A3B8" stroke-width="2" transform="translate(-10, 10)"/>
        <path d="M 100,40 A 60 60 0 0 1 160 100 L 100,100 Z" fill="#1E293B" stroke="#94A3B8" stroke-width="2" transform="translate(10, -10)"/>
        <use href="#baseBolt" transform="scale(0.85) translate(10, 10)" filter="url(#epicGlow)"/>
      </g>`
  } else if (id === 9) {
    return `
      <g transform="translate(0, 15)">
        <polygon points="35,80 165,80 150,140 50,140" fill="#0B0F19"/>
        <ellipse cx="100" cy="100" rx="70" ry="40" fill="#FF8C00" opacity="0.6" filter="url(#epicGlow)" class="${a ? 'pulse-glow-energy' : ''}"/>
        <use href="#baseBolt" transform="translate(-30, -35) scale(0.5)" opacity="0.8"/>
        <use href="#baseBolt" transform="translate(30, -40) scale(0.6) rotate(20 100 100)" opacity="0.8"/>
        <use href="#baseBolt" transform="translate(-15, -20) scale(0.9) rotate(-10 100 100)" class="${a ? 'float-energy' : ''}"/>
        <use href="#baseBolt" transform="translate(25, -10) scale(0.8) rotate(15 100 100)" class="${a ? 'float-delay-energy' : ''}"/>
        <use href="#baseBolt" transform="translate(5, -15) scale(1)" filter="url(#epicGlow)"/>
        <circle cx="65" cy="125" r="15" fill="url(#boltGrad)" filter="url(#boltGlow)"/>
        <circle cx="135" cy="115" r="18" fill="url(#boltGrad)" filter="url(#boltGlow)"/>
        <circle cx="100" cy="135" r="22" fill="url(#boltGrad)" filter="url(#boltGlow)"/>
        <polygon points="30,120 170,120 155,165 45,165" fill="#1E293B" stroke="#FFB800" stroke-width="3"/>
        <polygon points="40,120 160,120 150,160 50,160" fill="#0F172A"/>
        <rect x="90" y="110" width="20" height="25" rx="3" fill="#334155" stroke="#FFD700" stroke-width="2"/>
        <circle cx="100" cy="122" r="4" fill="#FFB800" filter="url(#boltGlow)"/>
        <polygon points="20,80 180,80 160,35 40,35" fill="#0F172A" stroke="#475569" stroke-width="2" opacity="0.9"/>
        <polygon points="35,75 165,75 150,45 50,45" fill="#1E293B"/>
        ${a ? `
        <circle cx="50" cy="70" r="4" fill="#FFD700" class="spark-energy" filter="url(#boltGlow)"/>
        <circle cx="140" cy="60" r="5" fill="#FFD700" class="spark2-energy" filter="url(#boltGlow)"/>
        <circle cx="100" cy="40" r="3" fill="#FFD700" class="spark-energy" style="animation-delay: 0.5s;" filter="url(#boltGlow)"/>
        ` : ''}
      </g>`
  }
  
  return `<use href="#baseBolt" class="${a ? 'float-energy' : ''}"/>`
})
</script>

<style scoped>
.cyber-energy-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 1em;
  height: 1em;
  vertical-align: middle;
}
.cyber-energy-wrapper svg {
  display: block;
}

:deep(.float-energy) { animation: floatAnimEnergy 3s ease-in-out infinite; }
:deep(.float-delay-energy) { animation: floatAnimEnergy 3s ease-in-out infinite 1.5s; }
:deep(.pulse-glow-energy) { animation: pulseGlowEnergy 2s infinite alternate; }
:deep(.spark-energy) { animation: sparkAnimEnergy 1.5s infinite linear; }
:deep(.spark2-energy) { animation: sparkAnimEnergy 2s infinite linear 1s; }

@keyframes floatAnimEnergy { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
@keyframes pulseGlowEnergy { 0% { filter: drop-shadow(0 0 5px #FFB800); } 100% { filter: drop-shadow(0 0 15px #FF8C00); } }
@keyframes sparkAnimEnergy { 0% { transform: scale(0) translateY(0); opacity: 0; } 50% { opacity: 1; transform: scale(1) translateY(-20px); } 100% { opacity: 0; transform: scale(0) translateY(-40px); } }
</style>
