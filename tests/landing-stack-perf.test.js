import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

test('Landing LearningPathCard avoids cascading backdrop-filter and permanent will-change', () => {
  const cardCss = fs.readFileSync(
    path.join(rootDir, 'src/assets/css/components/home/LearningPathCard.css'),
    'utf8'
  )
  const stackVue = fs.readFileSync(
    path.join(rootDir, 'src/components/home/LearningPathStack.vue'),
    'utf8'
  )

  assert.doesNotMatch(cardCss, /backdrop-filter:/i)
  assert.doesNotMatch(cardCss, /will-change:\s*transform/i)
  assert.match(cardCss, /contain:\s*layout style paint/i)
  assert.match(cardCss, /\.is-occluded/)
  assert.match(stackVue, /isCardOccluded/)
  assert.match(stackVue, /passive:\s*true/)
})

test('HomeView renders LearningPathShowcase, removes extra reference gallery, and keeps LearningPathStack disabled in comment', () => {
  const homeVue = fs.readFileSync(path.join(rootDir, 'src/views/HomeView.vue'), 'utf8')
  const showcaseVue = fs.readFileSync(path.join(rootDir, 'src/components/home/LearningPathShowcase.vue'), 'utf8')

  const showcaseCss = fs.readFileSync(
    path.join(rootDir, 'src/assets/css/components/home/LearningPathShowcase.css'),
    'utf8'
  )

  assert.match(homeVue, /<LearningPathShowcase\s*\/>/)
  assert.match(homeVue, /<!--[\s\S]*<LearningPathStack\s*\/>[\s\S]*-->/)
  assert.doesNotMatch(homeVue, /LearningPathReferences/)
  assert.equal(fs.existsSync(path.join(rootDir, 'src/components/home/references')), false)
  assert.equal(fs.existsSync(path.join(rootDir, 'src/components/home/LearningPathStack.vue')), true)
  assert.match(showcaseVue, /mini-sandbox/)
  assert.match(showcaseVue, /runSimulation/)
  assert.match(showcaseVue, /stage-step-controls/)
  assert.match(showcaseCss, /@media\s*\(max-width:\s*960px\)[\s\S]*\.track-rail-column\s*\{\s*display:\s*none;/)
})
