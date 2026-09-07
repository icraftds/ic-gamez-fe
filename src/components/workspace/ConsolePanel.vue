<template>
    <div class="panel-console">
        <div class="panel-header">
            <div class="panel-title">
                <i class="fa-solid fa-terminal"></i> Testcases
            </div>
        </div>
        <div class="console-output" v-html="store.consoleOutputHtml"></div>
        <div class="action-bar">
            <div class="token-badge" title="Kesempatan Submit Tersisa">
                <i class="fa-solid fa-heart" style="color: #ec4899;"></i> 
                <span>{{ store.tokens }}/10</span>
            </div>
            <button class="btn btn-outline" @click="store.runCode" :disabled="store.isRunning">
                <i class="fa-solid fa-play"></i> Run Code
            </button>
            <button class="btn btn-primary" @click="store.submitCode" :disabled="store.isSubmitting">
                <i class="fa-solid fa-cloud-arrow-up"></i> Submit
            </button>
        </div>
    </div>
</template>

<script setup>
import { useChallengeStore } from '../../stores/challengeStore'
const store = useChallengeStore()
</script>
