<template>
  <section
    :class="{ reveal: !isFullView }"
    id="leaderboard"
    class="ic-leaderboard-section"
    style="scroll-margin-top: 100px; padding: 20px 0; width: 100%"
  >
    <div
      class="dash-leaderboard"
      :class="{ 'preview-mode': !isFullView }"
      style="max-width: 1200px; margin: 0 auto; padding: 0 20px"
    >
      <!-- Cyberpunk Header -->
      <div class="lb-header-section" style="margin-bottom: 50px">
        <div class="cyber-glitch-bg"></div>
        <h2 class="title-main" data-text="Top CoderZ">
          Top <span class="gradient-text">CoderZ</span>
        </h2>
        <p class="subtitle">
          Arena Kompetisi iC GameZ - Buktikan Siapa Yang Paling Kuat!
        </p>
        
        <!-- Tab Selector -->
        <div class="cyber-tabs" v-if="isFullView">
          <button class="cyber-tab" :class="{ active: activeTab === 'monthly' }" @click="activeTab = 'monthly'">
            <i class="fa-solid fa-calendar-alt"></i> Bulan Ini
          </button>
          <button class="cyber-tab" :class="{ active: activeTab === 'all-time' }" @click="activeTab = 'all-time'">
            <i class="fa-solid fa-globe"></i> Sepanjang Masa
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="lb-loading-state">
        <div class="cube-wrapper">
          <div class="cube">
            <div class="side front"></div><div class="side back"></div>
            <div class="side right"></div><div class="side left"></div>
            <div class="side top"></div><div class="side bottom"></div>
          </div>
        </div>
        <p class="loading-text">Menyinkronkan Data Peringkat...</p>
      </div>

      <template v-else>
        <!-- The Cyber Podium -->
        <div class="cyber-podium-container" v-if="isFullView && currentRanking.length > 0">
          <div class="cyber-podium">
            <!-- 2nd Place -->
            <div class="podium-card-cyber p-second">
              <div class="cyber-rank-badge silver">2</div>
              <div class="podium-avatar-wrapper plan-badge-wrapper">
                <CyberBorder 
                  class="cyber-border-leaderboard"
                  :tierId="getUserBorderId(topUsers[1])"
                  :accountBadge="getUserBadgeStatus(topUsers[1])"
                  :avatarUrl="topUsers[1].avatar_url || 'https://ui-avatars.com/api/?name=' + topUsers[1].name + '&background=random'"
                  :imageUrl="topUsers[1].active_border_url"
                />
              </div>
              <div class="cyber-podium-info">
                <h4>{{ topUsers[1].username ? topUsers[1].username + '#' + topUsers[1].tag_id : topUsers[1].name }}</h4>
                <div style="display: flex; gap: 8px; justify-content: center; align-items: center; margin-bottom: 8px;">
                  <div class="xp-glitch" style="margin: 0;">{{ topUsers[1].xp.toLocaleString() }} XP</div>
                  <span class="ct-badge-level" :class="getLevelBadgeClass(topUsers[1])">Lvl {{ topUsers[1].level }}</span>
                </div>
                <button v-if="topUsers[1].slug" @click="$router.push('/coderz/' + topUsers[1].slug)" class="visit-btn" style="display: block; width: fit-content; margin: 0 auto;">Visit</button>
              </div>
            </div>

            <!-- 1st Place -->
            <div class="podium-card-cyber p-first">
              <div class="cyber-crown"><i class="fa-solid fa-crown"></i></div>
              <div class="cyber-rank-badge gold">1</div>
              <div class="podium-avatar-wrapper big-avatar plan-badge-wrapper">
                <CyberBorder 
                  class="cyber-border-leaderboard"
                  :tierId="getUserBorderId(topUsers[0])"
                  :accountBadge="getUserBadgeStatus(topUsers[0])"
                  :avatarUrl="topUsers[0].avatar_url || 'https://ui-avatars.com/api/?name=' + topUsers[0].name + '&background=random'"
                  :imageUrl="topUsers[0].active_border_url"
                />
              </div>
              <div class="cyber-podium-info">
                <h4>{{ topUsers[0].username ? topUsers[0].username + '#' + topUsers[0].tag_id : topUsers[0].name }}</h4>
                <div style="display: flex; gap: 8px; justify-content: center; align-items: center; margin-bottom: 8px;">
                  <div class="xp-glitch gold-text" style="margin: 0;">{{ topUsers[0].xp.toLocaleString() }} XP</div>
                  <span class="ct-badge-level" :class="getLevelBadgeClass(topUsers[0])">Lvl {{ topUsers[0].level }}</span>
                </div>
                <button v-if="topUsers[0].slug" @click="$router.push('/coderz/' + topUsers[0].slug)" class="visit-btn" style="display: block; width: fit-content; margin: 0 auto;">Visit</button>
              </div>
            </div>

            <!-- 3rd Place -->
            <div class="podium-card-cyber p-third">
              <div class="cyber-rank-badge bronze">3</div>
              <div class="podium-avatar-wrapper plan-badge-wrapper">
                <CyberBorder 
                  class="cyber-border-leaderboard"
                  :tierId="getUserBorderId(topUsers[2])"
                  :accountBadge="getUserBadgeStatus(topUsers[2])"
                  :avatarUrl="topUsers[2].avatar_url || 'https://ui-avatars.com/api/?name=' + topUsers[2].name + '&background=random'"
                  :imageUrl="topUsers[2].active_border_url"
                />
              </div>
              <div class="cyber-podium-info">
                <h4>{{ topUsers[2].username ? topUsers[2].username + '#' + topUsers[2].tag_id : topUsers[2].name }}</h4>
                <div style="display: flex; gap: 8px; justify-content: center; align-items: center; margin-bottom: 8px;">
                  <div class="xp-glitch" style="margin: 0;">{{ topUsers[2].xp.toLocaleString() }} XP</div>
                  <span class="ct-badge-level" :class="getLevelBadgeClass(topUsers[2])">Lvl {{ topUsers[2].level }}</span>
                </div>
                <button v-if="topUsers[2].slug" @click="$router.push('/coderz/' + topUsers[2].slug)" class="visit-btn" style="display: block; width: fit-content; margin: 0 auto;">Visit</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Your Rank HUD -->
        <div class="your-rank-hud" v-if="isFullView && isLoggedIn">
          <div class="hud-side">
            <span class="hud-label">TARGET XP ANDA</span>
            <span class="hud-value"><CyberEnergy :pkgId="1" :isAnimated="false" /> {{ activeTab === 'monthly' ? myRankMonthly : myRankGlobal }}</span>
          </div>
          <div class="hud-center">
            STATUS PERINGKAT <br />
            <span class="hud-highlight">{{ activeTab === 'monthly' ? 'BULAN INI' : 'GLOBAL' }}</span>
          </div>
          <div class="hud-side right">
            <span class="hud-label">POSISI SAAT INI</span>
            <span class="hud-value text-pink">#{{ activeTab === 'monthly' ? myRankMonthly : myRankGlobal }}</span>
          </div>
        </div>

        <!-- Cyber Table List -->
        <div class="cyber-table-container">
          <div class="cyber-table-header">
            <div class="ct-col ct-rank">#</div>
            <div class="ct-col ct-user">CODERZ</div>
            <div class="ct-col ct-stats" style="flex: 1; justify-content: flex-end;">STATISTIK & AKSI</div>
          </div>
          <div class="cyber-table-body">
            <div
              v-for="user in tableUsers"
              :key="user.id || user.rank"
              class="cyber-table-row"
              :class="{ 'top-3-row': user.rank <= 3 && isFullView }"
            >
              <div class="ct-col ct-rank">
                <span class="cyber-rank-num" :class="'r-' + user.rank">{{ user.rank }}</span>
              </div>
              <div class="ct-col ct-user">
                <div class="ct-avatar plan-badge-wrapper">
                  <CyberBorder 
                    class="cyber-border-leaderboard"
                    :tierId="getUserBorderId(user)"
                    :accountBadge="getUserBadgeStatus(user)"
                    :avatarUrl="user.avatar_url || 'https://ui-avatars.com/api/?name=' + user.name + '&background=random'"
                    :imageUrl="user.active_border_url"
                  />
                </div>
                <span class="ct-name">{{ user.username ? user.username + '#' + user.tag_id : user.name }}</span>
              </div>
              <div class="ct-col ct-stats" style="flex: 1; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; justify-content: center;">
                <div style="display: flex; gap: 10px; align-items: center;">
                  <span class="xp-text">{{ user.xp.toLocaleString() }} XP</span>
                  <span class="ct-badge-level" :class="getLevelBadgeClass(user)">Lvl {{ user.level }}</span>
                </div>
                <button v-if="user.slug" @click="$router.push('/coderz/' + user.slug)" class="visit-btn-small">Kunjungi Profil</button>
              </div>
            </div>
          </div>
        </div>

      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserAccount } from "../../composables/useUserAccount";
