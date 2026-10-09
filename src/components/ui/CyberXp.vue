<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <defs>
      <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00F0FF" />
        <stop offset="100%" stop-color="#3b82f6" />
      </linearGradient>
    </defs>
    <!-- Background Polygon -->
    <polygon points="50,8 92,50 50,92 8,50" fill="rgba(0, 240, 255, 0.1)" stroke="url(#xpGrad)" stroke-width="6" stroke-linejoin="round"/>
    
    <!-- Letter X -->
    <path d="M 33,38 L 47,62 M 47,38 L 33,62" stroke="url(#xpGrad)" stroke-width="6" stroke-linecap="round"/>
    
    <!-- Letter P -->
    <path d="M 55,62 V 38 H 63 A 8,8 0 0,1 63,54 H 55" fill="none" stroke="url(#xpGrad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script setup>
</script>
