<template>
  <div 
    class="cyber-trophy-wrapper" 
    :class="{ 'is-locked': isLocked, 'is-animated': isAnimated && !isLocked }"
    :style="wrapperStyle"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="20 15 240 235" 
      width="100%" 
      height="100%"
      class="cyber-trophy-svg"
    >
      <defs>
        <!-- Unique Filter Glow -->
        <filter :id="'glow_' + uid" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow 
            dx="0" 
            dy="0" 
            :stdDeviation="isLocked ? 2 : 6" 
            :flood-color="isLocked ? '#475569' : trophyColor" 
            :flood-opacity="isLocked ? 0.3 : 0.8"
          />
        </filter>

        <!-- Unique Metallic Gradient -->
        <linearGradient :id="'metalGrad_' + uid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="isLocked ? '#1e293b' : '#334155'"/>
          <stop offset="50%" :stop-color="isLocked ? '#0f172a' : '#0F172A'"/>
          <stop offset="100%" :stop-color="isLocked ? '#020617' : '#020617'"/>
        </linearGradient>

        <linearGradient :id="'beamGrad_' + uid" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" :stop-color="trophyColor" stop-opacity="0.15"/>
          <stop offset="100%" :stop-color="trophyColor" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- Global 40px Anti-Clip Padding -->
      <g transform="translate(40, 40)">
        <!-- Upward Light Beam -->
        <polygon 
          points="72,150 128,150 175,-15 25,-15" 
          :fill="isLocked ? '#334155' : `url(#beamGrad_${uid})`" 
          :opacity="isLocked ? 0.02 : 0.08"
        />

        <!-- Grand Base Pedestal -->
        <g class="trophy-base">
          <polygon 
            points="10,198 190,198 155,178 45,178" 
            fill="#050811" 
            :stroke="displayColor" 
            stroke-width="2.5" 
            :filter="`url(#glow_${uid})`"
          />
          <polygon 
            points="30,178 170,178 145,162 55,162" 
            fill="#0F172A" 
            :stroke="displayColor" 
            stroke-width="1.8"
          />
          <rect 
            x="68" 
            y="150" 
            width="64" 
            height="12" 
            rx="2" 
            fill="#1E293B" 
            :stroke="displayColor" 
            stroke-width="1.5"
          />
          <rect 
            x="78" 
            y="154" 
            width="44" 
            height="4" 
            :fill="displayColor" 
            :opacity="isLocked ? 0.2 : 0.6"
          />
        </g>

        <!-- Trophy Chalice Body with Float Animation -->
        <g :class="{ 'trophy-float': isAnimated && !isLocked }">
          
          <!-- TIER 1: Copper Circuit -->
          <template v-if="parsedTier === 1">
            <path d="M 52 68 C 24 68 22 118 56 128 L 66 128 C 42 118 40 78 54 78 Z" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="2"/>
            <path d="M 148 68 C 176 68 178 118 144 128 L 134 128 C 158 118 160 78 146 78 Z" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="2"/>
            <path d="M 54 62 L 146 62 L 126 138 L 74 138 Z" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="3" :filter="`url(#glow_${uid})`"/>
            <ellipse cx="100" cy="62" rx="46" ry="9" fill="#0B0F19" :stroke="displayColor" stroke-width="2"/>
            <polygon points="88,138 112,138 106,150 94,150" :fill="displayColor"/>

            <!-- Encircling Orbits -->
            <ellipse cx="100" cy="98" rx="74" ry="20" fill="none" :stroke="displayColor" stroke-width="1.8" stroke-dasharray="14 7" :class="{ 'orbit-flow-1': isAnimated && !isLocked }"/>
            <ellipse cx="100" cy="98" rx="60" ry="12" fill="none" stroke="#FFE0B2" stroke-width="1" opacity="0.4" stroke-dasharray="8 6" :class="{ 'orbit-flow-2': isAnimated && !isLocked }"/>
            <template v-if="isAnimated && !isLocked">
              <g><circle cx="0" cy="0" r="4" fill="#FFE0B2" :filter="`url(#glow_${uid})`"/><animateMotion dur="5s" repeatCount="indefinite" path="M 26,98 a 74,20 0 1,0 148,0 a 74,20 0 1,0 -148,0"/></g>
              <g><circle cx="0" cy="0" r="3" :fill="displayColor"/><animateMotion dur="5s" begin="-2.5s" repeatCount="indefinite" path="M 26,98 a 74,20 0 1,0 148,0 a 74,20 0 1,0 -148,0"/></g>
            </template>

            <!-- Default In-Place Rotating Core (No Icon) -->
            <g v-if="!hasIcon" transform="translate(100, 95)">
              <g :class="{ 'spin-cw': isAnimated && !isLocked }">
                <circle cx="0" cy="0" r="22" fill="none" :stroke="displayColor" stroke-width="4" stroke-dasharray="7 10.3"/>
                <circle cx="0" cy="0" r="16" fill="#0B0F19" :stroke="displayColor" stroke-width="1.5"/>
              </g>
              <g :class="{ 'spin-ccw': isAnimated && !isLocked }">
                <line x1="-12" y1="0" x2="12" y2="0" :stroke="displayColor" stroke-width="2"/>
                <line x1="0" y1="-12" x2="0" y2="12" :stroke="displayColor" stroke-width="2"/>
                <circle cx="0" cy="0" r="6" fill="#FFB870" :filter="`url(#glow_${uid})`"/>
                <circle cx="0" cy="0" r="2.5" fill="#FFF"/>
              </g>
            </g>
          </template>

          <!-- TIER 2: Neon Carbon -->
          <template v-else-if="parsedTier === 2">
            <polygon points="50,60 14,38 28,115 54,105" fill="#050811" :stroke="displayColor" stroke-width="2.5" :filter="`url(#glow_${uid})`"/>
            <polygon points="150,60 186,38 172,115 146,105" fill="#050811" :stroke="displayColor" stroke-width="2.5" :filter="`url(#glow_${uid})`"/>
            <polygon points="100,48 142,74 142,126 100,150 58,126 58,74" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="3.5" :filter="`url(#glow_${uid})`"/>
            <polygon points="100,56 134,77 134,122 100,142 66,122 66,77" fill="none" :stroke="displayColor" stroke-width="1" opacity="0.4"/>

            <g transform="rotate(-14 100 95)">
              <ellipse cx="100" cy="95" rx="78" ry="18" fill="none" :stroke="displayColor" stroke-width="2" stroke-dasharray="16 8" :class="{ 'orbit-flow-1': isAnimated && !isLocked }"/>
              <template v-if="isAnimated && !isLocked">
                <g><circle cx="0" cy="0" r="4.5" fill="#FFFFFF" :filter="`url(#glow_${uid})`"/><animateMotion dur="4.6s" repeatCount="indefinite" path="M 22,95 a 78,18 0 1,0 156,0 a 78,18 0 1,0 -156,0"/></g>
                <g><circle cx="0" cy="0" r="3" :fill="displayColor"/><animateMotion dur="4.6s" begin="-2.3s" repeatCount="indefinite" path="M 22,95 a 78,18 0 1,0 156,0 a 78,18 0 1,0 -156,0"/></g>
              </template>
            </g>

            <g v-if="!hasIcon" transform="translate(100, 95)">
              <g :class="{ 'spin-cw': isAnimated && !isLocked }">
                <polygon points="0,-20 17.3,-10 17.3,10 0,20 -17.3,10 -17.3,-10" fill="none" :stroke="displayColor" stroke-width="2.5" stroke-dasharray="10 8"/>
              </g>
              <g :class="{ 'spin-ccw': isAnimated && !isLocked }">
                <polygon points="0,-12 10.4,6 -10.4,6" :fill="displayColor" opacity="0.8" :filter="`url(#glow_${uid})`"/>
                <circle cx="0" cy="0" r="4.5" fill="#FFFFFF"/>
              </g>
            </g>
          </template>

          <!-- TIER 3: Cobalt Aegis -->
          <template v-else-if="parsedTier === 3">
            <polygon points="48,70 18,80 34,134 54,122" fill="#0C1526" :stroke="displayColor" stroke-width="2.2"/>
            <polygon points="152,70 182,80 166,134 146,122" fill="#0C1526" :stroke="displayColor" stroke-width="2.2"/>
            <path d="M 50 62 C 50 135 100 155 100 155 C 100 155 150 135 150 62 Z" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="3.5" :filter="`url(#glow_${uid})`"/>
            <ellipse cx="100" cy="62" rx="50" ry="10" fill="#0B0F19" :stroke="displayColor" stroke-width="2"/>

            <ellipse cx="100" cy="95" rx="80" ry="22" fill="none" :stroke="displayColor" stroke-width="2" stroke-dasharray="20 10" :class="{ 'orbit-flow-1': isAnimated && !isLocked }"/>
            <ellipse cx="100" cy="95" rx="88" ry="13" fill="none" stroke="#FFFFFF" stroke-width="1.2" opacity="0.5" stroke-dasharray="10 15" :class="{ 'orbit-flow-2': isAnimated && !isLocked }"/>
            <template v-if="isAnimated && !isLocked">
              <g><circle cx="0" cy="0" r="4.5" fill="#00F0FF" :filter="`url(#glow_${uid})`"/><animateMotion dur="5.2s" repeatCount="indefinite" path="M 20,95 a 80,22 0 1,0 160,0 a 80,22 0 1,0 -160,0"/></g>
              <g><circle cx="0" cy="0" r="3" fill="#FFFFFF"/><animateMotion dur="5.2s" begin="-2.6s" repeatCount="indefinite" path="M 20,95 a 80,22 0 1,0 160,0 a 80,22 0 1,0 -160,0"/></g>
            </template>

            <g v-if="!hasIcon" transform="translate(100, 95)">
              <g :class="{ 'spin-cw': isAnimated && !isLocked }">
                <circle cx="0" cy="0" r="25" fill="none" :stroke="displayColor" stroke-width="2" stroke-dasharray="14 10 4 10"/>
                <line x1="-28" y1="0" x2="-22" y2="0" :stroke="displayColor" stroke-width="2.5"/>
                <line x1="22" y1="0" x2="28" y2="0" :stroke="displayColor" stroke-width="2.5"/>
              </g>
              <g :class="{ 'spin-ccw': isAnimated && !isLocked }">
                <circle cx="0" cy="0" r="16" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="8 8"/>
                <circle cx="0" cy="0" r="7" :fill="displayColor" :filter="`url(#glow_${uid})`"/>
                <circle cx="0" cy="0" r="2.5" fill="#FFF"/>
              </g>
            </g>
          </template>

          <!-- TIER 4: Violet Glitch -->
          <template v-else-if="parsedTier === 4">
            <path d="M 58 70 L 16 48 L 36 112 L 64 116" fill="#070312" :stroke="displayColor" stroke-width="2.5"/>
            <path d="M 142 62 L 186 46 L 166 110 L 136 118" fill="#070312" :stroke="displayColor" stroke-width="2.5"/>
            <polygon points="56,60 144,52 132,136 68,142" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="3" :filter="`url(#glow_${uid})`"/>
            <polygon points="90,142 110,138 106,152 94,152" :fill="displayColor"/>

            <ellipse cx="100" cy="96" rx="76" ry="22" fill="none" :stroke="displayColor" stroke-width="1.8" stroke-dasharray="14 8 4 8" :class="{ 'orbit-flow-1': isAnimated && !isLocked }"/>
            <template v-if="isAnimated && !isLocked">
              <g><polygon points="0,-4 3,3 -3,3" fill="#FF77FF" :filter="`url(#glow_${uid})`"/><animateMotion dur="4.4s" repeatCount="indefinite" path="M 24,96 a 76,22 0 1,0 152,0 a 76,22 0 1,0 -152,0"/></g>
              <g><polygon points="0,-3 3,3 -3,3" fill="#B026FF"/><animateMotion dur="4.4s" begin="-2.2s" repeatCount="indefinite" path="M 24,96 a 76,22 0 1,0 152,0 a 76,22 0 1,0 -152,0"/></g>
            </template>

            <g v-if="!hasIcon" transform="translate(100, 95)">
              <g :class="{ 'spin-cw': isAnimated && !isLocked }">
                <polygon points="0,-22 15,0 0,22 -15,0" fill="none" :stroke="displayColor" stroke-width="2.5"/>
                <polygon points="0,-14 9,0 0,14 -9,0" :fill="displayColor" opacity="0.6" :filter="`url(#glow_${uid})`"/>
              </g>
              <g :class="{ 'spin-ccw': isAnimated && !isLocked }">
                <polygon points="-12,-12 12,-12 12,12 -12,12" fill="none" stroke="#FF00FF" stroke-width="1.5" stroke-dasharray="6 6"/>
                <circle cx="0" cy="0" r="5" fill="#FFF" :filter="`url(#glow_${uid})`"/>
              </g>
            </g>
          </template>

          <!-- TIER 5: Hyper Gold -->
          <template v-else-if="parsedTier === 5">
            <path d="M 50 60 C 14 50 14 122 58 132 C 34 112 34 72 58 72 Z" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="3"/>
            <path d="M 150 60 C 186 50 186 122 142 132 C 166 112 166 72 142 72 Z" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="3"/>
            <path d="M 54 58 C 54 122 80 142 100 142 C 120 142 146 122 146 58 Z" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="3.5" :filter="`url(#glow_${uid})`"/>
            <ellipse cx="100" cy="58" rx="46" ry="10" fill="#0B0F19" :stroke="displayColor" stroke-width="2"/>
            <polygon points="88,142 112,142 106,154 94,154" :fill="displayColor"/>

            <ellipse cx="100" cy="96" rx="82" ry="24" fill="none" :stroke="displayColor" stroke-width="2" stroke-dasharray="16 10" :class="{ 'orbit-flow-1': isAnimated && !isLocked }"/>
            <ellipse cx="100" cy="96" rx="70" ry="14" fill="none" stroke="#FFF" stroke-width="1" opacity="0.5" stroke-dasharray="8 6" :class="{ 'orbit-flow-2': isAnimated && !isLocked }"/>
            <template v-if="isAnimated && !isLocked">
              <g><circle cx="0" cy="0" r="5" fill="#FFF6B7" :filter="`url(#glow_${uid})`"/><animateMotion dur="5.5s" repeatCount="indefinite" path="M 18,96 a 82,24 0 1,0 164,0 a 82,24 0 1,0 -164,0"/></g>
              <g><circle cx="0" cy="0" r="3.5" :fill="displayColor"/><animateMotion dur="5.5s" begin="-2.75s" repeatCount="indefinite" path="M 18,96 a 82,24 0 1,0 164,0 a 82,24 0 1,0 -164,0"/></g>
            </template>

            <g v-if="!hasIcon" transform="translate(100, 95)">
              <g :class="{ 'spin-cw': isAnimated && !isLocked }">
                <path d="M 0,-24 L 0,-18 M 0,18 L 0,24 M -24,0 L -18,0 M 18,0 L 24,0 M -17,-17 L -13,-13 M 13,13 L 17,17 M -17,17 L -13,13 M 13,-13 L 17,-17" :stroke="displayColor" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="0" cy="0" r="16" fill="none" :stroke="displayColor" stroke-width="2" stroke-dasharray="8 4"/>
              </g>
              <g :class="{ 'spin-ccw': isAnimated && !isLocked }">
                <circle cx="0" cy="0" r="10" :fill="displayColor" :filter="`url(#glow_${uid})`"/>
                <circle cx="0" cy="0" r="4.5" fill="#FFFFFF"/>
              </g>
            </g>
          </template>

          <!-- TIER 6: Crimson Mecha -->
          <template v-else-if="parsedTier === 6">
            <path d="M 44 146 L 70 100 L 38 52 L 60 52 L 86 94 L 86 146 Z" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="2.8" :filter="`url(#glow_${uid})`"/>
            <path d="M 156 146 L 130 100 L 162 52 L 140 52 L 114 94 L 114 146 Z" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="2.8" :filter="`url(#glow_${uid})`"/>
            <rect x="78" y="66" width="44" height="66" rx="6" fill="#070B14" :stroke="displayColor" stroke-width="2"/>

            <ellipse cx="100" cy="96" rx="76" ry="20" fill="none" :stroke="displayColor" stroke-width="1.8" stroke-dasharray="14 6" :class="{ 'orbit-flow-1': isAnimated && !isLocked }"/>
            <template v-if="isAnimated && !isLocked">
              <g><polygon points="0,-4 3,3 -3,3" fill="#FFFFFF" :filter="`url(#glow_${uid})`"/><animateMotion dur="4.8s" repeatCount="indefinite" path="M 24,96 a 76,20 0 1,0 152,0 a 76,20 0 1,0 -152,0"/></g>
              <g><circle cx="0" cy="0" r="3.5" :fill="displayColor"/><animateMotion dur="4.8s" begin="-2.4s" repeatCount="indefinite" path="M 24,96 a 76,20 0 1,0 152,0 a 76,20 0 1,0 -152,0"/></g>
            </template>

            <g v-if="!hasIcon" transform="translate(100, 95)">
              <g :class="{ 'spin-cw': isAnimated && !isLocked }">
                <circle cx="0" cy="0" r="22" fill="none" :stroke="displayColor" stroke-width="2" stroke-dasharray="14 10 4 10"/>
                <line x1="-25" y1="0" x2="-16" y2="0" :stroke="displayColor" stroke-width="2.5"/>
                <line x1="16" y1="0" x2="25" y2="0" :stroke="displayColor" stroke-width="2.5"/>
                <line x1="0" y1="-25" x2="0" y2="-16" :stroke="displayColor" stroke-width="2.5"/>
                <line x1="0" y1="16" x2="0" y2="25" :stroke="displayColor" stroke-width="2.5"/>
              </g>
              <g :class="{ 'spin-ccw': isAnimated && !isLocked }">
                <circle cx="0" cy="0" r="10" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="4 4"/>
                <circle cx="0" cy="0" r="4.5" fill="#FF003C" :filter="`url(#glow_${uid})`"/>
              </g>
            </g>
          </template>

          <!-- TIER 7: Platinum Orbital -->
          <template v-else-if="parsedTier === 7">
            <path d="M 58 64 C 22 64 22 124 74 132 M 142 64 C 178 64 178 124 126 132" fill="none" :stroke="displayColor" stroke-width="2.5"/>
            <path d="M 58 62 L 142 62 L 126 138 L 74 138 Z" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="3" :filter="`url(#glow_${uid})`"/>
            <ellipse cx="100" cy="62" rx="42" ry="9" fill="#0B0F19" :stroke="displayColor" stroke-width="2"/>

            <g transform="rotate(22 100 96)">
              <ellipse cx="100" cy="96" rx="76" ry="18" fill="none" :stroke="displayColor" stroke-width="1.8" stroke-dasharray="15 8" :class="{ 'orbit-flow-1': isAnimated && !isLocked }"/>
              <template v-if="isAnimated && !isLocked">
                <g><circle cx="0" cy="0" r="4" fill="#FFF" :filter="`url(#glow_${uid})`"/><animateMotion dur="5s" repeatCount="indefinite" path="M 24,96 a 76,18 0 1,0 152,0 a 76,18 0 1,0 -152,0"/></g>
              </template>
            </g>
            <g transform="rotate(-22 100 96)">
              <ellipse cx="100" cy="96" rx="76" ry="18" fill="none" stroke="#60A5FA" stroke-width="1.5" stroke-dasharray="10 6" :class="{ 'orbit-flow-2': isAnimated && !isLocked }"/>
              <template v-if="isAnimated && !isLocked">
                <g><circle cx="0" cy="0" r="3.5" fill="#60A5FA"/><animateMotion dur="5.6s" repeatCount="indefinite" path="M 24,96 a 76,18 0 1,0 152,0 a 76,18 0 1,0 -152,0"/></g>
              </template>
            </g>

            <g v-if="!hasIcon" transform="translate(100, 95)">
              <g :class="{ 'spin-cw': isAnimated && !isLocked }">
                <polygon points="0,-20 14,-7 14,7 0,20 -14,7 -14,-7" fill="none" :stroke="displayColor" stroke-width="2.5"/>
              </g>
              <g :class="{ 'spin-ccw': isAnimated && !isLocked }">
                <polygon points="0,-12 12,0 0,12 -12,0" fill="#FFFFFF" opacity="0.8" :filter="`url(#glow_${uid})`"/>
                <circle cx="0" cy="0" r="4" fill="#00E5FF"/>
              </g>
            </g>
          </template>

          <!-- TIER 8: Obsidian Void -->
          <template v-else-if="parsedTier === 8">
            <path d="M 24 70 L 60 90 M 176 70 L 140 90 M 34 126 L 70 116 M 166 126 L 130 116" :stroke="displayColor" stroke-width="3" stroke-linecap="round"/>
            <polygon points="48,60 152,60 136,136 64,136" fill="#02040A" :stroke="displayColor" stroke-width="3.2" :filter="`url(#glow_${uid})`"/>

            <ellipse cx="100" cy="96" rx="80" ry="22" fill="none" :stroke="displayColor" stroke-width="2" stroke-dasharray="14 10" :class="{ 'orbit-flow-1': isAnimated && !isLocked }"/>
            <ellipse cx="100" cy="96" rx="66" ry="14" fill="none" stroke="#FF77FF" stroke-width="1" opacity="0.4" stroke-dasharray="8 6" :class="{ 'orbit-flow-2': isAnimated && !isLocked }"/>
            <template v-if="isAnimated && !isLocked">
              <g><circle cx="0" cy="0" r="4.5" fill="#FF77FF" :filter="`url(#glow_${uid})`"/><animateMotion dur="4.6s" repeatCount="indefinite" path="M 20,96 a 80,22 0 1,0 160,0 a 80,22 0 1,0 -160,0"/></g>
              <g><circle cx="0" cy="0" r="3" fill="#8A2BE2"/><animateMotion dur="4.6s" begin="-2.3s" repeatCount="indefinite" path="M 20,96 a 80,22 0 1,0 160,0 a 80,22 0 1,0 -160,0"/></g>
            </template>

            <g v-if="!hasIcon" transform="translate(100, 95)">
              <g :class="{ 'spin-cw': isAnimated && !isLocked }">
                <circle cx="0" cy="0" r="24" fill="none" :stroke="displayColor" stroke-width="2.5" stroke-dasharray="24 8 8 8"/>
              </g>
              <g :class="{ 'spin-ccw': isAnimated && !isLocked }">
                <circle cx="0" cy="0" r="16" fill="#000000" stroke="#FF00FF" stroke-width="2"/>
                <circle cx="0" cy="0" r="6" :fill="displayColor" :filter="`url(#glow_${uid})`"/>
                <circle cx="0" cy="0" r="2" fill="#FFF"/>
              </g>
            </g>
          </template>

          <!-- TIER 9: Quantum Apex -->
          <template v-else-if="parsedTier === 9">
            <polygon points="48,64 152,64 100,146" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="3.5" :filter="`url(#glow_${uid})`"/>
            <polygon points="64,70 136,70 100,132" fill="none" stroke="#FF00FF" stroke-width="2" opacity="0.8"/>
            <polygon points="88,146 112,146 106,154 94,154" :fill="displayColor"/>

            <ellipse cx="100" cy="96" rx="76" ry="20" fill="none" :stroke="displayColor" stroke-width="1.8" stroke-dasharray="14 8" :class="{ 'orbit-flow-1': isAnimated && !isLocked }"/>
            <ellipse cx="100" cy="96" rx="82" ry="14" fill="none" stroke="#FF00FF" stroke-width="1.5" stroke-dasharray="8 6" :class="{ 'orbit-flow-2': isAnimated && !isLocked }"/>
            <template v-if="isAnimated && !isLocked">
              <g><circle cx="0" cy="0" r="4" fill="#00FFFF" :filter="`url(#glow_${uid})`"/><animateMotion dur="4.2s" repeatCount="indefinite" path="M 24,96 a 76,20 0 1,0 152,0 a 76,20 0 1,0 -152,0"/></g>
              <g><circle cx="0" cy="0" r="3.5" fill="#FF00FF" :filter="`url(#glow_${uid})`"/><animateMotion dur="5s" repeatCount="indefinite" path="M 18,96 a 82,14 0 1,0 164,0 a 82,14 0 1,0 -164,0"/></g>
            </template>

            <g v-if="!hasIcon" transform="translate(100, 95)">
              <g :class="{ 'spin-cw': isAnimated && !isLocked }">
                <polygon points="0,-18 16,-9 16,9 0,18 -16,9 -16,-9" fill="none" :stroke="displayColor" stroke-width="2"/>
                <polygon points="-12,-12 12,-12 12,12 -12,12" fill="none" stroke="#FF00FF" stroke-width="1.5" stroke-dasharray="6 6"/>
              </g>
              <g :class="{ 'spin-ccw': isAnimated && !isLocked }">
                <polygon points="0,-10 10,0 0,10 -10,0" fill="#00FFFF" opacity="0.8" :filter="`url(#glow_${uid})`"/>
                <circle cx="0" cy="0" r="4" fill="#FFFFFF"/>
              </g>
            </g>
          </template>

          <!-- TIER 10: Singularity God (Default God Tier) -->
          <template v-else>
            <!-- Celestial God Angelic Wings -->
            <path d="M 58 146 C 0 116 0 46 28 16 C 48 56 58 86 68 106 Z" fill="#070A12" :stroke="displayColor" stroke-width="3" :filter="`url(#glow_${uid})`"/>
            <path d="M 48 136 C 14 106 14 56 34 30 C 48 60 54 86 64 106 Z" :fill="displayColor" opacity="0.3"/>
            <path d="M 142 146 C 200 116 200 46 172 16 C 152 56 142 86 132 106 Z" fill="#070A12" :stroke="displayColor" stroke-width="3" :filter="`url(#glow_${uid})`"/>
            <path d="M 152 136 C 186 106 186 56 166 30 C 152 60 146 86 136 106 Z" :fill="displayColor" opacity="0.3"/>

            <!-- Imperial Cosmic Chalice -->
            <path d="M 54 54 L 146 54 L 130 126 L 70 126 Z" :fill="`url(#metalGrad_${uid})`" :stroke="displayColor" stroke-width="4" :filter="`url(#glow_${uid})`"/>
            <ellipse cx="100" cy="54" rx="46" ry="10" fill="#0B0F19" :stroke="displayColor" stroke-width="2"/>
            <polygon points="70,54 130,54 125,24 75,24" fill="none" :stroke="displayColor" stroke-width="2" stroke-dasharray="6 3"/>

            <!-- Encircling Cosmic Orbits -->
            <ellipse cx="100" cy="92" rx="90" ry="26" fill="none" :stroke="displayColor" stroke-width="2.5" stroke-dasharray="24 12" :class="{ 'orbit-flow-1': isAnimated && !isLocked }"/>
            <ellipse cx="100" cy="92" rx="75" ry="15" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity="0.7" stroke-dasharray="10 8" :class="{ 'orbit-flow-2': isAnimated && !isLocked }"/>
            <template v-if="isAnimated && !isLocked">
              <g><circle cx="0" cy="0" r="6" fill="#FFFFFF" :filter="`url(#glow_${uid})`"/><circle cx="0" cy="0" r="3" :fill="displayColor"/><animateMotion dur="6s" repeatCount="indefinite" path="M 10,92 a 90,26 0 1,0 180,0 a 90,26 0 1,0 -180,0"/></g>
              <g><circle cx="0" cy="0" r="5" fill="#FFE082" :filter="`url(#glow_${uid})`"/><circle cx="0" cy="0" r="2.5" fill="#FFFFFF"/><animateMotion dur="6s" begin="-3s" repeatCount="indefinite" path="M 10,92 a 90,26 0 1,0 180,0 a 90,26 0 1,0 -180,0"/></g>
            </template>

            <!-- Default In-Place Rotating Mandala (No Icon) -->
            <g v-if="!hasIcon" transform="translate(100, 92)">
              <g :class="{ 'spin-cw': isAnimated && !isLocked }">
                <circle cx="0" cy="0" r="26" fill="none" :stroke="displayColor" stroke-width="2.5" stroke-dasharray="16 8 6 8"/>
                <line x1="-30" y1="0" x2="-22" y2="0" :stroke="displayColor" stroke-width="2"/>
                <line x1="22" y1="0" x2="30" y2="0" :stroke="displayColor" stroke-width="2"/>
                <line x1="0" y1="-30" x2="0" y2="-22" :stroke="displayColor" stroke-width="2"/>
                <line x1="0" y1="22" x2="0" y2="30" :stroke="displayColor" stroke-width="2"/>
              </g>
              <g :class="{ 'spin-ccw': isAnimated && !isLocked }">
                <polygon points="0,-18 5,-5 18,0 5,5 0,18 -5,5 -18,0 -5,-5" fill="none" stroke="#FFFFFF" stroke-width="2" :filter="`url(#glow_${uid})`"/>
                <polygon points="0,-11 11,0 0,11 -11,0" fill="none" :stroke="displayColor" stroke-width="2"/>
                <circle cx="0" cy="0" r="5" fill="#FFF" :filter="`url(#glow_${uid})`"/>
                <circle cx="0" cy="0" r="2.5" :fill="displayColor"/>
              </g>
            </g>
          </template>

          <!-- Event Icon Positioned Cleanly at Center Stage (if icon !== 'none') -->
          <g v-if="hasIcon" :transform="`translate(100, ${centerCY})`">
            <g :class="{ 'hologram-float': isAnimated && !isLocked }">
              <g transform="scale(0.30) translate(-100, -100)">
                <!-- 15 Event Hologram Icons -->
                <template v-if="icon === 'rank1'">
                  <polygon points="100,10 170,90 100,190 30,90" fill="none" :stroke="displayColor" stroke-width="8" stroke-linejoin="round"/>
                  <path d="M 85 90 L 100 70 V 140 M 80 140 H 120" :stroke="displayColor" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
                </template>
                <template v-else-if="icon === 'crown'">
                  <path d="M20 50 L40 90 L100 70 L160 90 L180 50 L160 120 L40 120 Z" fill="none" :stroke="displayColor" stroke-width="8" stroke-linejoin="round"/>
                  <circle cx="20" cy="45" r="8" :fill="displayColor"/> <circle cx="100" cy="60" r="10" :fill="displayColor"/> <circle cx="180" cy="45" r="8" :fill="displayColor"/>
                </template>
                <template v-else-if="icon === 'star'">
                  <polygon points="100,20 125,75 185,75 135,115 155,175 100,135 45,175 65,115 15,75 75,75" fill="none" :stroke="displayColor" stroke-width="10" stroke-linejoin="round"/>
                  <polygon points="100,50 115,85 155,85 125,110 135,145 100,120 65,145 75,110 45,85 85,85" :fill="displayColor" opacity="0.7"/>
                </template>
                <template v-else-if="icon === 'code'">
                  <polyline points="80,50 30,100 80,150" fill="none" :stroke="displayColor" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="120,50 170,100 120,150" fill="none" :stroke="displayColor" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="110" y1="40" x2="90" y2="160" :stroke="displayColor" stroke-width="12" stroke-linecap="round"/>
                </template>
                <template v-else-if="icon === 'sword'">
                  <path d="M40 160 L160 40 M30 130 L70 170 M130 30 L170 70" :stroke="displayColor" stroke-width="12" stroke-linecap="round"/>
                  <path d="M160 160 L40 40 M170 130 L130 170 M70 30 L30 70" :stroke="displayColor" stroke-width="12" stroke-linecap="round" opacity="0.8"/>
                </template>
                <template v-else-if="icon === 'speed'">
                  <circle cx="100" cy="110" r="70" fill="none" :stroke="displayColor" stroke-width="10"/>
                  <path d="M 85 20 H 115 M 100 20 V 40 M 150 60 L 165 45" :stroke="displayColor" stroke-width="10" stroke-linecap="round"/>
                  <polygon points="105,65 75,120 100,120 95,155 125,100 100,100" :fill="displayColor"/>
                </template>
                <template v-else-if="icon === 'shield'">
                  <path d="M 100 10 L 170 40 V 100 C 170 150 100 190 100 190 C 100 190 30 150 30 100 V 40 Z" fill="none" :stroke="displayColor" stroke-width="8" stroke-linejoin="round"/>
                  <rect x="75" y="90" width="50" height="40" rx="6" :fill="displayColor" opacity="0.8"/>
                  <path d="M 85 90 V 70 A 15 15 0 0 1 115 70 V 90" fill="none" :stroke="displayColor" stroke-width="8" stroke-linecap="round"/>
                  <circle cx="100" cy="110" r="6" fill="#0B0F19"/>
                </template>
                <template v-else-if="icon === 'ai'">
                  <polygon points="100,20 160,55 160,125 100,160 40,125 40,55" fill="none" :stroke="displayColor" stroke-width="8"/>
                  <polygon points="100,90 130,105 130,145 100,160 70,145 70,105" :fill="displayColor" opacity="0.5"/>
                  <line x1="100" y1="20" x2="100" y2="90" :stroke="displayColor" stroke-width="8"/>
                  <line x1="40" y1="125" x2="100" y2="160" :stroke="displayColor" stroke-width="8"/>
                  <line x1="160" y1="125" x2="100" y2="160" :stroke="displayColor" stroke-width="8"/>
                  <circle cx="100" cy="90" r="8" fill="#FFF"/>
                </template>
                <template v-else-if="icon === 'target'">
                  <circle cx="100" cy="100" r="80" fill="none" :stroke="displayColor" stroke-width="8" stroke-dasharray="40 20"/>
                  <circle cx="100" cy="100" r="40" fill="none" :stroke="displayColor" stroke-width="8"/>
                  <circle cx="100" cy="100" r="12" :fill="displayColor"/>
                  <path d="M 10 100 H 50 M 150 100 H 190 M 100 10 V 50 M 100 150 V 190" :stroke="displayColor" stroke-width="8" stroke-linecap="round"/>
                </template>
                <template v-else-if="icon === 'globe'">
                  <circle cx="100" cy="100" r="70" fill="none" :stroke="displayColor" stroke-width="10"/>
                  <ellipse cx="100" cy="100" rx="35" ry="70" fill="none" :stroke="displayColor" stroke-width="8" opacity="0.8"/>
                  <line x1="30" y1="100" x2="170" y2="100" :stroke="displayColor" stroke-width="8"/>
                </template>
                <template v-else-if="icon === 'app'">
                  <rect x="50" y="20" width="100" height="160" rx="15" fill="none" :stroke="displayColor" stroke-width="8"/>
                  <rect x="70" y="40" width="60" height="40" rx="5" :fill="displayColor" opacity="0.4"/>
                  <rect x="70" y="90" width="60" height="20" rx="5" :fill="displayColor" opacity="0.8"/>
                  <rect x="70" y="120" width="35" height="40" rx="5" fill="none" :stroke="displayColor" stroke-width="6"/>
                  <rect x="115" y="120" width="15" height="15" rx="3" :fill="displayColor"/>
                </template>
                <template v-else-if="icon === 'design'">
                  <path d="M 100 20 L 150 120 L 100 180 L 50 120 Z" fill="none" :stroke="displayColor" stroke-width="8" stroke-linejoin="round"/>
                  <circle cx="100" cy="20" r="10" :fill="displayColor"/> <circle cx="150" cy="120" r="10" :fill="displayColor"/>
                  <circle cx="50" cy="120" r="10" :fill="displayColor"/> <circle cx="100" cy="180" r="10" :fill="displayColor"/>
                  <path d="M 100 20 V 180 M 50 120 H 150" :stroke="displayColor" stroke-width="4" stroke-dasharray="8 8"/>
                </template>
                <template v-else-if="icon === 'audio'">
                  <rect x="30" y="110" width="20" height="70" rx="10" :fill="displayColor" opacity="0.6"/>
                  <rect x="70" y="40" width="20" height="140" rx="10" fill="none" :stroke="displayColor" stroke-width="6"/>
                  <rect x="110" y="70" width="20" height="110" rx="10" :fill="displayColor" opacity="0.9"/>
                  <rect x="150" y="130" width="20" height="50" rx="10" fill="none" :stroke="displayColor" stroke-width="6"/>
                </template>
                <template v-else-if="icon === 'hardware'">
                  <rect x="50" y="50" width="100" height="100" rx="10" fill="none" :stroke="displayColor" stroke-width="8"/>
                  <rect x="75" y="75" width="50" height="50" rx="5" :fill="displayColor" opacity="0.6"/>
                </template>
                <template v-else-if="icon === 'team'">
                  <circle cx="65" cy="65" r="25" fill="none" :stroke="displayColor" stroke-width="8"/>
                  <path d="M 15 160 C 15 110 115 110 115 160" fill="none" :stroke="displayColor" stroke-width="8"/>
                  <circle cx="135" cy="95" r="20" :fill="displayColor" opacity="0.7"/>
                </template>
              </g>
            </g>
          </g>

          <!-- Locked Hologram Overlay -->
          <g v-if="isLocked" transform="translate(100, 95)">
            <circle cx="0" cy="0" r="26" fill="#050811" stroke="#475569" stroke-width="2" stroke-dasharray="6 4"/>
            <path d="M -8 -2 V -8 A 8 8 0 0 1 8 -8 V -2" fill="none" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
            <rect x="-12" y="-2" width="24" height="18" rx="4" fill="#1E293B" stroke="#94A3B8" stroke-width="2"/>
            <circle cx="0" cy="6" r="3" fill="#94A3B8"/>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tier: {
    type: [Number, String],
    default: 10
  },
  icon: {
    type: String,
    default: 'none' // Default NO ICON as requested
  },
  size: {
    type: [Number, String],
    default: 280
  },
  isAnimated: {
    type: Boolean,
    default: true
  },
  isLocked: {
    type: Boolean,
    default: false
  }
})

