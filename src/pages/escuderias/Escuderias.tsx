import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Escuderia } from "@/entities/escuderia.entity.ts";
import { getOneEscuderia } from "@/services/escuderia.service.ts";

function Escuderias() {
  const { id } = useParams<{ id: string }>();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando escudería...</div>
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

  if (!escuderia) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">No se encontró la escudería</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Botón volver */}
        <Link
          to="/menuadmin"
          className="inline-block mb-6 text-blue-400 hover:text-blue-300"
        >
          ← Volver al menú
        </Link>

        {/* Card de la escudería */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold mb-6 text-center border-b border-gray-700 pb-4">
            {escuderia.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Fundación</p>
                <p className="text-xl font-semibold">{escuderia.fundation}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Nacionalidad</p>
                <p className="text-xl font-semibold">{escuderia.nationality}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Motor</p>
                <p className="text-xl font-semibold">{escuderia.engine}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Marca</p>
                <p className="text-xl font-semibold">{escuderia.brand.name}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Categoría</p>
                <p className="text-xl font-semibold">{escuderia.brand.name}</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              to={`/editarescuderia/${id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Editar
            </Link>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
              onClick={() => {
                if (confirm("¿Estás seguro de eliminar esta escudería?")) {
                  // Aquí irá la lógica de eliminación
                  console.log("Eliminar escudería", id);
                }
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Escuderias;
