import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import AdminView from '@/views/AdminView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import AccessDeniedView from '@/views/AccessDeniedView.vue'
import FacebookCallback from '@/components/FacebookCallback.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
      meta: { requiresAuth: false, guestOnly: true },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false, guestOnly: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false, guestOnly: true },
    },
    {
      path: '/facebook-callback',
      name: 'facebook-callback',
      component: FacebookCallback,
      meta: { requiresAuth: false, guestOnly: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/access-denied',
      name: 'access-denied',
      component: AccessDeniedView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return next('/access-denied')
  }

  if (to.path == '/' && userStore.isLoggedIn) {
    return next('/home')
  }

  if (to.meta.guestOnly && userStore.isLoggedIn) {
    return next('/access-denied')
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return next('/access-denied')
  }

  next()
})

export default router
