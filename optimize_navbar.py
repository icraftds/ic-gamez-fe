import os

# 1. Read both CSS files
old_css_path = 'src/assets/css/components/HomeNavbar.css'
new_css_path = 'src/assets/css/components/home/HomeNavbar.css'

with open(old_css_path, 'r', encoding='utf-8') as f:
    old_css = f.read()

with open(new_css_path, 'r', encoding='utf-8') as f:
    new_css = f.read()

# 2. Add classes for inline styles
inline_css = '''
.nav-shop-btn {
  background: transparent;
  border: none;
  color: #fbbf24;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
  margin-right: 15px;
}
.nav-shop-btn:hover {
  transform: scale(1.1);
}
.dropdown-trigger {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.dropdown-icon {
  margin-left: 8px;
  font-size: 0.8rem;
  color: #6b7280;
}
'''

# 3. Merge them into the new CSS file
merged_css = old_css + '\n' + new_css + '\n' + inline_css
with open(new_css_path, 'w', encoding='utf-8') as f:
    f.write(merged_css)

# 4. Remove the old CSS file
if os.path.exists(old_css_path):
    os.remove(old_css_path)

# 5. Update HomeNavbar.vue
vue_path = 'src/components/home/HomeNavbar.vue'
with open(vue_path, 'r', encoding='utf-8') as f:
    vue_content = f.read()

# Remove inline styles
vue_content = vue_content.replace('style="background: transparent; border: none; color: #fbbf24; font-size: 1.2rem; cursor: pointer; transition: transform 0.2s; margin-right: 15px;"', '')
vue_content = vue_content.replace('class="nav-btn shop-btn"', 'class="nav-btn shop-btn nav-shop-btn"')
vue_content = vue_content.replace('class="dropdown-container" @click="showUserDropdown = !showUserDropdown" style="position: relative; display: flex; align-items: center; cursor: pointer;"', 'class="dropdown-container dropdown-trigger" @click="showUserDropdown = !showUserDropdown"')
vue_content = vue_content.replace('style="margin-left: 8px; font-weight: 600;"', '')
vue_content = vue_content.replace('class="fa-solid fa-chevron-down" style="margin-left: 8px; font-size: 0.8rem; color: #6b7280;"', 'class="fa-solid fa-chevron-down dropdown-icon"')

# Remove old style import
vue_content = vue_content.replace('<style src="../../assets/css/components/HomeNavbar.css" scoped></style>\n', '')
vue_content = vue_content.replace('<style src="../../assets/css/components/HomeNavbar.css" scoped></style>\r\n', '')
vue_content = vue_content.replace('<style src="../../assets/css/components/HomeNavbar.css" scoped></style>', '')

with open(vue_path, 'w', encoding='utf-8') as f:
    f.write(vue_content)

print('Optimization complete!')
