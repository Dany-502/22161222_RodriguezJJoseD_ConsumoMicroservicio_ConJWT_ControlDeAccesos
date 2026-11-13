import apiClient from './apiClient.js'

// Inicia sesión en el microservicio y devuelve el JWT y los datos del usuario
export const loginUser = async (identifier, password) => {
  const res = await apiClient.post('/v1/auth/login', {
    identifier,
    password,
  })
  return res.data
}

// Valida el JWT actual contra el microservicio y obtiene el usuario autenticado
export const getCurrentUser = async () => {
  const res = await apiClient.get('/v1/auth/me')
  return res.data
}

