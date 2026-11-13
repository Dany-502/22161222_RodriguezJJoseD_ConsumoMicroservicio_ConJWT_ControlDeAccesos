import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import LoginView from '@/views/login.views.vue'
import UsuariosView from '@/views/usuarios.views.vue'
import RolesView from '@/views/roles.views.vue'
import EmployeesView from '@/views/employees.views.vue'
import NoAccessView from '@/views/noAccess.views.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        const authStore = useAuthStore()
        return authStore.isAuthenticated ? authStore.getDefaultRoute() : '/login'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true }
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: UsuariosView,
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/roles',
      name: 'roles',
      component: RolesView,
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/employees',
      name: 'employees',
      component: EmployeesView,
      meta: { requiresAuth: true, roles: ['admin', 'manager'] }
    },
    {
      path: '/sin-acceso',
      name: 'no-access',
      component: NoAccessView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath }
      }
    }

    if (!authStore.user) {
      const valid = await authStore.verifySession()
      if (!valid) {
        return {
          name: 'login',
          query: { redirect: to.fullPath }
        }
      }
    }

    if (to.meta.roles && !authStore.hasRole(...to.meta.roles)) {
      const defaultRoute = authStore.getDefaultRoute()
      return to.path === defaultRoute ? '/sin-acceso' : defaultRoute
    }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    if (!authStore.user) {
      const valid = await authStore.verifySession()
      if (!valid) return true
    }
    return authStore.getDefaultRoute()
  }

  return true
})

export default router

