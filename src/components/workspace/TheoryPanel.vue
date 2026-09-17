<template>
  <div class="theory-panel">
    <article class="panel-content">
      <header class="lesson-header">
        <span class="type-badge" :class="lesson.type">
          <i :class="lesson.type === 'text' ? 'fa-solid fa-book-open' : 'fa-solid fa-laptop-code'"></i>
          {{ lesson.type === 'text' ? 'Bacaan' : 'Koding' }}
        </span>
        <h1 class="lesson-title">{{ lesson.title }}</h1>
      </header>

      <!-- Konten HTML dari data materi -->
      <div class="lesson-body markdown-body" v-html="parsedExplanation"></div>
    </article>

    <footer class="panel-footer">
      <button class="nav-btn prev-btn" :disabled="isFirstLesson" @click="$emit('prev')">
        <i class="fa-solid fa-arrow-left"></i> Sebelumnya
      </button>
      <button class="nav-btn next-btn" @click="$emit('next')">
        Lanjut ke Tes <i class="fa-solid fa-arrow-right"></i>
      </button>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

// Configure marked to render markdown code blocks as custom UI components consistently
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
    required: true
  },
  isFirstLesson: {
    type: Boolean,
    default: false
  }
})

const parsedExplanation = computed(() => {
  if (!props.lesson || !props.lesson.explanation) return ''
  
  // Normalize legacy HTML code blocks from database into standard Markdown code blocks
  // to prevent marked from misinterpreting internal comments as Markdown headings.
  let content = props.lesson.explanation
  content = content.replace(/<div class="code-block">\s*<div class="code-header">(.*?)<\/div>\s*<pre>\s*<code>([\s\S]*?)<\/code>\s*<\/pre>\s*<\/div>/gi, "\n\n```$1\n$2\n```\n\n")
  
  return marked.parse(content)
})

defineEmits(['prev', 'next'])
</script>

<style scoped src="../../assets/css/components/workspace/TheoryPanel.css"></style>
