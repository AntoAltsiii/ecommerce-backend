import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

<Navbar />

<main style={{ flex: 1, backgroundColor: 'var(--color-bg)' }}>
        <Outlet />
      </main>

<footer style={{
        backgroundColor: 'var(--color-nav-bg)',
        borderTop: '2px solid var(--color-gold)',
        color: 'var(--color-text-light)',
        textAlign: 'center',
        padding: '16px',
        fontSize: '13px',
        letterSpacing: '0.5px',
      }}>
        ✦ ProyectoRopa — {new Date().getFullYear()}
      </footer>

    </div>
  );
}

export default Layout;
