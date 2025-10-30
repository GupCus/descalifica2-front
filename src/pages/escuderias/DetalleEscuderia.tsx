import { Escuderia } from "@/entities/escuderia.entity.ts";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Trash2 } from "lucide-react";
import { deleteEscuderia, getOneEscuderia } from "@/services/escuderia.service.ts";

const getCountryFlag = (nationality: string): string => {
  try {
    return new URL(
      `../../assets/banderas-paises/${nationality}.png`,
      import.meta.url
    ).href;
  } catch {
    return "";
  }
};

const getEscuderiaLogo = (name: string): string => {
  if (!name) return "";

  const normalizedName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  try {
    return new URL(
      `../../assets/escuderias/${normalizedName}.png`,
      import.meta.url
    ).href;
  } catch {
    return "";
  }
};

function DetalleEscuderia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [escuderia, setEscuderia] = useState<Escuderia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No se proporcionó un ID");
      setLoading(false);
      return;
    }
    getOneEscuderia(parseInt(id))
      .then((data) => setEscuderia(data))
      .catch((err) => {
        setError(err.message);
        console.error("Error cargando escudería", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!escuderia?.id) return;

    if (confirm(`¿Estás seguro de eliminar "${escuderia.name}"?`)) {
      try {
        await deleteEscuderia(escuderia.id);
        navigate("/escuderias");
      } catch (err) {
        console.error("Error eliminando escudería", err);
        alert("Error al eliminar la escudería");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-xl text-white">Cargando escudería...</div>
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

  if (!escuderia) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Escudería no encontrada</div>
      </div>
    );
  }

  const logoUrl = getEscuderiaLogo(escuderia.name);
  const flagUrl = getCountryFlag(escuderia.nationality);

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${logoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) brightness(0.4)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10">
        <div className="w-full max-w-4xl mx-8">
          {/* ✅ Botones en la misma fila, uno a cada extremo */}
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/escuderias"
              className="inline-block text-gray-300 hover:text-white transition-all bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 hover:border-red-500"
            >
              ← Volver al listado
            </Link>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>

          <div className="bg-gray-950/70 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-red-700/40">
            <h1
              className="text-white-100 mt-5 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase mb-8"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              {escuderia.name}
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
                      alt={escuderia.nationality}
                      className="w-12 h-8 object-cover rounded shadow-lg"
                    />
                  )}
                  <p className="text-2xl font-bold text-white">
                    {escuderia.nationality}
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                  Motor
                </h3>
                <p className="text-2xl font-bold text-white">
                  {escuderia.engine}
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                  Marca
                </h3>
                <p className="text-2xl font-bold text-white">
                  {typeof escuderia.brand === "string"
                    ? escuderia.brand
                    : escuderia.brand?.name || "—"}
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                  Categoría
                </h3>
                <p className="text-2xl font-bold text-white">
                  {typeof escuderia.racing_series === "string"
                    ? escuderia.racing_series
                    : escuderia.racing_series?.name || "—"}
                </p>
              </div>

              {escuderia.fundation && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 md:col-span-2">
                  <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                    Año de Fundación
                  </h3>
                  <p className="text-2xl font-bold text-white">
                    {escuderia.fundation}
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

export default DetalleEscuderia;
