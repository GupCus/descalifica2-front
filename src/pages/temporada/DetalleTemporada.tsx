import { Temporada } from '@/entities/temporada.entity.ts';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';


function DetalleTemporada() {
  const { id } = useParams<{ id: string }>();
  const [temporada, setTemporada] = useState<Temporada | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    if (!id) return;

    fetch(`${api}/temporadas/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setTemporada(data.data ?? data);
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
        <div className="text-xl text-white">Cargando temporada...</div>
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

  if (!temporada) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-xl text-white">Temporada no encontrada</div>
      </div>
    );
  }



  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 w-full h-full -z-10 blur-sm opacity-20"
        style={{
          backgroundImage: `url(${new URL('../../assets/FondoDetalleTemporada.jpg', import.meta.url).href})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className=" w-full max-w-4xl mx-4 ">
        <div className="bg-gray-950/70 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-gray-700/40">
          <Link
            to="/temporadas"
            className="inline-block mb-6 text-gray-300 hover:text-white transition-all bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 hover:border-red-500"
          >
            ← Volver al listado
          </Link>
          <h1
            className="text-white-100 mt-5 scroll-m-20 text-4xl font-extrabold tracking-wider text-center uppercase mb-8"
            style={{ fontFamily: "'Oswald',sans-serif" }}
          >
            {temporada.year} - {temporada.racing_series.name}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                Campeón de Pilotos
              </h3>
              <p className="text-2xl font-bold text-white">{temporada.winner_driver?.name}</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                Campeón de Constructores
              </h3>
              <p className="text-2xl font-bold text-white">{temporada.winner_team?.name}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">Número de Carreras</h3>
              <p className="text-2xl font-bold text-white">{temporada.races?.length ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleTemporada;
