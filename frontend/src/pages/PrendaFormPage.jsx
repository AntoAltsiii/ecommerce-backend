import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPrendaById, createPrenda, updatePrenda, getCategorias } from "../services/productoService";

function PrendaFormPage() {

const { id } = useParams();
  const navigate = useNavigate();

const modoEdicion = Boolean(id);
  const idNumerico = id ? Number(id) : null;

const [form, setForm] = useState({
    nombre:      '',
    precio:      '',
    imagenUrl:   '',
    categoriaId: '',
  });

const [categorias, setCategorias] = useState([]);

const [cargando, setCargando]         = useState(true);
  const [guardando, setGuardando]       = useState(false);
  const [error, setError]               = useState(null);
  const [erroresForm, setErroresForm]   = useState({});

useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError(null);

const cats = await getCategorias();
        setCategorias(cats);

if (modoEdicion) {
          const prenda = await getPrendaById(idNumerico);
          setForm({
            nombre:      prenda.nombre,
            precio:      prenda.precio_Actual,
            imagenUrl:   prenda.imagenUrl || '',

            categoriaId: prenda.categoriaId?.toString() || '',
          });
        }

      } catch (err) {
        setError(modoEdicion
          ? 'No se pudieron cargar los datos de la prenda.'
          : 'No se pudieron cargar las categorías.'
        );
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [modoEdicion, idNumerico]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (erroresForm[name]) {
      setErroresForm(prev => ({ ...prev, [name]: null }));
    }
  };

const validar = () => {
    const errores = {};

    if (!form.nombre.trim()) {
      errores.nombre = 'El nombre es requerido.';
    }

    const precio = parseFloat(form.precio);
    if (!form.precio || isNaN(precio) || precio <= 0) {
      errores.precio = 'El precio debe ser un número mayor a cero.';
    }

    if (!form.categoriaId) {
      errores.categoriaId = 'Seleccioná una categoría.';
    }

if (form.imagenUrl.trim()) {
      try {
        new URL(form.imagenUrl.trim());
      } catch {
        errores.imagenUrl = 'Ingresá una URL válida (debe empezar con http:// o https://)';
      }
    }

    return errores;
  };

