import { useCallback, useEffect, useState, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { AuthService, SessionCheckResult } from "../services/auth.service";
import { Button } from "@/components/ui/button";

const RutaProtegida = ({ children }: PropsWithChildren) => {
  const [sessionState, setSessionState] = useState<SessionCheckResult | null>(
    null,
  );
  const [retrying, setRetrying] = useState(false);

  const checkAuth = useCallback(async () => {
    setRetrying(true);
    const result = await AuthService.checkSession();
    setSessionState(result);
    setRetrying(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (sessionState === null) {
    return <div>Cargando...</div>;
  }

  if (sessionState.status === "network_error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="max-w-md w-full bg-gray-900 border border-amber-500/40 rounded-lg p-6 text-center space-y-4">
          <h2 className="text-lg font-semibold text-amber-300">
            Problema de conexión con el servidor
          </h2>
          <p className="text-sm text-gray-300">{sessionState.message}</p>
          <Button
            onClick={checkAuth}
            disabled={retrying}
            className="w-full cursor-pointer"
          >
            {retrying ? "Reintentando..." : "Reintentar"}
          </Button>
        </div>
      </div>
    );
  }

  if (sessionState.status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RutaProtegida;
