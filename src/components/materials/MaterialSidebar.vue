<template>
  <aside class="docs-sidebar" :class="{ 'is-open': isOpen }">
    <div class="sidebar-inner">
      <!-- Sidebar Header -->
      <div class="sidebar-header">
        <div class="header-branding">
          <div class="header-icon-box">
            <i class="fa-solid fa-book-bookmark"></i>
          </div>
          <div class="header-text-block">
            <div class="header-title-row">
              <h2 class="sidebar-title">Pusat Materi</h2>
              <span v-if="isProUser" class="tier-badge-pill pro" title="Akses PRO Aktif">
                <i class="fa-solid fa-crown"></i> PRO
              </span>
              <router-link v-else-if="isLoggedIn" to="/pricing" class="tier-badge-pill upgrade">
                Upgrade <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </router-link>
              <router-link v-else to="/login?redirect=/materials" class="tier-badge-pill login">
                Masuk <i class="fa-solid fa-arrow-right"></i>
              </router-link>
            </div>
            <p class="sidebar-subtitle">Dokumentasi & Modul Teori</p>
          </div>
        </div>
        <button class="close-sidebar-btn" @click="$emit('close')" aria-label="Tutup Sidebar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Segmented Tier Filter (Semua, Gratis, PRO) -->
      <div class="tier-filter-wrapper">
        <div class="tier-segmented-control" role="tablist">
          <button 
            type="button"
            class="segment-tab"
            :class="{ active: selectedTier === 'all' }"
            @click="onSelectTier('all')"
          >
            <span>Semua</span>
            <span class="count-pill">{{ counts.all || totalLessonsCount }}</span>
          </button>
          <button 
            type="button"
            class="segment-tab tab-free"
            :class="{ active: selectedTier === 'free' }"
            @click="onSelectTier('free')"
          >
            <span>Gratis</span>
            <span class="count-pill">{{ counts.free || freeLessonsCount }}</span>
          </button>
          <button 
            type="button"
            class="segment-tab tab-pro"
            :class="{ active: selectedTier === 'pro' }"
            @click="onSelectTier('pro')"
          >
            <i class="fa-solid fa-crown pro-crown-icon"></i>
            <span>PRO</span>
            <span class="count-pill">{{ counts.pro || proLessonsCount }}</span>
          </button>
        </div>
      </div>

      <!-- Search Input -->
      <div class="sidebar-search-box">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input 
          type="text" 
          :value="searchQuery" 
          @input="$emit('update:searchQuery', $event.target.value)"
          placeholder="Cari materi atau topik..." 
        />
        <button 
          v-if="searchQuery" 
          class="clear-search-btn" 
          @click="$emit('update:searchQuery', '')"
          type="button"
          aria-label="Hapus pencarian"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      
      <!-- Nav Navigation -->
      <nav class="sidebar-nav">
        <!-- Loading State -->
        <TerminalLoader v-if="isLoading" size="sm" label="materi" />

        <!-- Empty State -->
        <div v-else-if="isEmpty" class="empty-filter-state">
          <i class="fa-solid fa-filter-circle-xmark empty-icon"></i>
          <p>Tidak ada materi yang cocok.</p>
          <button class="reset-filter-btn" @click="resetFilters" type="button">
            <i class="fa-solid fa-rotate-left"></i> Reset Filter
          </button>
        </div>
        
        <div v-else class="materials-sections-wrapper">
          <!-- 1. SECTION: MATERI GRATIS (FREE) -->
          <div 
            v-if="(selectedTier === 'all' || selectedTier === 'free') && freePaths.length > 0" 
            class="section-tier-group"
          >
            <div class="category-divider">
              <div class="category-divider-left">
                <span class="category-dot dot-free"></span>
                <span class="category-heading">Materi Gratis</span>
              </div>
              <span class="category-meta">{{ freeLessonsCount }} materi</span>
            </div>

            <!-- Free Paths List -->
            <div class="paths-sub-list">
              <div class="path-group" v-for="path in freePaths" :key="'free-' + path.id">
                <div class="path-header-row" @click="togglePath('free-' + path.id)" :title="path.title">
                  <div class="path-title-content">
                    <i :class="path.icon || 'fa-solid fa-code'" class="path-icon free-accent"></i>
                    <span class="title-text">{{ path.title }}</span>
                  </div>
                  <i class="fa-solid fa-chevron-down toggle-icon" :class="{ 'rotated': openPaths.includes('free-' + path.id) }"></i>
                </div>
                
                <transition name="slide-fade">
                  <div class="path-content" v-show="openPaths.includes('free-' + path.id)">
                    <div class="chapter-group" v-for="chapter in path.chapters" :key="chapter.id">
                      <h5 class="chapter-title" @click="toggleChapter(chapter.id)">
                        <span>{{ chapter.title }}</span>
                        <i class="fa-solid fa-chevron-down toggle-icon" :class="{ 'rotated': openChapters.includes(chapter.id) }"></i>
                      </h5>
                      <transition name="slide-fade">
                        <ul class="lesson-list" v-show="openChapters.includes(chapter.id)">
                          <li v-for="lesson in chapter.lessons" :key="lesson.id">
                            <a 
                              href="#" 
                              @click.prevent="$emit('select-lesson', path.id, chapter.id, lesson.id, lesson)"
                              class="lesson-link"
                              :class="{ 
                                'active': activeLessonId === lesson.id && activeChapterId === chapter.id && activePathId === path.id
                              }"
                              :title="lesson.title"
                            >
                              <div class="lesson-item-left">
                                <i class="fa-regular fa-file-lines status-icon free-icon"></i>
                                <span class="lesson-link-title">{{ lesson.title }}</span>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </transition>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>

          <!-- 2. SECTION: MATERI PRO -->
          <div 
            v-if="(selectedTier === 'all' || selectedTier === 'pro') && proPaths.length > 0" 
            class="section-tier-group"
          >
            <div class="category-divider">
              <div class="category-divider-left">
                <i class="fa-solid fa-crown category-crown-icon"></i>
                <span class="category-heading pro-heading">Materi PRO</span>
              </div>
              <span class="category-meta pro-meta">{{ proLessonsCount }} materi</span>
            </div>

            <!-- Pro Paths List -->
            <div class="paths-sub-list">
              <div class="path-group" v-for="path in proPaths" :key="'pro-' + path.id">
                <div class="path-header-row" @click="togglePath('pro-' + path.id)" :title="path.title">
                  <div class="path-title-content">
                    <i :class="path.icon || 'fa-solid fa-layer-group'" class="path-icon pro-accent"></i>
                    <span class="title-text">{{ path.title }}</span>
                  </div>
                  <div class="path-meta-right">
                    <i v-if="!isProUser" class="fa-solid fa-lock pro-lock-icon" title="Perlu Akses PRO"></i>
                    <i class="fa-solid fa-chevron-down toggle-icon" :class="{ 'rotated': openPaths.includes('pro-' + path.id) }"></i>
                  </div>
                </div>
                
                <transition name="slide-fade">
                  <div class="path-content" v-show="openPaths.includes('pro-' + path.id)">
                    <div class="chapter-group" v-for="chapter in path.chapters" :key="chapter.id">
                      <h5 class="chapter-title" @click="toggleChapter(chapter.id)">
                        <span>{{ chapter.title }}</span>
                        <i class="fa-solid fa-chevron-down toggle-icon" :class="{ 'rotated': openChapters.includes(chapter.id) }"></i>
                      </h5>
                      <transition name="slide-fade">
                        <ul class="lesson-list" v-show="openChapters.includes(chapter.id)">
                          <li v-for="lesson in chapter.lessons" :key="lesson.id">
                            <a 
                              href="#" 
                              @click.prevent="$emit('select-lesson', path.id, chapter.id, lesson.id, lesson)"
                              class="lesson-link"
                              :class="{ 
                                'active': activeLessonId === lesson.id && activeChapterId === chapter.id && activePathId === path.id,
                                'is-locked': !isProUser
                              }"
                              :title="lesson.title"
                            >
                              <div class="lesson-item-left">
                                <i v-if="!isProUser" class="fa-solid fa-lock status-icon lock-icon"></i>
                                <i v-else class="fa-regular fa-file-lines status-icon pro-icon"></i>
                                <span class="lesson-link-title">{{ lesson.title }}</span>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </transition>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  paths: {
    type: Array,
    required: true,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  activePathId: {
    type: [Number, String],
    default: null
  },
  activeChapterId: {
    type: [Number, String],
    default: null
  },
  activeLessonId: {
    type: [Number, String],
    default: null
  },
  selectedTier: {
    type: String,
    default: 'all'
  },
  searchQuery: {
    type: String,
    default: ''
  },
  counts: {
    type: Object,
    default: () => ({ all: 0, free: 0, pro: 0 })
  },
  isProUser: {
    type: Boolean,
    default: false
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'close',
  'select-lesson',
  'update:selectedTier',
  'update:searchQuery',
  'reset-filter'
])