const handleSubmit = async (e) => {
    e.preventDefault();

const errores = validar();
    if (Object.keys(errores).length > 0) {
      setErroresForm(errores);
      return;
    }

const body = {
      nombre:       form.nombre.trim(),
      precio_Actual: parseFloat(form.precio),
      imagenUrl:    form.imagenUrl.trim() || null,
      categoria:    { idCategoria: Number(form.categoriaId) },
    };

    try {
      setGuardando(true);
      setError(null);

      if (modoEdicion) {
        await updatePrenda(idNumerico, body);
      } else {
        await createPrenda(body);
      }

navigate('/productos');

    } catch (err) {

      const mensajeBackend = err.response?.data || null;
      setError(mensajeBackend || 'Ocurrió un error al guardar la prenda. Intentá de nuevo.');
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

if (cargando) {
    return (
      <div style={estiloPage}>
        <p style={{ color: 'var(--color-text-soft)' }}>⏳ Cargando...</p>
      </div>
    );
  }

return (
    <div style={estiloPage}>

<button
        onClick={() => navigate(-1)}
        style={estiloBtnVolver}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-soft)'}
      >
        ← Volver
      </button>

<h1 style={{ margin: '12px 0 6px' }}>
        {modoEdicion ? 'Editar Prenda' : 'Nueva Prenda'}
      </h1>
      <p style={{ color: 'var(--color-text-soft)', margin: '0 0 28px' }}>
        {modoEdicion
          ? 'Modificá los campos que querés actualizar.'
          : 'Completá el formulario para agregar una nueva prenda al catálogo.'}
      </p>

{error && (
        <div style={estiloError}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={estiloForm}>

<div style={estiloGrupo}>
          <label style={estiloLabel} htmlFor="nombre">
            Nombre de la prenda *
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Remera básica blanca"
            style={{
              ...estiloInput,
              borderColor: erroresForm.nombre ? 'var(--color-danger)' : undefined,
            }}
          />
          {erroresForm.nombre && <p style={estiloErrorCampo}>{erroresForm.nombre}</p>}
        </div>

<div style={estiloGrupo}>
          <label style={estiloLabel} htmlFor="precio">
            Precio (ARS) *
          </label>
          <input
            id="precio"
            name="precio"
            type="number"
            min="1"
            step="0.01"
            value={form.precio}
            onChange={handleChange}
            placeholder="Ej: 5000"
            style={{
              ...estiloInput,
              borderColor: erroresForm.precio ? 'var(--color-danger)' : undefined,
            }}
          />
          {erroresForm.precio && <p style={estiloErrorCampo}>{erroresForm.precio}</p>}
        </div>

<div style={estiloGrupo}>
          <label style={estiloLabel} htmlFor="categoriaId">
            Categoría *
          </label>
          <select
            id="categoriaId"
            name="categoriaId"
            value={form.categoriaId}
            onChange={handleChange}
            style={{
              ...estiloInput,
              borderColor: erroresForm.categoriaId ? 'var(--color-danger)' : undefined,
            }}
          >
            <option value="">-- Seleccionar categoría --</option>
            {categorias.map(cat => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
                {cat.nombreCategoria}
              </option>
            ))}
          </select>
          {erroresForm.categoriaId && <p style={estiloErrorCampo}>{erroresForm.categoriaId}</p>}
        </div>

<div style={estiloGrupo}>
          <label style={estiloLabel} htmlFor="imagenUrl">
            URL de imagen <span style={{ color: 'var(--color-text-light)', fontSize: '12px' }}>(opcional)</span>
          </label>
          <input
            id="imagenUrl"
            name="imagenUrl"
            type="url"
            value={form.imagenUrl}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            style={{
              ...estiloInput,
              borderColor: erroresForm.imagenUrl ? 'var(--color-danger)' : undefined,
            }}
          />
          {erroresForm.imagenUrl && <p style={estiloErrorCampo}>{erroresForm.imagenUrl}</p>}

{form.imagenUrl && !erroresForm.imagenUrl && (
            <div style={estiloPreviewImagen}>
              <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--color-text-soft)' }}>
                Vista previa:
              </p>
              <img
                src={form.imagenUrl}
                alt="Vista previa"
                style={{ maxWidth: '160px', maxHeight: '160px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
        </div>

<div style={estiloBotones}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={estiloBtnCancelar}
            disabled={guardando}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-soft)'}
          >
            Cancelar
          </button>

          <button
            type="submit"
            style={{
              ...estiloBtnGuardar,
              opacity: guardando ? 0.7 : 1,
              cursor: guardando ? 'not-allowed' : 'pointer',
            }}
            disabled={guardando}
            onMouseEnter={e => !guardando && (e.currentTarget.style.backgroundColor = 'var(--color-gold-dark)')}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-gold)'}
          >
            {guardando
              ? 'Guardando...'
              : modoEdicion
                ? 'Guardar cambios'
                : 'Crear prenda'}
          </button>
        </div>

      </form>
    </div>
  );
}

const estiloPage = {
  maxWidth: '640px',
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

const estiloError = {
  padding: '12px 16px',
  backgroundColor: 'var(--color-danger-bg)',
  border: '1px solid var(--color-danger)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-danger)',
  marginBottom: '20px',
  fontSize: '14px',
};

const estiloForm = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const estiloGrupo = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const estiloLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: 'var(--color-text)',
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
  margin: 0,
  fontSize: '12px',
  color: 'var(--color-danger)',
};

const estiloPreviewImagen = {
  marginTop: '8px',
};

const estiloBotones = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end',
  paddingTop: '8px',
};

const estiloBtnCancelar = {
  padding: '10px 20px',
  backgroundColor: 'var(--color-bg-soft)',
  color: 'var(--color-text-soft)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '14px',
  cursor: 'pointer',
};

const estiloBtnGuardar = {
  padding: '10px 24px',
  backgroundColor: 'var(--color-gold)',
  color: '#fff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '14px',
  fontWeight: '600',
};

export default PrendaFormPage;
