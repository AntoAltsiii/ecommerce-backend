import api from './api';

export const getPrendas = async () => {
  try {
    const response = await api.get('/api/prendas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener prendas:', error);
    throw error;
  }
};

export const getPrendaById = async (id) => {
  try {
    const response = await api.get(`/api/prendas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener prenda ${id}:`, error);
    throw error;
  }
};

export const getCategorias = async () => {
  try {
    const response = await api.get('/api/categorias');
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

export const createPrenda = async (prendaData) => {
  try {
    const response = await api.post('/api/prendas', prendaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear prenda:', error);
    throw error;
  }
};

export const updatePrenda = async (id, prendaData) => {
  try {
    const response = await api.put(`/api/prendas/${id}`, prendaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar prenda ${id}:`, error);
    throw error;
  }
};

export const deletePrenda = async (id) => {
  try {
    await api.delete(`/api/prendas/${id}`);
  } catch (error) {
    console.error(`Error al eliminar prenda ${id}:`, error);
    throw error;
  }
};

export const getPrendasByCategoria = async (nombreCategoria) => {
  try {
    const response = await api.get(`/api/prendas/categoria/${encodeURIComponent(nombreCategoria)}`);
    return response.data;
  } catch (error) {
    console.error(`Error al filtrar prendas por categoría "${nombreCategoria}":`, error);
    throw error;
  }
};

export const createCategoria = async (categoriaData) => {
  try {
    const response = await api.post('/api/categorias', categoriaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
};

export const updateCategoria = async (id, categoriaData) => {
  try {
    const response = await api.put(`/api/categorias/${id}`, categoriaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar categoría ${id}:`, error);
    throw error;
  }
};

export const deleteCategoria = async (id) => {
  try {
    const response = await api.delete(`/api/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar categoría ${id}:`, error);
    throw error;
  }
};