import CyberBorder from '../ui/CyberBorder.vue';
import api from '../../services/api';

const getUserBadgeStatus = (user) => {
  if (user?.current_plan === 'expert') return 'EXPERT';
  if (user?.current_plan === 'pro' || user?.is_premium) return 'PRO';
  return 'FREE';
};

const getLevelBadgeClass = (user) => {
  const status = getUserBadgeStatus(user);
  if (status === 'EXPERT') return 'badge-expert';
  if (status === 'PRO') return 'badge-pro';
  return '';
};

const getUserBorderId = (user) => {
  if (user?.active_border_id) return user.active_border_id;
  if (user?.current_plan === 'expert') return 'D_EXPERT';
  if (user?.current_plan === 'pro' || user?.is_premium) return 'D_PRO';
  return 'D_FREE';
};

const props = defineProps({
  isFullView: {
    type: Boolean,
    default: false,
  },
});

const { isLoggedIn } = useUserAccount();

const monthlyRanking = ref([]);
const allTimeRanking = ref([]);
const myRankMonthly = ref("—");
const myRankGlobal = ref("—");
const isLoading = ref(true);
const activeTab = ref('monthly');

const currentRanking = computed(() => {
  return activeTab.value === 'monthly' ? monthlyRanking.value : allTimeRanking.value;
});

