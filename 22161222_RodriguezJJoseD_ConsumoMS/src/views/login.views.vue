<template>
  <div class="loginPage">
    <div class="loginCard">
      <div class="loginHeader">
        <h1 class="loginTitle">Iniciar sesión</h1>
        <p class="loginSubtitle">Accede con tu usuario o correo</p>
      </div>

      <div v-if="errorMessage" class="loginAlert">
        <span>{{ errorMessage }}</span>
      </div>

      <form class="loginForm" @submit.prevent="handleSubmit">
        <div class="formGroup">
          <label for="identifier" class="formLabel">Usuario o correo electrónico</label>
          <input
            id="identifier"
            v-model.trim="identifier"
            type="text"
            class="formInput"
            placeholder="Ej. jose2003@gmail.com"
            autocomplete="username"
            required
          />
        </div>

        <div class="formGroup">
          <label for="password" class="formLabel">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="formInput"
            placeholder="Ingresa tu contraseña"
            autocomplete="current-password"
            required
          />
        </div>

        <button type="submit" class="btnLogin" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Iniciando sesión...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'LoginView' })

import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const identifier = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''

  if (!identifier.value || !password.value) {
    errorMessage.value = 'Debes ingresar tu usuario/correo y contraseña.'
    return
  }

  const result = await authStore.login(identifier.value, password.value)
  if (!result.success) {
    errorMessage.value = result.message
    return
  }

  const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : ''
  if (redirectPath) {
    router.push(redirectPath)
    return
  }

  router.push(authStore.getDefaultRoute())
}
</script>

<style scoped>
.loginPage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: #f8fafc;
}

.loginCard {
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.loginHeader {
  margin-bottom: 1.5rem;
}

.loginTitle {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111111;
  margin-bottom: 0.35rem;
}

.loginSubtitle {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.4;
}

.loginAlert {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
}

.loginForm {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.formLabel {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.formInput {
  width: 100%;
  padding: 0.65rem 0.75rem;
  font-size: 0.95rem;
  color: #111111;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.15s ease;
}

.formInput:focus {
  border-color: #111111;
}

.btnLogin {
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #111111;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btnLogin:hover:not(:disabled) {
  background-color: #2d2d2d;
}

.btnLogin:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>

