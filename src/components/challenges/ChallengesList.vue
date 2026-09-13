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
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
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
  .custom-dropdown { width: 100%; }
}

/* Custom Dropdown Styles */
.custom-dropdown {
  position: relative;
  width: 250px;
}
.dropdown-selected {
  background: rgba(15, 10, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s;
}
.dropdown-selected:hover {
  border-color: #c084fc;
}
.selected-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e2e8f0;
  font-size: 0.95rem;
}
.selected-content i {
  color: #94a3b8;
}
.dropdown-arrow {
  color: #94a3b8;
  font-size: 0.85rem;
  transition: transform 0.3s;
}
.dropdown-arrow.open {
  transform: rotate(180deg);
}
.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background: rgba(20, 15, 40, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  z-index: 50;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}
.dropdown-item {
  padding: 12px 15px;
  color: #e2e8f0;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
}
.dropdown-item.active {
  background: rgba(192, 132, 252, 0.15);
  color: #c084fc;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
