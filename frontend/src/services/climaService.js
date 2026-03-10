import api from './api';

export const updateUbicacion = async (userId, latitude, longitude) => {
  try {
    const response = await api.put(`/api/clima/ubicacion/${userId}`, { latitude, longitude });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar ubicación para usuario ${userId}:`, error);
    throw error;
  }
};

export const getClima = async (userId) => {
  try {
    const response = await api.get(`/api/clima/usuario/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener clima para usuario ${userId}:`, error);
    throw error;
  }
};

export const getRecomendacion = async (userId) => {
  try {
    const response = await api.get(`/api/clima/recomendacion/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener recomendación para usuario ${userId}:`, error);
    throw error;
  }
};
