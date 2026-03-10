import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPrendas } from '../services/productoService';
import { getAllStock, createStock, updateStock, deleteStock, getSucursales } from '../services/compraService';

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

const estiloInput = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '14px',
  backgroundColor: 'var(--color-bg)',
  color: 'var(--color-text)',
  boxSizing: 'border-box',
};

const estiloLabel = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '6px',
  color: 'var(--color-text)',
};

function AdminStockPage() {
  const navigate = useNavigate();

const [stocks,    setStocks]    = useState([]);
  const [prendas,   setPrendas]   = useState([]);
  const [sucursales,setSucursales]= useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

const [modalAbierto, setModalAbierto] = useState(false);
  const [modalModo,    setModalModo]    = useState('crear');
  const [modalDatos,   setModalDatos]   = useState(null);

const [form,       setForm]      = useState({ prendaId: '', idSucursal: '', cantidad: '' });
  const [formError,  setFormError] = useState(null);
  const [guardando,  setGuardando] = useState(false);

const overlayRef = useRef(null);

useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [stockData, prendasData, sucursalesData] = await Promise.all([
        getAllStock(),
        getPrendas(),
        getSucursales(),
      ]);
      setStocks(stockData);
      setPrendas(prendasData);
      setSucursales(sucursalesData);
    } catch (err) {
      setError('No se pudieron cargar los datos de stock. Verificá que el backend esté activo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const nombrePrenda = (prendaId) => {
    const p = prendas.find(p => p.id === prendaId || p.id === Number(prendaId));
    return p?.nombre ?? `ID ${prendaId}`;
  };

  const nombreSucursal = (idSucursal) => {
    const s = sucursales.find(s => s.idSucursal === idSucursal || s.idSucursal === Number(idSucursal));
    return s?.nombreSucursal ?? s?.nombre ?? `Sucursal ${idSucursal}`;
  };

const abrirModalCrear = () => {
    setModalModo('crear');
    setModalDatos(null);
    setForm({

      prendaId:   prendas[0]?.id   ?? '',
      idSucursal: sucursales[0]?.idSucursal ?? '',
      cantidad:   '',
    });
    setFormError(null);
    setModalAbierto(true);
  };

const abrirModalEditar = (stock) => {
    setModalModo('editar');
    setModalDatos(stock);
    setForm({
      prendaId:   stock.prendaId,
      idSucursal: stock.idSucursal,
      cantidad:   stock.cantidad,
    });
    setFormError(null);
    setModalAbierto(true);
  };

const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setFormError(null);
  };

