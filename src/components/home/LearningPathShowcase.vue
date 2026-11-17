<template>
  <section class="track-explorer reveal" :style="stageThemeVars">
    <!-- Ambient open-stage spotlight glow (no cards stacked) -->
    <div class="explorer-ambient" aria-hidden="true"></div>

    <!-- Header & Interactive Filter Controls -->
    <div class="explorer-top">
      <div class="explorer-heading-block">
        <div class="explorer-eyebrow">
          <span class="eyebrow-pulse"></span>
          <span>INTERACTIVE SKILL MATRIX</span>
        </div>
        <h2 class="section-title">Mau Mulai Dari Jalur Mana?</h2>
        <p class="section-subtitle">
          Arahkan kursor atau pilih jalur di bawah untuk melihat silabus &amp; mencoba simulasi kode secara langsung.
        </p>
      </div>

      <div class="explorer-toolbar">
        <div class="filter-segments" role="tablist" aria-label="Filter jalur belajar">
          <button
            v-for="tab in filterTabs"
            :key="tab.key"
            type="button"
            role="tab"
            :aria-selected="activeFilter === tab.key"
            class="segment-btn"
            :class="{ active: activeFilter === tab.key }"
            @click="setFilter(tab.key)"
          >
            <span>{{ tab.label }}</span>
            <span class="segment-count">{{ tab.count }}</span>
          </button>
        </div>

        <div class="search-inline">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            v-model.trim="searchQuery"
            type="text"
            placeholder="Cari HTML, SQL, Python..."
            aria-label="Cari jalur belajar"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="search-clear"
            aria-label="Hapus pencarian"
            @click="searchQuery = ''"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty Filter Fallback -->
    <div v-if="filteredPaths.length === 0" class="explorer-empty">
      <i class="fa-solid fa-compass"></i>
      <p>Tidak ditemukan jalur belajar untuk filter atau kata kunci tersebut.</p>
      <button type="button" class="btn-reset-filter" @click="resetFilters">
        Tampilkan Semua Jalur
      </button>
    </div>

    <!-- Borderless 2-Pane Interactive Matrix -->
    <div v-else class="explorer-matrix">
      <!-- Left: Skill-Tree Timeline Index (Row list, zero cards) -->
      <div class="track-rail-column">
        <div class="track-rail-spine" aria-hidden="true"></div>
        <div class="track-rail-scroll" role="listbox" aria-label="Daftar jalur belajar">
          <button
            v-for="(item, idx) in filteredPaths"
            :key="item.path.id"
            type="button"
            role="option"
            :aria-selected="activePath?.id === item.path.id"
            class="rail-row"
            :class="{ 'is-selected': activePath?.id === item.path.id }"
            :style="{ '--row-accent': getPathThemeColor(item.path, item.originalIndex) }"
            @mouseenter="selectTrack(item.path, item.originalIndex)"
            @focus="selectTrack(item.path, item.originalIndex)"
            @click="selectTrack(item.path, item.originalIndex)"
          >
            <span class="rail-node-dot" aria-hidden="true"></span>
            <span class="rail-index">{{ String(item.originalIndex + 1).padStart(2, '0') }}</span>

            <span class="rail-icon">
              <i :class="getPathIconClass(item.path)"></i>
            </span>

            <span class="rail-main">
              <span class="rail-title">{{ item.path.title }}</span>
              <span class="rail-meta">
                {{ getChapterCount(item.path) }} Modul
                <span class="meta-sep">•</span>
                {{ isPathPremium(item.path) ? 'PRO' : 'GRATIS' }}
              </span>
            </span>

            <span class="rail-tier-tag" :class="isPathPremium(item.path) ? 'pro' : 'free'">
              <i :class="isPathPremium(item.path) ? 'fa-solid fa-crown' : 'fa-solid fa-gift'"></i>
            </span>

            <i class="fa-solid fa-chevron-right rail-arrow" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <!-- Right: Open Interactive Stage + Live Mini-Terminal Simulation -->
      <div v-if="activePath" class="track-stage-column">
        <div class="stage-telemetry-bar">
          <div class="telemetry-left">
            <span class="telemetry-track-num">
              ALUR {{ String(activeOriginalIndex + 1).padStart(2, '0') }} / {{ paths.length }}
            </span>
            <span
              class="stage-tier-pill"
              :class="isPathPremium(activePath) ? 'tier-pro' : 'tier-free'"
            >
              <i :class="isPathPremium(activePath) ? 'fa-solid fa-crown' : 'fa-solid fa-gift'"></i>
              {{ isPathPremium(activePath) ? 'PRO TRACK' : 'GRATIS' }}
            </span>
          </div>

          <div class="stage-step-controls" v-if="filteredPaths.length > 1">
            <button
              type="button"
              class="step-btn"
              aria-label="Jalur sebelumnya"
              @click="stepTrack(-1)"
            >
              <i class="fa-solid fa-arrow-up"></i>
            </button>
            <button
              type="button"
              class="step-btn"
              aria-label="Jalur berikutnya"
              @click="stepTrack(1)"
            >
              <i class="fa-solid fa-arrow-down"></i>
            </button>
          </div>
        </div>

        <Transition name="stage-fade" mode="out-in">
          <div :key="activePath.id" class="stage-body">
            <div class="stage-title-row">
              <div class="stage-brand-emblem">
                <i :class="getPathIconClass(activePath)"></i>
              </div>
              <div>
                <span class="stage-kicker">ALUR BELAJAR TERSTRUKTUR</span>
                <h3 class="stage-headline">
                  Kuasai <span class="stage-accent-text">{{ activePath.title }}</span>
                </h3>
              </div>
            </div>

            <p class="stage-description">{{ activePath.description }}</p>

            <!-- Inline borderless spec metrics -->
            <div class="stage-specs-strip">
              <div class="spec-item">
                <i class="fa-solid fa-layer-group"></i>
                <div>
                  <strong>{{ getChapterCount(activePath) }} Modul</strong>
                  <span>Materi bertahap</span>
                </div>
              </div>
              <div class="spec-divider" aria-hidden="true"></div>
              <div class="spec-item">
                <i class="fa-solid fa-bolt"></i>
                <div>
                  <strong>+{{ getChapterCount(activePath) * 150 }} XP</strong>
                  <span>Potensi progres</span>
                </div>
              </div>
              <div class="spec-divider" aria-hidden="true"></div>
              <div class="spec-item">
                <i class="fa-solid fa-robot"></i>
                <div>
                  <strong>Auto Check</strong>
                  <span>Validasi real-time</span>
                </div>
              </div>
            </div>

            <!-- Interactive Mini Code Probe (Real micro-interaction without leaving landing) -->
            <div class="mini-sandbox">
              <div class="sandbox-bar">
                <div class="sandbox-dots" aria-hidden="true">
                  <span></span><span></span><span></span>
                </div>
                <span class="sandbox-file">{{ sampleSnippet.filename }}</span>
                <button
                  type="button"
                  class="btn-run-probe"
                  :class="{ 'is-running': simState === 'running', 'is-passed': simState === 'passed' }"
                  @click="runSimulation"
                >
                  <i v-if="simState === 'running'" class="fa-solid fa-spinner fa-spin"></i>
                  <i v-else-if="simState === 'passed'" class="fa-solid fa-check"></i>
                  <i v-else class="fa-solid fa-play"></i>
                  <span>
                    {{
                      simState === 'running'
                        ? 'Menjalankan...'
                        : simState === 'passed'
                          ? 'Tervalidasi (+25 XP)'
                          : 'Simulasi Jalankan'
                    }}
                  </span>
                </button>
              </div>

              <pre class="sandbox-code"><code>{{ sampleSnippet.code }}</code></pre>

              <div class="sandbox-output" :class="'state-' + simState">
                <span class="output-prompt">&gt;_</span>
                <span v-if="simState === 'idle'">
                  Tekan <strong>Simulasi Jalankan</strong> untuk melihat feedback validator instan.
                </span>
                <span v-else-if="simState === 'running'">
                  Memeriksa sintaks &amp; output {{ activePath.title }}...
                </span>
                <span v-else class="output-pass">
                  <i class="fa-solid fa-circle-check"></i>
                  {{ sampleSnippet.output }} · Validasi Real-Time Lulus!
                </span>
              </div>
            </div>

            <!-- CTA Row -->
            <div class="stage-actions">
              <button
                type="button"
                class="btn-stage-primary"
                :disabled="isPreparingLesson"
                @click="startLearning(activePath)"
              >
                <TerminalLoader v-if="isPreparingLesson" variant="inline" label="membuka materi" />
                <template v-else>
                  <span>Mulai Belajar {{ activePath.title }}</span>
                  <i class="fa-solid fa-arrow-right cta-arrow"></i>
                </template>
              </button>

              <router-link to="/learning" class="btn-stage-secondary">
                <span>Eksplor Semua Jalur</span>
                <i class="fa-solid fa-compass"></i>
              </router-link>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Borderless Cursor-Spotlight 3-Step Gamification Loop -->
    <div class="gamification-strip">
      <div
        v-for="(step, sIdx) in loopSteps"
        :key="step.num"
        class="loop-step-item"
        @mousemove="updateSpotlight($event, sIdx)"
        @mouseleave="resetSpotlight(sIdx)"
        :style="spotlightStyles[sIdx]"
      >
        <span class="loop-num">{{ step.num }}</span>
        <div class="loop-copy">
          <h4>{{ step.title }}</h4>
          <p>{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLearningPaths } from '../../composables/useLearningPaths'
