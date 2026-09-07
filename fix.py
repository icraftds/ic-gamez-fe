import re

with open('frontend/src/views/HomeView.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove all existing script tags and the weird trailing div
content = re.sub(r'<script setup>.*?</script>', '', content, flags=re.DOTALL)
content = content.replace('<!-- Scripts -->\n    \n    </div>', '<!-- Scripts -->\n  </div>\n</template>\n\n<script setup>\nimport BackgroundEffects from \'../components/common/BackgroundEffects.vue\'\n</script>\n')

# Clean up any weird <BackgroundEffects> injected randomly
content = re.sub(r'<BackgroundEffects[^>]*>', '', content)

# Inject <BackgroundEffects> at the top
content = content.replace('<div class="home-view">\n', '<div class="home-view">\n    <BackgroundEffects :show-orb3="true" />\n')

with open('frontend/src/views/HomeView.vue', 'w', encoding='utf-8') as f:
    f.write(content)
    
# Now for WorkspaceView.vue
with open('frontend/src/views/WorkspaceView.vue', 'r', encoding='utf-8') as f:
    wcontent = f.read()

wcontent = wcontent.replace('<div class="workspace-view">\n    <TopBar />', '<div class="workspace-view">\n    <BackgroundEffects />\n    <TopBar />')
wcontent = wcontent.replace("import TopBar from '../components/TopBar.vue'", "import BackgroundEffects from '../components/common/BackgroundEffects.vue'\nimport TopBar from '../components/TopBar.vue'")

with open('frontend/src/views/WorkspaceView.vue', 'w', encoding='utf-8') as f:
    f.write(wcontent)
