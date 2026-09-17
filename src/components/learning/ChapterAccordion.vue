<template>
  <div class="chapter-card">
    <div class="chapter-header" @click="toggleChapter">
      <div class="chapter-info">
        <h3>{{ chapter.title }}</h3>
        <p>{{ chapter.completedSubMateri }}/{{ chapter.totalSubMateri }} materi selesai</p>
      </div>
      <i class="fa-solid" :class="isOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
    </div>
    
    <div class="chapter-content" v-show="isOpen">
      <ChapterLessonItem 
        v-for="lesson in chapter.lessons" 
        :key="lesson.id" 
        :lesson="lesson"
        @step-click="$emit('lesson-click', { lesson, step: $event })"
      />

      <div v-if="!chapter.lessons || chapter.lessons.length === 0" class="empty-lesson">
        Belum ada materi.
      </div>
    </div>
  </div>
</template>

<script setup>
import ChapterLessonItem from './ChapterLessonItem.vue'

defineProps({
  chapter: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle', 'lesson-click'])

const toggleChapter = () => {
  emit('toggle')
}
</script>

<style scoped src="../../assets/css/components/learning/ChapterAccordion.css"></style>
