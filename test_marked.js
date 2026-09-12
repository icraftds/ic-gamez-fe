import { marked } from 'marked';

marked.use({
  renderer: {
    code(token) {
      const lang = token.lang || 'text';
      return `<div class="code-block"><div class="code-header">${lang}</div><pre><code>${token.text}</code></pre></div>`;
    }
  }
});

console.log(marked.parse('```javascript\nconst a = 1;\n```'));
