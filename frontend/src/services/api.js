import axios from 'axios';
import keycloak from '../keycloak';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    }
  });

api.interceptors.request.use(
  (config) => {

if (keycloak.authenticated && keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }

    console.log('📤 REQUEST:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Error en REQUEST:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('📥 RESPONSE:', response.status, response.config.url);
    return response;
  },
  (error) => {

    if (error.response) {

      console.error('❌ Error del servidor:', error.response.status, error.response.data);

if (error.response.status === 401 && keycloak.authenticated) {
        console.warn('⚠️ Token expirado o inválido, intentando renovar...');
        keycloak.updateToken(0)
          .then(() => {
            console.log('✅ Token renovado, reintentá la acción');
          })
          .catch(() => {
            console.error('❌ No se pudo renovar token, cerrando sesión');
            keycloak.logout();
          });
      }
    } else if (error.request) {

      console.error('❌ Backend no responde:', error.message);
    } else {

      console.error('❌ Error de configuración:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
