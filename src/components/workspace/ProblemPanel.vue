<template>
    <div class="panel panel-left">
        <div class="panel-header">
            <div class="tabs">
                <div class="tab" :class="{ active: store.activeTab === 'Description' }" @click="store.activeTab = 'Description'">Description</div>
                <div class="tab" :class="{ active: store.activeTab === 'Submissions' }" @click="store.activeTab = 'Submissions'">Submissions</div>
            </div>
        </div>
        <div class="panel-content">
            <div v-show="store.activeTab === 'Description'">
                <h2 class="problem-title">{{ store.stageData?.title }}</h2>
                <div><div :class="store.stageData?.diffClass">{{ store.stageData?.diff }}</div></div>
                
                <div class="prose" v-html="store.stageData?.prose"></div>
            </div>
            <div v-show="store.activeTab === 'Submissions'">
                <h2 class="problem-title">Submission History</h2>
                <div class="prose">
                    <p v-if="store.submissions.length === 0">Belum ada submission. Jalankan kode Anda untuk mulai!</p>
                    <div v-else v-for="(sub, idx) in store.submissions" :key="idx" class="submission-card">
                        <div>
                            <div :class="sub.status === 'Accepted' ? 'sub-status-success' : 'sub-status-fail'">
                                <i class="fa-solid fa-check" v-if="sub.status === 'Accepted'"></i>
                                <i class="fa-solid fa-xmark" v-else></i> {{ sub.status }}
                            </div>
                            <div class="sub-time">Percobaan ke-{{ sub.attempt }} &bull; {{ sub.date }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useChallengeStore } from '../../stores/challengeStore'
const store = useChallengeStore()
</script>
