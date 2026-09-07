import re
import os

os.makedirs('frontend/src/views', exist_ok=True)

# Process HomeView
with open('icgamez.html', 'r', encoding='utf-8') as f:
    html = f.read()

body_match = re.search(r'<body>(.*?)</body>', html, re.DOTALL)
if body_match:
    body_content = body_match.group(1)
    # Remove fixed-bg
    body_content = re.sub(r'<div class="fixed-bg">.*?</div>', '', body_content, flags=re.DOTALL)
    # Remove script tags
    body_content = re.sub(r'<script.*?</script>', '', body_content, flags=re.DOTALL)
    # Fix links
    body_content = body_content.replace('href="icgamez-workspace.html?stage=', 'href="/workspace?stage=')
    
    vue_file = '<template>\n  <div class="home-view">\n' + body_content + '  </div>\n</template>\n\n<script setup>\nimport { onMounted } from "vue";\n</script>\n'
    with open('frontend/src/views/HomeView.vue', 'w', encoding='utf-8') as f:
        f.write(vue_file)

# Process WorkspaceView
with open('icgamez-workspace.html', 'r', encoding='utf-8') as f:
    html = f.read()

body_match = re.search(r'<body>(.*?)</body>', html, re.DOTALL)
if body_match:
    body_content = body_match.group(1)
    body_content = re.sub(r'<div class="fixed-bg">.*?</div>', '', body_content, flags=re.DOTALL)
    body_content = re.sub(r'<script.*?</script>', '', body_content, flags=re.DOTALL)
    
    # We will need to make links router-links or handle navigation correctly.
    body_content = body_content.replace('href="icgamez.html"', 'href="/"')
    
    vue_file = '<template>\n  <div class="workspace-view">\n' + body_content + '  </div>\n</template>\n\n<script setup>\n</script>\n'
    with open('frontend/src/views/WorkspaceView.vue', 'w', encoding='utf-8') as f:
        f.write(vue_file)
