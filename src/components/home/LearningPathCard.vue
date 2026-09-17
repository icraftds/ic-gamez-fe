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
        
        <router-link to="#" @click.prevent="startLearning" class="btn-start" :style="{ backgroundColor: themeColor, boxShadow: `0 4px 20px ${themeColor}30` }">
          <span v-if="!isPreparingLesson">Mulai Belajar</span>
          <span v-else>Menyiapkan Materi...</span>
          <i v-if="!isPreparingLesson" class="fa-solid fa-arrow-right btn-icon"></i>
          <div v-else class="btn-spinner"></div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLearningPaths } from '../../composables/useLearningPaths'

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

const router = useRouter()
const { fetchPathDetails, isPreparingLesson } = useLearningPaths()

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

const startLearning = async () => {
  isPreparingLesson.value = true
  let detailedPath = props.path
  
  // Periksa apakah lessons sudah dimuat, jika belum panggil API detail
  if (!detailedPath.chapters || detailedPath.chapters.length === 0 || !detailedPath.chapters[0].lessons) {
    const fetched = await fetchPathDetails(props.path.slug || props.path.id)
    if (fetched) detailedPath = fetched
  }

  const firstChapter = detailedPath?.chapters?.[0]
  const firstLesson = firstChapter?.lessons?.[0]

  if (firstChapter && firstLesson) {
    router.push(`/learning/${detailedPath.slug || detailedPath.id}/lesson/${firstChapter.slug || firstChapter.id}/${firstLesson.slug || firstLesson.id}`)
  } else {
    router.push(`/learning/${detailedPath?.slug || detailedPath?.id || props.path.slug || props.path.id}`)
  }
}
</script>

<style scoped src="../../assets/css/components/home/LearningPathCard.css"></style>
