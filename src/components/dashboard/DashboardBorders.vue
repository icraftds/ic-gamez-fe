<template>
  <div class="dash-borders">
    <h2>Border Profil</h2>
    <p class="subtitle">Koleksi border profil eksklusif untuk menghiasi avatarmu.</p>
    


    <div class="badges-grid">
      <div
        v-for="border in allBorders"
        :key="border.id"
        class="badge-card"
        :class="{ 'is-earned': border.earned, 'is-locked': !border.earned, 'is-active-border': border.tierId === activeBorderId }"
      >
        <div class="badge-icon-container" style="margin: 5px 0;">
          <div class="badge-hexagon">
            <CyberBorder :tierId="border.tierId" class="badge-svg-comp" style="transform: scale(0.95); transform-origin: center;" />
          </div>
        </div>
        <div class="badge-info">
          <h4>{{ parseName(border.name) }}</h4>
        </div>
        
        <!-- Hover Actions -->
        <div class="badge-hover-actions">
          <button v-if="border.earned && border.tierId !== activeBorderId" class="btn-hover-action btn-use" @click="useBorder(border)">Gunakan</button>
          <button v-if="border.earned && border.tierId === activeBorderId" class="btn-hover-action btn-use" disabled style="background: #10b981; color: #fff; box-shadow: none;">Digunakan</button>
          <button v-if="!border.earned && isBuyable(border.tierId)" class="btn-hover-action btn-buy" @click="buyBorder(border)">
            {{ (border.tierId === 'D_PRO' || border.tierId === 'D_EXPERT') ? 'Langganan' : 'Beli' }}
          </button>
          <button class="btn-hover-action btn-preview" @click="openMedalPopup(border)">Preview</button>
        </div>
      </div>
    </div>
    
    <NewMedalPopup :show="showNewMedal" :medal="newMedalData" @update:show="showNewMedal = $event" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import CyberBorder from '../ui/CyberBorder.vue'
import NewMedalPopup from './NewMedalPopup.vue'
import { TIERS } from '../../utils/tiers.js'
import { useUserAccount } from '../../composables/useUserAccount'
import { useRouter } from 'vue-router'
import { useToast } from '../../composables/useToast'

const { setActiveBorder, userProfile, userStats, currentPlan, fetchUserStats, activeBorderId } = useUserAccount()
const router = useRouter()
const { showToast } = useToast()

const userBorders = ref([])

onMounted(async () => {
  if (!userStats.value.completed_exercises) {
    await fetchUserStats()
  }
  try {
    const res = await api.get('/user/borders')
    if (res.data.success) {
      userBorders.value = res.data.data
    }
  } catch (err) {
    console.error('Failed to load user borders', err)
  }
})

const currentBadgeStatus = ref('PRO')
const showNewMedal = ref(false)
const newMedalData = ref(null)

const getSqlCount = () => {
  const paths = userStats.value?.completed_exercises?.breakdown?.sql || 0
  const daily = userStats.value?.events?.daily || 0
  return paths + daily
}
const getFrontendCount = () => userStats.value?.completed_exercises?.breakdown?.frontend || 0
const getStreak = () => userProfile.value?.longest_streak || 0
const getLevel = () => userProfile.value?.level || 1

const unlockedTiers = computed(() => {
  const sqlCount = getSqlCount()
  const feCount = getFrontendCount()
  const streakCount = getStreak()
  const lvlCount = getLevel()

  const allMedalsArr = [
    // SQL
    { tierId: 1, earned: sqlCount >= 1 }, { tierId: 2, earned: sqlCount >= 5 }, { tierId: 3, earned: sqlCount >= 10 }, { tierId: 4, earned: sqlCount >= 25 }, { tierId: 5, earned: sqlCount >= 50 }, { tierId: 6, earned: sqlCount >= 75 }, { tierId: 7, earned: sqlCount >= 100 },
    // Frontend
    { tierId: 1, earned: feCount >= 1 }, { tierId: 2, earned: feCount >= 5 }, { tierId: 3, earned: feCount >= 10 }, { tierId: 4, earned: feCount >= 25 }, { tierId: 5, earned: feCount >= 50 }, { tierId: 6, earned: feCount >= 75 }, { tierId: 7, earned: feCount >= 100 },
    // Streak
    { tierId: 1, earned: streakCount >= 3 }, { tierId: 2, earned: streakCount >= 7 }, { tierId: 3, earned: streakCount >= 14 }, { tierId: 4, earned: streakCount >= 30 }, { tierId: 5, earned: streakCount >= 60 }, { tierId: 6, earned: streakCount >= 100 }, { tierId: 7, earned: streakCount >= 365 },
    // Level
    { tierId: 1, earned: lvlCount >= 5 }, { tierId: 2, earned: lvlCount >= 25 }, { tierId: 3, earned: lvlCount >= 50 }, { tierId: 4, earned: lvlCount >= 75 }, { tierId: 5, earned: lvlCount >= 100 }, { tierId: 6, earned: lvlCount >= 125 }, { tierId: 7, earned: lvlCount >= 150 },
  ]

  const unlocked = {}
  for (let t = 1; t <= 7; t++) {
    const tierMedals = allMedalsArr.filter(m => m.tierId === t)
    unlocked[t] = tierMedals.every(m => m.earned)
  }
  return unlocked
})

