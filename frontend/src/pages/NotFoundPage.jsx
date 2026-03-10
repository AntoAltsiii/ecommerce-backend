import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '500px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
      <p style={{ fontSize: '80px', margin: 0 }}>🔍</p>
      <h1 style={{ fontSize: '28px', margin: '10px 0' }}>Página no encontrada</h1>
      <p style={{ color: '#666', marginBottom: '25px' }}>
        La URL que ingresaste no existe.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '12px 25px',
          backgroundColor: '#1a1a2e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '15px',
          cursor: 'pointer'
        }}
      >
        ← Volver al inicio
      </button>
    </div>
  );
}

export default NotFoundPage;
