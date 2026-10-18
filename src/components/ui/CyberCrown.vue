<template>
  <div 
    class="cyber-crown-container"
    :style="containerStyle"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 240 220" 
      width="100%" 
      height="100%" 
      overflow="visible" 
      class="cyber-crown-svg"
    >
      <defs>
        <!-- Dynamic Gradient definitions with unique IDs to allow multiple crowns on the same page -->
        <linearGradient :id="'mainMetal_' + uid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="config.mainGrad[0]" />
          <stop offset="50%" :stop-color="config.mainGrad[1]" />
          <stop offset="100%" :stop-color="config.mainGrad[2]" />
        </linearGradient>

        <linearGradient :id="'lightMetal_' + uid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
          <stop offset="100%" :stop-color="config.mainGrad[1]" stop-opacity="0.2" />
        </linearGradient>

        <linearGradient :id="'darkMetal_' + uid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="config.mainGrad[1]" />
          <stop offset="100%" :stop-color="config.mainGrad[2]" />
        </linearGradient>

        <linearGradient :id="'gemGrad_' + uid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="config.accentGrad[0]" />
          <stop offset="100%" :stop-color="config.accentGrad[1]" />
        </linearGradient>

        <filter :id="'subtleGlow_' + uid" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" :flood-color="config.glowColor" flood-opacity="0.6" />
        </filter>

        <filter :id="'numShadow_' + uid" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.85" />
        </filter>
      </defs>

      <!-- Main Crown Group with fixed offset translation -->
      <g transform="translate(20, 15)">
        <g :class="{ 'crown-floating': isAnimated }">
          <!-- Background Ambient Glow -->
          <ellipse 
            v-if="showGlow" 
            cx="100" 
            cy="110" 
            rx="70" 
            ry="35" 
            :fill="config.glowColor" 
            opacity="0.12" 
            :filter="`url(#subtleGlow_${uid})`"
          />

          <!-- Integrated Syntax Particles -->
          <g v-if="showSyntax" :font-family="'JetBrains Mono, monospace'" :fill="config.syntaxColor">
            <!-- Rank 1 Syntax -->
            <template v-if="parsedRank === 1">
              <text x="15" y="48" font-size="9" font-weight="700" :class="{ 'code-float-1': isAnimated }">{ }</text>
              <text x="170" y="48" font-size="9" font-weight="700" :class="{ 'code-float-2': isAnimated }">fn()</text>
              <text x="14" y="125" font-size="9" font-weight="700" opacity="0.6" :class="{ 'code-float-3': isAnimated }">01</text>
              <text x="175" y="125" font-size="9" font-weight="700" opacity="0.6" :class="{ 'code-float-1': isAnimated }">;</text>
            </template>

            <!-- Rank 2 Syntax -->
            <template v-else-if="parsedRank === 2">
              <text x="16" y="45" font-size="8.5" font-weight="700" :class="{ 'code-float-2': isAnimated }">&lt; /&gt;</text>
              <text x="166" y="45" font-size="8.5" font-weight="700" :class="{ 'code-float-1': isAnimated }">const</text>
              <text x="15" y="120" font-size="8.5" font-weight="700" opacity="0.6" :class="{ 'code-float-3': isAnimated }">10</text>
              <text x="175" y="120" font-size="8.5" font-weight="700" opacity="0.6" :class="{ 'code-float-2': isAnimated }">=&gt;</text>
            </template>

            <!-- Rank 3 Syntax -->
            <template v-else-if="parsedRank === 3">
              <text x="18" y="52" font-size="8.5" font-weight="700" :class="{ 'code-float-1': isAnimated }">var</text>
              <text x="170" y="52" font-size="8.5" font-weight="700" :class="{ 'code-float-3': isAnimated }">#03</text>
              <text x="16" y="120" font-size="8.5" font-weight="700" opacity="0.6" :class="{ 'code-float-2': isAnimated }">[ ]</text>
              <text x="175" y="120" font-size="8.5" font-weight="700" opacity="0.6" :class="{ 'code-float-1': isAnimated }">!=</text>
            </template>
          </g>

          <!-- Crown Body: RANK 1 (Grand Gold Sovereign) -->
          <g v-if="parsedRank === 1">
            <!-- Ornamen Sayap Logam Belakang -->
            <path d="M 35 110 C 15 80 25 40 45 35 C 40 60 55 85 70 95 Z" :fill="`url(#mainMetal_${uid})`" opacity="0.6"/>
            <path d="M 165 110 C 185 80 175 40 155 35 C 160 60 145 85 130 95 Z" :fill="`url(#mainMetal_${uid})`" opacity="0.6"/>

            <!-- Badan Mahkota 5 Puncak -->
            <polygon points="35,65 65,130 25,130" :fill="`url(#darkMetal_${uid})`"/>
            <polygon points="165,65 175,130 135,130" :fill="`url(#darkMetal_${uid})`"/>
            <polygon points="70,45 100,130 50,130" :fill="`url(#mainMetal_${uid})`"/>
            <polygon points="130,45 150,130 100,130" :fill="`url(#mainMetal_${uid})`"/>
            
            <!-- Puncak Tengah -->
            <polygon points="100,20 65,130 135,130" :fill="`url(#mainMetal_${uid})`" :filter="`url(#subtleGlow_${uid})`"/>
            <polygon points="100,20 100,130 135,130" :fill="`url(#lightMetal_${uid})`" opacity="0.4"/>

            <!-- Mutiara Ujung Bucu -->
            <circle cx="100" cy="20" r="6" fill="#FFFFFF" :filter="`url(#subtleGlow_${uid})`"/>
            <circle cx="70" cy="45" r="4.5" fill="#FFFFFF"/>
            <circle cx="130" cy="45" r="4.5" fill="#FFFFFF"/>
            <circle cx="35" cy="65" r="4" fill="#FFFFFF"/>
            <circle cx="165" cy="65" r="4" fill="#FFFFFF"/>

            <!-- Rim Bawah -->
            <path d="M 22 135 C 60 148 140 148 178 135 L 174 158 C 140 170 60 170 26 158 Z" :fill="`url(#mainMetal_${uid})`" :filter="`url(#subtleGlow_${uid})`"/>
            <path d="M 30 143 C 65 153 135 153 170 143 L 168 150 C 135 160 65 160 32 150 Z" fill="#0B0F19" opacity="0.4"/>

            <!-- Permata Delima Ruby -->
            <polygon points="100,140 108,148 100,156 92,148" :fill="`url(#gemGrad_${uid})`" :filter="`url(#subtleGlow_${uid})`"/>
            <circle cx="55" cy="148" r="3.5" :fill="`url(#gemGrad_${uid})`"/>
            <circle cx="145" cy="148" r="3.5" :fill="`url(#gemGrad_${uid})`"/>

            <!-- Angka 1 Poppins -->
            <g v-if="showNumber" :filter="`url(#numShadow_${uid})`">
              <text x="100" y="112" font-family="'Poppins', sans-serif" font-size="36" font-weight="900" fill="#FFFFFF" text-anchor="middle">1</text>
              <text x="100" y="112" font-family="'Poppins', sans-serif" font-size="36" font-weight="900" fill="none" stroke="#684200" stroke-width="1.5" text-anchor="middle">1</text>
            </g>
          </g>

          <!-- Crown Body: RANK 2 (Silver Radiant Noble) -->
          <g v-else-if="parsedRank === 2">
            <polygon points="40,55 75,130 25,130" :fill="`url(#darkMetal_${uid})`"/>
            <polygon points="160,55 175,130 125,130" :fill="`url(#darkMetal_${uid})`"/>
            <polygon points="100,28 65,130 100,130" :fill="`url(#mainMetal_${uid})`"/>
            <polygon points="100,28 135,130 100,130" :fill="`url(#lightMetal_${uid})`"/>
            <polygon points="40,55 75,130 100,130" :fill="`url(#mainMetal_${uid})`" opacity="0.9"/>
            <polygon points="160,55 125,130 100,130" :fill="`url(#lightMetal_${uid})`" opacity="0.8"/>

            <circle cx="100" cy="28" r="5.5" fill="#FFFFFF" :filter="`url(#subtleGlow_${uid})`"/>
            <circle cx="40" cy="55" r="4.5" fill="#FFFFFF"/>
            <circle cx="160" cy="55" r="4.5" fill="#FFFFFF"/>

            <path d="M 22 135 C 60 146 140 146 178 135 L 174 156 C 140 167 60 167 26 156 Z" :fill="`url(#mainMetal_${uid})`" :filter="`url(#subtleGlow_${uid})`"/>
            <line x1="30" y1="145" x2="170" y2="145" stroke="#4B5563" stroke-width="2"/>

            <!-- Permata Nilam Sapphire -->
            <circle cx="100" cy="147" r="5" :fill="`url(#gemGrad_${uid})`" :filter="`url(#subtleGlow_${uid})`"/>
            <polygon points="60,143 64,147 60,151 56,147" :fill="`url(#gemGrad_${uid})`"/>
            <polygon points="140,143 144,147 140,151 136,147" :fill="`url(#gemGrad_${uid})`"/>

            <!-- Angka 2 Poppins -->
            <g v-if="showNumber" :filter="`url(#numShadow_${uid})`">
              <text x="100" y="112" font-family="'Poppins', sans-serif" font-size="35" font-weight="900" fill="#FFFFFF" text-anchor="middle">2</text>
              <text x="100" y="112" font-family="'Poppins', sans-serif" font-size="35" font-weight="900" fill="none" stroke="#2D3748" stroke-width="1.5" text-anchor="middle">2</text>
            </g>
          </g>

          <!-- Crown Body: RANK 3 (Bronze Titan Coronet) -->
          <g v-else-if="parsedRank === 3">
            <polygon points="45,62 80,130 30,130" :fill="`url(#darkMetal_${uid})`"/>
            <polygon points="155,62 170,130 120,130" :fill="`url(#darkMetal_${uid})`"/>
            <polygon points="100,36 70,130 130,130" :fill="`url(#mainMetal_${uid})`"/>
            <polygon points="100,36 100,130 130,130" :fill="`url(#lightMetal_${uid})`" opacity="0.5"/>
            <polygon points="45,62 80,130 100,130" :fill="`url(#mainMetal_${uid})`" opacity="0.8"/>
            <polygon points="155,62 120,130 100,130" :fill="`url(#lightMetal_${uid})`" opacity="0.7"/>

            <polygon points="100,31 105,36 100,41 95,36" fill="#FFFFFF" :filter="`url(#subtleGlow_${uid})`"/>
            <circle cx="45" cy="62" r="4" fill="#FFFFFF"/>
            <circle cx="155" cy="62" r="4" fill="#FFFFFF"/>

            <path d="M 25 135 C 65 145 135 145 175 135 L 171 154 C 135 164 65 164 29 154 Z" :fill="`url(#mainMetal_${uid})`" :filter="`url(#subtleGlow_${uid})`"/>
            
            <!-- Permata Zamrud Emerald -->
            <polygon points="100,140 106,146 100,152 94,146" :fill="`url(#gemGrad_${uid})`" :filter="`url(#subtleGlow_${uid})`"/>
            <circle cx="65" cy="146" r="3" :fill="`url(#gemGrad_${uid})`"/>
            <circle cx="135" cy="146" r="3" :fill="`url(#gemGrad_${uid})`"/>

            <!-- Angka 3 Poppins -->
            <g v-if="showNumber" :filter="`url(#numShadow_${uid})`">
              <text x="100" y="112" font-family="'Poppins', sans-serif" font-size="35" font-weight="900" fill="#FFFFFF" text-anchor="middle">3</text>
              <text x="100" y="112" font-family="'Poppins', sans-serif" font-size="35" font-weight="900" fill="none" stroke="#3D1D09" stroke-width="1.5" text-anchor="middle">3</text>
            </g>
          </g>

          <!-- Sparkling Jewels (Each cleanly translated on a dedicated wrapper group to prevent CSS transform conflicts) -->
          <g v-if="isAnimated">
            <template v-if="parsedRank === 1">
              <g transform="translate(100, 20)"><path d="M 0,-6 Q 0,0 6,0 Q 0,0 0,6 Q 0,0 -6,0 Q 0,0 0,-6 Z" fill="#FFFFFF" class="sparkle-tight" /></g>
              <g transform="translate(35, 65)"><path d="M 0,-4 Q 0,0 4,0 Q 0,0 0,4 Q 0,0 -4,0 Q 0,0 0,-4 Z" fill="#FFFFFF" class="sparkle-tight" style="animation-delay: 0.4s" /></g>
              <g transform="translate(165, 65)"><path d="M 0,-4 Q 0,0 4,0 Q 0,0 0,4 Q 0,0 -4,0 Q 0,0 0,-4 Z" fill="#FFFFFF" class="sparkle-tight" style="animation-delay: 0.8s" /></g>
              <g transform="translate(100, 148)"><path d="M 0,-4 Q 0,0 4,0 Q 0,0 0,4 Q 0,0 -4,0 Q 0,0 0,-4 Z" fill="#FFFFFF" class="sparkle-tight" style="animation-delay: 1.2s" /></g>
            </template>
            <template v-else-if="parsedRank === 2">
              <g transform="translate(100, 28)"><path d="M 0,-5 Q 0,0 5,0 Q 0,0 0,5 Q 0,0 -5,0 Q 0,0 0,-5 Z" fill="#FFFFFF" class="sparkle-tight" /></g>
              <g transform="translate(40, 55)"><path d="M 0,-4 Q 0,0 4,0 Q 0,0 0,4 Q 0,0 -4,0 Q 0,0 0,-4 Z" fill="#FFFFFF" class="sparkle-tight" style="animation-delay: 0.5s" /></g>
              <g transform="translate(160, 55)"><path d="M 0,-4 Q 0,0 4,0 Q 0,0 0,4 Q 0,0 -4,0 Q 0,0 0,-4 Z" fill="#FFFFFF" class="sparkle-tight" style="animation-delay: 1.0s" /></g>
            </template>
            <template v-else-if="parsedRank === 3">
              <g transform="translate(100, 36)"><path d="M 0,-5 Q 0,0 5,0 Q 0,0 0,5 Q 0,0 -5,0 Q 0,0 0,-5 Z" fill="#FFFFFF" class="sparkle-tight" /></g>
              <g transform="translate(45, 62)"><path d="M 0,-4 Q 0,0 4,0 Q 0,0 0,4 Q 0,0 -4,0 Q 0,0 0,-4 Z" fill="#FFFFFF" class="sparkle-tight" style="animation-delay: 0.6s" /></g>
              <g transform="translate(155, 62)"><path d="M 0,-4 Q 0,0 4,0 Q 0,0 0,4 Q 0,0 -4,0 Q 0,0 0,-4 Z" fill="#FFFFFF" class="sparkle-tight" style="animation-delay: 1.1s" /></g>
            </template>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  rank: {
    type: [Number, String],
    default: 1,
    validator: (val) => [1, 2, 3, '1', '2', '3'].includes(val)
  },
  size: {
    type: [Number, String],
    default: null
  },
  isAnimated: {
    type: Boolean,
    default: true
  },
  showSyntax: {
    type: Boolean,
    default: true
  },
  showNumber: {
    type: Boolean,
    default: true
  },
  showGlow: {
    type: Boolean,
    default: true
  }
});

