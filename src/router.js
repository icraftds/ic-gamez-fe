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
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('./views/LeaderboardView.vue')
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('./views/PricingView.vue')
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
