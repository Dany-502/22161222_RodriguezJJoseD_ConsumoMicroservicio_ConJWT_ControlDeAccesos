<template>
  <aside class="dashboard-sidebar">
    <div class="sidebar-brand">
      <div class="brand-text">
        <h2>Prueba de microservicio</h2>
      </div>
    </div>

    <nav class="sidebar-nav">
      <template v-for="item in navItems" :key="item.to">
        <RouterLink
          v-if="authStore.hasRole(...item.roles)"
          :to="item.to"
          class="nav-item"
          active-class="active"
        >
          <span class="nav-label">{{ item.label }}</span>
        </RouterLink>

        <div
          v-else
          class="nav-item nav-item--locked"
          aria-disabled="true"
          :title="item.lockHint"
        >
          <span class="nav-label">{{ item.label }}</span>
        </div>
      </template>
    </nav>

    <div class="sidebar-footer">
      <div v-if="authStore.user" class="user-session">
        <p class="user-name">{{ authStore.user.username }}</p>
        <p class="user-role">Rol: {{ authStore.user.role }}</p>
      </div>
      <button type="button" class="btn-logout" @click="handleLogout">
        Cerrar sesión
      </button>
    </div>
  </aside>
</template>

<script setup>
defineOptions({ name: 'SidebarComponent' })

import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  {
    to: '/usuarios',
    label: 'Usuarios',
    roles: ['admin'],
    lockHint: 'Sección restringida: requiere rol admin',
  },
  {
    to: '/roles',
    label: 'Roles',
    roles: ['admin'],
    lockHint: 'Sección restringida: requiere rol admin',
  },
  {
    to: '/employees',
    label: 'Empleados',
    roles: ['admin', 'manager'],
    lockHint: 'Sección restringida: requiere rol admin o manager',
  },
]

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.dashboard-sidebar {
  width: 250px;
  background-color: #111111;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1.5rem 1rem;
  border-right: 1px solid #222222;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #222222;
  margin-bottom: 1.5rem;
}

.brand-text h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #999999;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.nav-item:hover {
  background-color: #222222;
  color: #ffffff;
}

.nav-item.active {
  background-color: #333333;
  color: #ffffff;
  font-weight: 600;
}

.nav-item--locked {
  color: #6b7280;
  opacity: 0.55;
  cursor: not-allowed;
  user-select: none;
}

.nav-item--locked:hover {
  background-color: transparent;
  color: #6b7280;
}

.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid #222222;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-session {
  text-align: left;
  padding: 0.25rem 0.25rem;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
}

.user-role {
  font-size: 0.78rem;
  color: #9ca3af;
}

.btn-logout {
  width: 100%;
  padding: 0.6rem 0.75rem;
  background-color: #222222;
  color: #ffffff;
  border: 1px solid #333333;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-logout:hover {
  background-color: #dc2626;
  border-color: #dc2626;
}
</style>
