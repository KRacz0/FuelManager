import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import AccessDeniedView from '@/views/AccessDeniedView.vue'
import MapView from '@/views/MapView.vue'
import ListView from '@/views/ListView.vue'
import AddStationView from '@/views/AddStationView.vue'
import ManageProposalsView from '@/views/ManageProposalsView.vue'
import ManageUsersView from '@/views/ManageUsersView.vue'

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
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
      meta: { requiresAuth: true },
    },
    {
      path: '/list',
      name: 'list',
      component: ListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/add-station',
      name: 'add-station',
      component: AddStationView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/manage-proposals',
      name: 'manage-proposals',
      component: ManageProposalsView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/manage-users',
      name: 'manage-users',
      component: ManageUsersView,
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
