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

    <div class="article-body markdown-body" v-html="article.content">
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})
</script>

<style>
.article-reader {
  background: rgba(15, 10, 30, 0.8);
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 16px;
  padding: 40px;
  backdrop-filter: blur(20px);
}

.article-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.article-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  color: #94a3b8;
  font-size: 0.9rem;
}

.category {
  color: var(--primary);
}

.article-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #fff, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: #cbd5e1;
}

/* Mockup Markdown Styling */
.markdown-body {
  color: #e2e8f0;
  line-height: 1.7;
}

.markdown-body h2 {
  font-size: 1.8rem;
  margin: 30px 0 15px 0;
  color: #fff;
}

.markdown-body h3 {
  font-size: 1.4rem;
  margin: 25px 0 15px 0;
  color: #fff;
}

.markdown-body p {
  margin-bottom: 20px;
  font-size: 1.05rem;
}

.code-block {
  background: #0d0914;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  margin: 20px 0;
  overflow: hidden;
}

.code-header {
  background: rgba(255,255,255,0.05);
  padding: 5px 15px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #94a3b8;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.code-block pre {
  padding: 15px;
  margin: 0;
  overflow-x: auto;
}

.code-block code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  color: #a5b4fc;
}

.article-tip {
  background: rgba(147, 51, 234, 0.1);
  border-left: 4px solid var(--primary-dark);
  padding: 15px 20px;
  border-radius: 0 8px 8px 0;
  margin: 30px 0;
  color: #f8fafc;
}

.article-tip strong {
  color: #c084fc;
}

@media (max-width: 768px) {
  .article-reader {
    padding: 20px;
  }
  
  .article-header h1 {
    font-size: 2rem;
  }
}
</style>
