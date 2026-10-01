<template>
  <aside class="ws-sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Toggle Button -->
    <div class="toggle-row">
      <button
        class="toggle-btn"
        :title="isCollapsed ? 'Buka sidebar' : 'Tutup sidebar'"
        @click="$emit('update:isCollapsed', !isCollapsed)"
      >
        <i :class="isCollapsed ? 'fa-solid fa-angles-right' : 'fa-solid fa-angles-left'"></i>
      </button>
    </div>

    <!-- Content (hidden when collapsed) -->
    <div v-if="!isCollapsed" class="sidebar-body">
      <div class="path-label">
        <i :class="pathIcon"></i>
        <span>{{ pathTitle }}</span>
      </div>

      <div class="chapter-list">
        <div
          v-for="chapter in chapters.filter(c => String(c.id) === String(activeChapterId) || String(c.slug) === String(activeChapterId))"
          :key="chapter.id"
          class="chapter-group"
        >
          <!-- Chapter Header -->
          <button
            class="chapter-header is-current"
            @click="toggleChapter(chapter.id)"
          >
            <span class="chapter-title">{{ chapter.title }}</span>
            <i :class="isChapterOpen(chapter) ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
          </button>

          <!-- Lesson List -->
          <div v-if="isChapterOpen(chapter)" class="lesson-list">
            <SidebarLessonItem
              v-for="lesson in chapter.lessons.filter(l => isLessonActive(l))"
              :key="lesson.id"
              :lesson="lesson"
              :is-open="isLessonOpen(lesson)"
              :is-active="isLessonActive(lesson)"
              :active-step="activeStep"
              @toggle="toggleLesson"
              @step-click="onSubItemClick(chapter.id, lesson, $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import SidebarLessonItem from './SidebarLessonItem.vue'

const props = defineProps({
  pathTitle: { type: String, default: '' },
  pathIcon: { type: String, default: '' },
  chapters: { type: Array, required: true },
  activeChapterId: { type: String, default: '' },
  activeLessonId: { type: String, default: '' },
  activeStep: { type: Number, default: 1 },
  isCollapsed: { type: Boolean, default: false },
})

const emit = defineEmits(['lesson-select', 'update:isCollapsed'])

const openChapterIds = ref([])
const openLessonIds = ref([])

// Otomatis buka chapter dan lesson yang sedang aktif
watch(
  () => [props.activeChapterId, props.activeLessonId],
  ([cId, lId]) => {
    if (cId && !openChapterIds.value.includes(String(cId))) {
      openChapterIds.value.push(String(cId))
    }
    if (lId && !openLessonIds.value.includes(String(lId))) {
      openLessonIds.value.push(String(lId))
    }
  },
  { immediate: true }
)

const toggleChapter = (id) => {
  const strId = String(id)
  const index = openChapterIds.value.indexOf(strId)
  if (index === -1) openChapterIds.value.push(strId)
  else openChapterIds.value.splice(index, 1)
}

const toggleLesson = (id) => {
  const strId = String(id)
  const index = openLessonIds.value.indexOf(strId)
  if (index === -1) openLessonIds.value.push(strId)
  else openLessonIds.value.splice(index, 1)
}

// Helpers untuk mengecek apakah chapter/lesson terbuka atau aktif (support ID atau Slug)
const isChapterOpen = (chapter) => {
  return openChapterIds.value.includes(String(chapter.id)) || openChapterIds.value.includes(String(chapter.slug))
}

const isLessonOpen = (lesson) => {
  return openLessonIds.value.includes(String(lesson.id)) || openLessonIds.value.includes(String(lesson.slug))
}

const isLessonActive = (lesson) => {
  return String(lesson.id) === String(props.activeLessonId) || String(lesson.slug) === String(props.activeLessonId)
}

const onSubItemClick = (chapterId, lesson, step) => {
  emit('lesson-select', { chapterId, lesson, step })
}
</script>

<style scoped src="../../assets/css/components/workspace/WorkspaceSidebar.css"></style>
