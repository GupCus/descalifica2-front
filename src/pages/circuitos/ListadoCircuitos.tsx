import { useEffect, useState } from 'react';
import { ChromaGrid } from '@/components/ui/Chroma-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Circuito } from '@/entities/circuito.entity.ts';
import { getCircuito } from '@/services/circuito.service.ts';
import { Link } from 'react-router-dom';

// Helper function para obtener la bandera del país automáticamente
const getCountryFlag = (country: string): string => {
  if (!country) return '';

  // Mapa de casos especiales (opcional, para nacionalidades con nombres diferentes al archivo)
  const specialCases: Record<string, string> = {
    'Reino Unido': 'UK',
    'Estados Unidos': 'USA',
    'Países Bajos': 'Paises_Bajos',
    'Emiratos Árabes Unidos': 'EAU',
    Baréin: 'bahrain',
    Barein: 'bahrain',
    Azerbaiyán: 'Azerbaiyan',
  };

  // Si hay un caso especial, usarlo
  if (specialCases[country]) {
    return new URL(
      `../../assets/banderas-paises/${specialCases[country]}.png`,
      import.meta.url
    ).href;
  }

  // Normalizar el nombre del país para que coincida con los archivos
  const normalizedName = country
    .normalize('NFD') // Descompone caracteres con acentos
    .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
    .replace(/\s+/g, '_') // Reemplaza espacios con guiones bajos
    .replace(/[^a-zA-Z0-9_]/g, ''); // Elimina caracteres especiales

  // Construye la ruta automáticamente
  try {
    return new URL(
      `../../assets/banderas-paises/${normalizedName}.png`,
      import.meta.url
    ).href;
  } catch {
    return '';
  }
};

// Helper function para obtener la imagen del circuito automáticamente desde assets
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

function ListadoCircuitos() {
  const [circuitos, setCircuitos] = useState<Circuito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCircuito()
      .then((data) => setCircuitos(data))
      .catch((err) => {
        setError(err.message);
        console.error('Error cargando circuitos', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <ChromaGrid />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-12 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="bg-slate-900/50 border-slate-700 overflow-hidden h-40"
              >
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-6 w-32" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500">Error cargando circuitos: {error}</div>
      </div>
    );
  }
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full blur-sm opacity-70"
        style={{
          backgroundImage: `url(${
            new URL('../../assets/circuitosFondo.jpg', import.meta.url).href
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <ChromaGrid />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="mb-6 text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
            Circuitos
          </h1>
        </header>

        {circuitos.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle>No hay circuitos disponibles</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {circuitos.map((circuito) => {
              const flagUrl = getCountryFlag(circuito.country);
              const circuitoImgUrl = getImagenCircuito(circuito.name);
              return (
                <Link
                  to={`/circuito/${circuito.id}`}
                  key={circuito.id}
                  className="block"
                >
                  <Card
                    key={circuito.id}
                    className="relative bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden group cursor-pointer py-0 border-t-0 border-b-0"
                  >
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={circuitoImgUrl}
                        alt={circuito.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // reemplazar con placeholder si no existe
                          target.src = new URL(
                            '../../assets/descalifica2logo.png',
                            import.meta.url
                          ).href;
                          target.className =
                            'absolute inset-0 w-full h-full object-contain bg-slate-900/50';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-top from-slate-900/90 via-slate-900/30 to-transparent"></div>

                      {flagUrl && (
                        <div className="absolute top-4 right-4 z-10">
                          <img
                            src={flagUrl}
                            alt={`Bandera de ${circuito.country}`}
                            className="w-14 h-10 object-cover rounded shadow-2xl border-2 border-white/20"
                          />
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <h3 className="text-2xl font-bold text-white tracking-tight">
                          {circuito.name}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListadoCircuitos;
