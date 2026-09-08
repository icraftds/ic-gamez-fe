<template>
  <div class="learning-path-card" :style="cardStyle">
    <div class="card-inner">
      <div class="card-header">
        <div class="icon-wrapper" :style="{ backgroundColor: themeColor + '20', color: themeColor }">
          <i :class="path.icon"></i>
        </div>
        <span class="path-title" :style="{ color: themeColor }">{{ path.title }}</span>
      </div>
      
      <div class="card-body">
        <h3 class="headline">Mulai perjalanan <span class="highlight" :style="{ color: themeColor }">{{ path.title }}</span> Anda.</h3>
        <p class="description">{{ path.description }}</p>
        
        <ul class="features">
          <li>
            <i class="fa-solid fa-check-circle" :style="{ color: themeColor }"></i>
            <span>{{ path.chapters ? path.chapters.length : 0 }} Modul Terstruktur</span>
          </li>
          <li>
            <i class="fa-solid fa-check-circle" :style="{ color: themeColor }"></i>
            <span>Materi Interaktif & Praktik Langsung</span>
          </li>
          <li>
            <i class="fa-solid fa-check-circle" :style="{ color: themeColor }"></i>
            <span>Validasi Kode Otomatis</span>
          </li>
        </ul>
        
        <router-link :to="`/learning`" class="btn-start" :style="{ backgroundColor: themeColor, boxShadow: `0 4px 15px ${themeColor}40` }">
          Mulai Belajar
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  path: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

// Calculate sticky top offset to create the stacking effect
const cardStyle = computed(() => {
  // Base offset is 120px (to account for navbar and some breathing room)
  // Each subsequent card overlaps by being 40px lower, so the header peeks out
  const baseOffset = 120
  const overlapSpacing = 40
  
  return {
    top: `${baseOffset + (props.index * overlapSpacing)}px`,
    zIndex: props.index + 10 // Ensure lower cards render on top visually as they scroll up
  }
})

// Determine theme color based on index
const themeColor = computed(() => {
  const colors = [
    '#00f0ff', // Cyan (primary)
    '#ec4899', // Hot Pink (secondary)
    '#9333ea', // Neon Purple
    '#10b981'  // Emerald Green
  ]
  return colors[props.index % colors.length]
})
</script>

<style scoped>
.learning-path-card {
  /* This makes the card sticky */
  position: sticky;
  
  /* Large margin bottom is CRITICAL: it gives the user room to scroll and read 
     the card before the next card comes up and overlaps it. */
  margin-bottom: 50vh; 
  width: 100%;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  transition: transform 0.3s ease;
}

/* Add a slight padding bottom to the last card so it doesn't get cut off abruptly */
.learning-path-card:last-child {
  margin-bottom: 100px;
}

.card-inner {
  background: var(--glass-bg, rgba(15, 10, 30, 0.85));
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 28px;
  padding: 48px 56px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.icon-wrapper {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}

.path-title {
  font-size: 1.15rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.headline {
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 8px;
  color: var(--text-light, #f8fafc);
  letter-spacing: -0.02em;
}

.description {
  font-size: 1.15rem;
  color: var(--text-muted, #94a3b8);
  line-height: 1.7;
  margin-bottom: 24px;
  max-width: 650px;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.features li {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #cbd5e1;
}

.features i {
  font-size: 1.2rem;
}

.btn-start {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 40px;
  border-radius: 50px;
  color: #05050f;
  font-weight: 800;
  font-size: 1.15rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: fit-content;
}

.btn-start:hover {
  transform: translateY(-3px);
  filter: brightness(1.15);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1) !important; /* Enhance shadow on hover */
}

/* Responsive */
@media (max-width: 768px) {
  .card-inner {
    padding: 32px 24px;
    border-radius: 20px;
  }
  .learning-path-card {
    margin-bottom: 60vh;
  }
  .headline {
    font-size: 2rem;
  }
  .description {
    font-size: 1.05rem;
  }
  .features li {
    font-size: 1rem;
  }
}
</style>