const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleGuardar = async (e) => {
    e.preventDefault();

if (!form.prendaId || !form.idSucursal) {
      setFormError('Seleccioná una prenda y una sucursal.');
      return;
    }
    const cantidadNum = Number(form.cantidad);
    if (isNaN(cantidadNum) || cantidadNum < 0) {
      setFormError('La cantidad debe ser un número mayor o igual a 0.');
      return;
    }

    const payload = {
      prendaId:   Number(form.prendaId),
      idSucursal: Number(form.idSucursal),
      cantidad:   cantidadNum,
    };

    try {
      setGuardando(true);
      setFormError(null);

      if (modalModo === 'crear') {
        await createStock(payload);
      } else {
        await updateStock(modalDatos.idStock, payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      const msg = err.response?.data || 'No se pudo guardar el stock. Intentá de nuevo.';
      setFormError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setGuardando(false);
    }
  };

const handleEliminar = async (stock) => {
    const prenda = nombrePrenda(stock.prendaId);
    const suc    = nombreSucursal(stock.idSucursal);

    const confirmar = window.confirm(
      `¿Eliminár el stock de "${prenda}" en ${suc} (${stock.cantidad} unidades)?\n\n` +
      `⚠️ Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    try {
      await deleteStock(stock.idStock);
      await cargarDatos();
    } catch (err) {
      const msg = err.response?.data || 'No se pudo eliminar el registro de stock.';
      alert(msg);
    }
  };

if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-soft)' }}>Cargando stock...</p>
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
          <h1 style={{ margin: '0 0 4px' }}>Gestión de Stock</h1>
          <p style={{ margin: 0, color: 'var(--color-text-soft)', fontSize: '14px' }}>
            {stocks.length} registro{stocks.length !== 1 ? 's' : ''} de stock
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/admin')} style={estiloBtnSecundario}>
            ← Volver al panel
          </button>
          <button onClick={abrirModalCrear} style={estiloBtnPrimario}>
            + Nuevo Stock
          </button>
        </div>
      </div>

{stocks.length === 0 ? (
        <div style={{
          padding: '50px',
          textAlign: 'center',
          color: 'var(--color-text-soft)',
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', margin: '0 auto 16px' }} />
          <p style={{ margin: '0 0 16px' }}>No hay registros de stock todavía.</p>
          <button onClick={abrirModalCrear} style={estiloBtnPrimario}>
            Agregar primer stock
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
                <th style={estiloCeldaHeader}>Prenda</th>
                <th style={estiloCeldaHeader}>Sucursal</th>
                <th style={estiloCeldaHeader}>Cantidad</th>
                <th style={{ ...estiloCeldaHeader, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, idx) => (
                <tr
                  key={stock.idStock}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--color-bg-soft)',
                  }}
                >

                  <td style={{ ...estiloCelda, fontWeight: '600', color: 'var(--color-text)' }}>
                    {nombrePrenda(stock.prendaId)}
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
                      {nombreSucursal(stock.idSucursal)}
                    </span>
                  </td>

<td style={estiloCelda}>
                    <span style={{
                      fontWeight: '700',
                      fontSize: '15px',
                      color: stock.cantidad === 0
                        ? 'var(--color-danger)'
                        : stock.cantidad <= 3
                        ? '#e67e22'
                        : 'var(--color-text)',
                    }}>
                      {stock.cantidad}
                    </span>
                    {stock.cantidad === 0 && (
                      <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--color-danger)', fontWeight: '600' }}>
                        SIN STOCK
                      </span>
                    )}
                    {stock.cantidad > 0 && stock.cantidad <= 3 && (
                      <span style={{ marginLeft: '8px', fontSize: '11px', color: '#e67e22', fontWeight: '600' }}>
                        BAJO
                      </span>
                    )}
                  </td>

<td style={{ ...estiloCelda, textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => abrirModalEditar(stock)} style={estiloBtnSecundario}>
                        Editar
                      </button>
                      <button onClick={() => handleEliminar(stock)} style={estiloBtnEliminar}>
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

{modalAbierto && (

        <div
          ref={overlayRef}
          onClick={(e) => { if (e.target === overlayRef.current) cerrarModal(); }}
          style={{
            position:  'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >

          <div style={{
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-md)',
            padding: '28px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <h2 style={{ margin: 0, fontSize: '18px' }}>
                {modalModo === 'crear' ? 'Nuevo registro de stock' : 'Editar stock'}
              </h2>
              <button
                onClick={cerrarModal}
                disabled={guardando}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-soft)', lineHeight: 1 }}
              >
                ×
              </button>
            </div>

<form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

<div>
                <label style={estiloLabel}>Prenda</label>
                <select
                  name="prendaId"
                  value={form.prendaId}
                  onChange={handleChange}
                  required
                  style={estiloInput}
                >
                  <option value="" disabled>Seleccioná una prenda</option>
                  {prendas.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

<div>
                <label style={estiloLabel}>Sucursal</label>
                <select
                  name="idSucursal"
                  value={form.idSucursal}
                  onChange={handleChange}
                  required
                  style={estiloInput}
                >
                  <option value="" disabled>Seleccioná una sucursal</option>
                  {sucursales.map(s => (
                    <option key={s.idSucursal} value={s.idSucursal}>
                      {s.nombreSucursal ?? s.nombre ?? `Sucursal ${s.idSucursal}`}
                    </option>
                  ))}
                </select>
              </div>

<div>
                <label style={estiloLabel}>Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  value={form.cantidad}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="Ej: 10"
                  style={estiloInput}
                />
              </div>

{formError && (
                <p style={{ margin: 0, color: 'var(--color-danger)', fontSize: '13px' }}>
                  ⚠️ {formError}
                </p>
              )}

<div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={cerrarModal}
                  disabled={guardando}
                  style={estiloBtnSecundario}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  style={{ ...estiloBtnPrimario, opacity: guardando ? 0.7 : 1 }}
                >
                  {guardando ? 'Guardando...' : (modalModo === 'crear' ? 'Crear' : 'Guardar cambios')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStockPage;
