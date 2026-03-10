import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPrendas, getCategorias, getPrendasByCategoria, deletePrenda } from '../services/productoService';
import { getAllStock } from '../services/compraService';
import CardGrid from '../components/productos/CardGrid';

function ProductosPage() {
  const { hasRole, loading: authLoading, authenticated } = useAuth();
  const navigate = useNavigate();

const [todasLasPrendas, setTodasLasPrendas] = useState([]);

  const [categorias, setCategorias] = useState([]);

const [textoBusqueda, setTextoBusqueda] = useState('');

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [eliminando, setEliminando] = useState(false);

const [stockMap, setStockMap] = useState(undefined);

useEffect(() => {
    getCategorias()
      .then(cats => setCategorias(cats))
      .catch(err => console.error('Error al cargar categorías:', err));

if (!authLoading && authenticated) {
      getAllStock()
        .then(stocks => {
          const mapa = {};
          stocks.forEach(s => {
            mapa[s.prendaId] = (mapa[s.prendaId] || 0) + (s.cantidad || 0);
          });
          setStockMap(mapa);
        })
        .catch(() => setStockMap({}));
    }
  }, [authLoading]);

useEffect(() => {

if (authLoading) return;

    const cargarPrendas = async () => {
      try {
        setLoading(true);
        setError(null);
        const prendas = categoriaSeleccionada
          ? await getPrendasByCategoria(categoriaSeleccionada)
          : await getPrendas();
        setTodasLasPrendas(prendas);
      } catch (err) {
        setError('No se pudieron cargar los productos. Revisá tu conexión.');
        console.error('Error al cargar prendas:', err);
      } finally {
        setLoading(false);
      }
    };
    cargarPrendas();
  }, [categoriaSeleccionada, authLoading]);

const recargarPrendas = async () => {
    try {
      setLoading(true);
      setError(null);
      const prendas = categoriaSeleccionada
        ? await getPrendasByCategoria(categoriaSeleccionada)
        : await getPrendas();
      setTodasLasPrendas(prendas);
    } catch (err) {
      setError('Error al recargar los productos.');
    } finally {
      setLoading(false);
    }
  };

const prendasFiltradas = todasLasPrendas.filter(prenda =>

    prenda.nombre.toLowerCase().includes(textoBusqueda.toLowerCase().trim())
  );

const handleEliminar = async (prendaId) => {

    const confirmar = window.confirm('¿Estás segura de que querés eliminar esta prenda? Esta acción no se puede deshacer.');
    if (!confirmar) return;

    try {
      setEliminando(true);
      await deletePrenda(prendaId);
      await recargarPrendas();
    } catch (err) {
      alert('No se pudo eliminar la prenda. Intentá de nuevo.');
      console.error('Error al eliminar prenda:', err);
    } finally {
      setEliminando(false);
    }
  };

const handleEditar = (prenda) => {

    navigate(`/admin/productos/editar/${prenda.id}`);
  };

return (
    <div style={estiloPage}>

<div style={estiloHeader}>
        <div>
          <h1 style={{ margin: '0 0 6px' }}>Catálogo de Prendas</h1>
          <p style={{ margin: 0, color: 'var(--color-text-soft)', fontSize: '15px' }}>
            {prendasFiltradas.length} prenda{prendasFiltradas.length !== 1 ? 's' : ''} encontrada{prendasFiltradas.length !== 1 ? 's' : ''}
          </p>
        </div>

{hasRole('ADMIN') && (
          <button
            style={estiloBtnNuevaPrenda}
            onClick={() => navigate('/admin/productos/nueva')}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-gold-dark)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-gold)'}
          >
            + Nueva Prenda
          </button>
        )}
      </div>

<div style={estiloFiltros}>

<div style={estiloInputWrapper}>

          <span style={estiloIconoBusqueda}>🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre de prenda..."
            value={textoBusqueda}
            onChange={e => setTextoBusqueda(e.target.value)}
            style={estiloInputBusqueda}
          />

          {textoBusqueda && (
            <button
              onClick={() => setTextoBusqueda('')}
              style={estiloBtnLimpiarInput}
              title="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>

<select
          value={categoriaSeleccionada}
          onChange={e => setCategoriaSeleccionada(e.target.value)}
          style={estiloSelect}
        >

          <option value="">Todas las categorías</option>

{categorias.map(cat => (
            <option key={cat.idCategoria} value={cat.nombreCategoria}>
              {cat.nombreCategoria}
            </option>
          ))}
        </select>

{(textoBusqueda || categoriaSeleccionada) && (
          <button
            onClick={() => {
              setTextoBusqueda('');
              setCategoriaSeleccionada('');
            }}
            style={estiloBtnLimpiarFiltros}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-soft)'}
          >
            Limpiar filtros
          </button>
        )}
      </div>

{eliminando && (
        <p style={{ color: 'var(--color-text-soft)', fontSize: '14px', margin: '0 0 12px' }}>
          Eliminando prenda...
        </p>
      )}

<CardGrid
        prendas={prendasFiltradas}
        loading={loading}
        error={error}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        stockMap={stockMap}
      />

    </div>
  );
}

const estiloPage = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '32px 24px',
};

const estiloHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '16px',
  marginBottom: '28px',
};

const estiloBtnNuevaPrenda = {
  padding: '10px 20px',
  backgroundColor: 'var(--color-gold)',
  color: '#fff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const estiloFiltros = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
  marginBottom: '28px',
  alignItems: 'center',
};

const estiloInputWrapper = {
  position: 'relative',
  flex: '1',
  minWidth: '200px',
};

const estiloIconoBusqueda = {
  position: 'absolute',
  left: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '14px',
  pointerEvents: 'none',
};

const estiloInputBusqueda = {
  width: '100%',
  paddingLeft: '32px',
  paddingRight: '32px',
  paddingTop: '10px',
  paddingBottom: '10px',
  fontSize: '14px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-bg-input)',
  color: 'var(--color-text)',
  boxSizing: 'border-box',
};

const estiloBtnLimpiarInput = {
  position: 'absolute',
  right: '8px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  fontSize: '18px',
  color: 'var(--color-text-light)',
  cursor: 'pointer',
  padding: '0',
  lineHeight: 1,
};

const estiloSelect = {
  padding: '10px 12px',
  fontSize: '14px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-bg-input)',
  color: 'var(--color-text)',
  cursor: 'pointer',
  minWidth: '180px',
};

const estiloBtnLimpiarFiltros = {
  padding: '10px 14px',
  backgroundColor: 'var(--color-bg-soft)',
  color: 'var(--color-text-soft)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

export default ProductosPage;

