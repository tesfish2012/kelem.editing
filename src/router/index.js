import { createRouter, createWebHistory } from 'vue-router'
import PROTECTED_ROUTES from './protected'
import USER_ROUTES from './/protected/userIndex'                
import OPEN_ROUTES from './open'
import { useMainStore } from '@/stores'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...OPEN_ROUTES,
    ...PROTECTED_ROUTES,
    ...USER_ROUTES,                           

    {
      path: '/404resource/:resource',
      name: '404resource',
      component: () => import('@/views/NotFound.vue'),
      props: true,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'NetworkError',
      component: () => import('@/views/NetworkError.vue'),
      meta: {
        requiresAuth: false,
        title: 'Network error'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
      meta: { requiresAuth: false }
    }
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash }
    } else {
      return { top: 0, left: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const mainStore = useMainStore()
  mainStore.setLoading(true)

  const { requiresAuth, role } = to.meta
  const authStore = useAuthStore()

  if (!requiresAuth) {
    return next()
  }

  if (authStore.isAuthenticated()) {
    if (authStore.expiryDate()) {
      return next({ name: 'login' })
    }

    // ✅ supports both: role: 'admin' and role: ['admin','staff']
    if (!role) {
      return next()
    }

    const hasPermission = authStore.userHasPermission(role)

    if (hasPermission) {
      return next()
    }

    return next({ name: 'login' })
  }

  return next({ name: 'login', params: { nextUrl: to.fullPath } })
})

router.afterEach(() => {
  const mainStore = useMainStore()
  mainStore.setLoading(false)
})

export default router
