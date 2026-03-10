import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { buscarOCrearUsuario } from '../services/usuarioService';
import { createCompra } from '../services/compraService';

const COSTO_ENVIO = 500;

const SUCURSAL_DEFAULT_ID = 1;

function CheckoutPage() {

const { user } = useAuth();

const { items, subtotal, vaciarCarrito } = useCart();

const navigate = useNavigate();

const [form, setForm] = useState({
    nombre:    '',
    apellido:  '',
    direccion: '',
    metodoPago: 'TARJETA',
  });

const [cargando, setCargando]     = useState(false);
  const [error, setError]           = useState(null);
  const [exitoso, setExitoso]       = useState(false);
  const [compraId, setCompraId]     = useState(null);

useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        nombre:   user.nombre   || user.username || '',
        apellido: user.apellido || '',
      }));
    }
  }, [user]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

const esFormularioValido = () => {
    if (items.length === 0) return false;
    if (!form.nombre.trim())    return false;
    if (!form.direccion.trim()) return false;
    return true;
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!esFormularioValido()) return;

    setCargando(true);
    setError(null);

    try {

const usuario = await buscarOCrearUsuario(
        { ...user, nombre: form.nombre, apellido: form.apellido },
        form.direccion
      );

const totalConEnvio = subtotal + COSTO_ENVIO;
      const hoy = new Date().toISOString().split('T')[0];

const payload = {
        fechaCompra: hoy,
        estado:      'PENDIENTE',
        totalCompra: totalConEnvio,
        tipo:        'ONLINE',

usuario: { idUsuario: usuario.idUsuario },

sucursal: { idSucursal: SUCURSAL_DEFAULT_ID },

items: items.map(item => ({
          prendaId:       item.id,
          cantidad:       item.cantidad,
          precioUnitario: item.precio_Actual,
          subtotal:       item.precio_Actual * item.cantidad,
        })),

envios: [{
          direccionEnvio: form.direccion,
          tipoEnvio:      'DOMICILIO',
          costo:          COSTO_ENVIO,
          estadoEnvio:    'PENDIENTE',
          fechaEnvio:     hoy,
        }],

pagos: [{
          metodoPago: form.metodoPago,
          monto:      totalConEnvio,
          estadoPago: 'PENDIENTE',
          fechaPago:  hoy,
        }],
      };

const compraCreada = await createCompra(payload);

setCompraId(compraCreada.idCompra);
      vaciarCarrito();
      setExitoso(true);

    } catch (err) {

const rawMsg = err.response?.data?.message ?? '';
      let mensajeError;
      if (rawMsg.toLowerCase().includes('stock insuficiente') || rawMsg.toLowerCase().includes('no existe registro de stock')) {

        const match = rawMsg.match(/prenda con id[:\s]+(\d+)/i);
        if (match) {
          const prendaIdProblema = Number(match[1]);
          const itemProblema = items.find(i => i.id === prendaIdProblema);
          const nombreProblema = itemProblema ? `"${itemProblema.nombre}"` : `#${prendaIdProblema}`;
          mensajeError = `Sin stock suficiente: ${nombreProblema} no tiene suficiente stock disponible. Revisá las cantidades en el carrito.`;
        } else {
          mensajeError = 'Sin stock suficiente: uno o más productos de tu pedido no tienen suficiente stock disponible. Revisá las cantidades en el carrito.';
        }
      } else if (typeof rawMsg === 'string' && rawMsg.trim()) {
        mensajeError = rawMsg;
      } else {
        mensajeError = 'Ocurrió un error al procesar tu compra. Intentá de nuevo.';
      }
      setError(mensajeError);
    } finally {

      setCargando(false);
    }
  };

if (exitoso) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '60px auto',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}>
        <p style={{ fontSize: '64px', margin: '0 0 16px' }}>🎉</p>
        <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          ¡Compra confirmada!
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>
          Tu pedido fue recibido correctamente.
        </p>
        {compraId && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '32px' }}>
            Número de compra: <strong style={{ color: 'var(--color-gold-dark)' }}>#{compraId}</strong>
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mis-compras')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--color-gold)',
              color: '#2C1A0E',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '14px',
            }}
          >
            Ver mis compras
          </button>
          <button
            onClick={() => navigate('/productos')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            Seguir comprando
          </button>
        </div>
      </div>
    );
  }

if (items.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '48px' }}>🛒</p>
        <h2 style={{ color: 'var(--color-text-primary)' }}>No tenés items en el carrito</h2>
        <button
          onClick={() => navigate('/productos')}
          style={{
            marginTop: '20px',
            padding: '12px 28px',
            backgroundColor: 'var(--color-gold)',
            color: '#2C1A0E',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: '700',
          }}
        >
          Ver productos
        </button>
      </div>
    );
  }

