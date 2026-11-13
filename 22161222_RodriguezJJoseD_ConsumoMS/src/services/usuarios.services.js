import apiClient from "./apiClient.js";

// Funcion para obtener todos los usuarios
export const getUsers = async () => {
    const res = await apiClient.get(`/v2/usuarios`);
    return res.data;
}

// Funcion para obtener usuario mediante su ID
export const getUserById = async (id) => {
    const res = await apiClient.get(`/v2/usuarios/${id}`);
    return res.data;
}

// Funcion para crear un usuario nuevo
export const createUser = async (data) => {
    const res = await apiClient.post(`/v2/usuarios`, data);
    return res.data;
}

// Funcion para actualizar los datos de un usuario existente
export const updateUser = async (id, data) => {
    const res = await apiClient.put(`/v2/usuarios/${id}`, data);
    return res.data;
}

// Funcion para eliminar un usuario
export const deleteUser = async (id) => {
    const res = await apiClient.delete(`/v2/usuarios/${id}`);
    return res.data;
}

