import re

# HomeView
with open('frontend/src/views/HomeView.vue', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'<a([^>]*?)href="/workspace([^"]*)"([^>]*)>', r'<router-link\1to="/workspace\2"\3>', content)
# Be careful replacing all </a> to </router-link>
# We only replace </a> that correspond to router-links we created. A safer regex:
# Actually, the a tags in HomeView that go to /workspace are all "btn-start" and others.
content = content.replace('href="/"', 'to="/"')
content = content.replace('<a ', '<router-link ').replace('</a>', '</router-link>')
content = content.replace('<router-link href=', '<router-link to=')

with open('frontend/src/views/HomeView.vue', 'w', encoding='utf-8') as f:
    f.write(content)

# WorkspaceView
with open('frontend/src/views/WorkspaceView.vue', 'r', encoding='utf-8') as f:
    w_content = f.read()
    
# Replace <a href="/"> with <router-link to="/">
w_content = w_content.replace('href="/"', 'to="/"')
w_content = w_content.replace('<a ', '<router-link ').replace('</a>', '</router-link>')

with open('frontend/src/views/WorkspaceView.vue', 'w', encoding='utf-8') as f:
    f.write(w_content)
