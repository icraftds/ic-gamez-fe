import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
