<template>
  <header class="ws-topbar">
    <div class="topbar-left">
      <button
        class="back-btn"
        @click="$emit('back')"
        :title="'Kembali ke ' + pathTitle"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
      <nav class="breadcrumb" aria-label="breadcrumb">
        <span class="breadcrumb-chapter clickable" @click="$emit('back')" title="Kembali ke Chapter">{{ chapterTitle }}</span>
        <i v-if="previousLessonTitle" class="fa-solid fa-chevron-right separator"></i>
        <span v-if="previousLessonTitle" class="breadcrumb-lesson clickable" @click="$emit('prev-lesson')" title="Kembali ke Materi Sebelumnya">{{ previousLessonTitle }}</span>
        <i class="fa-solid fa-chevron-right separator"></i>
        <span class="breadcrumb-lesson current">{{ lessonTitle }}</span>
      </nav>
    </div>

    <ol class="progress-steps" aria-label="Progress belajar">
      <li
        v-for="(step, index) in STEPS"
        :key="step.label"
        class="step"
        :class="{
          active: activeStep >= step.number,
          done: isStepDone(step.number, lesson, activeStep),
        }"
      >
        <div
          class="step-dot"
          :aria-current="activeStep === step.number ? 'step' : undefined"
        >
          <i v-if="isStepDone(step.number, lesson, activeStep)" class="fa-solid fa-check"></i>
          <span v-else>{{ step.number }}</span>
        </div>
        <span class="step-label">{{ step.label }}</span>
        <div
          v-if="index < STEPS.length - 1"
          class="step-connector"
          :class="{ active: isStepDone(step.number, lesson, activeStep) }"
        ></div>
      </li>
    </ol>

    <!-- User Indicator -->
    <div class="user-indicator" v-if="isLoggedIn">
      <div class="separator-vertical"></div>
      
      <!-- Energy Display -->
      <div class="nav-energy" title="Sisa Energi" style="gap: 0; padding-left: 2px;">
        <div style="width: 25px; height: 30px; display: flex; align-items: center; justify-content: flex-end; overflow: visible;">
          <CyberEnergy :pkgId="1" :isAnimated="false" style="min-width: 30px; min-height: 30px; width: 30px; height: 30px; transform: translateX(5px);" />
        </div>
        <span style="z-index: 1;">{{ credits }}</span>
      </div>

      <UserProfileDropdown />
    </div>
  </header>
</template>

<script setup>
import { ssoEnabled, globalLogoutEnabled } from '../../services/sso';
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserAccount } from "../../composables/useUserAccount";
import UserProfileDropdown from "../common/UserProfileDropdown.vue";

const router = useRouter();
const { isLoggedIn, credits, fetchUser } = useUserAccount();

const STEPS = [
  { number: 1, label: "Materi" },
  { number: 2, label: "Tes" },
  { number: 3, label: "Praktik" },
];

defineProps({
  pathTitle: { type: String, default: "" },
  chapterTitle: { type: String, default: "" },
  lessonTitle: { type: String, default: "" },
  previousLessonTitle: { type: String, default: "" },
  activeStep: { type: Number, required: true },
  lesson: { type: Object, default: () => ({}) },
});

const isStepDone = (stepNum, lessonObj, currentStep) => {
  if (currentStep > stepNum) return true;
  if (!lessonObj) return false;
  if (stepNum === 1 && lessonObj.isCompleted) return true;
  if (stepNum === 2 && lessonObj.quizPassed) return true;
  if (stepNum === 3 && lessonObj.practiceDone) return true;
  return false;
};

defineEmits(["back", "prev-lesson"]);

onMounted(() => {
  fetchUser();
});
</script>


<style
  scoped
  src="../../assets/css/components/workspace/WorkspaceTopbar.css"
></style>

<style scoped src="../../assets/css/components/workspace/WorkspaceTopbar.css"></style>
