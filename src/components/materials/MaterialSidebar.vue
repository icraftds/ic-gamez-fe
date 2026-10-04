<template>
  <aside class="docs-sidebar" :class="{ 'is-open': isOpen }">
    <div class="sidebar-header">
      <h2>Materi Belajar</h2>
      <button class="close-sidebar-btn" @click="$emit('close')">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner-small"></div>
        <span>Memuat materi...</span>
      </div>
      
      <div v-else class="path-group" v-for="path in paths" :key="path.id">
        <h3 class="path-title" @click="togglePath(path.id)">
          <span>
            <i :class="path.icon || 'fa-solid fa-book'"></i> {{ path.title }}
          </span>
          <i class="fa-solid fa-chevron-down toggle-icon" :class="{ 'rotated': openPaths.includes(path.id) }"></i>
        </h3>
        
        <transition name="slide-fade">
          <div class="path-content" v-show="openPaths.includes(path.id)">
            <div class="chapter-group" v-for="chapter in path.chapters" :key="chapter.id">
              <h4 class="chapter-title">{{ chapter.title }}</h4>
              <ul class="lesson-list">
                <li v-for="lesson in chapter.lessons" :key="lesson.id">
                  <a 
                    href="#" 
                    @click.prevent="$emit('select-lesson', path.id, chapter.id, lesson.id)"
                    class="lesson-link"
                    :class="{ 'active': activeLessonId === lesson.id && activeChapterId === chapter.id && activePathId === path.id }"
                  >
                    {{ lesson.title }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  paths: {
    type: Array,
    required: true,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  activePathId: {
    type: [Number, String],
    default: null
  },
  activeChapterId: {
    type: [Number, String],
    default: null
  },
  activeLessonId: {
    type: [Number, String],
    default: null
  }
})

defineEmits(['close', 'select-lesson'])

const openPaths = ref([])

// Watch for changes in paths to open the first one by default if none is open
watch(() => props.paths, (newPaths) => {
  if (newPaths.length > 0 && openPaths.value.length === 0) {
    openPaths.value.push(newPaths[0].id)
  }
}, { immediate: true })

const togglePath = (pathId) => {
  const index = openPaths.value.indexOf(pathId)
  if (index === -1) {
    openPaths.value.push(pathId)
  } else {
    openPaths.value.splice(index, 1)
  }
}
</script>

<style scoped src="../../assets/css/components/materials/MaterialSidebar.css"></style>
