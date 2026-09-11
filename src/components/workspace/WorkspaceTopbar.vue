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
          <i class="fa-solid fa-bolt"></i> {{ userProfile.xp }} XP
        </div>
      </div>

      <img :src="userProfile.avatar" :alt="userProfile.name" class="avatar-sm" :title="'Masuk sebagai ' + userProfile.name">
    </div>
  </header>
</template>

<script setup>
import { useUserAccount } from '../../composables/useUserAccount'

const { isLoggedIn, userProfile } = useUserAccount()
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

<style scoped>
.ws-topbar {
  height: 56px;
  background: rgba(15, 10, 30, 0.95);
  border-bottom: 1px solid rgba(147, 51, 234, 0.2);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 20px;
  z-index: 100;
  position: relative;
  flex-shrink: 0;
}

/* ── Left: back + breadcrumb ── */
.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: hidden;
  min-width: 0;
}

.back-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}
.back-btn:hover { background: rgba(255, 255, 255, 0.15); color: white; }

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.8rem;
  overflow: hidden;
  white-space: nowrap;
}
.separator { font-size: 0.6rem; color: #334155; }
.breadcrumb-path { color: #7c3aed; font-weight: 600; flex-shrink: 0; }
.breadcrumb-chapter { color: #64748b; flex-shrink: 0; }
.breadcrumb-lesson { color: #e2e8f0; font-weight: 500; overflow: hidden; text-overflow: ellipsis; }

/* ── Right: progress steps ── */
.progress-steps {
  display: flex;
  align-items: center;
  list-style: none;
  gap: 0;
  flex-shrink: 0;
}

.step {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #475569;
}
.step.active { color: #c084fc; }
.step.done { color: #10b981; }

.step-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  transition: all 0.3s;
  flex-shrink: 0;
}
.step.active .step-dot { background: #7c3aed; border-color: #c084fc; color: white; }
.step.done .step-dot { background: #10b981; border-color: #10b981; color: white; }

.step-label { white-space: nowrap; }

.step-connector {
  width: 32px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin: 0 8px;
  transition: background 0.3s;
}
.step-connector.active { background: #10b981; }

/* ── User Indicator ── */
.user-indicator {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.separator-vertical {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
}

.avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(147, 51, 234, 0.5);
  background: rgba(255, 255, 255, 0.05);
  object-fit: cover;
  cursor: pointer;
  transition: all 0.2s;
}

.avatar-sm:hover {
  border-color: #c084fc;
  transform: scale(1.05);
}

.user-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.level-badge i {
  color: #f59e0b;
}

.xp-badge i {
  color: #22d3ee;
}

@media (max-width: 1024px) {
  .step-label { display: none; }
  .step-connector { width: 20px; margin: 0 4px; }
  .breadcrumb-chapter { display: none; }
  .breadcrumb .separator:nth-child(2) { display: none; }
}

@media (max-width: 768px) {
  .ws-topbar { padding: 10px 12px; flex-wrap: wrap; gap: 8px; }
  .topbar-left { flex: 1; min-width: 0; }
  .breadcrumb-path { display: none; }
  .breadcrumb .separator:first-of-type { display: none; }
  .breadcrumb-lesson { font-size: 0.75rem; }
  .user-indicator { gap: 8px; }
  .user-stats { display: none; }
  .separator-vertical { display: none; }
  .step-dot { width: 18px; height: 18px; font-size: 0.55rem; }
  .step-connector { width: 14px; }
}
</style>
