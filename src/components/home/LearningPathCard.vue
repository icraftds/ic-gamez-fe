<template>
  <div class="learning-path-card" :style="cardStyle">
    <div class="card-inner">
      <div class="card-content-left">
        <div class="card-header">
          <div class="icon-wrapper" :style="{ backgroundColor: themeColor + '15', color: themeColor, border: `1px solid ${themeColor}40` }">
            <i :class="path.icon"></i>
          </div>
          <span class="path-title" :style="{ color: themeColor }">{{ path.title }}</span>
        </div>
        
        <h3 class="headline">Mulai perjalanan <span class="highlight" :style="{ color: themeColor }">{{ path.title }}</span> Anda.</h3>
        <p class="description">{{ path.description }}</p>
        
        <router-link :to="`/learning`" class="btn-start" :style="{ backgroundColor: themeColor, boxShadow: `0 4px 20px ${themeColor}30` }">
          Mulai Belajar
          <i class="fa-solid fa-arrow-right btn-icon"></i>
        </router-link>
      </div>
      
      <div class="card-content-right">
        <div class="features-panel" :style="{ borderTop: `4px solid ${themeColor}` }">
          <h4 class="features-title">Apa yang akan Anda pelajari?</h4>
          <ul class="features">
            <li>
              <div class="feature-icon" :style="{ color: themeColor, backgroundColor: themeColor + '10' }">
                <i class="fa-solid fa-book-open"></i>
              </div>
              <div class="feature-text">
                <strong>{{ path.chapters ? path.chapters.length : 0 }} Modul Terstruktur</strong>
                <span>Materi disusun step-by-step.</span>
              </div>
            </li>
            <li>
              <div class="feature-icon" :style="{ color: themeColor, backgroundColor: themeColor + '10' }">
                <i class="fa-solid fa-laptop-code"></i>
              </div>
              <div class="feature-text">
                <strong>Praktik Langsung</strong>
                <span>Belajar sambil ngoding interaktif.</span>
              </div>
            </li>
            <li>
              <div class="feature-icon" :style="{ color: themeColor, backgroundColor: themeColor + '10' }">
                <i class="fa-solid fa-robot"></i>
              </div>
              <div class="feature-text">
                <strong>Validasi Otomatis</strong>
                <span>Kode Anda dicek secara real-time.</span>
              </div>
            </li>
          </ul>
        </div>
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

// Calculate sticky top offset
const cardStyle = computed(() => {
  // Base offset to clear navbar comfortably
  const baseOffset = 130
  // Overlap spacing allows the header of the previous card to peek out
  const overlapSpacing = 50
  
  return {
    top: `${baseOffset + (props.index * overlapSpacing)}px`,
    zIndex: props.index + 10
  }
})

const themeColor = computed(() => {
  const colors = [
    '#00f0ff', // Cyan
    '#ec4899', // Hot Pink
    '#9333ea', // Neon Purple
    '#10b981'  // Emerald Green
  ]
  return colors[props.index % colors.length]
})
</script>

<style scoped>
.learning-path-card {
  position: sticky;
  /* Use a balanced margin: enough for scrolling, but not a massive empty void */
  margin-bottom: 25vh; 
  width: 100%;
  /* Take full width of container */
  max-width: 100%;
  transition: transform 0.3s ease;
}

/* The last card has no bottom margin so it flows directly to the next section */
.learning-path-card:last-child {
  margin-bottom: 0;
}

.card-inner {
  background: var(--glass-bg, rgba(15, 10, 30, 0.85));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 32px;
  padding: 56px;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6);
  
  /* 2 Column Layout for Desktop */
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.card-content-left {
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.path-title {
  font-size: 1.2rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.headline {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  color: var(--text-light, #f8fafc);
  letter-spacing: -0.02em;
}

.description {
  font-size: 1.15rem;
  color: var(--text-muted, #94a3b8);
  line-height: 1.7;
  margin-bottom: 40px;
  max-width: 90%;
}

.btn-start {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 40px;
  border-radius: 50px;
  color: #05050f;
  font-weight: 800;
  font-size: 1.15rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: fit-content;
}

.btn-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.btn-start:hover {
  transform: translateY(-3px);
  filter: brightness(1.15);
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.15) !important;
}

.btn-start:hover .btn-icon {
  transform: translateX(4px);
}

.card-content-right {
  display: flex;
  justify-content: center;
}

.features-panel {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.features-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 24px;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.features li {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feature-text strong {
  font-size: 1.15rem;
  color: white;
  font-weight: 700;
}

.feature-text span {
  font-size: 0.95rem;
  color: var(--text-muted, #94a3b8);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 1024px) {
  .card-inner {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px;
  }
  .learning-path-card {
    margin-bottom: 30vh;
  }
}

@media (max-width: 768px) {
  .card-inner {
    padding: 32px 24px;
    border-radius: 20px;
  }
  .learning-path-card {
    margin-bottom: 40vh;
  }
  .headline {
    font-size: 2.2rem;
  }
  .features-panel {
    padding: 24px;
  }
}
</style>
