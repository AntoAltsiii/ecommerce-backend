import api from './api';

export const getUsuarioByEmail = async (email) => {
  try {

const emailCodificado = encodeURIComponent(email);
    const response = await api.get(`/api/usuarios/email/${emailCodificado}`);
    return response.data;
  } catch (error) {

if (error.response?.status === 404) {
      return null;
    }

    console.error(`Error al buscar usuario por email ${email}:`, error);
    throw error;
  }
};

export const createUsuario = async (usuarioData) => {
  try {
    const response = await api.post('/api/usuarios', usuarioData);
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

export const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await api.put(`/api/usuarios/${id}`, usuarioData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar usuario ${id}:`, error);
    throw error;
  }
};

export const buscarOCrearUsuario = async (keycloakUser, direccion) => {

  const existente = await getUsuarioByEmail(keycloakUser.email);

  if (existente) {

if (existente.direccion !== direccion && direccion) {
      return await updateUsuario(existente.idUsuario, { ...existente, direccion });
    }
    return existente;
  }

const nuevoUsuario = {
    nombre:    keycloakUser.nombre   || keycloakUser.username || '',
    apellido:  keycloakUser.apellido || '',
    email:     keycloakUser.email,
    direccion: direccion || 'Sin direccion',
  };

  return await createUsuario(nuevoUsuario);
};
