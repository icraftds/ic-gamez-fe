<template>
  <div class="lesson-group">
    <!-- Lesson Header -->
    <button
      class="lesson-item lesson-header-item"
      :class="{
        'is-active': isActive && !isOpen,
        'is-completed': lesson.isCompleted,
      }"
      @click="$emit('toggle', lesson.id)"
    >
      <span class="lesson-type-badge" :class="lesson.type">
        <i :class="lesson.type === 'text' ? 'fa-solid fa-file-alt' : 'fa-solid fa-code'"></i>
      </span>
      <span class="lesson-title">{{ lesson.title }}</span>
      <i v-if="lesson.isCompleted" class="fa-solid fa-check status-icon completed"></i>
      <i v-else-if="lesson.isPremium" class="fa-solid fa-lock status-icon locked"></i>
      <i class="fa-solid lesson-expand-icon" :class="isOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
    </button>

    <!-- Sub Items (Materi, Tes, Praktik) -->
    <Transition name="sub">
      <div v-if="isOpen" class="sub-items">
        <!-- Materi -->
        <button 
          class="sub-item" 
          :class="{'is-active': isActive && activeStep === 1}" 
          @click="$emit('step-click', 'theory')"
        >
          <i class="fa-solid fa-book-open sub-icon theory-icon"></i>
          <span class="sub-label">Materi</span>
          <i v-if="lesson.isCompleted" class="fa-solid fa-check sub-status-icon completed"></i>
        </button>

        <!-- Tes Pertanyaan -->
        <button 
          class="sub-item" 
          :class="{
            'is-active': isActive && activeStep === 2, 
            'locked': !lesson.isCompleted
          }" 
          @click="$emit('step-click', 'quiz')"
        >
          <i class="fa-solid fa-circle-question sub-icon quiz-icon"></i>
          <span class="sub-label">Tes</span>
          <i v-if="!lesson.isCompleted" class="fa-solid fa-lock sub-status-icon locked"></i>
          <i v-else-if="lesson.quizPassed" class="fa-solid fa-check sub-status-icon completed"></i>
        </button>

        <!-- Praktik -->
        <button 
          class="sub-item" 
          :class="{
            'is-active': isActive && activeStep === 3, 
            'locked': !lesson.quizPassed
          }" 
          @click="$emit('step-click', 'practice')"
        >
          <i class="fa-solid fa-code sub-icon practice-icon"></i>
          <span class="sub-label">Praktik</span>
          <i v-if="!lesson.quizPassed" class="fa-solid fa-lock sub-status-icon locked"></i>
          <i v-else-if="lesson.practiceDone" class="fa-solid fa-check sub-status-icon completed"></i>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
defineProps({
  lesson: { type: Object, required: true },
  isOpen: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  activeStep: { type: Number, default: 1 },
})

defineEmits(['toggle', 'step-click'])
</script>

<style scoped>
.lesson-group {
  margin-bottom: 2px;
}

.lesson-item {
  width: 100%;
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  color: #64748b;
  padding: 8px 14px 8px 22px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.8rem;
  text-align: left;
  transition: all 0.2s;
}
.lesson-item:hover { color: #94a3b8; background: rgba(255, 255, 255, 0.03); }
.lesson-item.is-active {
  color: #c084fc;
  background: rgba(147, 51, 234, 0.1);
  border-left-color: #7c3aed;
}
.lesson-item.is-completed { color: #10b981; }

.lesson-type-badge {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  flex-shrink: 0;
}
.lesson-type-badge.text { background: rgba(56, 189, 248, 0.12); color: #38bdf8; }
.lesson-type-badge.code { background: rgba(147, 51, 234, 0.12); color: #c084fc; }

.lesson-title { flex: 1; line-height: 1.35; }

.lesson-expand-icon {
  font-size: 0.65rem;
  margin-left: auto;
  opacity: 0.6;
}

.status-icon { font-size: 0.65rem; flex-shrink: 0; }
.status-icon.completed { color: #10b981; }
.status-icon.locked { color: #f59e0b; }

/* ── Sub Items ── */
.sub-items {
  display: flex;
  flex-direction: column;
  padding: 4px 14px 4px 40px;
  gap: 4px;
  background: rgba(0, 0, 0, 0.1);
}

.sub-item {
  width: 100%;
  background: transparent;
  border: 1px solid transparent;
  color: #64748b;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.75rem;
  text-align: left;
  border-radius: 6px;
  transition: all 0.2s;
}

.sub-item:not(.locked):hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.sub-item.is-active {
  background: rgba(147, 51, 234, 0.15);
  border-color: rgba(147, 51, 234, 0.3);
  color: #e2e8f0;
}

.sub-item.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.sub-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 0.65rem;
  flex-shrink: 0;
}

.theory-icon { background: rgba(0, 240, 255, 0.15); color: #00f0ff; }
.quiz-icon { background: rgba(147, 51, 234, 0.15); color: #c084fc; }
.practice-icon { background: rgba(16, 185, 129, 0.15); color: #10b981; }

.sub-label {
  flex: 1;
}

.sub-status-icon {
  font-size: 0.65rem;
}
.sub-status-icon.completed { color: #10b981; }
.sub-status-icon.locked { color: #64748b; }

/* ── Transitions ── */
.sub-enter-active,
.sub-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.sub-enter-from,
.sub-leave-to {
  opacity: 0;
  max-height: 0;
}

.sub-enter-to,
.sub-leave-from {
  opacity: 1;
  max-height: 200px;
}
</style>
