<template>
  <div class="lesson-group">
    <div 
      class="lesson-item"
      @click="$emit('step-click', 'theory')"
    >
      <div class="lesson-status">
        <i v-if="lesson.isCompleted" class="fa-regular fa-circle-check completed-icon"></i>
        <i v-else class="fa-regular fa-circle pending-icon"></i>
      </div>
      <div class="lesson-title">
        {{ lesson.title }}
        <span v-if="lesson.is_premium && !isPremiumUser" class="premium-badge"><i class="fa-solid fa-lock"></i> PRO</span>
      </div>
      <div class="lesson-action-icon">
        <span v-if="lesson.is_premium && !isPremiumUser" class="unlock-pro-btn">
          <i class="fa-solid fa-lock"></i> Unlock Pro
        </span>
        <i v-else class="fa-solid fa-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserAccount } from '../../composables/useUserAccount'

defineProps({
  lesson: { type: Object, required: true }
})

defineEmits(['step-click'])

const { isPremiumUser } = useUserAccount()
</script>

<style scoped src="../../assets/css/components/learning/ChapterLessonItem.css"></style>
