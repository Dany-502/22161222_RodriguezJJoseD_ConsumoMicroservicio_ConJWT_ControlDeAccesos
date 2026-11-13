import axios from 'axios'

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
// En esta parte garantizamos que la URL base siempre incluya '/api' para que coincida con las rutas del microservicio
const baseURL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`

const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Adjunta automáticamente el JWT en cada petición si existe en localStorage
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Si el microservicio responde 401 (token ausente, inválido o expirado), limpiamos la sesión y redirigimos a /login
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        const requestUrl = error.config?.url || ''
        if (status === 401 && !requestUrl.includes('/v1/auth/login')) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_expires_in')
            if (window.location.pathname !== '/login') {
                window.location.assign('/login')
            }
        }
        return Promise.reject(error)
    },
)

export default apiClient
