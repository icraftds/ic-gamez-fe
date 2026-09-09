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
        :is-open="isLessonOpen(lesson.id)"
        @toggle="toggleLesson"
        @step-click="$emit('lesson-click', { lesson, step: $event })"
      />

      <div v-if="!chapter.lessons || chapter.lessons.length === 0" class="empty-lesson">
        Belum ada materi.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

const openLessons = ref([])

const toggleChapter = () => {
  emit('toggle')
}

const toggleLesson = (lessonId) => {
  const idx = openLessons.value.indexOf(lessonId)
  if (idx === -1) {
    openLessons.value.push(lessonId)
  } else {
    openLessons.value.splice(idx, 1)
  }
}

const isLessonOpen = (lessonId) => openLessons.value.includes(lessonId)
</script>

<style scoped>
.chapter-card {
  background: rgba(20, 15, 40, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.chapter-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.chapter-info h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.chapter-info p {
  font-size: 0.9rem;
  color: #94a3b8;
}

.chapter-content {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 20px 20px;
}

.empty-lesson {
  text-align: center;
  padding: 20px;
  color: #94a3b8;
  font-size: 0.9rem;
}
</style>