// Unique random ID per instance to avoid SVG defs collision
const uid = Math.random().toString(36).substring(2, 9);

const parsedRank = computed(() => Number(props.rank) || 1);

const CROWN_CONFIGS = {
  1: {
    mainGrad: ['#FFF6B7', '#F6B73C', '#9E6500'],
    accentGrad: ['#FF5E7E', '#B80028'],
    glowColor: '#FFB800',
    syntaxColor: '#FFD700'
  },
  2: {
    mainGrad: ['#FFFFFF', '#C0CADA', '#4B5563'],
    accentGrad: ['#00E5FF', '#0052D4'],
    glowColor: '#94A3B8',
    syntaxColor: '#00E5FF'
  },
  3: {
    mainGrad: ['#FFBE86', '#CD7F32', '#5A2E0F'],
    accentGrad: ['#38EF7D', '#0B7A3B'],
    glowColor: '#CD7F32',
    syntaxColor: '#38EF7D'
  }
};

const config = computed(() => CROWN_CONFIGS[parsedRank.value] || CROWN_CONFIGS[1]);

const containerStyle = computed(() => {
  if (!props.size) return {};
  const formattedSize = typeof props.size === 'number' ? `${props.size}px` : props.size;
  return {
    width: formattedSize,
    height: 'auto',
    aspectRatio: '240 / 220',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
});
</script>

<style scoped>
.cyber-crown-container {
  position: relative;
  user-select: none;
}

.cyber-crown-svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.crown-floating {
  animation: crownFloat 3s ease-in-out infinite;
}

.sparkle-tight {
  transform-origin: 0 0;
  animation: glintTight 1.8s infinite ease-in-out;
}

.code-float-1 {
  animation: codePulse 2.4s ease-in-out infinite;
}

.code-float-2 {
  animation: codePulse 2.8s ease-in-out infinite 0.7s;
}

.code-float-3 {
  animation: codePulse 2.2s ease-in-out infinite 1.2s;
}

@keyframes crownFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes glintTight {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.6) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) rotate(90deg);
    filter: drop-shadow(0 0 5px #FFFFFF);
  }
}

@keyframes codePulse {
  0%, 100% {
    opacity: 0.3;
    transform: translateY(0px);
  }
  50% {
    opacity: 0.85;
    transform: translateY(-4px);
  }
}
</style>
