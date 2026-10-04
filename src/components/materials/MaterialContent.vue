<template>
  <main class="docs-main">
    <div class="mobile-topbar" v-if="isMobile">
      <button class="open-sidebar-btn" @click="$emit('open-sidebar')">
        <i class="fa-solid fa-bars"></i> Daftar Materi
      </button>
    </div>

    <div v-if="!lesson" class="empty-state">
      <div class="empty-icon"><i class="fa-solid fa-book-open"></i></div>
      <h3>Pilih materi di sidebar untuk mulai membaca</h3>
      <p>Temukan materi yang ingin Anda pelajari dari daftar di sebelah kiri.</p>
    </div>
    
    <div v-else class="lesson-content">
      <header class="lesson-header">
        <span class="category-badge">{{ pathTitle }} / {{ chapterTitle }}</span>
        <h1 class="lesson-title">{{ lesson.title }}</h1>
      </header>
      
      <div class="lesson-body markdown-body" v-html="parsedExplanation"></div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
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
  }
})

defineEmits(['open-sidebar'])

const parsedExplanation = computed(() => {
  if (!props.lesson || !props.lesson.explanation) return ''
  
  let content = props.lesson.explanation
  content = content.replace(/<div class="code-block">\s*<div class="code-header">(.*?)<\/div>\s*<pre>\s*<code>([\s\S]*?)<\/code>\s*<\/pre>\s*<\/div>/gi, "\n\n```$1\n$2\n```\n\n")
  
  return marked.parse(content)
})
</script>

<style scoped src="../../assets/css/components/materials/MaterialContent.css"></style>
