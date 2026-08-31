import { useEffect, useState } from "react";
import { ChromaGrid } from "@/components/ui/Chroma-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Circuito } from "@/entities/circuito.entity.ts";
import { getCircuito } from "@/services/circuito.service.ts";
import { Link } from "react-router-dom";
import { getAssetUrl } from "@/utils/asset.util.ts";

function ListadoCircuitos() {
  const [circuitos, setCircuitos] = useState<Circuito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCircuito()
      .then((data) => setCircuitos(data))
      .catch((err) => {
        setError(err.message);
        console.error("Error cargando circuitos", err);
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="bg-slate-900/50 border-slate-700 overflow-hidden py-0 border-t-0 border-b-0"
              >
                <Skeleton className="h-44 sm:h-56 w-full" />
                <CardHeader className="p-3 sm:p-6">
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <Skeleton className="h-3 sm:h-4 w-full" />
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
            new URL("../../assets/circuitosFondo.jpg", import.meta.url).href
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <ChromaGrid />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="mb-6 text-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
            {circuitos.map((circuito) => {
              const flagUrl = getAssetUrl(`/flags/${circuito.country}.svg`);
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
                    <div className="relative w-full h-44 sm:h-56 overflow-hidden">
                      <img
                        src={getAssetUrl(circuito.track_map_image)}
                        alt={circuito.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = new URL(
                            "../../assets/descalifica2logo.png",
                            import.meta.url,
                          ).href;
                          target.className =
                            "absolute inset-0 w-full h-full object-contain bg-slate-900/50";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>

                      {flagUrl && (
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                          <img
                            src={flagUrl}
                            alt={`Bandera de ${circuito.country}`}
                            className="w-8 h-6 sm:w-14 sm:h-10 object-cover rounded shadow-2xl border border-white/20 sm:border-2"
                          />
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 z-10">
                        <h3 className="text-base sm:text-2xl font-bold text-white tracking-tight leading-tight line-clamp-2">
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
