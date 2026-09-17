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

<style scoped src="../../assets/css/components/home/LearningPathStack.css"></style>
