<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%" overflow="visible" class="cyber-medal-svg">
    <defs>
      <!-- Dynamic Styles -->
      <component :is="'style'" v-if="tier.id === 6">
        .t6-glow { animation: t6Glow 1.2s infinite alternate ease-in-out; }
        @keyframes t6Glow { from { filter: drop-shadow(0 0 2px #FF003C); } to { filter: drop-shadow(0 0 12px #FF0055); } }
      </component>
      <component :is="'style'" v-else-if="tier.id === 7">
        .t7-hue { animation: t7Hue 3s infinite alternate; }
        @keyframes t7Hue { from { filter: hue-rotate(0deg) drop-shadow(0 0 5px #00F0FF); } to { filter: hue-rotate(60deg) drop-shadow(0 0 20px #9D00FF); } }
      </component>

      <!-- Gradients & Filters -->
      <linearGradient :id="'metal_' + tier.id" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :stop-color="tier.color1" />
        <stop offset="50%" stop-color="#1A202C" />
        <stop offset="100%" :stop-color="tier.color2" />
      </linearGradient>
      
      <radialGradient :id="'slot_' + tier.id" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#141B2B" />
        <stop offset="100%" stop-color="#05070B" />
      </radialGradient>
      
      <linearGradient :id="'ribbon_' + tier.id" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" :stop-color="tier.ribbonFill" />
        <stop offset="100%" stop-color="#05080E" />
      </linearGradient>
      
      <filter :id="'glow_' + tier.id" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="10" :flood-color="tier.glow" flood-opacity="0.7"/>
      </filter>
    </defs>

    <g opacity="0.95">
      <path d="M 68,0 L 84,65 L 100,55 L 68,0 Z" :fill="'url(#ribbon_' + tier.id + ')'" :stroke="tier.ribbonBorder" stroke-width="1.2"/>
      <path d="M 132,0 L 116,65 L 100,55 L 132,0 Z" :fill="'url(#ribbon_' + tier.id + ')'" :stroke="tier.ribbonBorder" stroke-width="1.2"/>
      <line x1="78" y1="0" x2="90" y2="50" :stroke="tier.accent" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.7"/>
      <line x1="122" y1="0" x2="110" y2="50" :stroke="tier.accent" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.7"/>
    </g>
    
    <polygon points="86,48 114,48 108,60 92,60" :fill="'url(#metal_' + tier.id + ')'" :stroke="tier.accent" stroke-width="1.2" />
    
    <!-- Wings (Dynamic HTML string) -->
    <g v-html="tier.wings"></g>
    
    <g :filter="'url(#glow_' + tier.id + ')'">
      <polygon :points="tier.polyPoints" :fill="'url(#metal_' + tier.id + ')'" :stroke="tier.color1" stroke-width="2" />
      <circle cx="100" cy="95" r="46" fill="#090E17" :stroke="tier.accent" stroke-width="1.5" />
      <circle cx="100" cy="95" r="43" fill="none" :stroke="tier.color1" stroke-width="1" opacity="0.5" stroke-dasharray="4 2"/>
    </g>
    
    <circle cx="100" cy="54" r="2" :fill="tier.accent" />
    <circle cx="100" cy="136" r="2" :fill="tier.accent" />
    <circle cx="59" cy="95" r="2" :fill="tier.accent" />
    <circle cx="141" cy="95" r="2" :fill="tier.accent" />
    
    <circle cx="100" cy="95" r="37" :fill="'url(#slot_' + tier.id + ')'" :stroke="tier.accent" stroke-width="2" />
    
    <!-- SLOT untuk icon (dimasukkan dari luar) -->
    <g transform="translate(100, 95) scale(0.42) translate(-100, -95)">
      <slot>
        <template v-if="iconType === 'sql'">
          <ellipse cx="100" cy="55" rx="35" ry="12" fill="#FFFFFF"/>
          <path d="M 65,55 L 65,85 A 35 12 0 0 0 135 85 L 135,55 A 35 12 0 0 1 65 55" :fill="tier.accent" opacity="0.7"/>
          <path d="M 65,85 L 65,115 A 35 12 0 0 0 135 115 L 135,85 A 35 12 0 0 1 65 85" :fill="tier.accent" opacity="0.9"/>
          <polyline points="85,95 100,105 115,95" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
          <circle cx="85" cy="95" r="3" :fill="tier.color1"/>
          <circle cx="115" cy="95" r="3" :fill="tier.color1"/>
        </template>
        <template v-else-if="iconType === 'frontend'">
          <rect x="55" y="60" width="90" height="65" rx="6" :fill="tier.accent" opacity="0.15" :stroke="tier.accent" stroke-width="4"/>
          <path d="M 55,75 L 145,75" :stroke="tier.accent" stroke-width="4"/>
          <circle cx="65" cy="67.5" r="2.5" :fill="tier.color1"/>
          <circle cx="75" cy="67.5" r="2.5" fill="#FFFFFF"/>
          <polyline points="85,87 75,97 85,107" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="115,87 125,97 115,107" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="105" y1="85" x2="95" y2="109" :stroke="tier.accent" stroke-width="4" stroke-linecap="round"/>
        </template>
        <template v-else-if="iconType === 'streak'">
          <path d="M 100,135 C 65,135 60,95 78,75 C 90,60 95,45 95,45 C 95,45 105,65 122,70 C 138,75 135,135 100,135 Z" :fill="tier.accent" opacity="0.3"/>
          <path d="M 100,125 C 75,125 72,95 85,80 C 93,70 97,55 97,55 C 97,55 103,70 115,75 C 127,80 125,125 100,125 Z" :fill="tier.accent" opacity="0.6"/>
          <polygon points="105,40 82,90 102,95 90,135 122,80 100,75" fill="#FFFFFF"/>
        </template>
        <template v-else-if="iconType === 'level'">
          <CyberLevel :color="tier.accent" x="35" y="38" width="130" height="130" />
        </template>
        <template v-else-if="iconType === 'crown'">
          <polygon points="65,80 85,125 55,125" :fill="tier.accent" opacity="0.8"/>
          <polygon points="135,80 145,125 115,125" :fill="tier.accent" opacity="0.8"/>
          <polygon points="100,65 75,125 125,125" fill="#FFFFFF"/>
          <path d="M 52,130 C 80,138 120,138 148,130 L 145,140 C 120,148 80,148 55,140 Z" :fill="tier.accent"/>
          <circle cx="100" cy="62" r="4.5" fill="#FFFFFF"/>
          <circle cx="65" cy="78" r="3.5" fill="#FFFFFF"/>
          <circle cx="135" cy="78" r="3.5" fill="#FFFFFF"/>
        </template>
        <template v-else>
          <!-- none -->
          <circle cx="100" cy="95" r="28" fill="none" :stroke="tier.accent" stroke-width="1" stroke-dasharray="3 3" opacity="0.4"/>
        </template>
      </slot>
    </g>
    
    <!-- OVERLAY LOCKED -->
    <g opacity="0.95" v-if="isLocked">
      <rect x="0" y="0" width="200" height="200" fill="#030712" opacity="0.75" />
      <g transform="translate(100, 100) scale(1.8) translate(-12, -12)">
        <rect x="4" y="10" width="16" height="11" rx="2" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
        <path d="M 7,10 V 6 A 5,5 0 0,1 17,6 V 10" fill="none" stroke="#64748B" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="12" cy="15" r="1.5" fill="#94A3B8"/>
        <rect x="11.5" y="15" width="1" height="3" fill="#94A3B8"/>
      </g>
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tierId: {
    type: Number,
    required: true,
    default: 1
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  iconType: {
    type: String,
    default: 'none' // sql, frontend, streak, level, crown, none
  }
})

const TIERS = [
  {
    id: 1, name: "Level 1: Copper Node", tag: "TIER 01 • INITIATE", theme: "Copper & Neon Amber",
    accent: "#FF8C00", badgeClass: "bg-amber-950/60 text-amber-400 border-amber-500/30",
    color1: "#FF9933", color2: "#6B3500", glow: "#FF7700",
    polyPoints: "90,45 110,45 140,75 140,115 110,145 90,145 60,115 60,75",
    ribbonFill: "#421800", ribbonBorder: "#FF7700", wings: ""
  },
  {
    id: 2, name: "Level 10: Neon Carbon", tag: "TIER 02 • OPERATOR", theme: "Carbon Slate & Acid Lime",
    accent: "#00FF66", badgeClass: "bg-emerald-950/60 text-emerald-400 border-emerald-500/30",
    color1: "#00FF66", color2: "#0A3317", glow: "#00FF66",
    polyPoints: "100,40 145,66 145,124 100,150 55,124 55,66",
    ribbonFill: "#062410", ribbonBorder: "#00FF66", 
    wings: `<polygon points="45,95 28,95 38,115 50,110" fill="#00FF66" opacity="0.6"/><polygon points="155,95 172,95 162,115 150,110" fill="#00FF66" opacity="0.6"/>`
  },
  {
    id: 3, name: "Level 25: Cobalt Aegis", tag: "TIER 03 • SPECIALIST", theme: "Chrome & Electric Cyan",
    accent: "#00F0FF", badgeClass: "bg-cyan-950/60 text-cyan-400 border-cyan-500/30",
    color1: "#00F0FF", color2: "#0B273D", glow: "#00F0FF",
    polyPoints: "80,42 120,42 150,72 150,118 120,148 80,148 50,118 50,72",
    ribbonFill: "#061A28", ribbonBorder: "#00F0FF", 
    wings: `<polygon points="42,75 22,65 32,105 48,95" fill="#00F0FF" opacity="0.7"/><polygon points="158,75 178,65 168,105 152,95" fill="#00F0FF" opacity="0.7"/>`
  },
  {
    id: 4, name: "Level 40: Violet Glitch", tag: "TIER 04 • OVERRIDE", theme: "Obsidian & Purple",
    accent: "#B026FF", badgeClass: "bg-purple-950/60 text-purple-400 border-purple-500/30",
    color1: "#D946EF", color2: "#2A0845", glow: "#B026FF",
    polyPoints: "100,32 125,70 160,95 125,120 100,158 75,120 40,95 75,70",
    ribbonFill: "#1F0833", ribbonBorder: "#C026D3", 
    wings: `<path d="M35,95 L15,80 L25,120 Z" fill="#D946EF" opacity="0.8"/><path d="M165,95 L185,80 L175,120 Z" fill="#D946EF" opacity="0.8"/>`
  },
  {
    id: 5, name: "Level 60: Apex Gold Core", tag: "TIER 05 • ELITE", theme: "Hyper Gold",
    accent: "#FFB800", badgeClass: "bg-yellow-950/60 text-yellow-400 border-yellow-500/30",
    color1: "#FFDF00", color2: "#543300", glow: "#FFB800",
    polyPoints: "75,40 125,40 155,70 155,120 125,150 75,150 45,120 45,70",
    ribbonFill: "#2E1B00", ribbonBorder: "#FFB800", 
    wings: `<polygon points="40,65 15,50 25,95 42,90" fill="#FFB800" opacity="0.8"/><polygon points="160,65 185,50 175,95 158,90" fill="#FFB800" opacity="0.8"/><circle cx="100" cy="95" r="58" fill="none" stroke="#FFDF00" stroke-width="1.5" stroke-dasharray="8 4"/>`
  },
  {
    id: 6, name: "Level 80: Crimson Overlord", tag: "TIER 06 • SYNDICATE", theme: "Blood Metal",
    accent: "#FF003C", badgeClass: "bg-rose-950/60 text-rose-400 border-rose-500/30",
    color1: "#FF0055", color2: "#3D000E", glow: "#FF003C",
    polyPoints: "100,30 145,55 165,95 145,135 100,160 55,135 35,95 55,55",
    ribbonFill: "#260009", ribbonBorder: "#FF003C", 
    wings: `<g class="t6-glow">
              <polygon points="32,70 10,45 16,105 35,90" fill="#FF003C"/>
              <polygon points="168,70 190,45 184,105 165,90" fill="#FF003C"/>
              <polygon points="36,110 12,130 30,135" fill="#800018"/>
              <polygon points="164,110 188,130 170,135" fill="#800018"/>
            </g>`
  },
  {
    id: 7, name: "Level 100: Singularity God", tag: "TIER 07 • QUANTUM", theme: "Prismatic God-Tier",
    accent: "#00F0FF", badgeClass: "bg-gradient-to-r from-cyan-950 via-purple-950 to-pink-950 text-white border-pink-500/40",
    color1: "#00FFFF", color2: "#FF007F", glow: "#9D00FF",
    polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50",
    ribbonFill: "#150A2A", ribbonBorder: "#00F0FF", 
    wings: `<g class="t7-hue">
              <polygon points="35,60 8,35 18,95 38,85" fill="#00FFFF" opacity="0.9"/>
              <polygon points="165,60 192,35 182,95 162,85" fill="#FF007F" opacity="0.9"/>
              <polygon points="30,105 5,130 28,130" fill="#8000FF"/>
              <polygon points="170,105 195,130 172,130" fill="#8000FF"/>
            </g>
            <circle cx="100" cy="95" r="62" fill="none" stroke="#FF00AA" stroke-width="1.5" stroke-dasharray="14 6">
              <animateTransform attributeName="transform" type="rotate" from="0 100 95" to="360 100 95" dur="12s" repeatCount="indefinite"/>
            </circle>
            <circle cx="100" cy="95" r="68" fill="none" stroke="#00FFFF" stroke-width="1" stroke-dasharray="4 8">
              <animateTransform attributeName="transform" type="rotate" from="360 100 95" to="0 100 95" dur="18s" repeatCount="indefinite"/>
            </circle>`
  }
]

const tier = computed(() => {
  return TIERS.find(t => t.id === props.tierId) || TIERS[0]
})
</script>

<style>
.cyber-medal-svg {
  filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
}
</style>
