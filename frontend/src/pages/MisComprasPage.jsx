import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsuarioByEmail } from '../services/usuarioService';
import { getComprasByUsuario, cancelarCompra } from '../services/compraService';

function EstadoBadge({ estado }) {

  const colores = {
    PENDIENTE:  { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
    PAGADO:     { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
    CANCELADO:  { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    DEVUELTO:   { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
  };

const estilo = colores[estado] || { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' };

  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: estilo.bg,
      color:           estilo.text,
      border:          `1px solid ${estilo.border}`,
      letterSpacing:   '0.3px',
    }}>
      {estado}
    </span>
  );
}

function DetalleCompra({ compra, onCancelar, cancelando }) {
  const puedeCancel = compra.estado === 'PENDIENTE' || compra.estado === 'PAGADO';
  return (
    <div style={{
      borderTop: '1px solid var(--color-border)',
      padding: '16px 20px',
      backgroundColor: 'var(--color-bg-soft)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>

{compra.items && compra.items.length > 0 && (
        <div>
          <p style={estiloSubtituloDetalle}>Productos</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ color: 'var(--color-text-muted)', textAlign: 'left' }}>
                <th style={estiloThDetalle}>ID Prenda</th>
                <th style={estiloThDetalle}>Cantidad</th>
                <th style={estiloThDetalle}>Precio unitario</th>
                <th style={{ ...estiloThDetalle, textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {compra.items.map(item => (
                <tr key={item.idItem} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={estiloTdDetalle}>#{item.prendaId}</td>
                  <td style={estiloTdDetalle}>{item.cantidad}</td>
                  <td style={estiloTdDetalle}>${item.precioUnitario?.toLocaleString('es-AR')}</td>
                  <td style={{ ...estiloTdDetalle, textAlign: 'right', fontWeight: '600' }}>
                    ${item.subtotal?.toLocaleString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{compra.envios && compra.envios.length > 0 && (
        <div>
          <p style={estiloSubtituloDetalle}>Envío</p>
          {compra.envios.map((envio, idx) => (
            <div key={envio.idEnvio ?? idx} style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <span>{envio.direccionEnvio}</span>
              <span>Tipo: <strong>{envio.tipoEnvio}</strong></span>
              <span>Costo: <strong>${envio.costo?.toLocaleString('es-AR')}</strong></span>
              <span>Estado: <EstadoBadge estado={envio.estadoEnvio} /></span>
            </div>
          ))}
        </div>
      )}

{compra.pagos && compra.pagos.length > 0 && (
        <div>
          <p style={estiloSubtituloDetalle}>Pago</p>
          {compra.pagos.map((pago, idx) => (
            <div key={pago.idPago ?? idx} style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <span>Método: <strong>{pago.metodoPago}</strong></span>
              <span>Monto: <strong>${pago.monto?.toLocaleString('es-AR')}</strong></span>
              <span>Estado: <EstadoBadge estado={pago.estadoPago} /></span>
            </div>
          ))}
        </div>
      )}

{puedeCancel && (
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
          <button
            onClick={onCancelar}
            disabled={cancelando}
            style={{
              padding: '8px 18px',
              backgroundColor: cancelando ? '#f1f5f9' : 'transparent',
              color: cancelando ? '#94a3b8' : '#dc2626',
              border: '1px solid',
              borderColor: cancelando ? '#e2e8f0' : '#fca5a5',
              borderRadius: 'var(--radius-sm)',
              cursor: cancelando ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '13px',
            }}
          >
            {cancelando ? '⏳ Cancelando...' : '✕ Cancelar compra'}
          </button>
          <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Una vez cancelada, la compra no podrá reactivarse.
          </p>
        </div>
      )}
    </div>
  );
}

const estiloSubtituloDetalle = {
  margin: '0 0 8px',
  fontWeight: '600',
  fontSize: '13px',
  color: 'var(--color-text-secondary)',
};
const estiloThDetalle = {
  padding: '4px 8px',
  fontWeight: '600',
  fontSize: '12px',
};
const estiloTdDetalle = {
  padding: '8px 8px',
  color: 'var(--color-text-primary)',
};

function MisComprasPage() {

  const { user } = useAuth();
  const navigate  = useNavigate();

const [compras,   setCompras]   = useState([]);

  const [cargando,  setCargando]  = useState(true);

  const [error,     setError]     = useState(null);

  const [cancelando, setCancelando] = useState(null);

const [expandidas, setExpandidas] = useState(new Set());

useEffect(() => {

    if (!user?.email) return;

    const cargarCompras = async () => {
      try {

const usuarioDB = await getUsuarioByEmail(user.email);

        if (!usuarioDB) {

          setCompras([]);
          return;
        }

const listaCompras = await getComprasByUsuario(usuarioDB.idUsuario);

const ordenadas = [...listaCompras].sort((a, b) => b.idCompra - a.idCompra);
        setCompras(ordenadas);

      } catch (err) {
        console.error('Error al cargar compras:', err);
        setError('No pudimos cargar tus compras. Intentá de nuevo más tarde.');
      } finally {
        setCargando(false);
      }
    };

    cargarCompras();
  }, [user]);

const toggleExpansion = (idCompra) => {
    setExpandidas(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(idCompra)) {
        nuevo.delete(idCompra);
      } else {
        nuevo.add(idCompra);
      }
      return nuevo;
    });
  };

const handleCancelar = async (idCompra) => {
    if (!window.confirm('¿Estás seguro de que querés cancelar esta compra? Esta acción no se puede deshacer.')) return;
    setCancelando(idCompra);
    try {
      const compraActualizada = await cancelarCompra(idCompra);

      setCompras(prev => prev.map(c => c.idCompra === idCompra ? compraActualizada : c));
    } catch (err) {
      alert('No se pudo cancelar la compra. Intentá de nuevo más tarde.');
    } finally {
      setCancelando(null);
    }
  };

if (cargando) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-soft)', fontSize: '16px' }}>Cargando tus compras...</p>
      </div>
    );
  }

if (error) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '40px' }}>⚠️</p>
        <p style={{ color: '#dc2626' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '12px',
            padding: '10px 20px',
            backgroundColor: 'var(--color-gold)',
            color: '#2C1A0E',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

if (compras.length === 0) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '4px', backgroundColor: 'var(--color-gold)', borderRadius: '2px', margin: '0 auto 24px' }} />
        <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Todavía no hiciste ninguna compra
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Explorá el catálogo y encontrá prendas que te gusten.
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
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px' }}>

<h1 style={{ color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: '500' }}>
          Mis Compras
        </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '28px' }}>
        {compras.length} {compras.length === 1 ? 'compra realizada' : 'compras realizadas'}
      </p>

<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {compras.map(compra => (
          <div
            key={compra.idCompra}
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',

              borderLeft: `4px solid ${
                compra.estado === 'PAGADO'    ? '#22c55e' :
                compra.estado === 'PENDIENTE' ? '#f97316' :
                compra.estado === 'CANCELADO' ? '#ef4444' : '#94a3b8'
              }`,
            }}
          >

            <button
              onClick={() => toggleExpansion(compra.idCompra)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '16px 20px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >

              <div>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: 'var(--color-text-primary)' }}>
                  Compra #{compra.idCompra}
                </p>
                <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  {compra.fechaCompra}

                  {compra.items && compra.items.length > 0 && (
                    <span style={{ marginLeft: '12px' }}>
                      · {compra.items.length} {compra.items.length === 1 ? 'producto' : 'productos'}
                    </span>
                  )}
                </p>
              </div>

<div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <EstadoBadge estado={compra.estado} />
                <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--color-text-primary)' }}>
                  ${compra.totalCompra?.toLocaleString('es-AR')}
                </span>

                <span style={{
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  transform: expandidas.has(compra.idCompra) ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  display: 'inline-block',
                }}>
                  ▼
                </span>
              </div>
            </button>

{expandidas.has(compra.idCompra) && (
              <DetalleCompra
                compra={compra}
                onCancelar={() => handleCancelar(compra.idCompra)}
                cancelando={cancelando === compra.idCompra}
              />
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default MisComprasPage;
