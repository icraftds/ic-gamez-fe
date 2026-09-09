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
      <div class="category-filter">
        <i class="fa-solid fa-filter"></i>
        <select v-model="selectedCategory">
          <option value="">Semua Kategori</option>
          <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <div class="table-container">
      <table class="challenges-table">
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
            v-for="challenge in paginatedChallenges"
            :key="challenge.id"
            :challenge="challenge"
            :isPremiumUser="isPremiumUser"
            @click="openChallenge(challenge)"
          />
        </tbody>
      </table>
      <div v-if="filteredChallenges.length === 0" class="empty-state">
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useLearningPaths } from "../../composables/useLearningPaths.js";
import { useUserAccount } from "../../composables/useUserAccount.js";
import ChallengeTableRow from "./ChallengeTableRow.vue";

const emit = defineEmits(['require-premium']);

const router = useRouter();
const { allChallenges } = useLearningPaths();
const { isPremiumUser, deductCredit } = useUserAccount();

const selectedCategory = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;

const uniqueCategories = computed(() => {
  const categories = new Set(allChallenges.value.map(c => c.category));
  return Array.from(categories);
});

const filteredChallenges = computed(() => {
  if (!selectedCategory.value) return allChallenges.value;
  return allChallenges.value.filter((c) => c.category === selectedCategory.value);
});

const totalPages = computed(() => Math.ceil(filteredChallenges.value.length / itemsPerPage));

const paginatedChallenges = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredChallenges.value.slice(start, end);
});

// Reset pagination when filter changes
import { watch } from 'vue';
watch(selectedCategory, () => {
  currentPage.value = 1;
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

  // Arahkan ke halaman materi, buka step "Practice" (Tantangan)
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
  -webkit-text-fill-color: transparent;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.category-filter {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
}
.category-filter:focus-within {
  border-color: #c084fc;
  box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.2);
}
.category-filter i {
  color: #94a3b8;
}
.category-filter select {
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;
  appearance: none;
  padding-right: 20px;
}
.category-filter select option {
  background: #1e1b4b;
  color: #e2e8f0;
}

.table-container {
  background: rgba(15, 10, 30, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.challenges-table {
  width: 100%;
  border-collapse: collapse;
}

.challenges-table th {
  text-align: left;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.2);
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
  font-size: 1.1rem;
}

/* ── Pagination & Filter Tweaks ── */
.category-filter select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  border: none;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  width: 100%;
}
.category-filter select option {
  background-color: #1e1b4b; /* Dark background */
  color: #e2e8f0;
  padding: 10px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(15, 10, 30, 0.5);
}

.page-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: rgba(147, 51, 234, 0.2);
  border-color: #c084fc;
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: transparent;
}

.page-info {
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 500;
}
</style>
