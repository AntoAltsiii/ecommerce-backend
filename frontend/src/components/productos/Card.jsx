import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const estiloCard = {
  backgroundColor: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow-card)',
  display: 'flex',
  flexDirection: 'column',
  transition: 'box-shadow 0.25s ease, transform 0.2s ease',
};

const estiloImagen = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  backgroundColor: 'var(--color-bg-soft)',
  display: 'block',
};

const estiloPlaceholder = {
  width: '100%',
  height: '200px',
  backgroundColor: 'var(--color-bg-soft)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '50px',
  color: 'var(--color-text-light)',
};

const estiloContenido = {
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  flex: 1,
};

const estiloCategoriaBadge = {
  display: 'inline-block',
  backgroundColor: 'var(--color-gold-light)',
  color: 'var(--color-gold-dark)',
  fontSize: '11px',
  fontWeight: '600',
  padding: '2px 8px',
  borderRadius: '20px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  width: 'fit-content',
};

const estiloNombre = {
  fontSize: '15px',
  fontWeight: '600',
  color: 'var(--color-text)',
  margin: 0,
  lineHeight: 1.3,
};

const estiloPrecio = {
  fontSize: '17px',
  fontWeight: '700',
  color: 'var(--color-gold)',
  margin: 0,
};

const estiloAcciones = {
  padding: '12px 16px',
  borderTop: '1px solid var(--color-border)',
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

const estiloBtnAgregar = {
  flex: 1,
  padding: '9px 14px',
  backgroundColor: 'var(--color-gold)',
  color: '#fff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
};

const estiloBtnCantidad = {
  width: '34px',
  height: '34px',
  backgroundColor: 'var(--color-bg-soft)',
  border: '1px solid var(--color-border)',
  borderRadius: '50%',
  fontSize: '18px',
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '700',
  color: 'var(--color-text)',
};

const estiloNumeroCantidad = {
  minWidth: '28px',
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: '700',
  color: 'var(--color-text)',
  alignSelf: 'center',
};

const estiloBtnEditar = {
  flex: 1,
  padding: '9px 14px',
  backgroundColor: 'var(--color-bg-soft)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
};

const estiloBtnEliminar = {
  flex: 1,
  padding: '9px 14px',
  backgroundColor: 'var(--color-danger-bg)',
  color: 'var(--color-danger)',
  border: '1px solid var(--color-danger)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
};

function Card({ prenda, onEditar, onEliminar, stock }) {

  const { hasRole, authenticated } = useAuth();

const { agregarAlCarrito, quitarDelCarrito, getCantidad } = useCart();

const cantidadEnCarrito = getCantidad(prenda.id);

const categoriaNombre = prenda.categoriaNombre || 'Sin categoría';

const precioFormateado = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(prenda.precio_Actual);

  return (
    <div
      style={estiloCard}

onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >

{prenda.imagenUrl ? (

<img
          src={prenda.imagenUrl}
          alt={prenda.nombre}
          style={estiloImagen}

onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}

<div
        style={{
          ...estiloPlaceholder,

          display: prenda.imagenUrl ? 'none' : 'flex',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--color-text-light)', opacity: 0.6 }}>Sin imagen</span>
      </div>

<div style={estiloContenido}>

<span style={estiloCategoriaBadge}>{categoriaNombre}</span>

<p style={estiloNombre}>{prenda.nombre}</p>

<p style={estiloPrecio}>{precioFormateado}</p>

{stock !== undefined && stock > 0 && (
          <span style={{
            display: 'inline-block',
            backgroundColor: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
            fontSize: '11px',
            fontWeight: '600',
            padding: '2px 8px',
            borderRadius: '20px',
            width: 'fit-content',
          }}>
            {stock} en stock
          </span>
        )}
        {stock !== undefined && stock === 0 && (
          <span style={{
            display: 'inline-block',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            fontSize: '11px',
            fontWeight: '600',
            padding: '2px 8px',
            borderRadius: '20px',
            width: 'fit-content',
          }}>
            Sin stock
          </span>
        )}

      </div>

<div style={estiloAcciones}>

{hasRole('ADMIN') && (
          <>
            <button
              style={estiloBtnEditar}
              onClick={() => onEditar && onEditar(prenda)}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-soft)'}
            >
              Editar
            </button>
            <button
              style={estiloBtnEliminar}
              onClick={() => onEliminar && onEliminar(prenda.id)}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5c6cb'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-danger-bg)'}
            >
              Eliminar
            </button>
          </>
        )}

{authenticated && hasRole('CLIENTE') && (
          <>
            {cantidadEnCarrito === 0 ? (

              <button
                style={estiloBtnAgregar}
                onClick={() => agregarAlCarrito(prenda)}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-gold-dark)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-gold)'}
              >
                Agregar al carrito
              </button>
            ) : (

              <>

                <button
                  style={estiloBtnCantidad}
                  onClick={() => quitarDelCarrito(prenda.id)}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-soft)'}
                  title="Quitar una unidad"
                >
                  −
                </button>

<span style={estiloNumeroCantidad}>{cantidadEnCarrito}</span>

<button
                  style={estiloBtnCantidad}
                  onClick={() => agregarAlCarrito(prenda)}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-soft)'}
                  title="Agregar una unidad más"
                >
                  +
                </button>
              </>
            )}
          </>
        )}

{!authenticated && (
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-light)', alignSelf: 'center' }}>
            Iniciá sesión para comprar
          </p>
        )}

      </div>
    </div>
  );
}

export default Card;