return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '30px 20px' }}>

<h1 style={{ color: 'var(--color-text-primary)', marginBottom: '8px' }}>💳 Checkout</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
        Revisá tu pedido y completá los datos para finalizar la compra.
      </p>

<div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 300px',
        gap: '24px',

      }}>

<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

<section style={estiloSeccion}>
            <h3 style={estiloTituloSeccion}>👤 Datos personales</h3>

<label style={estiloLabel}>
              Nombre *
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
                style={estiloInput}
              />
            </label>

<label style={estiloLabel}>
              Apellido
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Tu apellido"
                style={estiloInput}
              />
            </label>
          </section>

<section style={estiloSeccion}>
            <h3 style={estiloTituloSeccion}>🚚 Dirección de envío</h3>
            <label style={estiloLabel}>
              Dirección completa *
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                required
                placeholder="Ej: Av. Corrientes 1234, CABA"
                style={estiloInput}
              />
            </label>
            <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Costo de envío: <strong>${COSTO_ENVIO.toLocaleString('es-AR')}</strong> (a domicilio)
            </p>
          </section>

<section style={estiloSeccion}>
            <h3 style={estiloTituloSeccion}>💳 Método de pago</h3>

            {['TARJETA', 'EFECTIVO', 'TRANSFERENCIA'].map(metodo => (
              <label
                key={metodo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  marginBottom: '8px',
                  border: `1px solid ${form.metodoPago === metodo ? 'var(--color-gold)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor: form.metodoPago === metodo ? 'rgba(201,168,76,0.08)' : 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                <input
                  type="radio"
                  name="metodoPago"
                  value={metodo}
                  checked={form.metodoPago === metodo}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--color-gold)' }}
                />
                <span style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>

                  {metodo === 'TARJETA'       && '💳 Tarjeta de crédito / débito'}
                  {metodo === 'EFECTIVO'      && '💵 Efectivo (contra entrega)'}
                  {metodo === 'TRANSFERENCIA' && '🏦 Transferencia bancaria'}
                </span>
              </label>
            ))}
          </section>

{error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-sm)',
              color: '#dc2626',
              fontSize: '14px',
            }}>
              ❌ {error}
            </div>
          )}

<button
            type="submit"
            disabled={cargando || !esFormularioValido()}
            style={{
              padding: '16px',
              backgroundColor: (cargando || !esFormularioValido()) ? '#ccc' : 'var(--color-gold)',
              color: '#2C1A0E',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: (cargando || !esFormularioValido()) ? 'not-allowed' : 'pointer',
              fontWeight: '700',
              fontSize: '16px',
              width: '100%',
              transition: 'background-color 0.2s',
            }}
          >

            {cargando ? '⏳ Procesando compra...' : '✅ Confirmar compra'}
          </button>

        </form>

<div style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          height: 'fit-content',
          position: 'sticky',
          top: '20px',
        }}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--color-text-primary)', fontSize: '15px' }}>
            Resumen del pedido
          </h3>

{items.map(item => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '13px',
                color: 'var(--color-text-muted)',
              }}
            >
              <span>
                {item.nombre}

                {item.cantidad > 1 && (
                  <span style={{ color: 'var(--color-gold-dark)' }}> ×{item.cantidad}</span>
                )}
              </span>
              <span>${(item.precio_Actual * item.cantidad).toLocaleString('es-AR')}</span>
            </div>
          ))}

<div style={{ borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />

<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Subtotal productos</span>
            <span>${subtotal.toLocaleString('es-AR')}</span>
          </div>

<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Envío a domicilio</span>
            <span>${COSTO_ENVIO.toLocaleString('es-AR')}</span>
          </div>

<div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: '700',
            fontSize: '16px',
            color: 'var(--color-text-primary)',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '12px',
          }}>
            <span>Total</span>
            <span style={{ color: 'var(--color-gold-dark)' }}>
              ${(subtotal + COSTO_ENVIO).toLocaleString('es-AR')}
            </span>
          </div>

<button
            onClick={() => navigate('/carrito')}
            style={{
              marginTop: '16px',
              width: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              textDecoration: 'underline',
            }}
          >
            ← Editar carrito
          </button>
        </div>

      </div>
    </div>
  );
}

const estiloSeccion = {
  padding: '20px',
  backgroundColor: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const estiloTituloSeccion = {
  margin: '0 0 4px',
  fontSize: '15px',
  fontWeight: '700',
  color: 'var(--color-text-primary)',
};

const estiloLabel = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  fontSize: '13px',
  fontWeight: '500',
  color: 'var(--color-text-secondary)',
};

const estiloInput = {
  padding: '10px 12px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '14px',
  backgroundColor: 'var(--color-bg)',
  color: 'var(--color-text-primary)',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default CheckoutPage;
