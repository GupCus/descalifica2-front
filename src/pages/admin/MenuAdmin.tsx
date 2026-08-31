import { Button } from "@/components/ui/button.tsx";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  UserPlus,
  MapPin,
  Shield,
  Flag,
  Timer,
  Tag,
  Layers,
  Calendar,
  FileSpreadsheet,
  Users,
  ArrowLeft,
} from "lucide-react";
import fondoPitwall from "../../assets/Pitwall.jpg";

function MenuAdmin() {
  const location = useLocation();

  // Verifica si estamos en una subruta (contiene un / adicional después de menuadmin)
  const isSubruta = location.pathname !== "/menuadmin";

  if (isSubruta) {
    return <Outlet />;
  }

  const adminOptions = [
    { to: "nuevopiloto", label: "Nuevo Piloto", icon: UserPlus },
    { to: "nuevocircuito", label: "Nuevo Circuito", icon: MapPin },
    { to: "nuevaescuderia", label: "Nueva Escudería", icon: Shield },
    { to: "nuevacarrera", label: "Nueva Carrera", icon: Flag },
    { to: "nuevasesion", label: "Nueva Sesión", icon: Timer },
    { to: "nuevamarca", label: "Nueva Marca", icon: Tag },
    { to: "nuevacategoria", label: "Nueva Categoría", icon: Layers },
    { to: "nuevatemporada", label: "Nueva Temporada", icon: Calendar },
    { to: "cargarsesion", label: "Cargar Resultados", icon: FileSpreadsheet },
    { to: "adminusuarios", label: "Administrar Usuarios", icon: Users },
  ];

  return (
    <div className="relative min-h-screen py-6 sm:py-10 flex flex-col justify-center items-center px-3 sm:px-4">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoPitwall})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.35)",
        }}
      />

      <div className="relative z-10 max-w-3xl w-full mx-auto">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-all bg-gray-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-700/60 hover:border-gray-500 text-xs sm:text-sm"
          >
            <ArrowLeft size={14} />
            Volver al inicio
          </Link>
          <Link
            to="/perfil"
            className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-all bg-gray-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-700/60 hover:border-gray-500 text-xs sm:text-sm"
          >
            Mi Perfil
          </Link>
        </div>

        <div className="bg-gray-950/80 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-7 border border-gray-700/60 shadow-2xl">
          <h1
            className="text-gray-100 text-xl sm:text-3xl font-bold tracking-wider text-center uppercase mb-4 sm:mb-6"
            style={{
              fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
              letterSpacing: "0.08em",
            }}
          >
            Panel de Administración
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
            {adminOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <Link key={opt.to} to={opt.to} className="w-full">
                  <Button className="w-full h-11 sm:h-12 bg-slate-800/80 hover:bg-slate-700 text-gray-100 font-semibold border border-slate-700/60 hover:border-slate-500 shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm px-2 cursor-pointer">
                    <Icon size={15} className="text-blue-400 shrink-0" />
                    <span className="truncate">{opt.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuAdmin;
