import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPrendas, deletePrenda, getCategorias } from '../services/productoService';

const estiloBtnPrimario = {
  padding: '9px 18px',
  backgroundColor: 'var(--color-gold)',
  color: '#fff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
};

const estiloBtnSecundario = {
  padding: '7px 14px',
  backgroundColor: 'var(--color-bg-soft)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
};

const estiloBtnEliminar = {
  padding: '7px 14px',
  backgroundColor: 'var(--color-danger-bg)',
  color: 'var(--color-danger)',
  border: '1px solid var(--color-danger)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
};

function AdminProductosPage() {
  const navigate = useNavigate();

const [prendas,    setPrendas]    = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [prendasData, categoriasData] = await Promise.all([
        getPrendas(),
        getCategorias(),
      ]);
      setPrendas(prendasData);
      setCategorias(categoriasData);
    } catch (err) {
      setError('No se pudieron cargar las prendas. Verificá que el backend esté activo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const nombreCategoria = (prenda) => {

    if (prenda.categoria?.nombreCategoria) return prenda.categoria.nombreCategoria;
    if (prenda.categoriaId) {
      const cat = categorias.find(c => c.idCategoria === prenda.categoriaId);
      return cat?.nombreCategoria ?? `ID ${prenda.categoriaId}`;
    }
    return '—';
  };

const handleEliminar = async (prenda) => {
    const confirmar = window.confirm(
      `¿Estás segura de que querés eliminar "${prenda.nombre}"?\n\n` +
      `⚠️ Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    try {
      await deletePrenda(prenda.id);
      await cargarDatos();
    } catch (err) {
      const msg = err.response?.data || `No se pudo eliminar "${prenda.nombre}".`;
      alert(msg);
    }
  };

if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-soft)' }}>Cargando prendas...</p>
      </div>
    );
  }

if (error) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <p style={{ color: 'var(--color-danger)' }}>{error}</p>
        <button onClick={cargarDatos} style={estiloBtnSecundario}>Reintentar</button>
      </div>
    );
  }

return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>

<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px' }}>Gestión de Prendas</h1>
          <p style={{ margin: 0, color: 'var(--color-text-soft)', fontSize: '14px' }}>
            {prendas.length} prenda{prendas.length !== 1 ? 's' : ''} en el catálogo
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/admin')} style={estiloBtnSecundario}>
            ← Volver al panel
          </button>
          <button onClick={() => navigate('/admin/productos/nueva')} style={estiloBtnPrimario}>
            + Nueva Prenda
          </button>
        </div>
      </div>

{prendas.length === 0 ? (
        <div style={{
          padding: '50px',
          textAlign: 'center',
          color: 'var(--color-text-soft)',
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', margin: '0 auto 16px' }} />
          <p style={{ margin: '0 0 16px' }}>No hay prendas todavía.</p>
          <button onClick={() => navigate('/admin/productos/nueva')} style={estiloBtnPrimario}>
            Crear la primera prenda
          </button>
        </div>
      ) : (

        <div style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-soft)', borderBottom: '2px solid var(--color-border)' }}>
                <th style={estiloCeldaHeader}>Imagen</th>
                <th style={estiloCeldaHeader}>Nombre</th>
                <th style={estiloCeldaHeader}>Categoría</th>
                <th style={estiloCeldaHeader}>Precio</th>
                <th style={{ ...estiloCeldaHeader, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {prendas.map((prenda, idx) => (
                <tr
                  key={prenda.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--color-bg-soft)',
                  }}
                >

                  <td style={estiloCelda}>
                    {prenda.imagenUrl ? (
                      <img
                        src={prenda.imagenUrl}
                        alt={prenda.nombre}
                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    ) : (
                      <div style={{
                        width: '64px', height: '64px', borderRadius: '8px',
                        backgroundColor: 'var(--color-bg-soft)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid var(--color-border)',
                      }}>
                        <span style={{ width: '20px', height: '2px', backgroundColor: 'var(--color-text-light)', borderRadius: '1px', display: 'block' }} />
                      </div>
                    )}
                  </td>

<td style={{ ...estiloCelda, fontWeight: '600', color: 'var(--color-text)' }}>
                    {prenda.nombre}
                  </td>

<td style={estiloCelda}>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: 'var(--color-gold-light)',
                      color: 'var(--color-gold-dark)',
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '2px 8px',
                      borderRadius: '20px',
                    }}>
                      {nombreCategoria(prenda)}
                    </span>
                  </td>

<td style={{ ...estiloCelda, fontWeight: '700', color: 'var(--color-gold)' }}>
                    ${prenda.precio_Actual?.toLocaleString('es-AR') ?? '—'}
                  </td>

<td style={{ ...estiloCelda, textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => navigate(`/admin/productos/editar/${prenda.id}`)}
                        style={estiloBtnSecundario}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(prenda)}
                        style={estiloBtnEliminar}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const estiloCeldaHeader = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: '700',
  color: 'var(--color-text-soft)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const estiloCelda = {
  padding: '12px 16px',
  verticalAlign: 'middle',
};

export default AdminProductosPage;
