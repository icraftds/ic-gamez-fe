<template>
  <div class="theory-panel">
    <article class="panel-content">
      <header class="lesson-header">
        <span class="type-badge" :class="lesson.type">
          <i :class="lesson.type === 'text' ? 'fa-solid fa-book-open' : 'fa-solid fa-laptop-code'"></i>
          {{ lesson.type === 'text' ? 'Bacaan' : 'Koding' }}
        </span>
        <h1 class="lesson-title">{{ lesson.title }}</h1>
      </header>

      <!-- Konten HTML dari data materi -->
      <div class="lesson-body" v-html="lesson.explanation"></div>
    </article>

    <footer class="panel-footer">
      <button class="nav-btn prev-btn" :disabled="isFirstLesson" @click="$emit('prev')">
        <i class="fa-solid fa-arrow-left"></i> Sebelumnya
      </button>
      <button class="nav-btn next-btn" @click="$emit('next')">
        Lanjut ke Tes <i class="fa-solid fa-arrow-right"></i>
      </button>
    </footer>
  </div>
</template>

<script setup>
defineProps({
  lesson: { type: Object, required: true },
  isFirstLesson: { type: Boolean, default: false },
})

defineEmits(['prev', 'next'])
</script>

<style scoped>
.theory-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 40px 64px;
}
.panel-content::-webkit-scrollbar { width: 5px; }
.panel-content::-webkit-scrollbar-thumb { background: rgba(147, 51, 234, 0.3); border-radius: 3px; }

/* ── Header ── */
.lesson-header { margin-bottom: 32px; }

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 14px;
}
.type-badge.text { background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.2); }
.type-badge.code { background: rgba(147, 51, 234, 0.1); color: #c084fc; border: 1px solid rgba(147, 51, 234, 0.2); }

.lesson-title {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  background: linear-gradient(135deg, #e2e8f0, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Body (rendered HTML from lesson data) ── */
.lesson-body {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #cbd5e1;
}
.lesson-body :deep(h2) { font-size: 1.5rem; font-weight: 700; color: white; margin: 28px 0 12px; }
.lesson-body :deep(h3) { font-size: 1.15rem; font-weight: 700; color: #c084fc; margin: 24px 0 10px; }
.lesson-body :deep(p) { margin-bottom: 16px; }
.lesson-body :deep(ul),
.lesson-body :deep(ol) { margin-left: 24px; margin-bottom: 16px; }
.lesson-body :deep(li) { margin-bottom: 8px; }
.lesson-body :deep(strong) { color: #e2e8f0; }
.lesson-body :deep(pre) {
  background: #060310;
  border: 1px solid rgba(147, 51, 234, 0.25);
  border-radius: 10px;
  padding: 20px;
  overflow-x: auto;
  margin: 20px 0;
}
.lesson-body :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: #00f0ff;
  font-size: 0.88rem;
}
.lesson-body :deep(p code),
.lesson-body :deep(li code) {
  background: rgba(0, 240, 255, 0.08);
  color: #67e8f9;
  padding: 2px 7px;
  border-radius: 5px;
}

/* ── Footer ── */
.panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 64px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(10, 6, 18, 0.6);
  flex-shrink: 0;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.prev-btn {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
}
.prev-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.12); color: white; }

.next-btn {
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  color: white;
}
.next-btn:hover { opacity: 0.9; transform: translateY(-1px); }
</style>
