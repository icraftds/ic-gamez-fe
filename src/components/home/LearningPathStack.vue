<template>
  <section class="learning-path-stack">
    <div class="stack-header reveal">
      <h2 class="section-title">Mau mulai dari mana?</h2>
      <p class="section-subtitle">
        Dari dasar pemrograman hingga mahir database dan web development.
        Scroll perlahan, dan pilih jalur yang paling sesuai dengan tujuanmu.
      </p>
    </div>
    
    <div class="stack-container">
      <LearningPathCard 
        v-for="(path, index) in paths" 
        :key="path.id" 
        :path="path"
        :index="index"
      />
    </div>
  </section>
</template>

<script setup>
import { useLearningPaths } from '../../composables/useLearningPaths'
import LearningPathCard from './LearningPathCard.vue'

const { paths } = useLearningPaths()
</script>

<style scoped>
.learning-path-stack {
  padding: 60px 0 100px 0;
}

.stack-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 60px auto;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  font-size: 1.15rem;
  color: var(--text-muted, #94a3b8);
  line-height: 1.6;
}

.stack-container {
  /* Ensure container is tall enough to allow scrolling through all sticky cards */
  position: relative;
  display: block;
  padding-bottom: 100px; /* Extra padding at the bottom of the stack */
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2.2rem;
  }
}
</style>