import { getPathThemeColor, getPathIconClass } from '../../utils/pathTheme'

const router = useRouter()
const { paths, fetchPathDetails, isPreparingLesson } = useLearningPaths()

const activeFilter = ref('all')
const searchQuery = ref('')
const selectedId = ref(null)
const simState = ref('idle')
let simTimer = null

const isPathPremium = (path) => Boolean(path?.is_premium || path?.isPremium)

const getChapterCount = (path) => {
  if (Array.isArray(path?.chapters) && path.chapters.length > 0) {
    return path.chapters.length
  }
  if (Number(path?.chapters_count) > 0) {
    return Number(path.chapters_count)
  }
  return 4
}

const filterTabs = computed(() => {
  const allCount = paths.value.length
  const freeCount = paths.value.filter((p) => !isPathPremium(p)).length
  const proCount = paths.value.filter((p) => isPathPremium(p)).length
  return [
    { key: 'all', label: 'Semua', count: allCount },
    { key: 'free', label: 'Gratis', count: freeCount },
    { key: 'pro', label: 'PRO', count: proCount },
  ]
})

const indexedPaths = computed(() =>
  paths.value.map((path, index) => ({
    path,
    originalIndex: index,
  }))
)

const filteredPaths = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return indexedPaths.value.filter(({ path }) => {
    if (activeFilter.value === 'free' && isPathPremium(path)) return false
    if (activeFilter.value === 'pro' && !isPathPremium(path)) return false
    if (q) {
      const hay = `${path.title || ''} ${path.slug || ''} ${path.description || ''}`.toLowerCase()
      return hay.includes(q)
    }
    return true
  })
})

