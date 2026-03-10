import { createContext, useContext, useEffect, useState, useRef } from 'react';
import keycloak from '../keycloak';

const AuthContext = createContext({});

export function AuthProvider({ children }) {

const [authenticated, setAuthenticated] = useState(false);

const [user, setUser] = useState(null);

const [roles, setRoles] = useState([]);

const [loading, setLoading] = useState(true);

const initialized = useRef(false);

useEffect(() => {

if (initialized.current) return;
    initialized.current = true;

    keycloak.init({

onLoad: 'check-sso',

pkceMethod: 'S256',

checkLoginIframe: false,
    })
    .then((isAuthenticated) => {

      setAuthenticated(isAuthenticated);

      if (isAuthenticated) {

const tokenData = keycloak.tokenParsed;

setUser({
          id:       tokenData.sub,
          username: tokenData.preferred_username,
          email:    tokenData.email,
          nombre:   tokenData.given_name,
          apellido: tokenData.family_name,
        });

const realmRoles = tokenData.realm_access?.roles || [];
        const appRoles = realmRoles.filter(r => ['ADMIN', 'CLIENTE', 'REPARTIDOR'].includes(r));
        setRoles(appRoles);
      }
    })
    .catch((error) => {

console.error('❌ Error al inicializar Keycloak:', error);
    })
    .finally(() => {

setLoading(false);
    });

const refreshInterval = setInterval(() => {
      if (keycloak.authenticated) {
        keycloak.updateToken(60)
          .then((refreshed) => {
            if (refreshed) {
              console.log('🔄 Token renovado automáticamente');

            }
          })
          .catch(() => {

console.warn('⚠️ No se pudo renovar el token, cerrando sesión...');
            keycloak.logout();
          });
      }
    }, 60000);

return () => clearInterval(refreshInterval);

  }, []);

const login = () => {
    keycloak.login({

      redirectUri: window.location.origin,
    });
  };

const logout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

const hasRole = (role) => roles.includes(role);

const getToken = () => keycloak.token;

const contextValue = {
    authenticated,
    user,
    roles,
    loading,
    login,
    logout,
    hasRole,
    getToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
