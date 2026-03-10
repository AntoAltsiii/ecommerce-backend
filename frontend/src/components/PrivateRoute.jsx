import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ roles }) {
  const { authenticated, loading, hasRole } = useAuth();

if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <p style={{ color: '#666' }}>⏳ Verificando acceso...</p>
      </div>
    );
  }

if (!authenticated) {

return <Navigate to="/" state={{ unauthorizedMessage: 'Necesitás iniciar sesión para acceder a esa página.' }} replace />;
  }

if (roles && roles.length > 0) {

    const tieneAcceso = roles.some(rol => hasRole(rol));

    if (!tieneAcceso) {

      return <Navigate to="/" state={{ unauthorizedMessage: 'No tenés permisos para acceder a esa página.' }} replace />;
    }
  }

return <Outlet />;
}

export default PrivateRoute;
