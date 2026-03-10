import Card from './Card';

function CardGrid({ prendas, loading, error, onEditar, onEliminar, stockMap }) {

if (loading) {
    return (
      <div style={estiloContenedor}>

        {[...Array(8)].map((_, i) => (
          <div key={i} style={estiloSkeleton}>

            <div style={estiloSkeletonImagen} />

            <div style={{ padding: '14px 16px' }}>
              <div style={{ ...estiloSkeletonLinea, width: '60%', marginBottom: '8px' }} />
              <div style={{ ...estiloSkeletonLinea, width: '80%', marginBottom: '8px' }} />
              <div style={{ ...estiloSkeletonLinea, width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

if (error) {
    return (
      <div style={estiloMensajeCentrado}>
        <p style={{ fontSize: '40px', margin: '0 0 12px' }}>⚠️</p>
        <p style={{ color: 'var(--color-danger)', fontWeight: '600', margin: '0 0 6px' }}>
          Error al cargar los productos
        </p>
        <p style={{ color: 'var(--color-text-soft)', fontSize: '14px', margin: 0 }}>
          {error}
        </p>
      </div>
    );
  }

if (!prendas || prendas.length === 0) {
    return (
      <div style={estiloMensajeCentrado}>
        <p style={{ fontSize: '40px', margin: '0 0 12px' }}>🔍</p>
        <p style={{ color: 'var(--color-text)', fontWeight: '600', margin: '0 0 6px' }}>
          No se encontraron prendas
        </p>
        <p style={{ color: 'var(--color-text-soft)', fontSize: '14px', margin: 0 }}>
          Probá con otro filtro o categoría.
        </p>
      </div>
    );
  }

return (
    <div style={estiloContenedor}>
      {prendas.map(prenda => (

        <Card
          key={prenda.id}
          prenda={prenda}
          onEditar={onEditar}
          onEliminar={onEliminar}
          stock={stockMap ? (stockMap[prenda.id] ?? 0) : undefined}
        />
      ))}
    </div>
  );
}

const estiloContenedor = {
  display: 'grid',

gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: '20px',
};

const estiloMensajeCentrado = {
  gridColumn: '1 / -1',
  textAlign: 'center',
  padding: '60px 20px',
  backgroundColor: 'var(--color-bg-soft)',
  borderRadius: 'var(--radius-md)',
  border: '2px dashed var(--color-border)',
};

const estiloSkeleton = {
  backgroundColor: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
  animation: 'pulse 1.5s ease-in-out infinite',
};

const estiloSkeletonImagen = {
  width: '100%',
  height: '200px',
  backgroundColor: 'var(--color-bg-soft)',
};

const estiloSkeletonLinea = {
  height: '14px',
  backgroundColor: 'var(--color-bg-soft)',
  borderRadius: '4px',
};

export default CardGrid;