const activeEntry = computed(() => {
  const list = filteredPaths.value
  if (list.length === 0) return null
  if (selectedId.value !== null) {
    const found = list.find((item) => String(item.path.id) === String(selectedId.value))
    if (found) return found
  }
  return list[0]
})

const activePath = computed(() => activeEntry.value?.path || null)
const activeOriginalIndex = computed(() => activeEntry.value?.originalIndex ?? 0)

const stageThemeVars = computed(() => {
  const color = activePath.value
    ? getPathThemeColor(activePath.value, activeOriginalIndex.value)
    : '#00f0ff'
  return {
    '--stage-accent': color,
  }
})

const selectTrack = (path) => {
  if (!path) return
  if (String(selectedId.value) !== String(path.id)) {
    selectedId.value = path.id
    simState.value = 'idle'
    if (simTimer) clearTimeout(simTimer)
  }
}

const setFilter = (key) => {
  activeFilter.value = key
  simState.value = 'idle'
}

const resetFilters = () => {
  activeFilter.value = 'all'
  searchQuery.value = ''
}

const stepTrack = (delta) => {
  const list = filteredPaths.value
  if (list.length === 0) return
  const currentIdx = list.findIndex((item) => String(item.path.id) === String(activePath.value?.id))
  const nextIdx = (currentIdx + delta + list.length) % list.length
  selectTrack(list[nextIdx].path)
}

watch(
  () => paths.value,
  (list) => {
    if (list.length > 0 && selectedId.value === null) {
      selectedId.value = list[0].id
    }
  },
  { immediate: true }
)

