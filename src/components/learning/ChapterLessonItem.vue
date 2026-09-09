<template>
  <div class="lesson-group">
    <!-- Lesson header row -->
    <div 
      class="lesson-item lesson-header-item"
      @click="$emit('toggle', lesson.id)"
    >
      <div class="lesson-status">
        <i v-if="lesson.isCompleted" class="fa-regular fa-circle-check completed-icon"></i>
        <i v-else class="fa-regular fa-circle pending-icon"></i>
      </div>
      <div class="lesson-title">
        {{ lesson.title }}
        <span v-if="lesson.isPremium" class="premium-badge"><i class="fa-solid fa-lock"></i> PRO</span>
      </div>
      <div class="lesson-expand-icon">
        <i class="fa-solid" :class="isOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </div>
    </div>

    <!-- Sub-items: Materi, Tes, Praktik -->
    <Transition name="sub">
      <div v-if="isOpen" class="sub-items">
        <!-- Materi -->
        <div
          class="sub-item sub-materi"
          @click="$emit('step-click', 'theory')"
        >
          <div class="sub-icon">
            <i class="fa-solid fa-book-open"></i>
          </div>
          <div class="sub-info">
            <span class="sub-label">Materi</span>
            <span class="sub-desc">Baca & pahami konten</span>
          </div>
          <div class="sub-status">
            <i v-if="lesson.isCompleted" class="fa-solid fa-check done-icon"></i>
            <i v-else class="fa-solid fa-play play-icon"></i>
          </div>
        </div>

        <!-- Tes Pertanyaan -->
        <div
          class="sub-item sub-quiz"
          :class="{ locked: !lesson.isCompleted }"
          @click="lesson.isCompleted && $emit('step-click', 'quiz')"
        >
          <div class="sub-icon">
            <i class="fa-solid fa-circle-question"></i>
          </div>
          <div class="sub-info">
            <span class="sub-label">Tes Pertanyaan</span>
            <span class="sub-desc">Uji pemahamanmu</span>
          </div>
          <div class="sub-status">
            <i v-if="!lesson.isCompleted" class="fa-solid fa-lock lock-icon"></i>
            <i v-else-if="lesson.quizPassed" class="fa-solid fa-check done-icon"></i>
            <i v-else class="fa-solid fa-play play-icon"></i>
          </div>
        </div>

        <!-- Praktik Kode -->
        <div
          class="sub-item sub-practice"
          :class="{ locked: !lesson.quizPassed }"
          @click="lesson.quizPassed && $emit('step-click', 'practice')"
        >
          <div class="sub-icon">
            <i class="fa-solid fa-code"></i>
          </div>
          <div class="sub-info">
            <span class="sub-label">Praktik Kode</span>
            <span class="sub-desc">Terapkan dalam kode</span>
          </div>
          <div class="sub-status">
            <i v-if="!lesson.quizPassed" class="fa-solid fa-lock lock-icon"></i>
            <i v-else-if="lesson.practiceDone" class="fa-solid fa-check done-icon"></i>
            <i v-else class="fa-solid fa-play play-icon"></i>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
defineProps({
  lesson: { type: Object, required: true },
  isOpen: { type: Boolean, default: false }
})

defineEmits(['toggle', 'step-click'])
</script>

<style scoped>
.lesson-group {
  display: flex;
  flex-direction: column;
}

.lesson-item {
  display: flex;
  align-items: center;
  padding: 18px 24px;
  background: rgba(10, 6, 18, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.lesson-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.lesson-status {
  width: 30px;
  display: flex;
  justify-content: center;
  margin-right: 15px;
  font-size: 1.2rem;
}

.completed-icon {
  color: #10b981;
}

.pending-icon {
  color: #475569;
}

.lesson-title {
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
}

.premium-badge {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.lesson-expand-icon {
  color: #64748b;
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

/* ── Sub Items ── */
.sub-items {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.sub-item {
  display: flex;
  align-items: center;
  padding: 16px 24px 16px 64px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.sub-item:hover:not(.locked) {
  background: rgba(255, 255, 255, 0.03);
}

.sub-item.sub-materi:hover:not(.locked) { border-left-color: #00f0ff; }
.sub-item.sub-quiz:hover:not(.locked) { border-left-color: #c084fc; }
.sub-item.sub-practice:hover:not(.locked) { border-left-color: #10b981; }

.sub-item.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.sub-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 1rem;
}

.sub-materi .sub-icon { background: rgba(0, 240, 255, 0.1); color: #00f0ff; }
.sub-quiz .sub-icon { background: rgba(192, 132, 252, 0.1); color: #c084fc; }
.sub-practice .sub-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }

.sub-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sub-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e2e8f0;
}

.sub-desc {
  font-size: 0.8rem;
  color: #64748b;
}

.sub-status {
  width: 30px;
  display: flex;
  justify-content: flex-end;
  font-size: 0.9rem;
}

.done-icon { color: #10b981; }
.play-icon { color: #64748b; font-size: 0.8rem; }
.lock-icon { color: #475569; }

/* ── Transitions ── */
.sub-enter-active,
.sub-leave-active {
  transition: all 0.3s ease;
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
  max-height: 300px;
}
</style>
