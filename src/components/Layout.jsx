import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const enlaces = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/sobre-mi', label: 'Sobre mí' },
  { to: '/habilidades', label: 'Habilidades' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/experiencia', label: 'Experiencia' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Layout() {
  const { isAuthenticated, authEnabled } = useAuth();

  return (
    <>
      <header>
        <nav className="navbar" aria-label="Principal">
          <h1 className="logo">JESÚS.DEV</h1>
          <ul className="menu">
            {enlaces.map((e) => (
              <li key={e.to}>
                <NavLink to={e.to} end={e.end}>
                  {e.label}
                </NavLink>
              </li>
            ))}
            <li className="menu-admin">
              <NavLink to="/admin/experiencias">
                {authEnabled && !isAuthenticated ? 'Acceder' : 'Admin'}
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>© 2026 Jesús David Mercado | Portafolio personal</p>
      </footer>
    </>
  );
}