const openPaths = ref([])
const openChapters = ref([])

const isLessonPro = (path, lesson) => {
  return Boolean(lesson.is_premium || path.is_premium)
}

// Client-side fallback count calculation if meta.counts is not yet loaded
const totalLessonsCount = computed(() => {
  let count = 0
  props.paths.forEach(p => {
    p.chapters?.forEach(c => {
      count += c.lessons?.length || 0
    })
  })
  return count
})

const freeLessonsCount = computed(() => {
  if (props.counts && props.counts.free !== undefined) return props.counts.free
  let count = 0
  props.paths.forEach(p => {
    p.chapters?.forEach(c => {
      c.lessons?.forEach(l => {
        if (!isLessonPro(p, l)) count++
      })
    })
  })
  return count
})

const proLessonsCount = computed(() => {
  if (props.counts && props.counts.pro !== undefined) return props.counts.pro
  let count = 0
  props.paths.forEach(p => {
    p.chapters?.forEach(c => {
      c.lessons?.forEach(l => {
        if (isLessonPro(p, l)) count++
      })
    })
  })
  return count
})

// Filtered paths based on search
const searchFilteredPaths = computed(() => {
  if (!props.paths || props.paths.length === 0) return []
  const query = props.searchQuery.trim().toLowerCase()
  if (!query) return props.paths

  return props.paths.map(path => {
    const matchingChapters = (path.chapters || []).map(chapter => {
      const matchingLessons = (chapter.lessons || []).filter(lesson => {
        const matchLesson = (lesson.title || '').toLowerCase().includes(query)
        const matchChapter = (chapter.title || '').toLowerCase().includes(query)
        const matchPath = (path.title || '').toLowerCase().includes(query)
        return matchLesson || matchChapter || matchPath
      })
      return { ...chapter, lessons: matchingLessons }
    }).filter(c => c.lessons.length > 0)

    return { ...path, chapters: matchingChapters }
  }).filter(p => p.chapters.length > 0)
})

