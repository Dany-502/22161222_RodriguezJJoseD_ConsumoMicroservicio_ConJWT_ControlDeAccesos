<template>
  <div class="no-access-container">
    <div class="no-access-card">
      <h1 class="no-access-title">Sección restringida</h1>
      <p class="no-access-message">
        Tu rol actual (<strong>{{ authStore.user?.role || 'sin rol' }}</strong>) no tiene permisos
        para acceder a esta sección o no cuenta con módulos habilitados.
      </p>
      <RouterLink
        v-if="defaultRoute !== '/sin-acceso'"
        :to="defaultRoute"
        class="btn-back"
      >
        Ir a mi sección permitida
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'NoAccessView' })

import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
const defaultRoute = computed(() => authStore.getDefaultRoute())
</script>

<style scoped>
.no-access-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.no-access-card {
  max-width: 440px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}

.no-access-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.no-access-message {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.btn-back {
  display: inline-block;
  padding: 0.65rem 1.25rem;
  background-color: #111111;
  color: #ffffff;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
}

.btn-back:hover {
  background-color: #333333;
}
</style>

