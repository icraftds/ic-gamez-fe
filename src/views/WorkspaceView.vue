<template>
  <div class="workspace-view">
    <BackgroundEffects />
    <TopBar />

    <div class="workspace">
      <ProblemPanel />

      <div class="panel-right">
        <EditorPanel />
        <ConsolePanel />
      </div>
    </div>

    <ResultModal />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useChallengeStore } from '../stores/challengeStore'

import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import TopBar from '../components/TopBar.vue'
import ResultModal from '../components/ResultModal.vue'
import ProblemPanel from '../components/workspace/ProblemPanel.vue'
import EditorPanel from '../components/workspace/EditorPanel.vue'
import ConsolePanel from '../components/workspace/ConsolePanel.vue'

const route = useRoute()
const store = useChallengeStore()

onMounted(() => {
  store.initStage(route.query.stage)
})
</script>
