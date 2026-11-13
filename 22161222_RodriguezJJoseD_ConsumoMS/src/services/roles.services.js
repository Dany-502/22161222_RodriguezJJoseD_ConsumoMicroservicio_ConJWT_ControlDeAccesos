import apiClient from "./apiClient";

// Funcion para obtener todos los roles
export const getRoles = async () => {
    const res = await apiClient.get(`/v2/roles`);
    return res.data;
}

// Funcion para obtener un rol por su ID
export const getRoleByID = async (id) => {
    const res = await apiClient.get(`/v2/roles/${id}`);
    return res.data;
}

