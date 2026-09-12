import { marked } from 'marked';

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
});

const str = '<h3>Contoh Kode (Python)</h3><div class="code-block"><div class="code-header">python</div><pre><code># Inisialisasi hash map (dictionary di Python)\nmy_map = {}\n\n# Menyisipkan nilai\nmy_map["apple"] = 100</code></pre></div>';

let content = str.replace(/<div class="code-block">\s*<div class="code-header">(.*?)<\/div>\s*<pre>\s*<code>([\s\S]*?)<\/code>\s*<\/pre>\s*<\/div>/gi, "\n\n```$1\n$2\n```\n\n");

console.log("REPLACED STRING:\n", content);
console.log("----------------------");
console.log("MARKED OUTPUT:\n", marked.parse(content));