// Unique ID for gradients/filters
const uid = Math.random().toString(36).substring(2, 9)

const TIER_COLORS = {
  1: '#FF8C42', // Copper Circuit
  2: '#00FF66', // Neon Carbon
  3: '#00F0FF', // Cobalt Aegis
  4: '#B026FF', // Violet Glitch
  5: '#FFB800', // Hyper Gold
  6: '#FF003C', // Crimson Mecha
  7: '#E2E8F0', // Platinum Orbital
  8: '#8A2BE2', // Obsidian Void
  9: '#00FFFF', // Quantum Apex
  10: '#FFD700', // Singularity God
}

const TIER_SLUGS = {
  'copper_circuit': 1, 'copper-circuit': 1, 'copper': 1,
  'neon_carbon': 2, 'neon-carbon': 2, 'carbon': 2,
  'cobalt_aegis': 3, 'cobalt-aegis': 3, 'cobalt': 3,
  'violet_glitch': 4, 'violet-glitch': 4, 'violet': 4,
  'hyper_gold': 5, 'hyper-gold': 5, 'gold': 5,
  'crimson_mecha': 6, 'crimson-mecha': 6, 'crimson': 6,
  'platinum_orbital': 7, 'platinum-orbital': 7, 'platinum': 7,
  'obsidian_void': 8, 'obsidian-void': 8, 'obsidian': 8,
  'quantum_apex': 9, 'quantum-apex': 9, 'quantum': 9,
  'singularity_god': 10, 'singularity-god': 10, 'singularity': 10, 'god': 10
}

