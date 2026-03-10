import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { buscarOCrearUsuario } from '../services/usuarioService';
import { updateUbicacion, getRecomendacion } from '../services/climaService';
import WeatherWidget from '../components/clima/WeatherWidget';

function PrendaCard({ prenda }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate('/productos')}
      title="Ver en catálogo"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-card)',
        transition: 'transform 0.15s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
    >

      {prenda.imagenUrl ? (
        <img
          src={prenda.imagenUrl}
          alt={prenda.nombre}
          style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '140px',
          backgroundColor: 'var(--color-bg-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ width: '28px', height: '3px', backgroundColor: 'var(--color-gold)', borderRadius: '2px', display: 'block' }} />
        </div>
      )}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ display: 'block', width: '24px', height: '3px', backgroundColor: 'var(--color-gold)', borderRadius: '2px' }} />
        <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: 'var(--color-text)' }}>
          {prenda.nombre}
        </p>
        {prenda.precio != null && (
          <p style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: 'var(--color-gold)' }}>
            ${prenda.precio.toLocaleString('es-AR')}
          </p>
        )}
        {prenda.razon && (
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-soft)', fontStyle: 'italic' }}>
            {prenda.razon}
          </p>
        )}
      </div>
    </div>
  );
}

function RecomendacionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

const [paso, setPaso]               = useState('cargando');
  const [userId, setUserId]           = useState(null);
  const [recomendacion, setReco]      = useState(null);
  const [errorMsg, setErrorMsg]       = useState(null);

  const [statusMsg, setStatusMsg]     = useState('');

useEffect(() => {
    if (!user) return;
    inicializar();
  }, [user]);

  const inicializar = async () => {
    try {
      setPaso('cargando');
      setStatusMsg('Buscando tu perfil...');

const u = await buscarOCrearUsuario(user, 'sin dirección');
      setUserId(u.idUsuario);

setStatusMsg('Buscando recomendaciones...');
      const reco = await getRecomendacion(u.idUsuario);
      setReco(reco);
      setPaso('listo');
    } catch (err) {

const data    = err.response?.data;
      const mensaje = (typeof data === 'string' ? data : data?.message ?? err.message ?? '').toLowerCase();
      if (err.response?.status === 500 && mensaje.includes('ubicaci')) {

        setPaso('sin-ubicacion');
      } else if (err.response?.status === 500) {

setPaso('sin-ubicacion');
      } else {
        setErrorMsg('No se pudieron cargar las recomendaciones. Verificá que el backend esté activo.');
        setPaso('error');
      }
    } finally {
      setStatusMsg('');
    }
  };

const obtenerUbicacionYRecargar = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Tu browser no soporta geolocalización. Probá con Chrome o Firefox.');
      setPaso('error');
      return;
    }

    setPaso('obteniendo');
    setStatusMsg('Esperando permiso de geolocalización...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          setStatusMsg('Guardando tu ubicación...');
          await updateUbicacion(userId, lat, lon);

          setStatusMsg('Obteniendo recomendaciones...');
          const reco = await getRecomendacion(userId);
          setReco(reco);
          setPaso('listo');
        } catch (err) {
          setErrorMsg('No se pudo obtener la recomendación. Intentá de nuevo.');
          setPaso('error');
        } finally {
          setStatusMsg('');
        }
      },
      (geoError) => {
        const msgs = {
          1: 'Denegaste el permiso de ubicación. Habilitalo en la configuración del browser.',
          2: 'No se pudo determinar tu ubicación. Intentá de nuevo.',
          3: 'La solicitud de ubicación tardó demasiado. Intentá de nuevo.',
        };
        setErrorMsg(msgs[geoError.code] || 'No se pudo obtener tu ubicación.');
        setPaso('sin-ubicacion');
        setStatusMsg('');
      },
      { timeout: 10000 }
    );
  };

