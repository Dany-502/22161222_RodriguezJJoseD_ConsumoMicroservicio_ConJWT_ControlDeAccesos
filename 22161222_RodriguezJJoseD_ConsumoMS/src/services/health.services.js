import apiClient from "./apiClient.js";

export const getHealth = async () => {
    const res = await apiClient.get('/v1/health');
    return res.data;
}