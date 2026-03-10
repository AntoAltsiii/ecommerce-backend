import { useNavigate } from 'react-router-dom';

const estiloCard = {
  padding: '22px 20px',
  backgroundColor: 'var(--color-bg-card)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  minWidth: '160px',
  textAlign: 'left',
  boxShadow: 'var(--shadow-card)',
  transition: 'box-shadow 0.2s, transform 0.15s',
};

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

      <h1 style={{ margin: '0 0 6px' }}>Panel de Administración</h1>
      <p style={{ color: 'var(--color-text-soft)', margin: '0 0 32px' }}>
        Desde acá gestionás el catálogo, el stock y todas las compras del sistema.
      </p>

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>

<button
          onClick={() => navigate('/admin/productos')}
          style={estiloCard}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <span style={{ display: 'block', width: '28px', height: '3px', backgroundColor: 'var(--color-gold)', borderRadius: '2px', marginBottom: '14px' }} />
          <strong>Gestión de Prendas</strong>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-soft)' }}>
            Ver, editar y eliminar prendas
          </p>
        </button>

<button
          onClick={() => navigate('/admin/productos/nueva')}
          style={{ ...estiloCard, borderColor: 'var(--color-gold)', borderWidth: '2px' }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <span style={{ display: 'block', width: '28px', height: '3px', backgroundColor: 'var(--color-gold)', borderRadius: '2px', marginBottom: '14px' }} />
          <strong style={{ color: 'var(--color-gold)' }}>Nueva Prenda</strong>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-soft)' }}>
            Agregar prenda al catálogo
          </p>
        </button>

<button
          onClick={() => navigate('/admin/categorias')}
          style={estiloCard}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <span style={{ display: 'block', width: '28px', height: '3px', backgroundColor: 'var(--color-gold)', borderRadius: '2px', marginBottom: '14px' }} />
          <strong>Categorías</strong>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-soft)' }}>
            Crear, editar y eliminar categorías
          </p>
        </button>

<button
          onClick={() => navigate('/admin/stock')}
          style={estiloCard}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <span style={{ display: 'block', width: '28px', height: '3px', backgroundColor: 'var(--color-gold)', borderRadius: '2px', marginBottom: '14px' }} />
          <strong>Stock</strong>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-soft)' }}>
            Control de inventario por sucursal
          </p>
        </button>

<button
          onClick={() => navigate('/admin/compras')}
          style={estiloCard}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <span style={{ display: 'block', width: '28px', height: '3px', backgroundColor: 'var(--color-gold)', borderRadius: '2px', marginBottom: '14px' }} />
          <strong>Compras</strong>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-soft)' }}>
            Ver y gestionar todas las compras
          </p>
        </button>

      </div>

    </div>
  );
}

export default AdminPage;

