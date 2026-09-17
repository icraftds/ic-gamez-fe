<template>
  <header class="ws-topbar">
    <div class="topbar-left">
      <button class="back-btn" @click="$emit('back')" :title="'Kembali ke ' + pathTitle">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <nav class="breadcrumb" aria-label="breadcrumb">
        <span class="breadcrumb-path">{{ pathTitle }}</span>
        <i class="fa-solid fa-chevron-right separator"></i>
        <span class="breadcrumb-chapter">{{ chapterTitle }}</span>
        <i class="fa-solid fa-chevron-right separator"></i>
        <span class="breadcrumb-lesson">{{ lessonTitle }}</span>
      </nav>
    </div>

    <ol class="progress-steps" aria-label="Progress belajar">
      <li
        v-for="(step, index) in STEPS"
        :key="step.label"
        class="step"
        :class="{
          active: activeStep >= step.number,
          done: activeStep > step.number,
        }"
      >
        <div class="step-dot" :aria-current="activeStep === step.number ? 'step' : undefined">
          <i v-if="activeStep > step.number" class="fa-solid fa-check"></i>
          <span v-else>{{ step.number }}</span>
        </div>
        <span class="step-label">{{ step.label }}</span>
        <div v-if="index < STEPS.length - 1" class="step-connector" :class="{ active: activeStep > step.number }"></div>
      </li>
    </ol>

    <!-- User Indicator -->
    <div class="user-indicator" v-if="isLoggedIn">
      <div class="separator-vertical"></div>
      
      <div class="user-stats">
        <div class="stat-badge level-badge" title="Level Anda">
          <i class="fa-solid fa-star"></i> Lvl {{ userProfile.level }}
        </div>
        <div class="stat-badge xp-badge" title="Total XP Anda">
          <i class="fa-solid fa-arrow-trend-up"></i> {{ userProfile.totalXp ?? userProfile.xp }} XP
        </div>
        <div class="stat-badge energy-badge" title="Sisa Energi" v-if="!isPremiumUser">
          <i class="fa-solid fa-bolt text-warning"></i> {{ credits }}
        </div>
        <div class="stat-badge premium-badge" title="Akun PRO" v-else>
          <i class="fa-solid fa-bolt" style="color: #f59e0b;"></i> PRO
        </div>
      </div>

      <img :src="userProfile.avatar" :alt="userProfile.name" class="avatar-sm" :title="'Masuk sebagai ' + userProfile.name">
    </div>
  </header>
</template>

<script setup>
import { useUserAccount } from '../../composables/useUserAccount'

const { isLoggedIn, userProfile, isPremiumUser, credits } = useUserAccount()
const STEPS = [
  { number: 1, label: 'Materi' },
  { number: 2, label: 'Tes' },
  { number: 3, label: 'Praktik' },
]

defineProps({
  pathTitle: { type: String, default: '' },
  chapterTitle: { type: String, default: '' },
  lessonTitle: { type: String, default: '' },
  activeStep: { type: Number, required: true },
})

defineEmits(['back'])
</script>

<style scoped src="../../assets/css/components/workspace/WorkspaceTopbar.css"></style>
