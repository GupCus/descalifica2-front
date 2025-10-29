import { Piloto } from "@/entities/piloto.entity.ts";
import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

const getCountryFlag = (nationality: string): string => {
  if (!nationality) return "";

  const normalizedName = nationality
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  try {
    return new URL(
      `../../assets/banderas-paises/${normalizedName}.png`,
      import.meta.url
    ).href;
  } catch {
    return "";
  }
};

function GetPiloto() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [piloto, setPiloto] = useState<Piloto | null>(
    location.state?.piloto || null
  );
  const [loading, setLoading] = useState(!location.state?.piloto);
  const [error, setError] = useState<string | null>(null);

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  useEffect(() => {
    if (location.state?.piloto) return;
    
    if (!id) return;

    fetch(`${api}/pilotos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Datos del piloto:", data); // <-- Agrega esto
        setPiloto(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, api, location.state]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-xl text-white">Cargando piloto...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!piloto) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Piloto no encontrado</div>
      </div>
    );
  }

  const flagUrl = getCountryFlag(piloto.nationality);

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${flagUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) brightness(0.4)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10">
        <div className="w-full max-w-4xl mx-8">
          <Link
            to="/pilotos"
            className="inline-block mb-6 text-gray-300 hover:text-white transition-all bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 hover:border-blue-500"
          >
            ← Volver al listado
          </Link>

          <div className="bg-gray-950/80 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-blue-700/40">
            <h1
              className="text-blue-100 mt-5 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase mb-8"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              {piloto.name} 
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                  Nacionalidad
                </h3>
                <div className="flex items-center gap-3">
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={piloto.nationality}
                      className="w-12 h-8 object-cover rounded shadow-lg"
                    />
                  )}
                  <p className="text-2xl font-bold text-white">
                    {piloto.nationality}
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                  Número
                </h3>
                <p className="text-2xl font-bold text-white">
                  #{piloto.num}
                </p>
              </div>

              {piloto.team && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                  <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                    Escudería
                  </h3>
                  <p className="text-2xl font-bold text-white">
                    {piloto.team.name}
                  </p>
                </div>
              )}

              {piloto.racing_series && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                  <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                    Categoría
                  </h3>
                  <p className="text-2xl font-bold text-white">
                    {piloto.racing_series.name}
                  </p>
                </div>
              )}

              {piloto.birth_date && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                  <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                    Fecha de Nacimiento
                  </h3>
                  <p className="text-2xl font-bold text-white">
                    {new Date(piloto.birth_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {piloto.wdcs && piloto.wdcs > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                  <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                    Campeonatos
                  </h3>
                  <p className="text-2xl font-bold text-white">
                    {piloto.wdcs} 🏆
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetPiloto;