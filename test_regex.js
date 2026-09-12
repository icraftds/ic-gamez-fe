const str = '<div class="code-block"><div class="code-header">python</div><pre><code># Inisialisasi hash map (dictionary di Python)\nmy_map = {}\n\n# Menyisipkan nilai\nmy_map["apple"] = 100</code></pre></div>';
const replaced = str.replace(/<div class="code-block">\s*<div class="code-header">(.*?)<\/div>\s*<pre>\s*<code>([\s\S]*?)<\/code>\s*<\/pre>\s*<\/div>/gi, "```$1\n$2\n```");
console.log(replaced);
