<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
    <defs>
      <linearGradient id="lvlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFD700" />
        <stop offset="100%" stop-color="#FF8C00" />
      </linearGradient>
    </defs>
    <!-- Background chevrons -->
    <polyline points="40,140 100,90 160,140" fill="none" :stroke="color" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>
    <polyline points="40,105 100,55 160,105" fill="none" :stroke="color" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
    <!-- Top star -->
    <polygon points="100,15 108,35 128,38 113,53 117,73 100,64 83,73 87,53 72,38 92,35" fill="#FFFFFF"/>
  </svg>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: 'url(#lvlGrad)'
  }
})
</script>
