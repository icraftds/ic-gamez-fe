<template>
    <div class="top-bar">
        <router-link to="/" class="nav-btn">
            <i class="fa-solid fa-arrow-left"></i> Kembali
        </router-link>
        <div class="problem-info">
            <span>{{ title }}</span>
            <span class="badge">IC Game-Z</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useChallengeStore } from '../stores/challengeStore'

const store = useChallengeStore()
const title = computed(() => store.stageData?.title.split(". ")[1] || 'Loading...')
</script>
