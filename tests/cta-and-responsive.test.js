import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const read = (relPath) => fs.readFileSync(path.join(rootDir, relPath), 'utf8')

test('CTA fixes: auth fallbacks, removed broken upgradeToPremium, and fixed links/tabs', () => {
  const userAccount = read('src/composables/useUserAccount.js')
  assert.match(userAccount, /export function getAuthHref/)
  assert.match(userAccount, /if \(!ssoEnabled\)/)
  assert.doesNotMatch(read('src/components/challenges/ChallengesSidebar.vue'), /\bupgradeToPremium\b/)
  assert.doesNotMatch(read('src/views/DashboardView.vue'), /\bupgradeToPremium\b/)

  const intro = read('src/components/home/IntroSection.vue')
  assert.doesNotMatch(intro, /to="#"/)
  assert.match(intro, /to="\/panduan"/)

  const premiumModal = read('src/components/common/PremiumModal.vue')
  assert.doesNotMatch(premiumModal, /\/\?auth=login/)
  assert.match(premiumModal, /<Teleport to="body">/)
  assert.match(premiumModal, /redirectToSso\(/)

  const authModal = read('src/components/common/AuthRequiredModal.vue')
  assert.match(authModal, /<Teleport to="body">/)
  assert.match(authModal, /route\.fullPath/)

  const contact = read('src/views/ContactView.vue')
  assert.match(contact, /userProfile/)
  assert.doesNotMatch(contact, /\bconst\s*\{\s*user\b/)

  assert.match(read('src/components/dashboard/DashboardBorders.vue'), /\/shop\?tab=border/)
  assert.match(read('src/views/ShopView.vue'), /\['module',\s*'energy',\s*'border',\s*'item'\]\.includes\(route\.query\.tab\)/)

  const daily = read('src/components/challenges/tabs/ChallengeDaily.vue')
  assert.match(daily, /emit\('require-auth'\)/)
  assert.doesNotMatch(daily, /router\.push\('\/login'\)/)
})

test('Workspace & Lesson CTAs: weekly challenge sync, editor reset, topbar title, step locks', () => {
  const store = read('src/stores/challengeStore.js')
  assert.match(store, /this\.mode === 'weekly'/)
  assert.match(store, /getActiveWeekly\(\)/)
  assert.match(store, /\/progress\/practice-complete/)
  assert.match(store, /resetCode\(\)/)

  const editor = read('src/components/workspace/EditorPanel.vue')
  assert.match(editor, /v-model="store\.language"/)
  assert.match(editor, /@click="store\.resetCode\(\)"/)

  const topBar = read('src/components/TopBar.vue')
  assert.match(topBar, /raw\.includes\('\. '\)/)

  const lessonView = read('src/views/LessonView.vue')
  assert.match(lessonView, /const initStepFromQuery = \(\) => \{[\s\S]*if \(!isLoggedIn\.value\)[\s\S]*!lesson\.isCompleted[\s\S]*!lesson\.quizPassed/)
  assert.match(read('src/components/workspace/WorkspaceSidebar.vue'), /chapter\.slug \|\| String\(chapter\.id\)/)
})

test('Responsiveness & z-index guards: mobile scrolling, overlays, popups, dashboard dock', () => {
  const appCss = read('src/assets/css/App.css')
  assert.match(appCss, /@media\s*\(max-width:\s*768px\)[\s\S]*\.app-layout\.workspace-mode[\s\S]*overflow-y:\s*visible/)

  const lessonCss = read('src/assets/css/views/LessonView.css')
  assert.match(lessonCss, /@media\s*\(max-width:\s*768px\)[\s\S]*\.lesson-workspace\s*\{[\s\S]*height:\s*auto;[\s\S]*overflow-y:\s*visible;/)

  const pagesCss = read('src/assets/css/pages.css')
  assert.match(pagesCss, /@media\s*\(max-width:\s*1024px\)[\s\S]*\.workspace-view\s*\{[\s\S]*height:\s*auto;[\s\S]*\.action-bar\s*\{\s*flex-wrap:\s*wrap;/)

  const practiceCss = read('src/assets/css/components/workspace/PracticePanel/PracticePanel.css')
  assert.match(practiceCss, /@media\s*\(max-width:\s*768px\)[\s\S]*\.editor-topbar\s*\{[\s\S]*flex-wrap:\s*wrap;/)

  const premiumCss = read('src/assets/css/components/common/PremiumModal.css')
  assert.match(premiumCss, /z-index:\s*10020/)
  assert.match(premiumCss, /calc\(100vw - 24px\)/)

  const authCss = read('src/assets/css/components/common/AuthRequiredModal.css')
  assert.match(authCss, /z-index:\s*10020/)
  assert.match(authCss, /calc\(100vw - 24px\)/)

  const appToast = read('src/components/common/AppToast.vue')
  assert.match(appToast, /max-width:\s*calc\(100vw - 24px\)/)

  const trophyPopup = read('src/components/dashboard/NewTrophyPopup.vue')
  const medalPopup = read('src/components/dashboard/NewMedalPopup.vue')
  assert.match(trophyPopup, /@media\s*\(max-width:\s*480px\)/)
  assert.match(medalPopup, /@media\s*\(max-width:\s*480px\)/)

  const dashVue = read('src/views/DashboardView.vue')
  assert.match(dashVue, /mobile-dash-utils/)
  assert.match(dashVue, /padding:\s*16px 16px 96px/)

  const inventory = read('src/components/dashboard/DashboardInventory.vue')
  assert.match(inventory, /<div class="item-icon">/)

  const lbCss = read('src/assets/css/components/LeaderboardTable.css')
  assert.match(lbCss, /\.hud-center\s*\{[\s\S]*position:\s*relative;/)
  assert.match(lbCss, /\.ct-name\s*\{[\s\S]*text-overflow:\s*ellipsis;/)

  const vpCss = read('src/assets/css/views/VisitProfileView.css')
  assert.match(vpCss, /@media\s*\(max-width:\s*600px\)[\s\S]*\.vp-rank-grid\s*\{\s*grid-template-columns:\s*1fr;/)

  assert.match(read('src/components/challenges/tabs/ChallengeAnnual.vue'), /flex-wrap:\s*wrap/)
  assert.match(read('src/components/challenges/tabs/ChallengeWeekly.vue'), /flex-wrap:\s*wrap/)
})
