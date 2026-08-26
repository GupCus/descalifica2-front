import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  AtSign,
  Mail,
  Send,
  ShieldCheck,
  Pencil,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthService } from "@/services/auth.service.ts";
import { apiClient } from "@/services/httpClient";
import fondoPerfil from "../assets/garageRB.jpg";

interface ProfileData {
  id: number;
  name: string;
  username: string;
  email: string;
  telegram_username: string | null;
  avatar_url: string | null;
  user_type?: string;
}

function Perfil() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const me = await AuthService.getCurrentUser();
        if (!me) {
          navigate("/login");
          return;
        }
        setUserRole(me.user_type || "user");

        const response = await apiClient.get<{ data: ProfileData }>(
          `/usuarios/${me.id}`,
        );
        setProfile(response.data.data);
      } catch (err: any) {
        console.error("Error al cargar perfil:", err);
        setError("Error al cargar los datos del perfil.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-400 text-lg">Cargando perfil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-4">
        <p className="text-red-400 text-lg">
          {error || "No se pudo encontrar el usuario."}
        </p>
        <Link
          to="/"
          className="text-gray-300 hover:text-white bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const resolvedAvatar = profile.avatar_url ?? null;
  const isAdmin = userRole === "admin" || profile.user_type === "admin";

  return (
    <div className="relative min-h-screen py-10 flex flex-col justify-start">
      {/* Fondo de pantalla */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoPerfil})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.35)",
        }}
      />

      <div className="relative z-10 max-w-2xl w-full mx-auto px-4">
        {/* Barra superior de navegación */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-all bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700/60 hover:border-gray-500"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
          {isAdmin && (
            <Link
              to="/menuadmin"
              className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-all bg-red-950/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-800/60 hover:border-red-600 text-sm"
            >
              <Shield size={16} />
              Panel de Admin
            </Link>
          )}
        </div>

        {/* Tarjeta de detalle de usuario */}
        <div className="bg-gray-950/75 backdrop-blur-md rounded-2xl p-8 border border-gray-700/60 shadow-2xl">
          <h1
            className="text-gray-200 mb-8 text-3xl md:text-4xl font-bold tracking-wider text-center uppercase"
            style={{
              fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            Mi Perfil
          </h1>

          {/* Encabezado con Avatar y Nombre */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 bg-gray-900 flex items-center justify-center shadow-xl">
              {resolvedAvatar ? (
                <img
                  src={resolvedAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-gray-400 font-bold">
                  {(profile.name || profile.username || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-white mt-4 text-center">
              {profile.name}
            </h2>
            <p className="text-gray-400 text-sm font-medium mt-0.5">
              @{profile.username}
            </p>

            <div className="mt-3">
              <Badge
                variant={isAdmin ? "destructive" : "default"}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  isAdmin ? "bg-red-600 text-white" : "bg-blue-600 text-white"
                }`}
              >
                {isAdmin ? "Administrador" : "Usuario"}
              </Badge>
            </div>
          </div>

          {/* Lista de Detalles */}
          <div className="space-y-4 border-t border-b border-gray-700/60 py-6 mb-8">
            <div className="flex items-center justify-between p-3.5 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-700/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                  <User size={18} />
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider block">
                    Nombre Completo
                  </span>
                  <span className="text-base text-gray-200 font-medium">
                    {profile.name || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-700/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                  <AtSign size={18} />
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider block">
                    Nombre de Usuario
                  </span>
                  <span className="text-base text-gray-200 font-medium">
                    {profile.username}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-700/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider block">
                    Correo Electrónico
                  </span>
                  <span className="text-base text-gray-200 font-medium">
                    {profile.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-700/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                  <Send size={18} />
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider block">
                    Usuario de Telegram
                  </span>
                  <span className="text-base text-gray-200 font-medium">
                    {profile.telegram_username ? (
                      `@${profile.telegram_username}`
                    ) : (
                      <span className="text-gray-500 italic">
                        No configurado
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-700/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider block">
                    Tipo de Cuenta
                  </span>
                  <span className="text-base text-gray-200 font-medium">
                    {isAdmin ? "Administrador" : "Usuario"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate("/perfil/editar")}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg font-medium cursor-pointer shadow-lg shadow-blue-900/20"
            >
              <Pencil size={18} />
              Editar Perfil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
