import { useState, useEffect } from 'react';
import { getAllCompras, cancelarCompra } from '../services/compraService';
import api from '../services/api';

function EstadoBadge({ estado }) {
  const colores = {
    PENDIENTE: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
    PAGADO:    { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
    CANCELADO: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    DEVUELTO:  { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
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
      color: estilo.text,
      border: `1px solid ${estilo.border}`,
    }}>
      {estado}
    </span>
  );
}

function DetalleCompra({ compra, onCambiarEstado, actualizando }) {
  const estiloSeccion = {
    backgroundColor: 'var(--color-bg-soft)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 16px',
  };
  const estiloThDetalle = {
    padding: '6px 12px',
    textAlign: 'left',
    fontSize: '12px',
    color: 'var(--color-text-soft)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  };
  const estiloTdDetalle = {
    padding: '6px 12px',
    fontSize: '13px',
    color: 'var(--color-text)',
    verticalAlign: 'middle',
  };

  const ESTADOS = ['PENDIENTE', 'PAGADO', 'CANCELADO', 'DEVUELTO'];
  const estadosDisponibles = ESTADOS.filter(e => e !== compra.estado);

  return (
    <div style={{
      borderTop: '1px solid var(--color-border)',
      padding: '16px 20px',
      backgroundColor: 'var(--color-bg-soft)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>

<div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', color: 'var(--color-text-soft)', fontWeight: '600' }}>
          Cambiar estado:
        </span>
        {estadosDisponibles.map(nuevoEstado => (
          <button
            key={nuevoEstado}
            onClick={() => onCambiarEstado(compra.idCompra, nuevoEstado)}
            disabled={actualizando}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '20px',
              cursor: actualizando ? 'not-allowed' : 'pointer',
              opacity: actualizando ? 0.6 : 1,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-card)',
              color: 'var(--color-text)',
            }}
          >
            → {nuevoEstado}
          </button>
        ))}
      </div>

{compra.items && compra.items.length > 0 && (
        <div style={estiloSeccion}>
          <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' }}>
            📦 Productos ({compra.items.length})
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-card)' }}>
                <th style={estiloThDetalle}>ID Prenda</th>
                <th style={estiloThDetalle}>Cant.</th>
                <th style={estiloThDetalle}>Precio unit.</th>
                <th style={estiloThDetalle}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {compra.items.map(item => (
                <tr key={item.idItem} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={estiloTdDetalle}>#{item.prendaId}</td>
                  <td style={estiloTdDetalle}>{item.cantidad}</td>
                  <td style={estiloTdDetalle}>${item.precioUnitario?.toLocaleString('es-AR')}</td>
                  <td style={estiloTdDetalle}>${item.subtotal?.toLocaleString('es-AR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{compra.envios && compra.envios.length > 0 && (
        <div style={estiloSeccion}>
          <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' }}>
            🚚 Envío
          </p>
          {compra.envios.map((envio, idx) => (
            <div key={envio.idEnvio ?? idx} style={{
              display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px',
              color: 'var(--color-text)',
            }}>
              <span>📍 {envio.direccionEnvio}</span>
              <span>Tipo: {envio.tipoEnvio}</span>
              <span>Costo: ${envio.costo?.toLocaleString('es-AR')}</span>
              <span>Estado: <EstadoBadge estado={envio.estadoEnvio} /></span>
            </div>
          ))}
        </div>
      )}

{compra.pagos && compra.pagos.length > 0 && (
        <div style={estiloSeccion}>
          <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' }}>
            💳 Pago
          </p>
          {compra.pagos.map((pago, idx) => (
            <div key={pago.idPago ?? idx} style={{
              display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px',
              color: 'var(--color-text)',
            }}>
              <span>Método: {pago.metodoPago}</span>
              <span>Monto: ${pago.monto?.toLocaleString('es-AR')}</span>
              <span>Estado: {pago.estadoPago}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

const FILTROS_ESTADO = ['TODOS', 'PENDIENTE', 'PAGADO', 'CANCELADO', 'DEVUELTO'];

function AdminComprasPage() {
  const [compras, setCompras]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [expandidas, setExpandidas] = useState(new Set());
  const [actualizando, setActualizando] = useState(null);

const cargarCompras = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCompras();

      data.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra));
      setCompras(data);
    } catch (err) {
      setError('No se pudieron cargar las compras. Intentá de nuevo.');
      console.error('Error al cargar compras:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarCompras(); }, []);

const toggleExpanDir = (idCompra) => {
    setExpandidas(prev => {
      const nuevo = new Set(prev);
      nuevo.has(idCompra) ? nuevo.delete(idCompra) : nuevo.add(idCompra);
      return nuevo;
    });
  };

const handleCambiarEstado = async (idCompra, nuevoEstado) => {
    setActualizando(idCompra);
    try {
      await api.put(`/api/compras/${idCompra}`, { estado: nuevoEstado });
      setCompras(prev => prev.map(c =>
        c.idCompra === idCompra ? { ...c, estado: nuevoEstado } : c
      ));
    } catch (err) {
      alert('No se pudo actualizar el estado. Intentá de nuevo.');
      console.error('Error al cambiar estado:', err);
    } finally {
      setActualizando(null);
    }
  };

const comprasFiltradas = filtroEstado === 'TODOS'
    ? compras
    : compras.filter(c => c.estado === filtroEstado);

const conteos = FILTROS_ESTADO.reduce((acc, estado) => {
    acc[estado] = estado === 'TODOS'
      ? compras.length
      : compras.filter(c => c.estado === estado).length;
    return acc;
  }, {});

  const estiloTabBase = {
    padding: '7px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.15s',
    backgroundColor: 'var(--color-bg-card)',
    color: 'var(--color-text-soft)',
  };
  const estiloTabActivo = {
    ...estiloTabBase,
    backgroundColor: 'var(--color-gold)',
    color: '#fff',
    border: '1px solid var(--color-gold)',
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px' }}>Todas las Compras</h1>
          <p style={{ margin: 0, color: 'var(--color-text-soft)', fontSize: '15px' }}>
            {compras.length} compra{compras.length !== 1 ? 's' : ''} en el sistema
          </p>
        </div>
        <button
          onClick={cargarCompras}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--color-bg-soft)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Cargando...' : '↺ Refrescar'}
        </button>
      </div>

<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {FILTROS_ESTADO.map(estado => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            style={filtroEstado === estado ? estiloTabActivo : estiloTabBase}
          >
            {estado} ({conteos[estado]})
          </button>
        ))}
      </div>

{loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-soft)' }}>
          Cargando compras...
        </div>
      )}

      {error && !loading && (
        <div style={{
          padding: '14px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-sm)',
          color: '#dc2626',
          fontSize: '14px',
        }}>
          ✗ {error}
        </div>
      )}

{!loading && !error && (
        comprasFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-soft)' }}>
            No hay compras con estado {filtroEstado === 'TODOS' ? 'registradas' : filtroEstado}.
          </div>
        ) : (
          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-soft)' }}>
                  <th style={estiloTh}>Compra #</th>
                  <th style={estiloTh}>Cliente</th>
                  <th style={estiloTh}>Fecha</th>
                  <th style={estiloTh}>Estado</th>
                  <th style={estiloTh}>Total</th>
                  <th style={estiloTh}></th>
                </tr>
              </thead>
              <tbody>
                {comprasFiltradas.map(compra => (
                  <>
                    <tr
                      key={compra.idCompra}
                      style={{
                        borderTop: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        backgroundColor: expandidas.has(compra.idCompra)
                          ? 'var(--color-bg-soft)'
                          : 'var(--color-bg-card)',
                        transition: 'background 0.1s',
                      }}
                      onClick={() => toggleExpanDir(compra.idCompra)}
                    >
                      <td style={estiloTd}>
                        <span style={{ fontWeight: '700' }}>#{compra.idCompra}</span>
                      </td>
                      <td style={estiloTd}>
                        {compra.usuario
                          ? `${compra.usuario.nombre ?? ''} ${compra.usuario.apellido ?? ''}`.trim() || compra.usuario.email
                          : '—'}
                      </td>
                      <td style={{ ...estiloTd, whiteSpace: 'nowrap' }}>
                        {compra.fechaCompra
                          ? new Date(compra.fechaCompra).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                          : '—'}
                      </td>
                      <td style={estiloTd}>
                        <EstadoBadge estado={compra.estado} />
                      </td>
                      <td style={{ ...estiloTd, fontWeight: '700', color: 'var(--color-gold)' }}>
                        ${compra.totalCompra?.toLocaleString('es-AR')}
                      </td>
                      <td style={{ ...estiloTd, textAlign: 'right' }}>
                        <span style={{ fontSize: '18px', color: 'var(--color-text-soft)' }}>
                          {expandidas.has(compra.idCompra) ? '▲' : '▼'}
                        </span>
                      </td>
                    </tr>

{expandidas.has(compra.idCompra) && (
                      <tr key={`detalle-${compra.idCompra}`}>
                        <td colSpan={6} style={{ padding: 0 }}>
                          <DetalleCompra
                            compra={compra}
                            onCambiarEstado={handleCambiarEstado}
                            actualizando={actualizando === compra.idCompra}
                          />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

    </div>
  );
}

const estiloTh = {
  padding: '10px 16px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: '700',
  color: 'var(--color-text-soft)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  whiteSpace: 'nowrap',
};

const estiloTd = {
  padding: '12px 16px',
  fontSize: '14px',
  color: 'var(--color-text)',
  verticalAlign: 'middle',
};

export default AdminComprasPage;