const topUsers = computed(() => {
  const users = [...currentRanking.value];
  while (users.length < 3) {
    users.push({ name: "-", xp: 0, avatar_url: null });
  }
  return users.slice(0, 3);
});

const tableUsers = computed(() => {
  if (props.isFullView) {
    return currentRanking.value.slice(3).map((user, index) => ({
      ...user,
      rank: index + 4
    }));
  }
  return allTimeRanking.value.slice(0, 5).map((user, index) => ({
    ...user,
    rank: index + 1
  }));
});

const fetchLeaderboard = async () => {
  try {
    isLoading.value = true;

    const [monthlyRes, allTimeRes] = await Promise.all([
      api.get("/leaderboard/monthly"),
      api.get("/leaderboard/all-time"),
    ]);

    monthlyRanking.value = (
      Array.isArray(monthlyRes.data.data) ? monthlyRes.data.data : []
    ).map((u) => ({ ...u, xp: Number(u.monthly_xp || u.xp || 0) }));
    allTimeRanking.value = (
      Array.isArray(allTimeRes.data.data) ? allTimeRes.data.data : []
    ).map((u) => ({ ...u, xp: Number(u.xp || 0) }));

    if (isLoggedIn.value) {
      const myRankRes = await api.get("/leaderboard/my-rank");
      myRankMonthly.value = myRankRes.data.data.monthly_rank || "—";
      myRankGlobal.value = myRankRes.data.data.all_time_rank || "—";
    }
  } catch (error) {
    console.error("Failed to load leaderboard", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchLeaderboard();
});

const getRankClass = (index) => {
  if (index === 0) return "row-gold";
  if (index === 1) return "row-silver";
  if (index === 2) return "row-bronze";
  return "row-normal";
};
</script>

<style src="../../assets/css/components/LeaderboardTable.css" scoped></style>
