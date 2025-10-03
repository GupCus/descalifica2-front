import { Outlet, NavLink } from 'react-router-dom';
import header from '../assets/Header.png';

// Función externa para manejar las clases activas
const estaSeleccionado = ({ isActive }) => (isActive ? "active" : "");

function RootLayout() {
  return (
    <>
      <header></header>

      <main>
        <aside>
          <nav className="sidebar-nav">
            <NavLink to="/" className="logo">
              <img src={header} alt="Home" />
            </NavLink>
            
            <NavLink to="/pilotos" className={estaSeleccionado}>
              Pilotos
            </NavLink>
            
            <NavLink to="/about" className={estaSeleccionado}>
              Sobre Nosotros
            </NavLink>
          </nav>
          
        </aside>

        <section className="content">
          <Outlet />
        </section>
      </main>

      <footer>
      </footer>
    </>
  );
}

export default RootLayout;