if (paso === 'cargando' || paso === 'obteniendo') {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-soft)', fontSize: '16px' }}>{statusMsg || 'Cargando...'}</p>
      </div>
    );
  }

  if (paso === 'sin-ubicacion') {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ margin: '0 0 8px' }}>Recomendación por Clima</h1>
        <p style={{ color: 'var(--color-text-soft)', marginBottom: '32px' }}>
          Te recomendamos qué prendas usar según el clima de tu zona.
        </p>

        <div style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '40px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
        }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '20px' }}>Necesitamos tu ubicación</h2>
          <p style={{ color: 'var(--color-text-soft)', margin: '0 0 8px', fontSize: '14px' }}>
            Para recomendarte ropa según el clima necesitamos saber dónde estás.
            <br />Tu ubicación se guarda en tu perfil para no pedirla siempre.
          </p>
          {errorMsg && (
            <p style={{ color: 'var(--color-danger)', fontSize: '13px', margin: '12px 0' }}>
              {errorMsg}
            </p>
          )}
          <button
            onClick={obtenerUbicacionYRecargar}
            style={{
              marginTop: '20px',
              padding: '12px 28px',
              backgroundColor: 'var(--color-gold)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Compartir mi ubicación
          </button>
        </div>
      </div>
    );
  }

  if (paso === 'error') {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-danger)', marginBottom: '24px' }}>{errorMsg}</p>
        <button
          onClick={inicializar}
          style={{
            padding: '10px 24px',
            backgroundColor: 'var(--color-bg-soft)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px' }}>

<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px' }}>Recomendación por Clima</h1>
          <p style={{ margin: 0, color: 'var(--color-text-soft)', fontSize: '14px' }}>
            Basado en el clima de tu zona te sugerimos qué ponerte hoy.
          </p>
        </div>
        <button
          onClick={obtenerUbicacionYRecargar}
          style={{
            padding: '9px 16px',
            backgroundColor: 'var(--color-bg-soft)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '13px',
            color: 'var(--color-text)',
          }}
        >
          Actualizar ubicación
        </button>
      </div>

<div style={{ marginBottom: '32px' }}>
        <WeatherWidget
          temperatura={recomendacion.temperaturaActual}
          humedad={recomendacion.humedad}
          condicion={recomendacion.condicion}
          esDeDia={recomendacion.esDeDia}
          pronostico={recomendacion.pronostico}
        />
      </div>

<p style={{
        fontSize: '17px',
        fontWeight: '600',
        color: 'var(--color-text)',
        margin: '0 0 24px',
        padding: '14px 18px',
        backgroundColor: 'var(--color-bg-soft)',
        borderRadius: 'var(--radius-sm)',
        borderLeft: '4px solid var(--color-gold)',
      }}>
        {recomendacion.mensaje?.replace(/[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u2600-\u27BF\uFE00-\uFE0F]/gu, '').trim()}
      </p>

{recomendacion.prendas && recomendacion.prendas.length > 0 ? (
        <>
          <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>Prendas sugeridas para hoy</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}>
            {recomendacion.prendas.map((p) => (
              <PrendaCard key={p.idPrenda} prenda={p} />
            ))}
          </div>
        </>
      ) : (
        <div style={{
          padding: '30px',
          textAlign: 'center',
          color: 'var(--color-text-soft)',
          backgroundColor: 'var(--color-bg-soft)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '28px',
        }}>
          <p style={{ margin: 0, fontSize: '15px' }}>
            No hay prendas específicas en el catálogo para este clima todavía.
            <br />
            <span style={{ fontSize: '13px' }}>
              El admin puede agregar prendas con nombres como "frio", "templado" o "calor" para que aparezcan aquí.
            </span>
          </p>
        </div>
      )}

<div style={{ textAlign: 'center', marginTop: '8px' }}>
        <button
          onClick={() => navigate('/productos')}
          style={{
            padding: '11px 24px',
            backgroundColor: 'var(--color-gold)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Ver catálogo completo →
        </button>
      </div>
    </div>
  );
}

export default RecomendacionPage;
