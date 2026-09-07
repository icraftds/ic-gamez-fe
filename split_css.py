import re

with open('src/style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

base_css = []
layout_css = []
components_css = []
pages_css = []

current_section = 'base'

for i, line in enumerate(lines):
    if '/* Background Effects */' in line:
        current_section = 'pages'
    elif '/* Navbar */' in line:
        current_section = 'layout'
    elif '/* Container */' in line:
        current_section = 'layout'
    elif '/* Hero Section */' in line:
        current_section = 'pages'
    elif '/* Intro / Mockup Section */' in line:
        current_section = 'pages'
    elif '/* Grid Header */' in line:
        current_section = 'pages'
    elif '/* Uniform Card Perspective Styling */' in line:
        current_section = 'components'
    elif '/* Coffee Modal CSS */' in line:
        current_section = 'components'
    elif '/* Reveal Utils */' in line:
        current_section = 'base'
    elif '/* Leaderboard Styles */' in line:
        current_section = 'pages'
    elif '/* --- Workspace CSS --- */' in line:
        current_section = 'pages'
        
    if current_section == 'base':
        base_css.append(line)
    elif current_section == 'layout':
        layout_css.append(line)
    elif current_section == 'components':
        components_css.append(line)
    elif current_section == 'pages':
        pages_css.append(line)

with open('src/assets/css/base.css', 'w', encoding='utf-8') as f:
    f.writelines(base_css)
    
with open('src/assets/css/layout.css', 'w', encoding='utf-8') as f:
    f.writelines(layout_css)
    
with open('src/assets/css/components.css', 'w', encoding='utf-8') as f:
    f.writelines(components_css)
    
with open('src/assets/css/pages.css', 'w', encoding='utf-8') as f:
    f.writelines(pages_css)
    
with open('src/style.css', 'w', encoding='utf-8') as f:
    f.write('@import "./assets/css/base.css";\n')
    f.write('@import "./assets/css/layout.css";\n')
    f.write('@import "./assets/css/components.css";\n')
    f.write('@import "./assets/css/pages.css";\n')
