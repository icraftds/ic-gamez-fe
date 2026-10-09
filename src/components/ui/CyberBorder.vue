<template>
  <div class="cyber-border-wrapper" v-html="svgMarkup"></div>
</template>

<script setup>
import { computed } from 'vue'
import { TIERS } from '../../utils/tiers.js'

const uid = Math.random().toString(36).substring(2, 9);

const props = defineProps({
  tierId: {
    type: [Number, String],
    default: 1
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  accountBadge: {
    type: String,
    default: 'FREE' // PRO, EXPERT, FREE
  },
  avatarUrl: {
    type: String,
    default: ''
  }
})

const tier = computed(() => {
  return TIERS.find(t => t.id === props.tierId) || TIERS[0]
})

function getDynamicSVGStyles(tierId) {
  if (tierId === 'D_EXPERT') {
    return `<style>
      .d-expert-shimmer { animation: dExpertShimmer 3s infinite ease-in-out; }
      .d-expert-shimmer-alt { animation: dExpertShimmer 3s infinite ease-in-out 1.5s; }
      @keyframes dExpertShimmer { 0%, 100% { opacity: 0; } 50% { opacity: 0.8; filter: drop-shadow(0 0 4px #FFF); } }
    </style>`;
  } else if (tierId === 6) {
    return `<style>
      .t6-glow { animation: t6Glow 1.2s infinite alternate ease-in-out; }
      @keyframes t6Glow { from { filter: drop-shadow(0 0 2px #FF003C); } to { filter: drop-shadow(0 0 12px #FF0055); } }
    </style>`;
  } else if (tierId === 7) {
    return `<style>
      .t7-hue { animation: t7Hue 3s infinite alternate; }
      @keyframes t7Hue { from { filter: hue-rotate(0deg) drop-shadow(0 0 5px #00F0FF); } to { filter: hue-rotate(60deg) drop-shadow(0 0 20px #9D00FF); } }
    </style>`;
  } else if (tierId === 'BB3') {
    return `<style>
      .bb3-spin { transform-origin: 100px 100px; animation: bb3Spin 4s linear infinite; }
      .bb3-spin-reverse { transform-origin: 100px 100px; animation: bb3SpinRev 6s linear infinite; }
      @keyframes bb3Spin { 100% { transform: rotate(360deg); } }
      @keyframes bb3SpinRev { 100% { transform: rotate(-360deg); } }
    </style>`;
  } else if (tierId === 'BB4') {
    return `<style>
      .bb4-spin { transform-origin: 100px 100px; animation: bb4Spin 8s linear infinite; }
      .bb4-spin-reverse { transform-origin: 100px 100px; animation: bb4SpinRev 5s linear infinite; }
      .bb4-pulse { animation: bb4Pulse 2s ease-in-out infinite alternate; }
      .bb4-pulse-alt { animation: bb4Pulse 2.5s ease-in-out infinite alternate-reverse; }
      @keyframes bb4Spin { 100% { transform: rotate(360deg); } }
      @keyframes bb4SpinRev { 100% { transform: rotate(-360deg); } }
      @keyframes bb4Pulse { from { opacity: 0.3; filter: drop-shadow(0 0 2px #9D00FF); } to { opacity: 1; filter: drop-shadow(0 0 10px #4B0082); } }
    </style>`;
  } else if (tierId === 'BB5') {
    return `<style>
      .bb5-dash { animation: bb5DashAnim 3s linear infinite; }
      .bb5-pulse { animation: bb5Pulse 1s alternate infinite ease-in-out; }
      @keyframes bb5DashAnim { to { stroke-dashoffset: -90; } }
      @keyframes bb5Pulse { from { opacity: 0.4; filter: drop-shadow(0 0 2px #F7DF1E); } to { opacity: 1; filter: drop-shadow(0 0 10px #F7DF1E); } }
    </style>`;
  } else if (tierId === 'BB6') {
    return `<style>
      .bb6-pulse { animation: bb6Pulse 1.5s alternate infinite ease-in-out; }
      @keyframes bb6Pulse { from { opacity: 0.5; filter: drop-shadow(0 0 2px #3178C6); } to { opacity: 1; filter: drop-shadow(0 0 10px #3178C6); } }
    </style>`;
  } else if (tierId === 'BB7') {
    return `<style>
      .bb7-wave { animation: bb7Wave 3s infinite alternate ease-in-out; }
      @keyframes bb7Wave { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 20; } }
    </style>`;
  } else if (tierId === 'BB8') {
    return `<style>
      .bb8-snake1 { animation: bb8Snake 4s linear infinite; }
      .bb8-snake2 { animation: bb8Snake 4s linear infinite; animation-delay: -2s; }
      @keyframes bb8Snake { 0% { stroke-dashoffset: 880; } 100% { stroke-dashoffset: 0; } }
    </style>`;
  } else if (tierId === 'BB9') {
    return `<style>
      .bb9-spin { transform-origin: 100px 100px; animation: bb9Spin 5s linear infinite; }
      .bb9-spin-rev { transform-origin: 100px 100px; animation: bb9SpinRev 7s linear infinite; }
      @keyframes bb9Spin { to { transform: rotate(360deg); } }
      @keyframes bb9SpinRev { to { transform: rotate(-360deg); } }
    </style>`;
  } else if (tierId === 'BB11') {
    return `<style>
      .bb11-blink { animation: bb11Blink 1s step-end infinite; }
      .bb11-glitch1 { animation: bb11Glitch 3s infinite; }
      .bb11-glitch2 { animation: bb11Glitch 2.5s infinite; animation-delay: 0.5s; }
      .bb11-glitch3 { animation: bb11Glitch 4s infinite; animation-delay: 1.5s; }
      @keyframes bb11Blink { 50% { opacity: 0; } }
      @keyframes bb11Glitch { 0%, 90% { opacity: 1; transform: translateY(0); } 92% { opacity: 0.5; transform: translateY(5px); } 94% { opacity: 1; transform: translateY(-5px); } 96% { opacity: 0; } 98% { opacity: 1; transform: translateY(0); } }
    </style>`;
  } else if (tierId === 'BB13') {
    return `<style>
      .bb13-pulse { animation: bb13Pulse 3s infinite alternate ease-in-out; transform-origin: center; }
      .bb13-pulse-alt { animation: bb13Pulse 3.5s infinite alternate-reverse ease-in-out; transform-origin: center; }
      .bb13-spin { animation: bb13Spin 10s linear infinite; transform-origin: center; }
      .bb13-spin-rev { animation: bb13SpinRev 8s linear infinite; transform-origin: center; }
      @keyframes bb13Pulse { 0% { transform: scale(0.9); } 100% { transform: scale(1.1); } }
      @keyframes bb13Spin { to { transform: rotate(360deg); } }
      @keyframes bb13SpinRev { to { transform: rotate(-360deg); } }
    </style>`;
  }
  return '';
}

function getTierAccents(t, uid) {
  if (t.id === 'D_FREE') return `<rect x="18" y="18" width="164" height="164" rx="36" fill="none" stroke="${t.color1}" stroke-width="2" opacity="0.8"/>`;
  if (t.id === 'D_PRO') return `
    <rect x="14" y="14" width="172" height="172" rx="40" fill="none" stroke="${t.color1}" stroke-width="3" opacity="0.9"/>
    <rect x="20" y="20" width="160" height="160" rx="34" fill="none" stroke="${t.color2}" stroke-width="1.5" opacity="0.6"/>`;
  if (t.id === 'D_EXPERT') return `
    <rect x="14" y="14" width="172" height="172" rx="40" fill="none" stroke="url(#expertGrad_${uid})" stroke-width="4" />
    <rect x="20" y="20" width="160" height="160" rx="34" fill="none" stroke="${t.color1}" stroke-width="1.5" opacity="0.8"/>
    <path d="M 14 80 L 14 120" stroke="#FFF" stroke-width="4" opacity="0" class="d-expert-shimmer" />
    <path d="M 186 80 L 186 120" stroke="#FFF" stroke-width="4" opacity="0" class="d-expert-shimmer-alt" />
    <path d="M 80 14 L 120 14" stroke="#FFF" stroke-width="4" opacity="0" class="d-expert-shimmer" />
    <path d="M 80 186 L 120 186" stroke="#FFF" stroke-width="4" opacity="0" class="d-expert-shimmer-alt" />`;
  if (t.id === 1) return `<rect x="18" y="18" width="164" height="164" rx="38" fill="none" stroke="${t.color1}" stroke-width="1.5" opacity="0.6"/>`;
  if (t.id === 2) return `<rect x="10" y="10" width="180" height="180" rx="42" fill="none" stroke="${t.accent}" stroke-width="2" stroke-dasharray="20 15" opacity="0.8"/>`;
  if (t.id === 3) return `<path d="M 80 5 L 120 5 L 125 15 L 75 15 Z" fill="${t.color1}"/><path d="M 80 195 L 120 195 L 125 185 L 75 185 Z" fill="${t.color1}"/>`;
  if (t.id === 4) return `<rect x="6" y="6" width="188" height="188" rx="46" fill="none" stroke="${t.accent}" stroke-width="1.5" opacity="0.7"/><rect x="18" y="18" width="164" height="164" rx="38" fill="none" stroke="${t.color1}" stroke-width="1.5" opacity="0.7"/>`;
  if (t.id === 5) return `<path d="M 10 50 L 10 40 Q 10 10 40 10 L 50 10 L 50 20 Q 20 20 20 50 Z" fill="${t.color1}" /><path d="M 190 50 L 190 40 Q 190 10 160 10 L 150 10 L 150 20 Q 180 20 180 50 Z" fill="${t.color1}" /><path d="M 10 150 L 10 160 Q 10 190 40 190 L 50 190 L 50 180 Q 20 180 20 150 Z" fill="${t.color1}" /><path d="M 190 150 L 190 160 Q 190 190 160 190 L 150 190 L 150 180 Q 180 180 180 150 Z" fill="${t.color1}" />`;
  if (t.id === 6) return `
    <rect x="5" y="5" width="190" height="190" rx="46" fill="none" stroke="${t.color1}" stroke-width="4" stroke-dasharray="45 25">
      <animate attributeName="stroke-dashoffset" values="0; -140" dur="2s" repeatCount="indefinite" calcMode="linear"/>
    </rect>
    <circle cx="28" cy="28" r="4.5" fill="${t.accent}" class="t6-glow"><animate attributeName="r" values="4.5; 6; 4.5" dur="1s" repeatCount="indefinite" /></circle>
    <circle cx="172" cy="28" r="4.5" fill="${t.accent}" class="t6-glow"><animate attributeName="r" values="4.5; 6; 4.5" dur="1.1s" repeatCount="indefinite" /></circle>
    <circle cx="28" cy="172" r="4.5" fill="${t.accent}" class="t6-glow"><animate attributeName="r" values="4.5; 6; 4.5" dur="1.2s" repeatCount="indefinite" /></circle>
    <circle cx="172" cy="172" r="4.5" fill="${t.accent}" class="t6-glow"><animate attributeName="r" values="4.5; 6; 4.5" dur="0.9s" repeatCount="indefinite" /></circle>`;
  if (t.id === 7) return `
    <rect class="t7-hue" x="2" y="2" width="196" height="196" rx="48" fill="none" stroke="${t.accent}" stroke-width="2.5" stroke-dasharray="25 15 5 15">
      <animate attributeName="stroke-dashoffset" values="0; -120" dur="3s" repeatCount="indefinite" calcMode="linear"/>
    </rect>
    <rect class="t7-hue" x="18" y="18" width="164" height="164" rx="38" fill="none" stroke="${t.color1}" stroke-width="2.5" />
    <circle cx="100" cy="5" r="5" fill="${t.color1}" class="t7-hue"><animateTransform attributeName="transform" type="translate" values="0 0; 0 -6; 0 0" dur="3s" repeatCount="indefinite" /></circle>
    <circle cx="100" cy="195" r="5" fill="${t.color1}" class="t7-hue"><animateTransform attributeName="transform" type="translate" values="0 0; 0 -6; 0 0" dur="3s" begin="0.75s" repeatCount="indefinite" /></circle>
    <circle cx="5" cy="100" r="5" fill="${t.color1}" class="t7-hue"><animateTransform attributeName="transform" type="translate" values="0 0; 0 -6; 0 0" dur="3s" begin="1.5s" repeatCount="indefinite" /></circle>
    <circle cx="195" cy="100" r="5" fill="${t.color1}" class="t7-hue"><animateTransform attributeName="transform" type="translate" values="0 0; 0 -6; 0 0" dur="3s" begin="2.25s" repeatCount="indefinite" /></circle>`;
  if (t.id === 'BB1') return `
    <rect x="8" y="8" width="184" height="184" rx="44" fill="none" stroke="${t.accent}" stroke-width="2" opacity="0.9"/>
    <rect x="14" y="14" width="172" height="172" rx="40" fill="none" stroke="${t.color2}" stroke-width="6"/>
    <path d="M 80 8 L 120 8 L 128 16 L 72 16 Z" fill="${t.accent}"/>
    <path d="M 80 192 L 120 192 L 128 184 L 72 184 Z" fill="${t.accent}"/>
    <path d="M 8 80 L 8 120 L 16 128 L 16 72 Z" fill="${t.accent}"/>
    <path d="M 192 80 L 192 120 L 184 128 L 184 72 Z" fill="${t.accent}"/>`;
  if (t.id === 'BB2') return `
    <rect x="10" y="10" width="180" height="180" rx="42" fill="none" stroke="${t.color1}" stroke-width="4" stroke-dasharray="20 10 5 10"/>
    <polygon points="10,40 40,10 50,10 10,50" fill="${t.color1}" opacity="0.8"/>
    <polygon points="190,40 160,10 150,10 190,50" fill="${t.color1}" opacity="0.8"/>
    <polygon points="10,160 40,190 50,190 10,150" fill="${t.color1}" opacity="0.8"/>
    <polygon points="190,160 160,190 150,190 190,150" fill="${t.color1}" opacity="0.8"/>
    <circle cx="100" cy="100" r="85" fill="none" stroke="${t.accent}" stroke-width="1" opacity="0.3"/>`;
  if (t.id === 'BB3') return `
    <circle cx="100" cy="100" r="92" fill="none" stroke="${t.color1}" stroke-width="3" stroke-dasharray="10 30" class="bb3-spin" />
    <circle cx="100" cy="100" r="86" fill="none" stroke="${t.accent}" stroke-width="2" stroke-dasharray="40 15" class="bb3-spin-reverse" />
    <rect x="15" y="15" width="170" height="170" rx="38" fill="none" stroke="${t.accent}" stroke-width="4" stroke-dasharray="30 40">
      <animate attributeName="stroke-dashoffset" values="0; -140" dur="1.5s" repeatCount="indefinite" calcMode="linear"/>
    </rect>
    <circle cx="100" cy="100" r="70" fill="none" stroke="${t.color1}" stroke-width="1.5" opacity="0.5">
      <animate attributeName="r" values="70; 75; 70" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5; 0.1; 0.5" dur="2s" repeatCount="indefinite" />
    </circle>`;
  if (t.id === 'BB4') return `
    <circle cx="100" cy="100" r="96" fill="none" stroke="${t.accent}" stroke-width="6" stroke-dasharray="4 12" class="bb4-spin" />
    <circle cx="100" cy="100" r="88" fill="none" stroke="${t.color1}" stroke-width="2" stroke-dasharray="50 20" class="bb4-spin-reverse" />
    <path d="M 50 10 Q 100 50 150 10" fill="none" stroke="${t.accent}" stroke-width="3" class="bb4-pulse" />
    <path d="M 50 190 Q 100 150 150 190" fill="none" stroke="${t.accent}" stroke-width="3" class="bb4-pulse" />
    <path d="M 10 50 Q 50 100 10 150" fill="none" stroke="${t.color1}" stroke-width="3" class="bb4-pulse-alt" />
    <path d="M 190 50 Q 150 100 190 150" fill="none" stroke="${t.color1}" stroke-width="3" class="bb4-pulse-alt" />
    <circle cx="100" cy="100" r="80" fill="none" stroke="${t.accent}" stroke-width="1" stroke-dasharray="2 6">
      <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite"/>
    </circle>`;
  if (t.id === 'BB5') return `
    <rect x="15" y="15" width="170" height="170" rx="40" fill="none" stroke="#F7DF1E" stroke-width="4" stroke-dasharray="15 30" class="bb5-dash" />
    <g transform="translate(150, 150)" opacity="0.6">
      <rect x="0" y="0" width="30" height="30" rx="4" fill="#F7DF1E" />
      <text x="28" y="26" font-family="sans-serif" font-weight="bold" font-size="18" fill="#1A1A1A" text-anchor="end">JS</text>
    </g>
    <text x="100" y="32" font-family="monospace" font-weight="bold" font-size="24" fill="#F7DF1E" text-anchor="middle" class="bb5-pulse">{}</text>
    <text x="100" y="185" font-family="monospace" font-weight="bold" font-size="20" fill="#F7DF1E" text-anchor="middle" class="bb5-pulse">&lt;/&gt;</text>
    <path d="M 10 50 L 10 10 L 50 10" fill="none" stroke="#F7DF1E" stroke-width="6"/>
    <path d="M 190 50 L 190 10 L 150 10" fill="none" stroke="#F7DF1E" stroke-width="6"/>
    <path d="M 10 150 L 10 190 L 50 190" fill="none" stroke="#F7DF1E" stroke-width="6"/>
    <path d="M 190 150 L 190 190 L 150 190" fill="none" stroke="#F7DF1E" stroke-width="6"/>`;
  if (t.id === 'BB6') return `
    <rect x="15" y="15" width="170" height="170" rx="40" fill="none" stroke="#3178C6" stroke-width="4" stroke-dasharray="25 25" class="bb6-pulse" />
    <g transform="translate(150, 150)" opacity="0.6">
      <rect x="0" y="0" width="30" height="30" rx="4" fill="#3178C6" />
      <text x="28" y="24" font-family="sans-serif" font-weight="bold" font-size="18" fill="#FFF" text-anchor="end">TS</text>
    </g>
    <text x="100" y="32" font-family="monospace" font-weight="bold" font-size="18" fill="#3178C6" text-anchor="middle" class="bb6-pulse">let x: any;</text>
    <path d="M 10 50 L 10 10 L 50 10" fill="none" stroke="#3178C6" stroke-width="4"/>
    <path d="M 190 50 L 190 10 L 150 10" fill="none" stroke="#3178C6" stroke-width="4"/>
    <path d="M 10 150 L 10 190 L 50 190" fill="none" stroke="#3178C6" stroke-width="4"/>
    <path d="M 190 150 L 190 190 L 150 190" fill="none" stroke="#3178C6" stroke-width="4"/>`;
  if (t.id === 'BB7') return `
    <ellipse cx="100" cy="100" rx="88" ry="88" fill="none" stroke="#777BB4" stroke-width="5" stroke-dasharray="20 40" class="bb7-wave" />
    <g transform="translate(100, 25)" opacity="0.7">
      <ellipse cx="0" cy="0" rx="25" ry="14" fill="#777BB4" />
      <text x="0" y="5" font-family="sans-serif" font-weight="bold" font-style="italic" font-size="14" fill="#FFF" text-anchor="middle">php</text>
    </g>
    <ellipse cx="100" cy="100" rx="94" ry="94" fill="none" stroke="#1A1A1A" stroke-width="4" />
    <path d="M 50 10 Q 100 20 150 10" fill="none" stroke="#777BB4" stroke-width="4" class="bb7-wave" />
    <path d="M 50 190 Q 100 180 150 190" fill="none" stroke="#777BB4" stroke-width="4" class="bb7-wave" />`;
  if (t.id === 'BB8') return `
    <rect x="12" y="12" width="176" height="176" rx="45" fill="none" stroke="#3776AB" stroke-width="6" opacity="0.3"/>
    <g opacity="0.4" transform="translate(100, 25) scale(0.9)">
      <path d="M -8,-10 h 8 q 8,0 8,8 v 4 h -16 q -4,0 -4,4 v 4 h 20 v 4 q 0,8 -8,8 h -8" fill="none" stroke="#3776AB" stroke-width="5" stroke-linecap="round"/>
      <path d="M 8,14 h -8 q -8,0 -8,-8 v -4 h 16 q 4,0 4,-4 v -4 h -20 v -4 q 0,-8 8,-8 h 8" fill="none" stroke="#FFD43B" stroke-width="5" stroke-linecap="round"/>
      <circle cx="-5" cy="-6" r="1.5" fill="#3776AB"/>
      <circle cx="5" cy="10" r="1.5" fill="#FFD43B"/>
    </g>
    <rect x="12" y="12" width="176" height="176" rx="45" fill="none" stroke="#3776AB" stroke-width="6" stroke-dasharray="80 800" stroke-linecap="round" class="bb8-snake1"/>
    <rect x="12" y="12" width="176" height="176" rx="45" fill="none" stroke="#FFD43B" stroke-width="6" stroke-dasharray="80 800" stroke-linecap="round" class="bb8-snake2"/>`;
  if (t.id === 'BB9') return `
    <rect x="18" y="18" width="164" height="164" rx="36" fill="none" stroke="#00ADD8" stroke-width="2"/>
    <g transform="translate(100, 25)" opacity="0.4">
      <text x="-12" y="8" font-family="sans-serif" font-weight="900" font-size="24" font-style="italic" fill="#00ADD8" letter-spacing="-2">GO</text>
      <path d="M 22,-4 L 32,-4 M 20,0 L 30,0 M 18,4 L 28,4" stroke="#00ADD8" stroke-width="2.5" stroke-linecap="round" />
    </g>
    <g class="bb9-spin">
      <circle cx="100" cy="18" r="6" fill="#00ADD8"/>
      <circle cx="100" cy="182" r="6" fill="#00ADD8"/>
      <circle cx="18" cy="100" r="6" fill="#00ADD8"/>
      <circle cx="182" cy="100" r="6" fill="#00ADD8"/>
    </g>
    <g class="bb9-spin-rev">
      <rect x="95" y="5" width="10" height="10" fill="none" stroke="#FFFFFF" stroke-width="2"/>
      <rect x="95" y="185" width="10" height="10" fill="none" stroke="#FFFFFF" stroke-width="2"/>
      <rect x="5" y="95" width="10" height="10" fill="none" stroke="#FFFFFF" stroke-width="2"/>
      <rect x="185" y="95" width="10" height="10" fill="none" stroke="#FFFFFF" stroke-width="2"/>
    </g>`;
  if (t.id === 'BB10') return `
    <polygon points="100,5 195,50 195,150 100,195 5,150 5,50" fill="none" stroke="#CE412B" stroke-width="4"/>
    <g transform="translate(100, 30)" opacity="0.4">
      <circle cx="0" cy="0" r="16" fill="none" stroke="#CE412B" stroke-width="4" stroke-dasharray="4 3"/>
      <circle cx="0" cy="0" r="12" fill="none" stroke="#CE412B" stroke-width="1.5"/>
      <text x="0" y="6" font-family="sans-serif" font-weight="bold" font-size="18" fill="#CE412B" text-anchor="middle">R</text>
    </g>
    <polygon points="100,15 185,55 185,145 100,185 15,145 15,55" fill="none" stroke="#2C2C2C" stroke-width="6"/>
    <circle cx="100" cy="100" r="88" fill="none" stroke="#CE412B" stroke-width="2" stroke-dasharray="10 10"/>
    <path d="M 90 5 L 110 5 L 105 15 L 95 15 Z" fill="#CE412B"/>
    <path d="M 90 195 L 110 195 L 105 185 L 95 185 Z" fill="#CE412B"/>
    <path d="M 5 90 L 5 110 L 15 105 L 15 95 Z" fill="#CE412B"/>
    <path d="M 195 90 L 195 110 L 185 105 L 185 95 Z" fill="#CE412B"/>`;
  if (t.id === 'BB11') return `
    <rect x="10" y="10" width="180" height="180" rx="10" fill="none" stroke="#003300" stroke-width="8"/>
    <rect x="10" y="10" width="180" height="180" rx="10" fill="none" stroke="#00FF00" stroke-width="2"/>
    <text x="25" y="30" font-family="monospace" font-size="14" fill="#00FF00" font-weight="bold">root@sys:~#</text>
    <text x="110" y="30" font-family="monospace" font-size="16" fill="#00FF00" class="bb11-blink">_</text>
    <rect x="15" y="50" width="5" height="15" fill="#00FF00" class="bb11-glitch1"/>
    <rect x="180" y="120" width="5" height="20" fill="#00FF00" class="bb11-glitch2"/>
    <rect x="50" y="180" width="10" height="5" fill="#00FF00" class="bb11-glitch3"/>`;
  if (t.id === 'BB12') return `
    <path d="M 5,5 L 195,195" fill="none" stroke="#DC143C" stroke-width="2" opacity="0.5"/>
    <path d="M 195,5 L 5,195" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.5"/>
    <rect x="12" y="12" width="176" height="176" rx="20" fill="none" stroke="#DC143C" stroke-width="4"/>
    <path d="M 12 50 L 50 12 L 20 12 L 12 20 Z" fill="#FFD700"/>
    <path d="M 188 50 L 150 12 L 180 12 L 188 20 Z" fill="#FFD700"/>
    <path d="M 12 150 L 50 188 L 20 188 L 12 180 Z" fill="#FFD700"/>
    <path d="M 188 150 L 150 188 L 180 188 L 188 180 Z" fill="#FFD700"/>`;
  if (t.id === 'BB13') return `
    <circle cx="100" cy="100" r="90" fill="none" stroke="#8A2BE2" stroke-width="2" />
    <path d="M 10 100 Q 100 -20 190 100 Q 100 220 10 100 Z" fill="none" stroke="#00FFFF" stroke-width="1.5" class="bb13-pulse" />
    <path d="M 100 10 Q -20 100 100 190 Q 220 100 100 10 Z" fill="none" stroke="#8A2BE2" stroke-width="1.5" class="bb13-pulse-alt" />
    <circle cx="100" cy="100" r="75" fill="none" stroke="#00FFFF" stroke-width="4" stroke-dasharray="10 30" class="bb13-spin" />
    <circle cx="100" cy="100" r="82" fill="none" stroke="#8A2BE2" stroke-width="2" stroke-dasharray="40 10" class="bb13-spin-rev" />`;
  return '';
}

const svgMarkup = computed(() => {
  const t = tier.value;
  const customStyles = getDynamicSVGStyles(t.id);
  const tierAccents = getTierAccents(t, uid);
  
  const accountBadgeSVG = props.accountBadge === 'PRO' ? `
    <g transform="translate(100, 188)" class="pro-pulse">
      <rect x="-24" y="-12" width="48" height="24" rx="10" fill="#FFB800" />
      <text x="0" y="4" font-family="sans-serif" font-size="11" font-weight="900" fill="#000000" text-anchor="middle" letter-spacing="0.5">PRO</text>
    </g>` : props.accountBadge === 'EXPERT' ? `
    <g transform="translate(100, 188)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))">
      <rect x="-35" y="-12" width="70" height="24" rx="10" fill="url(#expertGrad_${uid})" />
      <path d="M -25 -5 L -23.5 -1.5 L -20 0 L -23.5 1.5 L -25 5 L -26.5 1.5 L -30 0 L -26.5 -1.5 Z" fill="#FFFFFF" class="expert-sparkle" style="transform-origin: -25px 0px;" />
      <path d="M 22 4 L 23 1 L 26 0 L 23 -1 L 22 -4 L 21 -1 L 18 0 L 21 1 Z" fill="#FFFFFF" class="expert-sparkle-2" style="transform-origin: 22px 0px;" />
      <path d="M -4 -8 L -3 -5.5 L 0 -4.5 L -3 -3.5 L -4 -1 L -5 -3.5 L -8 -4.5 L -5 -5.5 Z" fill="#FFFFFF" class="expert-sparkle" style="transform-origin: -4px -4.5px; animation-delay: 0.8s;" />
      <text x="0" y="4" font-family="sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">EXPERT</text>
    </g>` : '';
  
  const lockedOverlay = props.isLocked ? `
    <g opacity="0.95">
      <rect x="0" y="0" width="200" height="200" fill="#030712" opacity="0.75" />
      <g transform="translate(100, 100) scale(1.8) translate(-12, -12)">
        <rect x="4" y="10" width="16" height="11" rx="2" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
        <path d="M 7,10 V 6 A 5,5 0 0,1 17,6 V 10" fill="none" stroke="#64748B" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="12" cy="15" r="1.5" fill="#94A3B8"/>
        <rect x="11.5" y="15" width="1" height="3" fill="#94A3B8"/>
      </g>
    </g>` : '';
  
  const avatarImageSVG = props.avatarUrl 
    ? `<image href="${props.avatarUrl}" x="25" y="25" width="150" height="150" preserveAspectRatio="xMidYMid slice" />` 
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <style>
      .pro-pulse { animation: proPulse 1.5s infinite alternate ease-in-out; }
      @keyframes proPulse { from { filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.6)); } to { filter: drop-shadow(0 0 16px rgba(255, 140, 0, 1)); } }
      .expert-sparkle { animation: sparkle 2s infinite ease-in-out; }
      .expert-sparkle-2 { animation: sparkle 2.5s infinite ease-in-out 0.5s; }
      @keyframes sparkle { 0% { transform: scale(0.2) rotate(0deg); opacity: 0; } 50% { transform: scale(1.1) rotate(90deg); opacity: 1; } 100% { transform: scale(0.2) rotate(180deg); opacity: 0; } }
    </style>
    ${customStyles}
    <linearGradient id="metal_${t.id}_${uid}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${t.color1}" /><stop offset="40%" stop-color="#1A202C" /><stop offset="100%" stop-color="${t.color2}" /></linearGradient>
    <radialGradient id="slot_${t.id}_${uid}" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#141B2B" /><stop offset="100%" stop-color="#05070B" /></radialGradient>
    <filter id="glow_${t.id}_${uid}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="${t.glow}" flood-opacity="0.75"/></filter>
    <linearGradient id="expertGrad_${uid}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#A225F8" /><stop offset="100%" stop-color="#FF3887" /></linearGradient>
  </defs>

  <mask id="avatarMask_${t.id}_${uid}">
    <rect x="25" y="25" width="150" height="150" rx="35" fill="white"/>
  </mask>
  <g mask="url(#avatarMask_${t.id}_${uid})">
    <rect x="25" y="25" width="150" height="150" fill="url(#slot_${t.id}_${uid})" />
    ${avatarImageSVG}
  </g>

  <g filter="url(#glow_${t.id}_${uid})">
    <rect x="12" y="12" width="176" height="176" rx="42" fill="none" stroke="url(#metal_${t.id}_${uid})" stroke-width="8" />
    <rect x="22" y="22" width="156" height="156" rx="36" fill="none" stroke="${t.color2}" stroke-width="3" />
    ${tierAccents}
  </g>
  ${accountBadgeSVG}
  ${lockedOverlay}
</svg>`;
})
</script>

<style>
.cyber-border-wrapper {
  display: block;
  width: 100%;
  height: 100%;
}
.cyber-border-wrapper svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>