// 100% Free paths & chapters & lessons
const freePaths = computed(() => {
  return searchFilteredPaths.value.map(path => {
    const freeChapters = (path.chapters || []).map(chapter => {
      return {
        ...chapter,
        lessons: (chapter.lessons || []).filter(l => !isLessonPro(path, l))
      }
    }).filter(c => c.lessons.length > 0)

    return {
      ...path,
      chapters: freeChapters
    }
  }).filter(p => p.chapters.length > 0)
})

// 100% PRO paths & chapters & lessons
const proPaths = computed(() => {
  return searchFilteredPaths.value.map(path => {
    const proChapters = (path.chapters || []).map(chapter => {
      return {
        ...chapter,
        lessons: (chapter.lessons || []).filter(l => isLessonPro(path, l))
      }
    }).filter(c => c.lessons.length > 0)

    return {
      ...path,
      chapters: proChapters
    }
  }).filter(p => p.chapters.length > 0)
})

const isEmpty = computed(() => {
  if (props.selectedTier === 'free') return freePaths.value.length === 0
  if (props.selectedTier === 'pro') return proPaths.value.length === 0
  return freePaths.value.length === 0 && proPaths.value.length === 0
})

// Auto open first path in active list
watch([freePaths, proPaths], () => {
  if (openPaths.value.length === 0) {
    if (freePaths.value.length > 0) {
      openPaths.value.push('free-' + freePaths.value[0].id)
      if (freePaths.value[0].chapters?.length > 0) {
        openChapters.value.push(freePaths.value[0].chapters[0].id)
      }
    } else if (proPaths.value.length > 0) {
      openPaths.value.push('pro-' + proPaths.value[0].id)
      if (proPaths.value[0].chapters?.length > 0) {
        openChapters.value.push(proPaths.value[0].chapters[0].id)
      }
    }
  }
}, { immediate: true })

// Ensure active chapter is open
watch(() => props.activeChapterId, (newChapterId) => {
  if (newChapterId && !openChapters.value.includes(newChapterId)) {
    openChapters.value.push(newChapterId)
  }
}, { immediate: true })

// Ensure active path is open in either free or pro section
watch(() => props.activePathId, (newPathId) => {
  if (newPathId) {
    const freeKey = 'free-' + newPathId
    const proKey = 'pro-' + newPathId
    if (!openPaths.value.includes(freeKey)) openPaths.value.push(freeKey)
    if (!openPaths.value.includes(proKey)) openPaths.value.push(proKey)
  }
}, { immediate: true })

const togglePath = (pathKey) => {
  const index = openPaths.value.indexOf(pathKey)
  if (index === -1) {
    openPaths.value.push(pathKey)
  } else {
    openPaths.value.splice(index, 1)
  }
}

const toggleChapter = (chapterId) => {
  const index = openChapters.value.indexOf(chapterId)
  if (index === -1) {
    openChapters.value.push(chapterId)
  } else {
    openChapters.value.splice(index, 1)
  }
}

const onSelectTier = (tier) => {
  emit('update:selectedTier', tier)
}

const resetFilters = () => {
  emit('reset-filter')
}
</script>

<style scoped src="../../assets/css/components/materials/MaterialSidebar.css"></style>
