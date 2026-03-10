import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartItem({ item, onRestar, onSumar, onEliminar }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      backgroundColor: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      marginBottom: '12px',
    }}>

{item.imagenUrl ? (
        <img
          src={item.imagenUrl}
          alt={item.nombre}
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'cover',
            borderRadius: '8px',
            flexShrink: 0,
          }}
        />
      ) : (
        <div style={{
          width: '70px',
          height: '70px',
          backgroundColor: 'var(--color-bg-soft)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ width: '28px', height: '3px', backgroundColor: 'var(--color-gold)', borderRadius: '2px', display: 'block' }} />
        </div>
      )}

<div style={{ flex: 1, minWidth: 0 }}>

        <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-text-primary)', fontSize: '15px' }}>
          {item.nombre}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          {item.categoriaNombre}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-gold-dark)', fontWeight: '500' }}>
          ${item.precio_Actual.toLocaleString('es-AR')} c/u
        </p>
      </div>

<div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <button
          onClick={onRestar}
          style={estiloBotonCantidad}
          title="Quitar una unidad"
        >
          −
        </button>
        <span style={{
          minWidth: '28px',
          textAlign: 'center',
          fontWeight: '700',
          fontSize: '16px',
          color: 'var(--color-text-primary)',
        }}>
          {item.cantidad}
        </span>
        <button
          onClick={onSumar}
          style={estiloBotonCantidad}
          title="Agregar una unidad"
        >
          +
        </button>
      </div>

<div style={{ minWidth: '100px', textAlign: 'right', flexShrink: 0 }}>
        <p style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: 'var(--color-text-primary)' }}>
          ${(item.precio_Actual * item.cantidad).toLocaleString('es-AR')}
        </p>
      </div>

<button
        onClick={onEliminar}
        title="Quitar del carrito"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          color: 'var(--color-text-muted)',
          padding: '4px',
          flexShrink: 0,
          lineHeight: 1,
          borderRadius: '4px',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#e74c3c'}
        onMouseLeave={e => e.target.style.color = 'var(--color-text-muted)'}
      >
        ×
      </button>
    </div>
  );
}

const estiloBotonCantidad = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg-soft)',
  cursor: 'pointer',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '700',
  color: 'var(--color-text-primary)',
  lineHeight: 1,
};

function CarritoPage() {

const {
    items,
    subtotal,
    cantidadTotal,
    agregarAlCarrito,
    quitarDelCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
  } = useCart();

const navigate = useNavigate();

if (items.length === 0) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <span style={{ width: '28px', height: '3px', backgroundColor: 'var(--color-gold)', borderRadius: '2px', display: 'block' }} />
        </div>
        <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '8px' }}>Tu carrito está vacío</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Explorá el catálogo y agregá prendas que te gusten.
        </p>
        <button
          onClick={() => navigate('/productos')}
          style={{
            padding: '12px 28px',
            backgroundColor: 'var(--color-gold)',
            color: '#2C1A0E',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '15px',
          }}
        >
          Ver productos
        </button>
      </div>
    );
  }

return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 20px' }}>

<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: 'var(--color-text-primary)' }}>
          Mi Carrito

          <span style={{ fontSize: '16px', fontWeight: 'normal', color: 'var(--color-text-muted)', marginLeft: '10px' }}>
            ({cantidadTotal} {cantidadTotal === 1 ? 'item' : 'items'})
          </span>
        </h1>

<button
          onClick={vaciarCarrito}
          style={{
            background: 'none',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
          }}
        >
          Vaciar carrito
        </button>
      </div>

<div>
        {items.map(item => (
          <CartItem
            key={item.id}
            item={item}

            onRestar={() => quitarDelCarrito(item.id)}

            onSumar={() => agregarAlCarrito(item)}

            onEliminar={() => eliminarDelCarrito(item.id)}
          />
        ))}
      </div>

<div style={{
        marginTop: '24px',
        padding: '20px 24px',
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>

<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', color: 'var(--color-text-muted)' }}>Subtotal de productos</span>
          <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
            ${subtotal.toLocaleString('es-AR')}
          </span>
        </div>

<p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)' }}>
          El costo de envío se calcula en el siguiente paso.
        </p>

<button
          onClick={() => navigate('/checkout')}
          style={{
            padding: '14px',
            backgroundColor: 'var(--color-gold)',
            color: '#2C1A0E',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '16px',
            width: '100%',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => e.target.style.backgroundColor = 'var(--color-gold-light)'}
          onMouseLeave={e => e.target.style.backgroundColor = 'var(--color-gold)'}
        >
          Ir al Checkout →
        </button>

<button
          onClick={() => navigate('/productos')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            color: 'var(--color-text-muted)',
            textDecoration: 'underline',
          }}
        >
          ← Seguir comprando
        </button>
      </div>
    </div>
  );
}

export default CarritoPage;
