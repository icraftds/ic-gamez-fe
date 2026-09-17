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
          v-for="chapter in chapters"
          :key="chapter.id"
          class="chapter-group"
        >
          <!-- Chapter Header -->
          <button
            class="chapter-header"
            :class="{ 'is-current': chapter.id === activeChapterId }"
            @click="toggleChapter(chapter.id)"
          >
            <span class="chapter-title">{{ chapter.title }}</span>
            <i :class="openChapterIds.includes(chapter.id) ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
          </button>

          <!-- Lesson List -->
          <div v-if="openChapterIds.includes(chapter.id)" class="lesson-list">
            <SidebarLessonItem
              v-for="lesson in chapter.lessons"
              :key="lesson.id"
              :lesson="lesson"
              :is-open="isLessonOpen(lesson.id)"
              :is-active="lesson.id === activeLessonId"
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
    if (cId && !openChapterIds.value.includes(cId)) {
      openChapterIds.value.push(cId)
    }
    if (lId && !openLessonIds.value.includes(lId)) {
      openLessonIds.value.push(lId)
    }
  },
  { immediate: true }
)

const toggleChapter = (id) => {
  const index = openChapterIds.value.indexOf(id)
  if (index === -1) openChapterIds.value.push(id)
  else openChapterIds.value.splice(index, 1)
}

const toggleLesson = (id) => {
  const index = openLessonIds.value.indexOf(id)
  if (index === -1) openLessonIds.value.push(id)
  else openLessonIds.value.splice(index, 1)
}

const isLessonOpen = (id) => openLessonIds.value.includes(id)

const onSubItemClick = (chapterId, lesson, step) => {
  emit('lesson-select', { chapterId, lesson, step })
}
</script>

<style scoped src="../../assets/css/components/workspace/WorkspaceSidebar.css"></style>
