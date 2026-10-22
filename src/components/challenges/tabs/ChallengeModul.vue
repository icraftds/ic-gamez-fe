<template>
  <main class="content">
    <div class="header">
      <h2>Tantangan <span class="gradient-text">Coding & SQL</span></h2>
      <p>
        Pilih tantangan dan mulai belajar dengan praktik langsung. Pastikan
        kredit Anda cukup!
      </p>
    </div>

    <div class="filters">
      <div class="custom-dropdown" ref="dropdownRef">
        <div class="dropdown-selected" @click="isDropdownOpen = !isDropdownOpen">
          <div class="selected-content">
            <i class="fa-solid fa-filter"></i>
            <span>{{ selectedCategory || 'Semua Kategori' }}</span>
          </div>
          <i class="fa-solid fa-chevron-down dropdown-arrow" :class="{ 'open': isDropdownOpen }"></i>
        </div>
        <transition name="fade-slide">
          <div class="dropdown-menu" v-if="isDropdownOpen">
            <div class="dropdown-item" :class="{ 'active': selectedCategory === '' }" @click="selectCategory('')">
              Semua Kategori
            </div>
            <div class="dropdown-item" v-for="cat in uniqueCategories" :key="cat" 
                 :class="{ 'active': selectedCategory === cat }" @click="selectCategory(cat)">
              {{ cat }}
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="challenges-grid-container">
      <div class="challenges-grid">
        <div
          v-for="challenge in challenges"
          :key="challenge.id"
          class="challenge-card"
          :class="{ 'is-premium-locked': challenge.isPremium && !isPremiumUser }"
          @click="openChallenge(challenge)"
        >
          <div class="challenge-card-header">
            <span class="badge category-badge">{{ challenge.category }}</span>
            <span v-if="challenge.isPremium" class="badge badge-premium">
              <i class="fa-solid" :class="isPremiumUser ? 'fa-lock-open' : 'fa-lock'"></i> Pro / Expert
            </span>
          </div>
          <h3 class="challenge-title">{{ challenge.title }}</h3>
          
          <div class="challenge-topics">
            <p class="topic-label"><i class="fa-solid fa-book-open"></i> Topik Pembelajaran:</p>
            <p class="topic-text">Pelajari dan asah kemampuan terkait {{ challenge.category }} untuk meningkatkan skill Anda.</p>
          </div>

          <div class="challenge-rewards">
            <div class="reward-item xp">
              <i class="fa-solid fa-star"></i> +{{ getExpectedXp(challenge.difficulty) }} XP
            </div>
            <div class="reward-item coin">
              <img src="/images/icoinz.svg" alt="iCoinZ" class="coin-icon" style="width: 16px; height: 16px;" /> +{{ challenge.coin_reward || getExpectedCoin(challenge.difficulty) }} iCoinZ
            </div>
          </div>

          <div class="challenge-card-footer">
            <span class="difficulty-badge" :class="challenge.difficulty.toLowerCase()">
              {{ challenge.difficulty }}
            </span>
            <div class="status-indicator">
              <span v-if="challenge.isCompleted" class="status-completed">
                <i class="fa-solid fa-circle-check"></i> Selesai
              </span>
              <span v-else class="status-pending">
                Mulai Tantangan <i class="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <TerminalLoader v-if="isLoading" label="tantangan modul" />
      <div v-else-if="challenges.length === 0" class="empty-state">
        Tidak ada tantangan dalam kategori ini.
      </div>
      
      <!-- Pagination Controls -->
      <div class="pagination" v-if="totalPages > 1">
        <button class="page-btn" @click="currentPage--" :disabled="currentPage === 1">
          <i class="fa-solid fa-chevron-left"></i> Sebelumnya
        </button>
        <span class="page-info">Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <button class="page-btn" @click="currentPage++" :disabled="currentPage === totalPages">
          Selanjutnya <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLearningPaths } from "../../../composables/useLearningPaths.js";
import { useUserAccount } from "../../../composables/useUserAccount.js";
import ChallengeTableRow from "../ChallengeTableRow.vue";
import api from "../../../services/api.js";

const emit = defineEmits(['require-premium', 'require-auth']);

const router = useRouter();
const route = useRoute();
const { paths, fetchAllPathsDetails } = useLearningPaths();
const { isPremiumUser, deductCredit, isLoggedIn } = useUserAccount();

const selectedCategory = ref(route.query.category || "");
const currentPage = ref(1);
const totalPages = ref(1);
const challenges = ref([]);
const isLoading = ref(false);

const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const selectCategory = (cat) => {
  isDropdownOpen.value = false;
  if (cat === "") {
    const newQuery = { ...route.query };
    delete newQuery.category;
    router.push({ query: newQuery });
  } else {
    router.push({ query: { ...route.query, category: cat } });
  }
};

