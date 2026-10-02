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
              <i class="fa-solid fa-star"></i> +{{ getExpectedXp(challenge.difficulty, challenge.costCredit) }} XP
            </div>
            <div class="reward-item coin">
              <img src="/images/icoinz.svg" alt="iCoinZ" class="coin-icon" style="width: 16px; height: 16px;" /> +{{ challenge.coin_reward || 10 }} Koin
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
      <div v-if="isLoading" class="empty-state">
        Memuat tantangan...
      </div>
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
import { useRouter } from "vue-router";
import { useLearningPaths } from "../../../composables/useLearningPaths.js";
import { useUserAccount } from "../../../composables/useUserAccount.js";
import ChallengeTableRow from "../ChallengeTableRow.vue";
import api from "../../../services/api.js";

const emit = defineEmits(['require-premium', 'require-auth']);

const router = useRouter();
const { paths, fetchPaths } = useLearningPaths();
const { isPremiumUser, deductCredit, isLoggedIn } = useUserAccount();

const selectedCategory = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const challenges = ref([]);
const isLoading = ref(false);

const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const selectCategory = (cat) => {
  selectedCategory.value = cat;
  isDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

const uniqueCategories = computed(() => {
  return paths.value.map(p => p.title);
});

const fetchChallenges = async () => {
  try {
    isLoading.value = true;
    if (paths.value.length === 0) {
      await fetchPaths();
    }
    
    const response = await api.get('/challenges', {
      params: {
        page: currentPage.value,
        category: selectedCategory.value
      }
    });
    
    totalPages.value = response.data.meta ? response.data.meta.last_page : 1;
    
    challenges.value = response.data.data.map(challenge => {
      let category = 'Lainnya';
      let pathId = null;
      let chapterId = challenge.chapter_id;
      
      const path = paths.value.find(p => p.chapters && p.chapters.some(c => c.id == challenge.chapter_id));
      if (path) {
        category = path.title;
        pathId = path.slug || path.id;
        const chapter = path.chapters.find(c => c.id == challenge.chapter_id);
        if (chapter) chapterId = chapter.slug || chapter.id;
      }
      
      return {
        ...challenge,
        category,
        pathId,
        chapterId,
        difficulty: challenge.difficulty || (challenge.is_premium ? 'Sulit' : 'Sedang'),
        isCompleted: (() => {
          let p = challenge.progress;
          if (Array.isArray(p)) p = p.length > 0 ? p[0] : null;
          return p ? (p.is_completed || !!p.saved_code) : false;
        })(),
        isPremium: challenge.is_premium,
        costCredit: challenge.cost_credit,
      };
    });
    
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

const getExpectedXp = (difficulty, costCredit = 0) => {
  const diff = (difficulty || 'sedang').toLowerCase();
  let base = 50;
  if (diff === 'mudah' || diff === 'easy') base = 25;
  else if (diff === 'sedang' || diff === 'medium') base = 50;
  else if (diff === 'sulit' || diff === 'hard') base = 100;
  else if (diff === 'boss') base = 300;
  
  return Math.floor(base * (1 + (costCredit / 10)));
};

const openChallenge = (challenge) => {
  if (!isLoggedIn.value) {
    emit('require-auth');
    return;
  }

  if (challenge.isPremium && !isPremiumUser.value) {
    emit('require-premium');
    return;
  }

  if (!challenge.isCompleted && !deductCredit(challenge.costCredit)) {
    emit('require-premium');
    return;
  }

  router.push(
    `/learning/${challenge.pathId}/lesson/${challenge.chapterId}/${challenge.id}?step=practice&mode=challenge`
  );
};
</script>

<style scoped src="../../../assets/css/components/challenges/ChallengeModul.css"></style>

