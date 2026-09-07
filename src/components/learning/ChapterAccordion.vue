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
      <div 
        v-for="lesson in chapter.lessons" 
        :key="lesson.id" 
        class="lesson-item" 
        @click="$emit('lesson-click', lesson)"
      >
        <div class="lesson-status">
          <i v-if="lesson.isCompleted" class="fa-regular fa-circle-check completed-icon"></i>
          <i v-else class="fa-regular fa-circle pending-icon"></i>
        </div>
        <div class="lesson-title">
          {{ lesson.title }}
          <span v-if="lesson.isPremium" class="premium-badge"><i class="fa-solid fa-lock"></i> PRO</span>
        </div>
        <div class="lesson-type" :class="lesson.type">
          {{ lesson.type === 'text' ? 'Teks' : (lesson.type === 'sql' ? 'SQL' : 'Code') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

.lesson-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-radius: 8px;
  margin-top: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
  background: rgba(0, 0, 0, 0.2);
}

.lesson-item:hover {
  background: rgba(147, 51, 234, 0.2);
}

.lesson-status {
  margin-right: 15px;
  font-size: 1.1rem;
}

.completed-icon {
  color: #10b981;
}

.pending-icon {
  color: #64748b;
}

.lesson-title {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.premium-badge {
  font-size: 0.65rem;
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.lesson-type {
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
}

.lesson-type.text {
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.lesson-type.sql, .lesson-type.code {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
}
</style>
