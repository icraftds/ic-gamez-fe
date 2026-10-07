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
                <img :src="topUsers[1].avatar_url || 'https://ui-avatars.com/api/?name=' + topUsers[1].name + '&background=random'" :class="getPlanBorderClass(topUsers[1])" />
                <div v-if="getPlanBadge(topUsers[1])" class="plan-badge" :class="getPlanBadge(topUsers[1]).class">
                  {{ getPlanBadge(topUsers[1]).text }}
                </div>
              </div>
              <div class="cyber-podium-info">
                <h4>{{ topUsers[1].name }}</h4>
                <div class="xp-glitch">{{ topUsers[1].xp.toLocaleString() }} XP</div>
              </div>
            </div>

            <!-- 1st Place -->
            <div class="podium-card-cyber p-first">
              <div class="cyber-crown"><i class="fa-solid fa-crown"></i></div>
              <div class="cyber-rank-badge gold">1</div>
              <div class="podium-avatar-wrapper big-avatar plan-badge-wrapper">
                <img :src="topUsers[0].avatar_url || 'https://ui-avatars.com/api/?name=' + topUsers[0].name + '&background=random'" :class="getPlanBorderClass(topUsers[0])" />
                <div v-if="getPlanBadge(topUsers[0])" class="plan-badge" :class="getPlanBadge(topUsers[0]).class">
                  {{ getPlanBadge(topUsers[0]).text }}
                </div>
              </div>
              <div class="cyber-podium-info">
                <h4>{{ topUsers[0].name }}</h4>
                <div class="xp-glitch gold-text">{{ topUsers[0].xp.toLocaleString() }} XP</div>
              </div>
            </div>

            <!-- 3rd Place -->
            <div class="podium-card-cyber p-third">
              <div class="cyber-rank-badge bronze">3</div>
              <div class="podium-avatar-wrapper plan-badge-wrapper">
                <img :src="topUsers[2].avatar_url || 'https://ui-avatars.com/api/?name=' + topUsers[2].name + '&background=random'" :class="getPlanBorderClass(topUsers[2])" />
                <div v-if="getPlanBadge(topUsers[2])" class="plan-badge" :class="getPlanBadge(topUsers[2]).class">
                  {{ getPlanBadge(topUsers[2]).text }}
                </div>
              </div>
              <div class="cyber-podium-info">
                <h4>{{ topUsers[2].name }}</h4>
                <div class="xp-glitch">{{ topUsers[2].xp.toLocaleString() }} XP</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Your Rank HUD -->
        <div class="your-rank-hud" v-if="isFullView && isLoggedIn">
          <div class="hud-side">
            <span class="hud-label">TARGET XP ANDA</span>
            <span class="hud-value"><i class="fa-solid fa-bolt text-cyan"></i> {{ activeTab === 'monthly' ? myRankMonthly : myRankGlobal }}</span>
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
            <div class="ct-col ct-xp">POWER (XP)</div>
            <div class="ct-col ct-level">TIER</div>
          </div>
          <div class="cyber-table-body">
            <div
              v-for="(user, i) in isFullView ? currentRanking : allTimeRanking.slice(0, 5)"
              :key="i"
              class="cyber-table-row"
              :class="{ 'top-3-row': i < 3 && isFullView }"
            >
              <div class="ct-col ct-rank">
                <span class="cyber-rank-num" :class="'r-' + (i + 1)">{{ i + 1 }}</span>
              </div>
              <div class="ct-col ct-user">
                <div class="ct-avatar plan-badge-wrapper">
                  <img :src="user.avatar_url || 'https://ui-avatars.com/api/?name=' + user.name + '&background=random'" :class="getPlanBorderClass(user)" />
                  <div v-if="getPlanBadge(user)" class="plan-badge" :class="getPlanBadge(user).class" style="bottom: -10px;">
                    {{ getPlanBadge(user).text }}
                  </div>
                </div>
                <span class="ct-name">{{ user.name }}</span>
              </div>
              <div class="ct-col ct-xp">
                <span class="xp-text">{{ user.xp.toLocaleString() }}</span>
              </div>
              <div class="ct-col ct-level">
                <span class="ct-badge-level">Lvl {{ user.level }}</span>
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
import api from "../../services/api";

const getPlanHexClass = (user) => {
  if (user?.current_plan === 'expert') return 'bg-expert';
  if (user?.current_plan === 'pro' || user?.is_premium) return 'bg-pro';
  return '';
};

const getPlanBorderClass = (user) => {
  if (user?.current_plan === 'expert') return 'border-expert';
  if (user?.current_plan === 'pro' || user?.is_premium) return 'border-pro';
  return 'border-gray';
};

const getPlanBadge = (user) => {
  if (user?.current_plan === 'expert') return { text: 'Expert', class: 'expert' };
  if (user?.current_plan === 'pro' || user?.is_premium) return { text: 'Pro', class: 'pro' };
  return null;
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
