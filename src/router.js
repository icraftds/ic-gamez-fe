import { ssoEnabled, loadSsoSession } from './services/sso'
import { startAuthLoading, stopAuthLoading, redirectToSso, isRedirectingToSso } from './composables/useUserAccount'
import { useNotifications } from './composables/useNotifications'
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

const router = createRouter({
  // Build-time prerendering (scripts/prerender.mjs) runs without a browser.
  history: import.meta.env.SSR ? createMemoryHistory(import.meta.env.BASE_URL) : createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/LoginView.vue')
    },
    {
      path: '/auto-login',
      name: 'auto-login',
      component: () => import('./views/AutoLoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/RegisterView.vue')
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: () => import('./views/WorkspaceView.vue')
    },
    {
      path: '/learning',
      name: 'learning',
      component: () => import('./views/LearningView.vue')
    },
    {
      path: '/challenges',
      name: 'challenges',
      component: () => import('./views/ChallengesView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('./views/NotificationsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/learning/:pathId',
      name: 'path-detail',
      component: () => import('./views/PathDetailView.vue')
    },
    {
      path: '/learn',
      redirect: '/learning'
    },
    {
      path: '/learn/path/:pathId',
      redirect: to => `/learning/${to.params.pathId}`
    },
    {
      path: '/learning/:pathId/lesson/:chapterId/:lessonId',
      name: 'lesson',
      component: () => import('./views/LessonView.vue')
    },
    {
      path: '/encyclopedia/:slug?',
      name: 'encyclopedia',
      component: () => import('./views/EncyclopediaView.vue'),
      // Keep the view mounted while switching articles (only :slug changes)
      meta: { stableKey: true }
    },
    {
      path: '/cheatsheet',
      name: 'cheatsheet',
      component: () => import('./views/CheatsheetView.vue')
    },
    {
      path: '/cheatsheet/:slug',
      name: 'cheatsheet-reader',
      component: () => import('./views/CheatsheetReaderView.vue')
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('./views/ShopView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/shop/checkout',
      name: 'shop-checkout',
      component: () => import('./views/ShopCheckoutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('./views/LeaderboardView.vue')
    },
    {
      path: '/coderz/:slug',
      name: 'visit-profile',
      component: () => import('./views/VisitProfileView.vue')
    },
    {
      path: '/profile',
      redirect: '/profile/edit'
    },
    {
      path: '/profile/edit',
      name: 'profile-edit',
      component: () => import('./views/ProfileEditView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('./views/PricingView.vue')
    },
    {
      path: '/developer',
      name: 'developer',
      component: () => import('./views/DeveloperView.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('./views/CheckoutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/payment/success',
      name: 'payment-success',
      component: () => import('./views/PaymentSuccessView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/materials',
      name: 'materials',
      component: () => import('./views/MaterialsView.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('./views/FaqView.vue')
    },
    {
      path: '/panduan',
      alias: '/guide',
      name: 'guide',
      component: () => import('./views/GuideView.vue')
    },
    {
      path: '/hubungi-kami',
      alias: '/contact',
      name: 'contact',
      component: () => import('./views/ContactView.vue')
    },
    {
      path: '/tentang-kami',
      alias: '/about',
      name: 'about',
      component: () => import('./views/AboutView.vue')
    },
    {
      path: '/kebijakan-privasi',
      alias: '/privacy',
      name: 'privacy',
      component: () => import('./views/PrivacyView.vue')
    },
    {
      path: '/syarat-ketentuan',
      alias: '/terms',
      name: 'terms',
      component: () => import('./views/TermsView.vue')
    },
    {
      // Must stay last. Prerendered to dist/404.html, which Vercel serves with HTTP 404.
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('./views/NotFoundView.vue')
    }
  ]
})

const AUTO_SSO_COOLDOWN_MS = 10000
const AUTO_SSO_STORAGE_KEY = 'gamez_auto_sso_ts'

function canAutoRedirectToSso(from) {
  if (isRedirectingToSso.value) return false
  if (from.matched.length > 0 || typeof window === 'undefined') return true
  try {
    const lastTs = Number(sessionStorage.getItem(AUTO_SSO_STORAGE_KEY) || 0)
    if (lastTs && Date.now() - lastTs < AUTO_SSO_COOLDOWN_MS) {
      sessionStorage.removeItem(AUTO_SSO_STORAGE_KEY)
      return false
    }
    sessionStorage.setItem(AUTO_SSO_STORAGE_KEY, String(Date.now()))
  } catch { /* Ignore storage restrictions. */ }
  return true
}

router.beforeEach(async (to, from, next) => {
  // Prerendering only renders public pages as a logged-out visitor; auth guards run in the browser.
  if (import.meta.env.SSR) return next()
  if (['login', 'register', 'auto-login'].includes(to.name)) {
    if (ssoEnabled) {
      if (!isRedirectingToSso.value) {
        const target = typeof to.query.redirect === 'string' ? to.query.redirect : '/dashboard'
        redirectToSso(target, to.name === 'register' ? 'daftar' : 'masuk')
      }
      return next(false)
    }
    if (to.name === 'register') {
      startAuthLoading({ text: 'Memuat pendaftaran akun' })
    } else {
      startAuthLoading({ text: 'Memuat autentikasi masuk' })
    }
  }

  if (ssoEnabled) {
    if (to.meta.requiresAuth) {
      try {
        if (!await loadSsoSession()) {
          if (canAutoRedirectToSso(from)) {
            redirectToSso(to.fullPath, 'masuk')
            return next(false)
          }
          return next()
        }
        try { sessionStorage.removeItem(AUTO_SSO_STORAGE_KEY) } catch { /* Ignore storage restrictions. */ }
      } catch {
        if (from.matched.length === 0) return next()
        return next(false)
      }
    }
    return next()
  }
  const token = localStorage.getItem('auth_token')
  if (to.meta.requiresAuth && !token) {
    startAuthLoading({ text: 'Memuat autentikasi masuk' })
    next('/login')
  } else {
    next()
  }
})

router.afterEach((to) => {
  if (import.meta.env.SSR) return
  // Auth views (login / register) dismiss authLoading explicitly via finishAuthLoading()
  // once their component is mounted on screen so the user never gets stuck on the previous page.
  if (!['login', 'register', 'auto-login'].includes(to.name)) {
    stopAuthLoading()
  } else {
    // Safety fallback in case the route view fails to mount
    setTimeout(() => {
      stopAuthLoading()
    }, 2500)
  }

  // Refresh notification summary on navigation
  const { fetchUnreadSummary } = useNotifications()
  fetchUnreadSummary()
})

export default router