watch(() => route.query.category, (newCat) => {
  selectedCategory.value = newCat || "";
});

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

const challengeCategoryList = [
  'Tantangan Database & SQL',
  'Tantangan JavaScript & Logika',
  'Algoritma & Problem Solving',
  'Tantangan Python Fundamentals',
  'Tantangan PHP & Backend',
  'Tantangan Frontend & Web',
];

const uniqueCategories = computed(() => {
  const catSet = new Set(challengeCategoryList);
  paths.value.forEach(p => {
    if (p.title && p.slug !== 'global-challenges') catSet.add(p.title);
  });
  challenges.value.forEach(c => {
    if (c.category) catSet.add(c.category);
  });
  return Array.from(catSet);
});

const fetchChallenges = async () => {
  try {
    isLoading.value = true;
    
    // Pastikan kita memiliki detail dari setiap path agar chapters tersedia
    const hasDetailedPaths = paths.value.length > 0 && paths.value.every(p => Array.isArray(p.chapters));
    if (!hasDetailedPaths) {
      await fetchAllPathsDetails();
    }
    
    const response = await api.get('/challenges', {
      params: {
        page: currentPage.value,
        category: selectedCategory.value
      }
    });
    
    totalPages.value = response.data.meta ? response.data.meta.last_page : 1;
    
    let completedLocal = []
    try {
      completedLocal = JSON.parse(localStorage.getItem('completed_challenges') || '[]')
    } catch(e) {}

    const list = response.data.data.map(challenge => {
      let category = challenge.path_title || 'Lainnya';
      let pathId = challenge.path_slug || challenge.path_id;
      let chapterId = challenge.chapter_slug || challenge.chapter_id;
      
      const path = paths.value.find(p => p.chapters && p.chapters.some(c => c.id == challenge.chapter_id));
      if (path) {
        category = path.title;
        pathId = path.slug || path.id;
        const chapter = path.chapters.find(c => c.id == challenge.chapter_id);
        if (chapter) chapterId = chapter.slug || chapter.id;
      }

      if (!pathId) pathId = challenge.path_slug || 'global-challenges';
      if (!chapterId) chapterId = challenge.chapter_slug || challenge.chapter_id || 'algorithms';
      
      let p = challenge.progress;
      if (Array.isArray(p)) p = p.length > 0 ? p[0] : null;
      const isChallengeCompleted = Boolean((p && p.challenge_completed) || completedLocal.includes(challenge.id));

      return {
        ...challenge,
        category,
        pathId,
        chapterId,
        difficulty: challenge.difficulty || (challenge.is_premium ? 'Sulit' : 'Sedang'),
        isCompleted: isChallengeCompleted,
        isPremium: challenge.is_premium,
        costCredit: challenge.cost_credit,
      };
    });

    // Hilangkan kartu soal yang sudah selesai dari layar
    challenges.value = list.filter(item => !item.isCompleted);
    
  } catch (error) {
    console.error('Failed to fetch challenges:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchChallenges();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

watch(currentPage, () => {
  fetchChallenges();
});

watch(selectedCategory, () => {
  currentPage.value = 1;
  fetchChallenges();
});

const getExpectedXp = (difficulty) => {
  const diff = (difficulty || 'sedang').toLowerCase();
  if (diff === 'mudah' || diff === 'easy') return 25;
  if (diff === 'sedang' || diff === 'medium') return 50;
  if (diff === 'sulit' || diff === 'hard') return 100;
  if (diff === 'boss') return 150;
  return 50;
};

const getExpectedCoin = (difficulty) => {
  const diff = (difficulty || 'sedang').toLowerCase();
  if (diff === 'boss') return 25;
  if (diff === 'sulit' || diff === 'hard') return 15;
  return 10;
};

const openChallenge = async (challenge) => {
  if (!isLoggedIn.value) {
    emit('require-auth');
    return;
  }

  if (challenge.isPremium && !isPremiumUser.value) {
    emit('require-premium');
    return;
  }

  // Jika user free dan tantangan belum selesai, periksa pemotongan kredit
  if (!isPremiumUser.value && !challenge.isCompleted) {
    const success = await deductCredit(challenge.costCredit || 1);
    if (!success) {
      emit('require-premium');
      return;
    }
  }

  const pId = challenge.pathId || challenge.path_slug || 'global-challenges';
  const cId = challenge.chapterId || challenge.chapter_slug || challenge.chapter_id || 'algorithms';

  router.push(
    `/learning/${pId}/lesson/${cId}/${challenge.id}?step=practice&mode=challenge`
  );
};
</script>

<style scoped src="../../../assets/css/components/challenges/ChallengeModul.css"></style>

