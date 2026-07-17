import { useEffect, useState, PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthService } from "../services/auth.service";

const RutaProtegida = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState<Boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();
  }, []);

  // Mientras verifica la autenticación, muestra un loading o null
  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza las rutas hijas
  return <>{children}</>;
};

export default RutaProtegida;
