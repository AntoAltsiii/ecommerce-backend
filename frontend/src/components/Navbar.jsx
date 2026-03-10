import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { authenticated, user, loading, login, logout, hasRole } = useAuth();

const { cantidadTotal } = useCart();

  const location = useLocation();

const esActivo = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

const estiloLink = (path) => ({
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: esActivo(path) ? '600' : 'normal',
    color: esActivo(path) ? 'var(--color-gold-light)' : 'var(--color-nav-text)',
    backgroundColor: esActivo(path) ? 'rgba(201,168,76,0.15)' : 'transparent',
  });

if (loading) return null;

  return (
    <nav style={{
      backgroundColor: 'var(--color-nav-bg)',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px',

      borderBottom: '2px solid var(--color-gold)',
    }}>

<Link to="/" style={{ textDecoration: 'none', color: 'var(--color-nav-text)', fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
        ✦ ProyectoRopa
      </Link>

<div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>

<Link to="/productos" style={estiloLink('/productos')}>
          Productos
        </Link>

{authenticated && hasRole('CLIENTE') && (
          <Link to="/carrito" style={{ ...estiloLink('/carrito'), position: 'relative' }}>
            Carrito

            {cantidadTotal > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--color-gold)',
                color: '#2C1A0E',
                fontSize: '10px',
                fontWeight: '700',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}>
                {cantidadTotal > 99 ? '99+' : cantidadTotal}
              </span>
            )}
          </Link>
        )}

{authenticated && hasRole('CLIENTE') && (
          <Link to="/mis-compras" style={estiloLink('/mis-compras')}>
            Mis Compras
          </Link>
        )}

{authenticated && hasRole('CLIENTE') && (
          <Link to="/recomendacion" style={estiloLink('/recomendacion')}>
            Recomendación
          </Link>
        )}

{(hasRole('REPARTIDOR') || hasRole('ADMIN')) && (
          <Link to="/envios" style={estiloLink('/envios')}>
            Envíos
          </Link>
        )}

{hasRole('ADMIN') && (
          <Link to="/admin" style={{
            ...estiloLink('/admin'),

            backgroundColor: esActivo('/admin') ? 'rgba(201,168,76,0.25)' : 'transparent',
            color: 'var(--color-gold-light)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '6px',
          }}>
            Panel Admin
          </Link>
        )}

<span style={{ color: 'var(--color-text-light)', margin: '0 5px', opacity: 0.4 }}>|</span>

{authenticated ? (

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--color-text-light)', fontSize: '13px' }}>
              {user?.username}
            </span>
            <button
              onClick={logout}
              style={{
                padding: '5px 12px',
                backgroundColor: 'transparent',
                color: 'var(--color-gold-light)',
                border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Salir
            </button>
          </div>
        ) : (

          <button
            onClick={login}
            style={{
              padding: '6px 16px',
              backgroundColor: 'var(--color-gold)',
              color: 'var(--color-nav-bg)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
            }}
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
