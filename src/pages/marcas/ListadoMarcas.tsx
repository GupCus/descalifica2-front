import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChromaGrid } from "@/components/ui/Chroma-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Marca } from "@/entities/marca.entity.ts";
import { getMarca } from "@/services/marca.service.ts";
import { getAssetUrl } from "@/utils/asset.util.ts";

function ListadoMarcas() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMarca()
      .then((data) => setMarcas(data))
      .catch((err) => {
        setMarcas([]);
        setError("Error cargando marcas " + err);
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="bg-slate-900/50 border-slate-700 overflow-hidden py-0 border-t-0 border-b-0"
              >
                <Skeleton className="h-44 sm:h-48 w-full" />
                <CardHeader className="p-3 sm:p-4">
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
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
      <div className="relative min-h-screen">
        <ChromaGrid />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <Card className="bg-red-900/50 border-red-700">
            <CardHeader>
              <CardTitle className="text-red-200">Error</CardTitle>
              <div className="text-red-300">{error}</div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full blur-sm opacity-35"
        style={{
          backgroundImage: `url(${
            new URL("../../assets/fondomarcas.png", import.meta.url).href
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <ChromaGrid />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg uppercase">
            Marcas
          </h1>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {marcas.map((marca) => {
            const logo = getAssetUrl(marca.logo_image);
            const flagUrl = getAssetUrl(`/flags/${marca.nationality}.svg`);
            return (
              <Link to={`/marca/${marca.id}`} key={marca.id}>
                <Card className="relative bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden group cursor-pointer py-0 border-t-0 border-b-0">
                  <div className="relative w-full h-44 sm:h-48 overflow-hidden">
                    <img
                      src={logo}
                      alt={marca.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 overflow-hidden"
                      onError={(e) => {
                        const t = e.currentTarget as HTMLImageElement;
                        t.onerror = null;
                        t.src = new URL(
                          "../../assets/descalifica2logo.png",
                          import.meta.url,
                        ).href;
                        t.classList.add(
                          "object-contain",
                          "bg-slate-900/50",
                          "overflow-hidden",
                        );
                      }}
                    />
                    {flagUrl && (
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                        <img
                          src={flagUrl}
                          alt={`Bandera de ${marca.nationality}`}
                          className="w-8 h-6 sm:w-14 sm:h-10 object-cover rounded shadow-2xl border border-white/20 sm:border-2"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                      <h3 className="text-base sm:text-xl font-bold text-white tracking-tight leading-tight line-clamp-2">
                        {marca.name}
                      </h3>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ListadoMarcas;
