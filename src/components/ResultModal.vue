<template>
    <div class="modal-overlay" :class="{ active: store.modalActive }">
        <div class="modal-content">
            <button class="modal-close" @click="store.closeModal"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-icon">
                <i v-if="store.modalState.type === 'success'" class="fa-solid fa-circle-check modal-success-icon"></i>
                <i v-else class="fa-solid fa-circle-xmark modal-fail-icon"></i>
            </div>
            <h2 style="margin-bottom: 10px;">{{ store.modalState.title }}</h2>
            <p style="color: var(--text-sub); margin-bottom: 25px;">{{ store.modalState.desc }}</p>
            <button class="btn btn-primary" style="width: 100%;" @click="store.closeModal">{{ store.modalState.btnText }}</button>
        </div>
    </div>
</template>

<script setup>
import { useChallengeStore } from '../stores/challengeStore'
const store = useChallengeStore()
</script>
