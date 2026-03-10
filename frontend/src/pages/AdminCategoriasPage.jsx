import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../services/productoService';

function AdminCategoriasPage() {
  const navigate = useNavigate();

const [categorias, setCategorias] = useState([]);

const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [errorNueva, setErrorNueva]           = useState(null);
  const [creando, setCreando]                 = useState(false);

const [editandoId, setEditandoId]         = useState(null);
  const [editandoNombre, setEditandoNombre] = useState('');
  const [errorEdicion, setErrorEdicion]     = useState(null);
  const [guardandoId, setGuardandoId]       = useState(null);

const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

const inputEdicionRef = useRef(null);

useEffect(() => {
    cargarCategorias();
  }, []);

useEffect(() => {
    if (editandoId !== null && inputEdicionRef.current) {
      inputEdicionRef.current.focus();
      inputEdicionRef.current.select();
    }
  }, [editandoId]);

const cargarCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const cats = await getCategorias();
      setCategorias(cats);
    } catch (err) {
      setError('No se pudieron cargar las categorías.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const handleCrear = async (e) => {
    e.preventDefault();

    const nombre = nuevaCategoria.trim();
    if (!nombre) {
      setErrorNueva('El nombre no puede estar vacío.');
      return;
    }

    try {
      setCreando(true);
      setErrorNueva(null);
      await createCategoria({ nombreCategoria: nombre });
      setNuevaCategoria('');
      await cargarCategorias();
    } catch (err) {
      const msg = err.response?.data || 'No se pudo crear la categoría.';
      setErrorNueva(msg);
    } finally {
      setCreando(false);
    }
  };

const iniciarEdicion = (cat) => {
    setEditandoId(cat.idCategoria);
    setEditandoNombre(cat.nombreCategoria);
    setErrorEdicion(null);
  };

const cancelarEdicion = () => {
    setEditandoId(null);
    setEditandoNombre('');
    setErrorEdicion(null);
  };

const handleGuardarEdicion = async (idCategoria) => {
    const nombre = editandoNombre.trim();
    if (!nombre) {
      setErrorEdicion('El nombre no puede estar vacío.');
      return;
    }

    try {
      setGuardandoId(idCategoria);
      setErrorEdicion(null);
      await updateCategoria(idCategoria, { nombreCategoria: nombre });
      setEditandoId(null);
      await cargarCategorias();
    } catch (err) {
      const msg = err.response?.data || 'No se pudo actualizar la categoría.';
      setErrorEdicion(msg);
    } finally {
      setGuardandoId(null);
    }
  };

const handleEliminar = async (cat) => {
    const confirmar = window.confirm(
      `¿Estás segura de que querés eliminar la categoría "${cat.nombreCategoria}"?\n\n` +
      `⚠️ Si tiene prendas asignadas, la operación puede fallar.`
    );
    if (!confirmar) return;

    try {
      await deleteCategoria(cat.idCategoria);
      await cargarCategorias();
    } catch (err) {
      const msg = err.response?.data || `No se pudo eliminar "${cat.nombreCategoria}". Verificá que no tenga prendas asignadas.`;
      alert(msg);
    }
  };

return (
    <div style={estiloPage}>

<button
        onClick={() => navigate('/admin')}
        style={estiloBtnVolver}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-soft)'}
      >
        ← Panel Admin
      </button>

      <h1 style={{ margin: '12px 0 6px' }}>Gestión de Categorías</h1>
      <p style={{ color: 'var(--color-text-soft)', margin: '0 0 28px' }}>
        Creá, editá y eliminá las categorías del catálogo.
      </p>

      {error && <div style={estiloErrorGlobal}>⚠️ {error}</div>}

<div style={estiloSeccion}>
        <h2 style={estiloTituloSeccion}>Nueva categoría</h2>
        <form onSubmit={handleCrear} style={estiloFormNueva}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={nuevaCategoria}
              onChange={e => {
                setNuevaCategoria(e.target.value);
                if (errorNueva) setErrorNueva(null);
              }}
              placeholder="Ej: Remeras de verano"
              style={{
                ...estiloInput,
                borderColor: errorNueva ? 'var(--color-danger)' : undefined,
              }}
              disabled={creando}
            />
            {errorNueva && <p style={estiloErrorCampo}>{errorNueva}</p>}
          </div>
          <button
            type="submit"
            style={{
              ...estiloBtnCrear,
              opacity: creando ? 0.7 : 1,
            }}
            disabled={creando}
            onMouseEnter={e => !creando && (e.currentTarget.style.backgroundColor = 'var(--color-gold-dark)')}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-gold)'}
          >
            {creando ? 'Creando...' : '+ Crear'}
          </button>
        </form>
      </div>

