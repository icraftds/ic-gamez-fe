import { ssoEnabled, loadSsoSession } from './services/sso'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      path: '/learning/:pathId',
      name: 'path-detail',
      component: () => import('./views/PathDetailView.vue')
    },
    {
      path: '/learning/:pathId/lesson/:chapterId/:lessonId',
      name: 'lesson',
      component: () => import('./views/LessonView.vue')
    },
    {
      path: '/encyclopedia',
      name: 'encyclopedia',
      component: () => import('./views/EncyclopediaView.vue')
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
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (ssoEnabled) {
    if (['login', 'register', 'auto-login'].includes(to.name)) {
      const target = typeof to.query.redirect === 'string' ? to.query.redirect : '/dashboard'
      window.location.replace('/auth/start?return_to=' + encodeURIComponent(target))
      return next(false)
    }
    if (to.meta.requiresAuth) {
      try {
        if (!await loadSsoSession()) {
          window.location.assign('/auth/start?return_to=' + encodeURIComponent(to.fullPath))
          return next(false)
        }
      } catch { return next(false) }
    }
    return next()
  }
  const token = localStorage.getItem('auth_token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
