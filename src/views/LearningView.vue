<template>
  <div class="learning-view">
    <BackgroundEffects :show-orb3="true" />
    <HomeNavbar />

    <div class="container" style="margin-top: 40px">
      <div class="tree-header">
        <h2><i class="fa-solid fa-code-branch"></i> Learning <span class="gradient-text">Paths</span></h2>
        <p>Ikuti roadmap pembelajaran kami dari dasar hingga algoritma tingkat lanjut.</p>
      </div>

      <div class="paths-grid">
        <PathCard 
          v-for="path in paths" 
          :key="path.id" 
          :path="path" 
          @click="goToPath(path)" 
        />
      </div>
    </div>

    <!-- Premium Modal -->
    <PremiumModal 
      :isOpen="showPremiumModal" 
      @close="showPremiumModal = false" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'
import PathCard from '../components/learning/PathCard.vue'
import PremiumModal from '../components/common/PremiumModal.vue'
import { useLearningPaths } from '../composables/useLearningPaths'

const router = useRouter()
const { paths } = useLearningPaths()

const showPremiumModal = ref(false)

const goToPath = (path) => {
  if (path.isPremium) {
    showPremiumModal.value = true
    return
  }
  router.push(`/learning/${path.id}`)
}
</script>

<style scoped>
.learning-view {
  min-height: 100vh;
  padding-bottom: 80px;
}

.tree-header {
  text-align: center;
  margin-bottom: 50px;
}

.tree-header h2 {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.tree-header p {
  color: #94a3b8;
  font-size: 1.1rem;
}

.paths-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  max-width: 1000px;
  margin: 0 auto;
}
</style>
