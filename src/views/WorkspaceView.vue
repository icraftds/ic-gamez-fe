<template>
  <div class="workspace-view">
    <SimpleBackground />
    <TopBar />

    <div class="workspace">
      <ProblemPanel />

      <div class="panel-right">
        <EditorPanel />
        <ConsolePanel />
      </div>
    </div>


    <ResultModal />
    
    <!-- Early Exit Warning Modal -->
    <ConfirmModal
      v-model="showExitWarning"
      type="danger"
      title="Peringatan Keluar!"
      message="Kamu tidak bisa mengikuti kuis daily kembali dan akan dinyatakan gugur. Kamu bisa mencoba lagi quiz yang lain besok."
      confirmText="Tetap Keluar (Gugur)"
      @confirm="forceLeave"
      @cancel="cancelLeave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useChallengeStore } from '../stores/challengeStore'

import SimpleBackground from '../components/common/SimpleBackground.vue'
import TopBar from '../components/TopBar.vue'
import ResultModal from '../components/ResultModal.vue'
import ProblemPanel from '../components/workspace/ProblemPanel.vue'
import EditorPanel from '../components/workspace/EditorPanel.vue'
import ConsolePanel from '../components/workspace/ConsolePanel.vue'
import ConfirmModal from '../components/common/ConfirmModal.vue'

const route = useRoute()
const router = useRouter()
const store = useChallengeStore()

const showExitWarning = ref(false)
let pendingTarget = null
let isConfirmed = false

onMounted(async () => {
  await store.initChallenge(route.query)
})

onBeforeRouteLeave((to, from) => {
  if (store.mode === 'speedrun' && !store.isSuccess && !isConfirmed) {
    showExitWarning.value = true
    pendingTarget = to
    return false // Batalkan navigasi sementara
  }
  return true
})

const forceLeave = async () => {
  showExitWarning.value = false
  await store.failDailyChallenge()
  isConfirmed = true
  if (pendingTarget) {
    router.push(pendingTarget)
  } else {
    router.back()
  }
}

const cancelLeave = () => {
  showExitWarning.value = false
  pendingTarget = null
}
</script>
