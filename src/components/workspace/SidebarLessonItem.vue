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
      <i v-else-if="lesson.is_premium && !isPremiumUser" class="fa-solid fa-lock status-icon locked"></i>
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
import { useUserAccount } from '../../composables/useUserAccount'

defineProps({
  lesson: { type: Object, required: true },
  isOpen: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  activeStep: { type: Number, default: 1 },
})

defineEmits(['toggle', 'step-click'])

const { isPremiumUser } = useUserAccount()
</script>

<style scoped src="../../assets/css/components/workspace/SidebarLessonItem.css"></style>