const sampleSnippet = computed(() => {
  const slug = String(activePath.value?.slug || activePath.value?.title || '').toLowerCase()

  if (slug.includes('sql') || slug.includes('postgres') || slug.includes('mysql')) {
    return {
      filename: 'query.sql',
      code: `SELECT developer, SUM(xp) AS total_xp\nFROM progress_logs\nWHERE completed = TRUE\nGROUP BY developer ORDER BY total_xp DESC;`,
      output: '3 rows returned (1.2ms)',
    }
  }
  if (slug.includes('python')) {
    return {
      filename: 'challenge.py',
      code: `def calc_streak(days: list[bool]) -> int:\n    return sum(1 for d in days if d)\n\nprint(f"Streak: {calc_streak([True, True, True])} hari")`,
      output: 'Streak: 3 hari',
    }
  }
  if (slug.includes('php') || slug.includes('laravel')) {
    return {
      filename: 'RewardController.php',
      code: `$reward = collect($lessons)->sum('xp');\nreturn response()->json([\n    'status' => 'unlocked', 'xp' => $reward\n]);`,
      output: '{"status":"unlocked","xp":150}',
    }
  }
  if (slug.includes('css') || slug.includes('tailwind')) {
    return {
      filename: 'layout.css',
      code: `.grid-matrix {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 1rem;\n}`,
      output: 'Layout responsiveness 100% verified',
    }
  }
  if (slug.includes('html')) {
    return {
      filename: 'index.html',
      code: `<section aria-label="Arena Tantangan">\n  <h1>Mulai Coding Interaktif</h1>\n  <button data-action="solve">Kirim Solusi</button>\n</section>`,
      output: 'Semantic DOM & Accessibility: 100/100',
    }
  }
  return {
    filename: 'arena.js',
    code: `const solveChallenge = (xp, multiplier = 1.5) => {\n  return Math.round(xp * multiplier);\n};\nconsole.log("XP Earned:", solveChallenge(100));`,
    output: 'XP Earned: 150',
  }
})

const runSimulation = () => {
  if (simState.value === 'running') return
  simState.value = 'running'
  if (simTimer) clearTimeout(simTimer)
  simTimer = setTimeout(() => {
    simState.value = 'passed'
  }, 420)
}

const startLearning = async (targetPath) => {
  if (!targetPath) return
  isPreparingLesson.value = true
  try {
    let detailedPath = targetPath
    if (
      !detailedPath.chapters ||
      detailedPath.chapters.length === 0 ||
      !detailedPath.chapters[0].lessons
    ) {
      const fetched = await fetchPathDetails(targetPath.slug || targetPath.id)
      if (fetched) detailedPath = fetched
    }

    const firstChapter = detailedPath?.chapters?.[0]
    const firstLesson = firstChapter?.lessons?.[0]

    if (firstChapter && firstLesson) {
      router.push(
        `/learning/${detailedPath.slug || detailedPath.id}/lesson/${firstChapter.slug || firstChapter.id}/${firstLesson.slug || firstLesson.id}`
      )
    } else {
      router.push(`/learning/${detailedPath?.slug || detailedPath?.id || targetPath.slug || targetPath.id}`)
    }
  } finally {
    isPreparingLesson.value = false
  }
}

const loopSteps = [
  {
    num: '01',
    title: 'Pilih Jalur Tanpa Bingung',
    desc: 'Filter materi gratis atau PRO dan lihat struktur modul sebelum mulai belajar.',
  },
  {
    num: '02',
    title: 'Praktik Langsung & Auto Check',
    desc: 'Jalankan kode HTML, JS, Python, PHP hingga SQL langsung di workspace interaktif.',
  },
  {
    num: '03',
    title: 'Kumpulkan XP, Badge & Rank',
    desc: 'Setiap soal lulus menambah XP, iCoinZ, dan peringkatmu di leaderboard global.',
  },
]

const spotlightCoords = ref([null, null, null])
const spotlightStyles = computed(() =>
  spotlightCoords.value.map((pos) =>
    pos ? { '--spot-x': `${pos.x}px`, '--spot-y': `${pos.y}px`, '--spot-op': 1 } : { '--spot-op': 0 }
  )
)

const updateSpotlight = (e, idx) => {
  const rect = e.currentTarget?.getBoundingClientRect()
  if (!rect) return
  spotlightCoords.value[idx] = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

const resetSpotlight = (idx) => {
  spotlightCoords.value[idx] = null
}

onUnmounted(() => {
  if (simTimer) clearTimeout(simTimer)
})
</script>

<style scoped src="../../assets/css/components/home/LearningPathShowcase.css"></style>
