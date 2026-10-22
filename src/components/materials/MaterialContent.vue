<template>
  <main class="docs-main">
    <div class="mobile-topbar" v-if="isMobile">
      <button class="open-sidebar-btn" @click="$emit('open-sidebar')">
        <i class="fa-solid fa-bars"></i> Daftar Materi
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="!lesson" class="empty-state">
      <div class="empty-icon"><i class="fa-solid fa-book-open"></i></div>
      <h3>Pilih materi di sidebar untuk mulai membaca</h3>
      <p>Temukan materi yang ingin Anda pelajari dari daftar modul di sebelah kiri.</p>
    </div>
    
    <!-- Lesson View -->
    <div v-else class="lesson-content">
      <header class="lesson-header">
        <div class="header-meta-row">
          <span class="category-badge">{{ pathTitle }} / {{ chapterTitle }}</span>
          
          <span v-if="isLessonPro" class="content-tier-pill pro">
            <i class="fa-solid fa-crown"></i> PUSAT MATERI PRO
          </span>
          <span v-else class="content-tier-pill free">
            <i class="fa-solid fa-gift"></i> PUSAT MATERI GRATIS
          </span>
        </div>

        <h1 class="lesson-title">{{ lesson.title }}</h1>
      </header>
      
      <!-- GATED ACCESS: Locked for Pro -->
      <div v-if="isLocked" class="pro-locked-card">
        <div class="lock-glow-orb"></div>
        
        <div class="lock-badge-pill">
          <i class="fa-solid fa-lock"></i> KONTEN EKSKLUSIF PRO
        </div>
        
        <div class="lock-icon-wrapper">
          <i class="fa-solid fa-crown crown-glow"></i>
        </div>

        <h2 class="lock-title">Materi Ini Khusus Pengguna Paket PRO</h2>
        
        <p class="lock-desc">
          Materi <strong>"{{ lesson.title }}"</strong> merupakan bagian dari kurikulum lanjutan. Silakan berlangganan paket PRO terlebih dahulu untuk membuka akses materi ini secara lengkap.
        </p>

        <!-- Cuplikan / Preview snippet if available -->
        <div v-if="lesson.preview_snippet" class="teaser-preview-box">
          <div class="teaser-header">
            <i class="fa-solid fa-eye"></i> Cuplikan Singkat Materi:
          </div>
          <p class="teaser-text">{{ lesson.preview_snippet }}</p>
          <div class="teaser-fade"></div>
        </div>

        <!-- Pro Features Highlight Grid -->
        <div class="pro-features-grid">
          <div class="feature-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>Akses 100% Seluruh Modul & Materi Lanjutan</span>
          </div>
          <div class="feature-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>Bebas Akses Kuis Evaluasi & Tantangan Praktik</span>
          </div>
          <div class="feature-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>Pembahasan AI & Solusi Koding Lengkap</span>
          </div>
          <div class="feature-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>Sertifikat Resmi Penyelesaian Kurikulum</span>
          </div>
        </div>

        <!-- Call to Action Buttons -->
        <div class="lock-actions">
          <button v-if="isLoggedIn" class="btn-upgrade-now" @click="$router.push('/pricing')">
            <i class="fa-solid fa-bolt"></i> Tingkatkan ke Paket PRO
          </button>
          <template v-else>
            <button class="btn-upgrade-now" @click="$router.push('/login?redirect=/materials')">
              <i class="fa-solid fa-arrow-right-to-bracket"></i> Masuk / Daftar Akun PRO
            </button>
            <button class="btn-see-pricing" @click="$router.push('/pricing')">
              Lihat Pilihan Paket
            </button>
          </template>
        </div>
      </div>

      <!-- FULL CONTENT: Authorized (Free or Pro Member) -->
      <div v-else>
        <!-- Pro Member Banner Notice -->
        <div v-if="isLessonPro" class="pro-access-notice">
          <i class="fa-solid fa-crown"></i>
          <span>Akses PRO aktif: Anda memiliki hak akses penuh ke materi eksklusif ini.</span>
        </div>

        <!-- Main Markdown Body -->
        <div class="lesson-body markdown-body" v-html="parsedExplanation"></div>

        <!-- Bottom Action Bar -->
        <div class="content-bottom-bar">
          <button 
            v-if="lesson.path_slug && lesson.chapter_slug"
            class="btn-workspace-link"
            @click="goToWorkspace"
          >
            <i class="fa-solid fa-code"></i>
            <span>Buka di Mode Praktik & Kuis</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { marked } from 'marked'

// Configure marked for code blocks
marked.use({
  renderer: {
    code(token) {
      const lang = token.lang || 'text'
      const escapedCode = token.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return `
        <div class="code-block">
          <div class="code-header">${lang}</div>
          <pre><code>${escapedCode}</code></pre>
        </div>
      `
    }
  }
})

const props = defineProps({
  lesson: {
    type: Object,
    default: null
  },
  pathTitle: {
    type: String,
    default: ''
  },
  chapterTitle: {
    type: String,
    default: ''
  },
  isMobile: {
    type: Boolean,
    default: false
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

defineEmits(['open-sidebar'])

const router = useRouter()

const isLessonPro = computed(() => {
  return Boolean(props.lesson?.is_premium)
})

const isLocked = computed(() => {
  if (!props.lesson) return false
  if (!isLessonPro.value) return false
  // If user is Pro, they have access
  if (props.isProUser) return false
  // If backend explicitly says can_access is true (e.g. preview)
  if (props.lesson.can_access) return false
  return true
})

const parsedExplanation = computed(() => {
  if (!props.lesson || !props.lesson.explanation) return ''
  
  let content = props.lesson.explanation
  content = content.replace(/<div class="code-block">\s*<div class="code-header">(.*?)<\/div>\s*<pre>\s*<code>([\s\S]*?)<\/code>\s*<\/pre>\s*<\/div>/gi, "\n\n```$1\n$2\n```\n\n")
  
  return marked.parse(content)
})

const goToWorkspace = () => {
  if (!props.lesson) return
  const path = props.lesson.path_slug || props.lesson.path_id
  const chapter = props.lesson.chapter_slug || props.lesson.chapter_id
  const lesson = props.lesson.slug || props.lesson.id

  if (path && chapter && lesson) {
    router.push(`/learning/${path}/lesson/${chapter}/${lesson}`)
  }
}
</script>

<style scoped src="../../assets/css/components/materials/MaterialContent.css"></style>
