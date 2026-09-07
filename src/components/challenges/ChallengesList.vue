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
      <div class="search-bar">
        <i class="fa-solid fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari tantangan..."
        />
      </div>
      <button class="btn-search">Cari</button>
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
          <tr
            v-for="challenge in filteredChallenges"
            :key="challenge.id"
            @click="openChallenge(challenge)"
            :class="{
              'is-premium-row': challenge.isPremium && !isPremiumUser,
            }"
          >
            <td>
              {{ challenge.title }}
              <span v-if="challenge.isPremium" class="badge-sm premium"
                ><i class="fa-solid fa-lock" v-if="!isPremiumUser"></i>
                Premium</span
              >
            </td>
            <td>{{ challenge.category }}</td>
            <td>
              <span
                class="diff-badge"
                :class="challenge.difficulty.toLowerCase()"
                >{{ challenge.difficulty }}</span
              >
            </td>
            <td class="status-cell">
              <i
                v-if="challenge.isCompleted"
                class="fa-solid fa-circle-check completed"
              ></i>
              <i v-else class="fa-regular fa-circle pending"></i>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredChallenges.length === 0" class="empty-state">
        Tidak ada tantangan yang cocok dengan pencarian Anda.
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useLearningPaths } from "../../composables/useLearningPaths.js";
import { useUserAccount } from "../../composables/useUserAccount.js";

const emit = defineEmits(['require-premium']);

const router = useRouter();
const { allChallenges } = useLearningPaths();
const { isPremiumUser, deductCredit } = useUserAccount();

const searchQuery = ref("");

const filteredChallenges = computed(() => {
  if (!searchQuery.value) return allChallenges.value;
  return allChallenges.value.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
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

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0 15px;
}

.search-bar i {
  color: #64748b;
}

.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 15px;
  color: white;
  outline: none;
}

.btn-search {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 25px;
  font-weight: 600;
  cursor: pointer;
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

.challenges-table td {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.challenges-table tr {
  cursor: pointer;
  transition: background 0.2s ease;
}

.challenges-table tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

.challenges-table tr.is-premium-row {
  opacity: 0.8;
}

.status-cell {
  text-align: center;
}

.status-cell .completed {
  color: #10b981;
  font-size: 1.2rem;
}

.status-cell .pending {
  color: #475569;
  font-size: 1.2rem;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #64748b;
}

.badge-sm {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 10px;
  vertical-align: middle;
}

.badge-sm.premium {
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.5);
}

.diff-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid transparent;
}
.diff-badge.mudah {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
}
.diff-badge.sedang {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
}
.diff-badge.sulit {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}
</style>
