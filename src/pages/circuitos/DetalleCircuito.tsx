import { Circuito } from '@/entities/circuito.entity.ts';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const getCountryFlag = (nationality: string): string => {
  try {
    return new URL(
      `../../assets/banderas-paises/${nationality}.png`,
      import.meta.url
    ).href;
  } catch {
    return '';
  }
};

const getImagenCircuito = (name: string): string => {
  if (!name) return '';

  // Normalizar el nombre del circuito para que coincida con los archivos
  const normalizedName = name
    .toLowerCase() // Convertir a minúsculas
    .normalize('NFD') // Descompone caracteres con acentos
    .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/[^a-z0-9-]/g, ''); // Elimina caracteres especiales

  // Buscar siempre en assets
  try {
    return new URL(
      `../../assets/circuitos/${normalizedName}.png`,
      import.meta.url
    ).href;
  } catch {
    return '';
  }
};

function DetalleCircuito() {
  const { id } = useParams<{ id: string }>();
  const [circuito, setCircuito] = useState<Circuito | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    if (!id) return;

    fetch(`${api}/circuitos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCircuito(data.data ?? data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, api]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-xl text-white">Cargando circuito...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!circuito) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-xl text-white">Circuito no encontrado</div>
      </div>
    );
  }

  const flagUrl = getCountryFlag(circuito.country);
  const circuitoImgUrl = getImagenCircuito(circuito.name);

  return (
    <div className="relative min-h-screen ">
      <div
        className="absolute inset-0 w-full h-full blur-sm opacity-70"
        style={{
          backgroundImage: `url(${circuitoImgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className=" w-full max-w-4xl mx-8">
        <Link
          to="/circuitos"
          className="inline-block mb-6 text-gray-300 hover:text-white transition-all bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 hover:border-red-500"
        >
          ← Volver al listado
        </Link>

        <div className="bg-gray-950/70 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-red-700/40">
          <h1
            className="text-white-100 mt-5 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase mb-8"
            style={{ fontFamily: "'Oswald',sans-serif" }}
          >
            {circuito.name}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                País
              </h3>
              <div className="flex items-center gap-3 overflow-visible">
                {flagUrl && (
                  <img
                    src={flagUrl}
                    alt={circuito.country}
                    className="w-12 h-8 object-cover rounded shadows-lg overflow-hidden"
                  />
                )}
                <p className="text-2xl font-bold text-white">
                  {circuito.country}
                </p>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                Longitud
              </h3>
              <p className="text-2xl font-bold text-white">
                {circuito.length} km
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                Año de Inaguración
              </h3>
              <p className="text-2xl font-bold text-white">{circuito.year}</p>
            </div>
            <div>
              <img src={circuito.track_map_url} alt={circuito.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleCircuito;
