<template>
    <div class="top-bar">
        <router-link to="/challenges" class="nav-btn">
            <i class="fa-solid fa-arrow-left"></i> Kembali
        </router-link>
        <div class="problem-info">
            <span>{{ title }}</span>
            <span class="badge">IC Game-Z</span>
            <span class="badge time-badge" v-if="store.mode === 'speedrun'">
                <i class="fa-solid fa-stopwatch"></i> {{ formattedTime }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useChallengeStore } from '../stores/challengeStore'

const store = useChallengeStore()
const title = computed(() => store.stageData?.title.split(". ")[1] || 'Loading...')

const elapsedSeconds = ref(0)
let timerInterval = null

const updateTimer = () => {
    if (store.mode === 'speedrun' && store.startTime) {
        elapsedSeconds.value = Math.floor((Date.now() - store.startTime) / 1000)
    }
}

const formattedTime = computed(() => {
    const m = Math.floor(elapsedSeconds.value / 60).toString().padStart(2, '0')
    const s = (elapsedSeconds.value % 60).toString().padStart(2, '0')
    return `${m}:${s}`
})

onMounted(() => {
    timerInterval = setInterval(updateTimer, 1000)
})

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.time-badge {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    margin-left: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
}
</style>
