<template>
  <div class="article-reader" v-if="article">
    <div class="article-header">
      <div class="article-meta">
        <span class="category"><i class="fa-solid fa-folder"></i> {{ article.category }}</span>
        <span class="read-time"><i class="fa-regular fa-clock"></i> {{ article.readTime }}</span>
      </div>
      <h1>{{ article.title }}</h1>
      <p class="subtitle">{{ article.subtitle }}</p>
    </div>

    <div class="article-body markdown-body" v-html="parsedContent">
    </div>
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
  article: {
    type: Object,
    required: true
  }
})

const parsedContent = computed(() => {
  if (!props.article || !props.article.content) return ''
  
  // Normalize legacy HTML code blocks from database into standard Markdown code blocks
  // to prevent marked from misinterpreting internal comments as Markdown headings.
  let content = props.article.content
  content = content.replace(/<div class="code-block">\s*<div class="code-header">(.*?)<\/div>\s*<pre>\s*<code>([\s\S]*?)<\/code>\s*<\/pre>\s*<\/div>/gi, "\n\n```$1\n$2\n```\n\n")
  
  return marked.parse(content)
})
</script>

<style src="../../assets/css/components/encyclopedia/ArticleReader.css"></style>