const parsedTier = computed(() => {
  if (typeof props.tier === 'string' && TIER_SLUGS[props.tier.toLowerCase()]) {
    return TIER_SLUGS[props.tier.toLowerCase()]
  }
  const num = parseInt(props.tier, 10)
  return isNaN(num) || num < 1 || num > 10 ? 10 : num
})

const trophyColor = computed(() => TIER_COLORS[parsedTier.value] || '#FFD700')
const displayColor = computed(() => props.isLocked ? '#475569' : trophyColor.value)
const hasIcon = computed(() => props.icon && props.icon !== 'none')
const centerCY = computed(() => parsedTier.value === 10 ? 92 : 95)

const wrapperStyle = computed(() => {
  if (!props.size) return {}
  const sizeVal = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: sizeVal,
    height: sizeVal,
    aspectRatio: '1 / 1',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }
})
</script>

<style scoped>
.cyber-trophy-wrapper {
  position: relative;
  user-select: none;
}

.cyber-trophy-svg {
  display: block;
  overflow: visible;
}

.is-locked {
  filter: grayscale(85%) opacity(0.65);
}

.trophy-float {
  animation: float 3.6s ease-in-out infinite;
}

.hologram-float {
  animation: floatHolo 2.6s ease-in-out infinite alternate;
}

.spin-cw {
  transform-origin: 0 0;
  animation: spinCW 10s linear infinite;
}

.spin-ccw {
  transform-origin: 0 0;
  animation: spinCCW 12s linear infinite;
}

.orbit-flow-1 {
  animation: orbitDash1 3s linear infinite;
}

.orbit-flow-2 {
  animation: orbitDash2 4s linear infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-7px); }
}

@keyframes floatHolo {
  0% { transform: translateY(-3px); opacity: 0.9; }
  100% { transform: translateY(3px); opacity: 1; }
}

@keyframes spinCW {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spinCCW {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes orbitDash1 {
  to { stroke-dashoffset: -60px; }
}

@keyframes orbitDash2 {
  to { stroke-dashoffset: 60px; }
}
</style>
