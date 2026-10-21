<template>
  <div class="learning-path-card" :style="cardStyle">
    <div class="card-ambient-glow" :style="ambientGlowStyle"></div>
    <div class="card-inner">
      <div class="card-content-left">
        <div class="card-header">
          <div
            class="icon-wrapper"
            :style="{
              backgroundColor: themeColor + '15',
              color: themeColor,
              border: `1px solid ${themeColor}40`,
            }"
          >
            <i :class="path.icon || 'fa-solid fa-code'"></i>
          </div>
          <div class="header-labels">
            <div class="path-title-row">
              <span class="path-title" :style="{ color: themeColor }">
                {{ path.title }}
              </span>
              <span v-if="isPremium" class="badge-tier tier-pro">
                <i class="fa-solid fa-crown"></i> PRO
              </span>
              <span v-else class="badge-tier tier-free">
                <i class="fa-solid fa-gift"></i> GRATIS
              </span>
            </div>
            <span class="path-step-indicator" v-if="total > 0">
              Alur {{ index + 1 }} dari {{ total }}
            </span>
          </div>
        </div>

        <h3 class="headline">
          Mulai perjalanan
          <span class="highlight" :style="{ color: themeColor }">{{
            path.title
          }}</span>
          Anda.
        </h3>
        <p class="description">{{ path.description }}</p>

        <router-link
          to="#"
          @click.prevent="startLearning"
          class="btn-start"
          :style="{
            backgroundColor: themeColor,
            boxShadow: `0 4px 22px ${themeColor}35`,
          }"
        >
          <template v-if="!isPreparingLesson">
            <span>Mulai Belajar</span>
            <i class="fa-solid fa-arrow-right btn-icon"></i>
          </template>
          <TerminalLoader v-else variant="inline" label="materi" />
        </router-link>
      </div>

      <div class="card-content-right">
        <div
          class="features-panel"
          :style="{ borderTop: `4px solid ${themeColor}` }"
        >
          <h4 class="features-title">Apa yang akan Anda pelajari?</h4>
          <ul class="features">
            <li>
              <div
                class="feature-icon"
                :style="{
                  color: themeColor,
                  backgroundColor: themeColor + '12',
                }"
              >
                <i class="fa-solid fa-book-open"></i>
              </div>
              <div class="feature-text">
                <strong
                  >{{ chapterCount }} Modul Terstruktur</strong
                >
                <span>Materi disusun step-by-step.</span>
              </div>
            </li>
            <li>
              <div
                class="feature-icon"
                :style="{
                  color: themeColor,
                  backgroundColor: themeColor + '12',
                }"
              >
                <i class="fa-solid fa-laptop-code"></i>
              </div>
              <div class="feature-text">
                <strong>Praktik Langsung</strong>
                <span>Belajar sambil ngoding interaktif.</span>
              </div>
            </li>
            <li>
              <div
                class="feature-icon"
                :style="{
                  color: themeColor,
                  backgroundColor: themeColor + '12',
                }"
              >
                <i class="fa-solid fa-robot"></i>
              </div>
              <div class="feature-text">
                <strong>Validasi Otomatis</strong>
                <span>Kode Anda dicek secara real-time.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useLearningPaths } from "../../composables/useLearningPaths";
import { useUserAccount } from "../../composables/useUserAccount";

const props = defineProps({
  path: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
});

const router = useRouter();
const { fetchPathDetails, isPreparingLesson } = useLearningPaths();
const { isPremiumUser } = useUserAccount();

const isPremium = computed(() => {
  return Boolean(props.path.is_premium || props.path.isPremium);
});

const chapterCount = computed(() => {
  if (props.path.chapters && props.path.chapters.length > 0) {
    return props.path.chapters.length;
  }
  return 4;
});

// Z-index scales smoothly so cards land on top of previous cards without offset drifting
const cardStyle = computed(() => {
  return {
    zIndex: props.index + 5,
    '--card-theme': themeColor.value,
  };
});

const themeColor = computed(() => {
  const colors = [
    "#00f0ff", // Cyan
    "#ec4899", // Hot Pink
    "#9333ea", // Neon Purple
    "#10b981", // Emerald Green
  ];
  return colors[props.index % colors.length];
});

const ambientGlowStyle = computed(() => {
  return {
    background: `radial-gradient(circle at 85% 20%, ${themeColor.value}18 0%, transparent 60%)`,
  };
});

const startLearning = async () => {
  isPreparingLesson.value = true;
  let detailedPath = props.path;

  // Periksa apakah lessons sudah dimuat, jika belum panggil API detail
  if (
    !detailedPath.chapters ||
    detailedPath.chapters.length === 0 ||
    !detailedPath.chapters[0].lessons
  ) {
    const fetched = await fetchPathDetails(props.path.slug || props.path.id);
    if (fetched) detailedPath = fetched;
  }

  const firstChapter = detailedPath?.chapters?.[0];
  const firstLesson = firstChapter?.lessons?.[0];

  if (firstChapter && firstLesson) {
    router.push(
      `/learning/${detailedPath.slug || detailedPath.id}/lesson/${firstChapter.slug || firstChapter.id}/${firstLesson.slug || firstLesson.id}`,
    );
  } else {
    router.push(
      `/learning/${detailedPath?.slug || detailedPath?.id || props.path.slug || props.path.id}`,
    );
  }
};
</script>

<style
  scoped
  src="../../assets/css/components/home/LearningPathCard.css"
></style>
