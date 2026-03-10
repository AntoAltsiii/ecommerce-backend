import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllEnvios, updateEnvio } from '../services/compraService';

const ESTILOS_ESTADO = {
  PENDIENTE: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  EN_CAMINO: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  ENTREGADO: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  DEVUELTO:  { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
};

function EstadoEnvioBadge({ estado }) {
  const s = ESTILOS_ESTADO[estado] || { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: s.bg,
      color: s.text,
      border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      {estado?.replace('_', ' ')}
    </span>
  );
}

const TRANSICIONES = {
  PENDIENTE: [{ estado: 'EN_CAMINO', label: 'En camino',  color: '#1d4ed8' }],
  EN_CAMINO: [
    { estado: 'ENTREGADO', label: 'Entregado', color: '#166534' },
    { estado: 'DEVUELTO',  label: 'Devuelto',  color: '#dc2626' },
  ],
  ENTREGADO: [],
  DEVUELTO:  [],
};

function EnviosPage() {
  const { hasRole } = useAuth();

  const [envios,       setEnvios]       = useState([]);
  const [cargando,     setCargando]     = useState(true);
  const [error,        setError]        = useState(null);
  const [filtro,       setFiltro]       = useState('TODOS');
  const [actualizando, setActualizando] = useState(null);

  useEffect(() => {
    cargarEnvios();
  }, []);

  const cargarEnvios = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await getAllEnvios();
      setEnvios([...data].sort((a, b) => b.idEnvio - a.idEnvio));
    } catch (err) {
      setError('No se pudo cargar la lista de envíos. Intentá de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const handleCambioEstado = async (envio, nuevoEstado) => {
    setActualizando(envio.idEnvio);
    try {
      const actualizado = await updateEnvio(envio.idEnvio, { estadoEnvio: nuevoEstado });
      setEnvios(prev => prev.map(e => e.idEnvio === actualizado.idEnvio ? actualizado : e));
    } catch (err) {
      alert('No se pudo actualizar el estado del envío. Intentá de nuevo.');
    } finally {
      setActualizando(null);
    }
  };

  const enviosFiltrados = filtro === 'TODOS'
    ? envios
    : envios.filter(e => e.estadoEnvio === filtro);

if (cargando) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-soft)', fontSize: '16px' }}>Cargando envíos...</p>
      </div>
    );
  }

if (error) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: '#dc2626' }}>{error}</p>
        <button
          onClick={cargarEnvios}
          style={{
            marginTop: '12px', padding: '10px 20px',
            backgroundColor: 'var(--color-gold)', color: '#2C1A0E',
            border: 'none', borderRadius: 'var(--radius-sm)',
            cursor: 'pointer', fontWeight: '600',
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' }}>

<div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: 'var(--color-text-primary)', margin: '0 0 6px' }}>
          Gestión de Envíos
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
          {hasRole('ADMIN')
            ? 'Vista ADMIN: todos los envíos del sistema.'
            : 'Vista REPARTIDOR: actualizá el estado de los envíos.'}
        </p>
      </div>

<div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['TODOS', 'PENDIENTE', 'EN_CAMINO', 'ENTREGADO', 'DEVUELTO'].map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                border: '1px solid',
                backgroundColor: filtro === f ? 'var(--color-gold)' : 'transparent',
                color: filtro === f ? '#2C1A0E' : 'var(--color-text-muted)',
                borderColor: filtro === f ? 'var(--color-gold)' : 'var(--color-border)',
              }}
            >
              {f.replace('_', ' ')}
              {' '}
              <span style={{ fontSize: '11px' }}>
                ({f === 'TODOS' ? envios.length : envios.filter(e => e.estadoEnvio === f).length})
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={cargarEnvios}
          style={{
            padding: '6px 14px',
            backgroundColor: 'var(--color-bg-card)',
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          🔄 Actualizar
        </button>
      </div>

{enviosFiltrados.length === 0 && (
        <div style={{
          padding: '60px', textAlign: 'center',
          backgroundColor: 'var(--color-bg-soft)', borderRadius: 'var(--radius-md)',
          border: '2px dashed var(--color-border)', color: 'var(--color-text-muted)',
        }}>
          <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '16px', margin: 0 }}>
            {filtro === 'TODOS'
              ? 'No hay envíos registrados todavía.'
              : `No hay envíos con estado "${filtro.replace('_', ' ')}".`}
          </p>
        </div>
      )}

{enviosFiltrados.length > 0 && (
        <div style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'auto',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{
                backgroundColor: 'var(--color-bg-soft)',
                borderBottom: '2px solid var(--color-border)',
              }}>
                {['Envío #', 'Compra #', 'Dirección', 'Tipo', 'Costo', 'Estado', 'Fecha', 'Acciones'].map(col => (
                  <th key={col} style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    whiteSpace: 'nowrap',
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enviosFiltrados.map(envio => {
                const transiciones = TRANSICIONES[envio.estadoEnvio] ?? [];
                const estaActualizando = actualizando === envio.idEnvio;

                return (
                  <tr
                    key={envio.idEnvio}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: estaActualizando ? 'var(--color-bg-soft)' : 'transparent',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                      #{envio.idEnvio}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                      {envio.idCompra ? `#${envio.idCompra}` : '—'}
                    </td>
                    <td
                      title={envio.direccionEnvio}
                      style={{
                        padding: '12px 16px',
                        maxWidth: '180px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {envio.direccionEnvio}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                      {envio.tipoEnvio}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>
                      ${envio.costo?.toLocaleString('es-AR')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <EstadoEnvioBadge estado={envio.estadoEnvio} />
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', fontSize: '12px' }}>
                      {envio.fechaEnvio}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {estaActualizando ? (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>⏳ Actualizando...</span>
                      ) : transiciones.length > 0 ? (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {transiciones.map(t => (
                            <button
                              key={t.estado}
                              onClick={() => handleCambioEstado(envio, t.estado)}
                              style={{
                                padding: '5px 12px',
                                backgroundColor: 'transparent',
                                color: t.color,
                                border: `1px solid ${t.color}`,
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
                          {envio.estadoEnvio === 'ENTREGADO' ? '✓ Completado' : '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default EnviosPage;
