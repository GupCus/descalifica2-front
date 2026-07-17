import { useEffect, useState, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";

const RutaProtegidaAdmin = ({ children }: PropsWithChildren) => {
  const [isAdmin, setIsAdmin] = useState<Boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await AuthService.isAdmin();
      setIsAdmin(admin);
    };

    checkAdmin();
  }, []);

  // Mientras verifica si es admin, muestra un loading
  if (isAdmin === null) {
    return <div>Cargando...</div>;
  }

  // Si no es admin, redirige al home o login
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si es admin, renderiza los children
  return <>{children}</>;
};

export default RutaProtegidaAdmin;