const isBorderEarned = (tierId) => {
  if (tierId === 'D_FREE') return true;
  if (tierId === 'D_PRO') return currentPlan.value === 'pro' || currentPlan.value === 'expert';
  if (tierId === 'D_EXPERT') return currentPlan.value === 'expert';
  
  if (typeof tierId === 'number' && tierId >= 1 && tierId <= 7) {
    return unlockedTiers.value[tierId] || false;
  }
  
  // Custom or Premium Bought borders
  if (userBorders.value.includes(tierId)) {
    return true;
  }
  
  return false;
}

const isBuyable = (tierId) => {
  if (typeof tierId === 'number' && tierId >= 1 && tierId <= 7) return false;
  if (tierId === 'D_FREE') return false; // Default free is never locked, but just in case
  return true;
}

const allBorders = computed(() => {
  // read forceUpdateKey to trigger re-evaluation when a border is bought
  const trigger = forceUpdateKey.value;
  const borders = TIERS.map(t => ({
    id: `border-${t.id}`,
    category: 'borders',
    tierId: t.id,
    name: t.name,
    description: t.desc,
    earned: isBorderEarned(t.id),
  }));

  return borders.sort((a, b) => {
    // 1. Yang digunakan (active border) paling atas (index 0)
    const isActiveA = a.tierId === activeBorderId.value;
    const isActiveB = b.tierId === activeBorderId.value;
    if (isActiveA && !isActiveB) return -1;
    if (!isActiveA && isActiveB) return 1;

    // 2. Yang dimiliki (earned) setelahnya
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;

    // 3. Urutan default: FREE -> PRO -> EXPERT -> Lainnya
    const priority = {
      'D_FREE': 1,
      'D_PRO': 2,
      'D_EXPERT': 3
    };

    const pA = priority[a.tierId] || 999;
    const pB = priority[b.tierId] || 999;

    if (pA !== pB) {
      return pA - pB;
    }

    return 0;
  });
})

const parseName = (name) => {
  if (name.includes(': ')) {
    return name.split(': ')[1]
  }
  return name
}

const useBorder = (border) => {
  setActiveBorder(border.tierId)
  showToast(`Berhasil memakai border: ${parseName(border.name)}!`, 'success')
}

const buyBorder = (border) => {
  if (border.tierId === 'D_PRO' || border.tierId === 'D_EXPERT') {
    router.push('/pricing');
  } else {
    router.push('/shop');
  }
}

const forceUpdateKey = ref(0);
watch(forceUpdateKey, () => {
  // this forces a re-evaluation of allBorders by modifying a reactive dependency.
});

const openMedalPopup = (border) => {
  newMedalData.value = {
    ...border,
    name: parseName(border.name),
  }
  showNewMedal.value = true
}
</script>

<style scoped>
@import '../../assets/css/components/dashboard/DashboardMedals.css';

.dash-borders {
  padding: 1.5rem 0;
  width: 100%;
}

.dash-borders h2 {
  font-family: "Poppins", sans-serif;
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

.dash-borders .subtitle {
  color: #94A3B8;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  width: 100%;
}

.badge-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.badge-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 240, 255, 0.3);
  box-shadow: 0 10px 20px -5px rgba(0, 240, 255, 0.15);
}

.badge-card.is-active-border {
  border-color: rgba(16, 185, 129, 0.6);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
  background: rgba(16, 185, 129, 0.05);
}

.badge-info h4 {
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  margin-top: 15px;
  margin-bottom: 0;
  font-family: "Poppins", sans-serif;
}

.badge-hover-actions {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  opacity: 0;
  z-index: 10;
  transition: opacity 0.3s ease;
}

.badge-card:hover .badge-hover-actions {
  opacity: 1;
}

.btn-hover-action {
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 8px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  width: 70%;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-use {
  background: #00F0FF;
  color: #000;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
}
.btn-use:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.6);
}

.btn-buy {
  background: transparent;
  color: #fbbf24;
  border: 1px solid #fbbf24;
}
.btn-buy:hover {
  background: rgba(251, 191, 36, 0.1);
  transform: scale(1.05);
}

.btn-preview {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.btn-preview:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 1000px) {
  .badge-hover-actions {
    position: static;
    opacity: 1;
    background: transparent;
    backdrop-filter: none;
    margin-top: 15px;
    width: 100%;
    flex-direction: column;
    gap: 8px;
  }
  .btn-hover-action {
    width: 100%;
    font-size: 0.8rem;
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .badges-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .badge-card {
    padding: 15px 10px;
  }
}
</style>
