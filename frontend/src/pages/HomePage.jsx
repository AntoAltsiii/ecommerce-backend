import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HERO_IMAGE = 'https://st3.depositphotos.com/3323581/33209/i/950/depositphotos_332095606-stock-photo-set-of-mens-stylish-clothes.jpg';

function HomePage() {
  const { authenticated, user, loading, login, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const mensajeAcceso = location.state?.unauthorizedMessage;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <p style={{ color: 'var(--color-text-soft)', fontSize: '15px' }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div>

{mensajeAcceso && (
        <div style={{
          padding: '12px 24px',
          backgroundColor: 'var(--color-bg-soft)',
          borderBottom: '1px solid var(--color-border)',
          color: 'var(--color-text-soft)',
          textAlign: 'center',
          fontSize: '14px',
        }}>
          {mensajeAcceso}
        </div>
      )}

      {!authenticated ? (

<div style={{
          display: 'flex',
          minHeight: 'calc(100vh - 62px)',
          flexWrap: 'wrap',
        }}>

<div style={{
            flex: '1 1 460px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(40px, 6vw, 90px) clamp(28px, 6vw, 80px)',
            backgroundColor: 'var(--color-bg)',
          }}>

            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '18px',
              display: 'block',
            }}>
              Nueva Colección 2026
            </span>

            <h1 style={{
              fontSize: 'clamp(34px, 4.5vw, 58px)',
              fontWeight: '800',
              color: 'var(--color-text)',
              lineHeight: 1.1,
              margin: '0 0 22px 0',
              letterSpacing: '-1.5px',
            }}>
              Moda que<br />define tu estilo.
            </h1>

            <p style={{
              color: 'var(--color-text-soft)',
              fontSize: '16px',
              lineHeight: 1.75,
              maxWidth: '420px',
              margin: '0 0 42px 0',
            }}>
              Descubrí prendas seleccionadas para cada ocasión.
              Calidad, estilo y comodidad en un solo lugar.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={login}
                style={{
                  padding: '14px 34px',
                  backgroundColor: 'var(--color-nav-bg)',
                  color: 'var(--color-nav-text)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  letterSpacing: '0.4px',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Iniciar Sesión
              </button>

              <button
                onClick={() => navigate('/productos')}
                style={{
                  padding: '14px 34px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  letterSpacing: '0.4px',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-text-soft)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                Ver Catálogo
              </button>
            </div>

            <p style={{
              color: 'var(--color-text-light)',
              fontSize: '12px',
              marginTop: '18px',
            }}>
              Como invitado podés explorar el catálogo. Para comprar, iniciá sesión.
            </p>
          </div>

<div style={{
            flex: '1 1 400px',
            minHeight: '460px',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'var(--color-bg-soft)',
          }}>
            <img
              src={HERO_IMAGE}
              alt="Colección de moda"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>

      ) : (

<div>

<div style={{
            backgroundColor: '#D1C192',
            padding: '56px 40px 48px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--color-nav-bg)',
              margin: '0 0 12px',
              opacity: 0.7,
            }}>
              Bienvenido de vuelta
            </p>
            <h1 style={{
              fontSize: 'clamp(24px, 3vw, 34px)',
              fontWeight: '700',
              margin: '0 0 8px',
              letterSpacing: '-0.5px',
              color: 'var(--color-nav-bg)',
            }}>
              {user?.nombre || user?.username}
            </h1>
            <p style={{
              color: 'var(--color-nav-bg)',
              fontSize: '14px',
              margin: 0,
              opacity: 0.65,
            }}>
              ¿Qué querés hacer hoy?
            </p>
          </div>

<div style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: '52px 24px',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: '18px',
            }}>

              <TarjetaAcceso
                texto="Ver Productos"
                descripcion="Explorá el catálogo completo"
                onClick={() => navigate('/productos')}
              />

              {(hasRole('CLIENTE') || hasRole('ADMIN')) && (
                <TarjetaAcceso
                  texto="Mi Carrito"
                  descripcion="Revisá tus productos seleccionados"
                  onClick={() => navigate('/carrito')}
                />
              )}

              {(hasRole('CLIENTE') || hasRole('ADMIN')) && (
                <TarjetaAcceso
                  texto="Mis Compras"
                  descripcion="Historial de tus pedidos"
                  onClick={() => navigate('/mis-compras')}
                />
              )}

              {(hasRole('CLIENTE') || hasRole('ADMIN')) && (
                <TarjetaAcceso
                  texto="Recomendación"
                  descripcion="Prendas según el clima de hoy"
                  onClick={() => navigate('/recomendacion')}
                />
              )}

              {(hasRole('REPARTIDOR') || hasRole('ADMIN')) && (
                <TarjetaAcceso
                  texto="Envíos"
                  descripcion="Gestión de entregas"
                  onClick={() => navigate('/envios')}
                />
              )}

              {hasRole('ADMIN') && (
                <TarjetaAcceso
                  texto="Panel Admin"
                  descripcion="Administrá productos y stock"
                  onClick={() => navigate('/admin')}
                  destacado
                />
              )}

            </div>

            <div style={{ textAlign: 'center', marginTop: '44px' }}>
              <button
                onClick={logout}
                style={{
                  padding: '10px 26px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-soft)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  letterSpacing: '0.3px',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-text-soft)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TarjetaAcceso({ texto, descripcion, onClick, destacado }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '26px 22px',
        backgroundColor: destacado ? 'var(--color-nav-bg)' : 'var(--color-bg-card)',
        color: destacado ? 'var(--color-nav-text)' : 'var(--color-text)',
        border: destacado ? 'none' : '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
        boxShadow: 'var(--shadow-card)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        width: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <span style={{
        display: 'block',
        width: '28px',
        height: '3px',
        backgroundColor: destacado ? 'var(--color-gold)' : 'var(--color-gold)',
        borderRadius: '2px',
        marginBottom: '4px',
      }} />
      <span style={{
        fontSize: '15px',
        fontWeight: '700',
        letterSpacing: '-0.2px',
      }}>
        {texto}
      </span>
      <span style={{
        fontSize: '12px',
        color: destacado ? 'var(--color-text-light)' : 'var(--color-text-soft)',
        fontWeight: '400',
        lineHeight: 1.4,
      }}>
        {descripcion}
      </span>
    </button>
  );
}

export default HomePage;
