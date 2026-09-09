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
</style>
