const obtenerColor = (condicion) => {
  if (condicion === 'Frío')     return '#4a90d9';
  if (condicion === 'Templado') return 'var(--color-gold)';
  if (condicion === 'Calor')    return '#e67e22';
  return 'var(--color-gold)';
};

function WeatherWidget({ temperatura, humedad, condicion, esDeDia, pronostico }) {
  const color   = obtenerColor(condicion);
  const tempRedondeada = temperatura != null ? Math.round(temperatura) : '--';

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-card)',
      border: `2px solid ${color}`,
      borderRadius: 'var(--radius-md)',
      padding: '24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: 'var(--shadow-card)',
      maxWidth: '420px',
    }}>

<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff', textAlign: 'center', lineHeight: 1.2 }}>
            {esDeDia ? 'DÍA' : 'NOCHE'}
          </span>
        </div>
        <div>
          <div style={{
            fontSize: '48px',
            fontWeight: '800',
            color: color,
            lineHeight: 1,
          }}>
            {tempRedondeada}°C
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: color,
            marginTop: '2px',
          }}>
            {condicion} · {esDeDia ? 'Día' : 'Noche'}
          </div>
        </div>
      </div>

<div style={{
        display: 'flex',
        gap: '20px',
        fontSize: '14px',
        color: 'var(--color-text-soft)',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '12px',
      }}>
        <span>Humedad: <strong>{humedad}%</strong></span>
      </div>

{pronostico && (
        <div style={{
          backgroundColor: 'var(--color-bg-soft)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          fontSize: '13px',
          color: 'var(--color-text-soft)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '6px',
        }}>
          <span>Hoy: <strong>{pronostico.condicionEsperada}</strong></span>
          {pronostico.tempMaxima != null && (
            <span>
              Máx <strong style={{ color: '#e67e22' }}>{Math.round(pronostico.tempMaxima)}°</strong>
              {' / '}
              Mín <strong style={{ color: '#4a90d9' }}>{Math.round(pronostico.tempMinima)}°</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;
