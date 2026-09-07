import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import WorkspaceView from './views/WorkspaceView.vue'
import PathDetailView from './views/PathDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: WorkspaceView
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
      component: () => import('./views/DashboardView.vue')
    },
    {
      path: '/learning/:pathId',
      name: 'path-detail',
      component: PathDetailView
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
    }
  ]
})

export default router
