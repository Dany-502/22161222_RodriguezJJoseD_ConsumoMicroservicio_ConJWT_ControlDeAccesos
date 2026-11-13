import apiClient from "./apiClient.js";

// Obtener todos los empleados (GET /api/v2/employees)
export const getEmployees = async () => {
    const res = await apiClient.get('/v2/employees');
    return res.data;
};

// Obtener un empleado por su ID (GET /api/v2/employees/:id)
export const getEmployeeById = async (id) => {
    const res = await apiClient.get(`/v2/employees/${id}`);
    return res.data;
};

// Crear un nuevo empleado (POST /api/v2/employees)
export const createEmployee = async (data) => {
    const res = await apiClient.post('/v2/employees', data);
    return res.data;
};

// Actualizar los datos de un empleado (PUT /api/v2/employees/:id)
export const updateEmployee = async (id, data) => {
    const res = await apiClient.put(`/v2/employees/${id}`, data);
    return res.data;
};

// Eliminar un empleado (DELETE /api/v2/employees/:id)
export const deleteEmployee = async (id) => {
    const res = await apiClient.delete(`/v2/employees/${id}`);
    return res.data;
};

