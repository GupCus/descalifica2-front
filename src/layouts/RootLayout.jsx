import { Outlet, NavLink } from 'react-router-dom';

function RootLayout() {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Sobre Nosotros
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Productos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/prueba"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Prueba
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/nuevoPiloto" className={({ isActive }) => (isActive ? "active" : "")}>
                Añadir un nuevo piloto
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>© 2025 Francisco Figueroa</p>
      </footer>
    </>
  );
}

export default RootLayout;