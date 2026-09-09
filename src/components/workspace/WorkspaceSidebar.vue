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

<style scoped>
.ws-sidebar {
  width: 280px;
  min-width: 280px;
  background: rgba(10, 6, 18, 0.97);
  border-right: 1px solid rgba(147, 51, 234, 0.15);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease, min-width 0.3s ease;
  overflow: hidden;
}

.ws-sidebar.collapsed {
  width: 44px;
  min-width: 44px;
}

/* ── Toggle row ── */
.toggle-row {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.toggle-btn {
  background: rgba(147, 51, 234, 0.1);
  border: 1px solid rgba(147, 51, 234, 0.2);
  color: #c084fc;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  transition: background 0.2s;
}
.toggle-btn:hover { background: rgba(147, 51, 234, 0.25); }

/* ── Body ── */
.sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 16px;
}
.sidebar-body::-webkit-scrollbar { width: 4px; }
.sidebar-body::-webkit-scrollbar-thumb { background: rgba(147, 51, 234, 0.3); border-radius: 2px; }

.path-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: #c084fc;
  font-size: 0.82rem;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 6px;
}

/* ── Chapters ── */
.chapter-header {
  width: 100%;
  background: transparent;
  border: none;
  color: #64748b;
  padding: 9px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: left;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.chapter-header:hover,
.chapter-header.is-current { color: #94a3b8; background: rgba(255, 255, 255, 0.03); }
.chapter-header i { font-size: 0.6rem; flex-shrink: 0; }
.chapter-title { flex: 1; line-height: 1.3; }


</style>