<div style={estiloSeccion}>
        <h2 style={estiloTituloSeccion}>
          Categorías existentes
          <span style={estiloContador}>{categorias.length}</span>
        </h2>

        {loading ? (
          <p style={{ color: 'var(--color-text-soft)' }}>⏳ Cargando...</p>
        ) : categorias.length === 0 ? (
          <div style={estiloVacia}>
            <p style={{ fontSize: '30px', margin: '0 0 10px' }}>📂</p>
            <p style={{ margin: 0, color: 'var(--color-text-soft)' }}>
              Todavía no hay categorías. ¡Creá la primera!
            </p>
          </div>
        ) : (
          <ul style={estiloLista}>
            {categorias.map(cat => (
              <li key={cat.idCategoria} style={estiloItem}>

                {editandoId === cat.idCategoria ? (

                  <div style={{ display: 'flex', gap: '8px', flex: 1, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        ref={inputEdicionRef}
                        type="text"
                        value={editandoNombre}
                        onChange={e => {
                          setEditandoNombre(e.target.value);
                          if (errorEdicion) setErrorEdicion(null);
                        }}
                        style={{
                          ...estiloInput,
                          borderColor: errorEdicion ? 'var(--color-danger)' : undefined,
                        }}

                        onKeyDown={e => {
                          if (e.key === 'Enter') handleGuardarEdicion(cat.idCategoria);
                          if (e.key === 'Escape') cancelarEdicion();
                        }}
                      />
                      {errorEdicion && <p style={estiloErrorCampo}>{errorEdicion}</p>}
                    </div>
                    <button
                      style={estiloBtnGuardarEdicion}
                      onClick={() => handleGuardarEdicion(cat.idCategoria)}
                      disabled={guardandoId === cat.idCategoria}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-gold-dark)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-gold)'}
                    >
                      {guardandoId === cat.idCategoria ? '...' : 'Guardar'}
                    </button>
                    <button
                      style={estiloBtnCancelarEdicion}
                      onClick={cancelarEdicion}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-soft)'}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (

                  <>
                    <span style={estiloNombreCategoria}>{cat.nombreCategoria}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={estiloBtnEditar}
                        onClick={() => iniciarEdicion(cat)}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-soft)'}
                      >
                        Editar
                      </button>
                      <button
                        style={estiloBtnEliminar}
                        onClick={() => handleEliminar(cat)}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5c6cb'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-danger-bg)'}
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}

              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

const estiloPage = {
  maxWidth: '700px',
  margin: '0 auto',
  padding: '32px 24px',
};

const estiloBtnVolver = {
  background: 'none',
  border: 'none',
  color: 'var(--color-text-soft)',
  fontSize: '14px',
  cursor: 'pointer',
  padding: 0,
};

const estiloErrorGlobal = {
  padding: '12px 16px',
  backgroundColor: 'var(--color-danger-bg)',
  border: '1px solid var(--color-danger)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-danger)',
  marginBottom: '20px',
  fontSize: '14px',
};

const estiloSeccion = {
  backgroundColor: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '20px 24px',
  marginBottom: '20px',
};

const estiloTituloSeccion = {
  margin: '0 0 16px',
  fontSize: '16px',
  color: 'var(--color-text)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const estiloContador = {
  backgroundColor: 'var(--color-bg-soft)',
  color: 'var(--color-text-soft)',
  fontSize: '12px',
  fontWeight: '600',
  padding: '2px 8px',
  borderRadius: '20px',
};

const estiloFormNueva = {
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
};

const estiloInput = {
  padding: '10px 12px',
  fontSize: '14px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-bg-input)',
  color: 'var(--color-text)',
  width: '100%',
  boxSizing: 'border-box',
};

const estiloErrorCampo = {
  margin: '4px 0 0',
  fontSize: '12px',
  color: 'var(--color-danger)',
};

const estiloBtnCrear = {
  padding: '10px 18px',
  backgroundColor: 'var(--color-gold)',
  color: '#fff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const estiloVacia = {
  textAlign: 'center',
  padding: '32px',
  backgroundColor: 'var(--color-bg-soft)',
  borderRadius: 'var(--radius-sm)',
};

const estiloLista = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const estiloItem = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 14px',
  backgroundColor: 'var(--color-bg-soft)',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
};

const estiloNombreCategoria = {
  fontSize: '14px',
  fontWeight: '500',
  color: 'var(--color-text)',
};

const estiloBtnEditar = {
  padding: '6px 12px',
  backgroundColor: 'var(--color-bg-soft)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '12px',
  cursor: 'pointer',
};

const estiloBtnEliminar = {
  padding: '6px 12px',
  backgroundColor: 'var(--color-danger-bg)',
  color: 'var(--color-danger)',
  border: '1px solid var(--color-danger)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '12px',
  cursor: 'pointer',
};

const estiloBtnGuardarEdicion = {
  padding: '10px 16px',
  backgroundColor: 'var(--color-gold)',
  color: '#fff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const estiloBtnCancelarEdicion = {
  padding: '10px 14px',
  backgroundColor: 'var(--color-bg-soft)',
  color: 'var(--color-text-soft)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

export default AdminCategoriasPage;
