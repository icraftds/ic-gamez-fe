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
      <div class="filter-select">
        <i class="fa-solid fa-filter"></i>
        <select v-model="selectedCategory">
          <option value="">Semua Kategori</option>
          <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>NAMA TANTANGAN</th>
            <th>KATEGORI</th>
            <th>TINGKAT</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          <ChallengeTableRow
            v-for="challenge in challenges"
            :key="challenge.id"
            :challenge="challenge"
            :isPremiumUser="isPremiumUser"
            @click="openChallenge(challenge)"
          />
        </tbody>
      </table>
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
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLearningPaths } from "../../composables/useLearningPaths.js";
import { useUserAccount } from "../../composables/useUserAccount.js";
import ChallengeTableRow from "./ChallengeTableRow.vue";
import api from "../../services/api.js";

const emit = defineEmits(['require-premium']);

const router = useRouter();
const { paths, fetchPaths } = useLearningPaths();
const { isPremiumUser, deductCredit } = useUserAccount();

const selectedCategory = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const challenges = ref([]);
const isLoading = ref(false);

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
        difficulty: challenge.is_premium ? 'Hard' : 'Medium',
        isCompleted: challenge.progress ? challenge.progress.is_completed : false,
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
});

watch(currentPage, () => {
  fetchChallenges();
});

watch(selectedCategory, () => {
  currentPage.value = 1;
  fetchChallenges();
});

const openChallenge = (challenge) => {
  if (challenge.isPremium && !isPremiumUser.value) {
    emit('require-premium');
    return;
  }

  if (!challenge.isCompleted && !deductCredit(challenge.costCredit)) {
    emit('require-premium');
    return;
  }

  router.push(
    `/learning/${challenge.pathId}/lesson/${challenge.chapterId}/${challenge.id}?step=3`,
  );
};
</script>

<style scoped>
.content {
  flex: 1;
}

.header {
  margin-bottom: 30px;
}
.header h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}
.header p {
  color: #94a3b8;
}
.gradient-text {
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .header h2 { font-size: 1.5rem; }
  .filters { flex-direction: column; }
}
</style>
