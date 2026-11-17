<template>
  <section class="learning-path-stack">
    <div class="stack-header reveal">
      <h2 class="section-title">Mau mulai dari mana?</h2>
      <p class="section-subtitle">
        Dari dasar pemrograman hingga mahir database dan web development.
        Scroll perlahan, dan pilih jalur yang paling sesuai dengan tujuanmu.
      </p>
    </div>

    <div ref="containerRef" class="stack-container">
      <LearningPathCard
        v-for="(path, index) in paths"
        :key="path.id"
        :path="path"
        :index="index"
        :total="paths.length"
        :is-occluded="isCardOccluded(index)"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useLearningPaths } from '../../composables/useLearningPaths'
import LearningPathCard from './LearningPathCard.vue'

const { paths } = useLearningPaths()
const containerRef = ref(null)
const visibleWindow = ref(null)

let cardOffsets = []
let rafId = null

const measureCardOffsets = () => {
  const el = containerRef.value
  if (!el || typeof window === 'undefined') {
    cardOffsets = []
    return
  }

  const children = el.children
  const offsets = new Array(children.length)
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    offsets[i] = {
      top: child.offsetTop,
      bottom: child.offsetTop + child.offsetHeight,
    }
  }
  cardOffsets = offsets
}

const updateVisibleWindow = () => {
  rafId = null
  if (cardOffsets.length === 0 || typeof window === 'undefined') {
    visibleWindow.value = null
    return
  }

  // Sticky cards only overlap heavily on tall viewports; on short screens sticky is disabled via CSS.
  if (window.innerHeight <= 600) {
    visibleWindow.value = null
    return
  }

  const containerTop = (containerRef.value?.getBoundingClientRect().top || 0) + window.scrollY
  const stickyAnchor = window.scrollY + 110
  const viewportBottom = window.scrollY + window.innerHeight + 160

  let topPinnedIdx = -1
  let lastVisibleIdx = 0

  for (let i = 0; i < cardOffsets.length; i++) {
    const docTop = containerTop + cardOffsets[i].top
    if (docTop <= stickyAnchor) {
      topPinnedIdx = i
    }
    if (docTop <= viewportBottom) {
      lastVisibleIdx = i
    } else {
      break
    }
  }

  const minVisible = Math.max(0, topPinnedIdx - 1)
  const maxVisible = Math.min(cardOffsets.length - 1, Math.max(lastVisibleIdx + 1, minVisible + 2))
  visibleWindow.value = { min: minVisible, max: maxVisible }
}

const scheduleUpdate = () => {
  if (rafId !== null || typeof requestAnimationFrame === 'undefined') return
  rafId = requestAnimationFrame(updateVisibleWindow)
}

const handleResize = () => {
  measureCardOffsets()
  scheduleUpdate()
}

const isCardOccluded = (index) => {
  const win = visibleWindow.value
  if (!win) return false
  return index < win.min || index > win.max
}

watch(
  () => paths.value.length,
  async () => {
    await nextTick()
    measureCardOffsets()
    scheduleUpdate()
  }
)

onMounted(async () => {
  await nextTick()
  measureCardOffsets()
  updateVisibleWindow()
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', scheduleUpdate)
    window.removeEventListener('resize', handleResize)
  }
  if (rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(rafId)
  }
})
</script>

<style scoped src="../../assets/css/components/home/LearningPathStack.css"></style>
