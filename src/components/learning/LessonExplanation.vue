<template>
  <div class="step-content">
    <div class="explanation-box" v-html="explanation"></div>
    <div class="action-bar">
      <button class="btn-primary" @click="$emit('next')">
        Lanjut ke Tes <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  explanation: {
    type: String,
    required: true
  }
})

defineEmits(['next'])
</script>

<style scoped src="../../assets/css/components/learning/LessonExplanation.css"></style>
