import { useCallback, useEffect, useState, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { AuthService, SessionCheckResult } from "../services/auth.service";
import { isAdmin } from "@/utils/role.util.ts";
import { Button } from "@/components/ui/button";

const RutaProtegidaAdmin = ({ children }: PropsWithChildren) => {
  const [sessionState, setSessionState] = useState<SessionCheckResult | null>(
    null,
  );
  const [retrying, setRetrying] = useState(false);

  const checkAdmin = useCallback(async () => {
    setRetrying(true);
    const result = await AuthService.checkSession();
    setSessionState(result);
    setRetrying(false);
  }, []);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

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
            onClick={checkAdmin}
            disabled={retrying}
            className="w-full cursor-pointer"
          >
            {retrying ? "Reintentando..." : "Reintentar"}
          </Button>
        </div>
      </div>
    );
  }

  if (sessionState.status !== "authenticated" || !isAdmin(sessionState.user)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RutaProtegidaAdmin;
