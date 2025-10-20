import { Escuderia } from "@/entities/escuderia.entity.ts";
import { getEscuderia } from "@/services/escuderia.service.ts";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function GetEscuderia() {
  const [escuderias, setEscuderias] = useState<Escuderia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEscuderia()
      .then(data => setEscuderias(data))
      .catch(err => {
        setError(err.message);
        setLoading(false);
        console.error("Error cargando escuderías", err);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando escuderías...</div>
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Escuderías</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {escuderias.map((escuderia) => (
            <div
              key={escuderia.id}
              className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-bold mb-3">{escuderia.name}</h3>
              <div className="space-y-2 mb-4">
                <p className="text-gray-400">
                  <span className="font-semibold">Nacionalidad:</span>{" "}
                  {escuderia.nationality}
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold">Motor:</span>{" "}
                  {escuderia.engine}
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold">Categoría:</span>{" "}
                  {escuderia.categoria.name}
                </p>
              </div>

              {/* Botón para ver más información */}
              <Link
                to={`/escuderias/${escuderia.id}`}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded-lg transition"
              >
                Ver más información
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/menuadmin"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            ← Volver al menú
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GetEscuderia;
