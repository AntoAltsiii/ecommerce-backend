import api from './api';

export const createCompra = async (compraData) => {
  try {
    const response = await api.post('/api/compras', compraData);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear compra:', error);
    throw error;
  }
};

export const getComprasByUsuario = async (usuarioId) => {
  try {
    const response = await api.get(`/api/compras/usuario/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al obtener compras del usuario ${usuarioId}:`, error);
    throw error;
  }
};

export const getCompraById = async (id) => {
  try {
    const response = await api.get(`/api/compras/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al obtener compra ${id}:`, error);
    throw error;
  }
};

export const getAllStock = async () => {
  try {
    const response = await api.get('/api/stock');
    return response.data;
  } catch (error) {
    console.error('Error al obtener stock:', error);
    throw error;
  }
};

export const createStock = async (stockData) => {
  try {
    const response = await api.post('/api/stock', stockData);
    return response.data;
  } catch (error) {
    console.error('Error al crear stock:', error);
    throw error;
  }
};

export const updateStock = async (id, stockData) => {
  try {
    const response = await api.put(`/api/stock/${id}`, stockData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar stock ${id}:`, error);
    throw error;
  }
};

export const deleteStock = async (id) => {
  try {
    await api.delete(`/api/stock/${id}`);
  } catch (error) {
    console.error(`Error al eliminar stock ${id}:`, error);
    throw error;
  }
};

export const getSucursales = async () => {
  try {
    const response = await api.get('/api/sucursal');
    return response.data;
  } catch (error) {
    console.error('Error al obtener sucursales:', error);
    throw error;
  }
};

export const getAllEnvios = async () => {
  try {
    const response = await api.get('/api/envio');
    return response.data;
  } catch (error) {
    console.error('Error al obtener envíos:', error);
    throw error;
  }
};

export const updateEnvio = async (id, data) => {
  try {
    const response = await api.put(`/api/envio/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar envío ${id}:`, error);
    throw error;
  }
};

export const cancelarCompra = async (id) => {
  try {
    const response = await api.put(`/api/compras/${id}`, { estado: 'CANCELADO' });
    return response.data;
  } catch (error) {
    console.error(`Error al cancelar compra ${id}:`, error);
    throw error;
  }
};

export const getAllCompras = async () => {
  try {
    const response = await api.get('/api/compras');
    return response.data;
  } catch (error) {
    console.error('Error al obtener todas las compras:', error);
    throw error;
  }
};
