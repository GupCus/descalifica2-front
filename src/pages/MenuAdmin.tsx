import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import fondoPitwall from "../assets/Pitwall.jpg";

function MenuAdmin() {
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoPitwall})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.4)",
        }}
      />

      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen">
        <div className="bg-gray-950/50 backdrop-blur-md rounded-lg p-12 shadow-2xl border border-gray-700/30 max-w-4xl w-full mx-8">
          <h1
            className="text-gray-100 text-6xl font-black tracking-wider text-center mb-16 uppercase"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Menú Admin
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Link to="nuevopiloto" className="w-full">
              <Button className="w-full h-12 bg-slate-600 hover:bg-slate-700 text-white font-semibold shadow-lg shadow-slate-900/50 border-0 transition-all hover:scale-105">
                Nuevo PILOTO
              </Button>
            </Link>
            <Link to="nuevocircuito" className="w-full">
              <Button className="w-full h-12 bg-slate-600 hover:bg-slate-700 text-white font-semibold shadow-lg shadow-slate-900/50 border-0 transition-all hover:scale-105">
                Nuevo CIRCUITO
              </Button>
            </Link>
            <Link to="nuevaescuderia" className="w-full">
              <Button className="w-full h-12 bg-slate-600 hover:bg-slate-700 text-white font-semibold shadow-lg shadow-slate-900/50 border-0 transition-all hover:scale-105">
                Nueva ESCUDERÍA
              </Button>
            </Link>
            <Link to="nuevacarrera" className="w-full">
              <Button className="w-full h-12 bg-slate-600 hover:bg-slate-700 text-white font-semibold shadow-lg shadow-slate-900/50 border-0 transition-all hover:scale-105">
                Nueva CARRERA
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="nuevasesion" className="w-full">
              <Button className="w-full h-12 bg-slate-600 hover:bg-slate-700 text-white font-semibold shadow-lg shadow-slate-900/50 border-0 transition-all hover:scale-105">
                Nueva SESIÓN
              </Button>
            </Link>
            <Link to="nuevamarca" className="w-full">
              <Button className="w-full h-12 bg-slate-600 hover:bg-slate-700 text-white font-semibold shadow-lg shadow-slate-900/50 border-0 transition-all hover:scale-105">
                Nueva MARCA
              </Button>
            </Link>
            <Link to="nuevacategoria" className="w-full">
              <Button className="w-full h-12 bg-slate-600 hover:bg-slate-700 text-white font-semibold shadow-lg shadow-slate-900/50 border-0 transition-all hover:scale-105">
                Nueva CATEGORÍA
              </Button>
            </Link>
            <Link to="nuevatemporada" className="w-full">
              <Button className="w-full h-12 bg-slate-600 hover:bg-slate-700 text-white font-semibold shadow-lg shadow-slate-900/50 border-0 transition-all hover:scale-105">
                Nueva TEMPORADA
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuAdmin;
