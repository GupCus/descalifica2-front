import { Piloto } from "@/entities/piloto.entity.ts";
import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

const getCountryFlag = (nationality: string): string => {
  if (!nationality) return "";

  const specialCases: Record<string, string> = {
    "Reino Unido": "UK",
    "Estados Unidos": "USA",
    "Países Bajos": "Paises_Bajos",
    "Emiratos Árabes Unidos": "EAU",
    Baréin: "bahrain",
    Bahréin: "bahrain",
    Azerbaiyán: "Azerbaiyan",
  };

  if (specialCases[nationality]) {
    try {
      return new URL(
        `../../assets/banderas-paises/${specialCases[nationality]}.png`,
        import.meta.url
      ).href;
    } catch {
      return "";
    }
  }

  const normalizedName = nationality
    .normalize("NFD")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");

  try {
    return new URL(
      `../../assets/banderas-paises/${normalizedName}.png`,
      import.meta.url
    ).href;
  } catch {
    return "";
  }
};

const getPilotoPhoto = (name: string): string => {
  const normalizedName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  try {
    return new URL(
      `../../assets/pilotos/${normalizedName}.png`,
      import.meta.url
    ).href;
  } catch {
    return "https://via.placeholder.com/400x500/1e293b/cbd5e1?text=Piloto";
  }
};

function DetallePiloto() {
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
        setPiloto(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, api, location.state]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando piloto...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!piloto) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Piloto no encontrado</div>
      </div>
    );
  }

  const flagUrl = getCountryFlag(piloto.nationality);
  const photoUrl = getPilotoPhoto(piloto.name);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      {/* Foto del piloto difuminada de fondo */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url(${photoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(50px) brightness(0.4)",
        }}
      />

      {/* Efectos de luz */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Link
          to="/pilotos"
          className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Volver al listado
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border">
              <img
                src={photoUrl}
                alt={piloto.name}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x500/1e293b/cbd5e1?text=Piloto";
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/70 backdrop-blur-md rounded-lg p-6 shadow-lg border border-slate-700/50">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">{piloto.name}</h1>
                <div className="text-5xl font-bold text-primary">
                  #{piloto.num}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                <h3 className="text-sm font-semibold text-slate-400 mb-2">
                  NACIONALIDAD
                </h3>
                <div className="flex items-center gap-3">
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={`Bandera de ${piloto.nationality}`}
                      className="w-8 h-6 object-cover rounded shadow"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <p className="text-lg font-semibold text-white">
                    {piloto.nationality}
                  </p>
                </div>
              </div>

              {piloto.team && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    ESCUDERÍA
                  </h3>
                  <p className="text-lg font-semibold text-white">
                    {piloto.team.name}
                  </p>
                </div>
              )}

              {piloto.role && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    ROL
                  </h3>
                  <p className="text-lg font-semibold text-white">{piloto.role}</p>
                </div>
              )}

              {piloto.racing_series && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    CATEGORÍA
                  </h3>
                  <p className="text-lg font-semibold text-white">
                    {piloto.racing_series.name}
                  </p>
                </div>
              )}

              {piloto.birth_date && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all md:col-span-2">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    FECHA DE NACIMIENTO
                  </h3>
                  <p className="text-lg font-semibold text-white">
                    {new Date(piloto.birth_date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
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

export default DetallePiloto;
