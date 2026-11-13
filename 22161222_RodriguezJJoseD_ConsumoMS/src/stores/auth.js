import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loginUser, getCurrentUser } from '@/services/auth.services.js'

const TOKEN_KEY = 'auth_token'  // llave que va a buscar el token en el local storage
const EXPIRES_KEY = 'auth_expires_in' // llave que va a buscar el tiempo de expiracion en el local storage

//  Datos se van a almacenar en memoria y en el local storage para que persistan entre sesiones
export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '') // token de autenticacion
  const user = ref(null) // usuario autenticado
  const expiresIn = ref(localStorage.getItem(EXPIRES_KEY) || '') // tiempo de expiracion del token
  const isLoading = ref(false) // estado de carga

  const isAuthenticated = computed(() => Boolean(token.value)) // booleano que indica si el usuario esta autenticado

  // Funcion que guarda los datos de la sesion en el local storage
  function setSession(data) {
    // obtenemos los datos de la sesion
    token.value = data.accessToken || '' // obtenemos el token de autenticacion
    user.value = data.user || null // obtenemos el usuario autenticado
    expiresIn.value = data.expiresIn || '' // obtenemos el tiempo de expiracion del token

    // guardamos los datos de la sesion en el local storage
    if (token.value) { // si hay token
      localStorage.setItem(TOKEN_KEY, token.value) // guardamos el token en el local storage
    } else {
      localStorage.removeItem(TOKEN_KEY) // y si no hay token eliminamos el token del local storage
    }

    if (expiresIn.value) { // si hay tiempo de expiracion
      localStorage.setItem(EXPIRES_KEY, expiresIn.value) // guardamos el tiempo de expiracion en el local storage
    } else {
      localStorage.removeItem(EXPIRES_KEY) // y si no hay tiempo de expiracion eliminamos el tiempo de expiracion del local storage
    }
  }

  // Funcion que limpia los datos de la sesion actual y elimina el token del local storage
  function clearSession() {
    token.value = ''
    user.value = null
    expiresIn.value = ''
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EXPIRES_KEY)
  }

  // Funcion asincrona que inicia sesion
  async function login(identifier, password) {
    isLoading.value = true // establece el estado de carga en true
    try {
      const data = await loginUser(identifier, password) // llama al servicio de login
      setSession(data) // guarda los datos de la sesion
      return { success: true, data } // devuelve el objeto con exito y los datos
    } catch (error) {
      const message =
        error.response?.data?.message || 'No fue posible iniciar sesión. Verifica tus credenciales.' // obtiene el mensaje de error o un mensaje por defecto
      return { success: false, message } // devuelve el objeto con fallo y el mensaje de error
    } finally {
      isLoading.value = false
    }
  }

  // Funcion asincrona que verifica la sesion
  async function verifySession() {
    if (!token.value) return false // si no hay token, devuelve false
    try {
      const response = await getCurrentUser() // llama al servicio para obtener el usuario actual
      const currentUser = response?.data || null // obtiene el usuario actual
      if (currentUser) { // si hay usuario
        user.value = currentUser // establece el usuario actual
        return true // devuelve true
      }
      clearSession() // limpia la sesion
      return false
    } catch {
      clearSession()
      return false // si hay error, limpia la sesion y devuelve false
    }
  }

  // Funcion que cierra la sesion
  function logout() {
    clearSession() // limpia la sesion
  }

  // Verifica si el usuario autenticado tiene alguno de los roles permitidos
  function hasRole(...roles) {
    const currentRole = user.value?.role
    return Boolean(currentRole && roles.includes(currentRole))
  }

  // Devuelve la ruta inicial permitida segun el rol del usuario
  function getDefaultRoute() {
    const currentRole = user.value?.role
    if (currentRole === 'admin') return '/usuarios'
    if (currentRole === 'manager') return '/employees'
    return '/sin-acceso'
  }

  return {
    token,
    user,
    expiresIn,
    isLoading,
    isAuthenticated,
    setSession,
    clearSession,
    login,
    verifySession,
    logout,
    hasRole,
    getDefaultRoute,
  }
})

