import { useEffect, useState } from "react";
import { ChromaGrid } from "@/components/ui/Chroma-grid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getEscuderia } from "@/services/escuderia.service.ts";
import { Escuderia } from "@/entities/escuderia.entity.ts";
import { Link } from "react-router-dom";
import { getAssetUrl } from "@/utils/asset.util.ts";

function ListadoEscuderias() {
  const [escuderias, setEscuderias] = useState<Escuderia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paises, setPaises] = useState<string[]>([]);
  const [filtroPaisF1, setFiltroPaisF1] = useState<string>("null");

  useEffect(() => {
    getEscuderia()
      .then((data) => {
        setEscuderias(data);
        const naciones = Array.from(
          new Set(data.map((e: Escuderia) => e.nationality).filter(Boolean)),
        );
        setPaises(naciones);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Error cargando escuderías", err);
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
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="bg-slate-900/50 border-slate-700 overflow-hidden py-0 border-t-0 border-b-0"
              >
                <Skeleton className="h-52 sm:h-64 w-full" />
                <CardHeader className="p-3 sm:p-6">
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-1/2" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <Skeleton className="h-3 sm:h-4 w-full mb-2" />
                  <Skeleton className="h-3 sm:h-4 w-2/3" />
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
        <div
          className="absolute inset-0 w-full h-full blur-sm opacity-35"
          style={{
            backgroundImage: `url(${
              new URL("../../assets/vers-lec.jpg", import.meta.url).href
            })`,
            backgroundSize: "auto 100%",
            backgroundPosition: "center",
          }}
        />
        <ChromaGrid />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <Card className="bg-red-900/50 border-red-700">
            <CardHeader>
              <CardTitle className="text-red-200">Error</CardTitle>
              <CardDescription className="text-red-300">
                {error}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  //Separamos por categoria
  const f2Escuderias = escuderias.filter((e) => {
    if (!e.racing_series) return false;
    return e.racing_series.name === "F2";
  });

  const f1Escuderias = escuderias.filter((e) => {
    if (!e.racing_series) return false;
    return e.racing_series.name === "F1";
  });

  const escuderiasF1Filtradas = f1Escuderias.filter(
    (e) => filtroPaisF1 === "null" || e.nationality === filtroPaisF1,
  );

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full blur-sm opacity-35"
        style={{
          backgroundImage: `url(${
            new URL("../../assets/vers-lec.jpg", import.meta.url).href
          })`,
          backgroundSize: "auto 100%",
          backgroundPosition: "center",
        }}
      />
      <ChromaGrid />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div>
          <img
            src={new URL("../../assets/f1-logo.png", import.meta.url).href}
            alt="Logo de Formula 1"
            className="mx-auto w-40 sm:w-50 h-auto object-contain"
          />
        </div>
        <div className="mb-6 max-w-md mx-auto">
          <h4 className="mb-1 ml-3 font-semibold text-xs sm:text-sm text-gray-300">Filtrar por país</h4>
          <Select value={filtroPaisF1} onValueChange={setFiltroPaisF1}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar escuderías por país" />
            </SelectTrigger>
            <SelectContent className="border-none">
              <SelectItem value="null">Todas las escuderías</SelectItem>
              {paises.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {escuderiasF1Filtradas.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">No hay escuderías F1</CardTitle>
              <CardDescription className="text-slate-400">
                Aún no se han registrado escuderías en el sistema.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {escuderiasF1Filtradas.map((escuderia) => {
              const flagUrl = getAssetUrl(
                `/flags/${escuderia.nationality}.svg`,
              );
              const logoUrl = getAssetUrl(escuderia.logo_image);

              return (
                <Link to={`/escuderia/${escuderia.id}`} key={escuderia.id}>
                  <Card 
                    className="relative bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden group cursor-pointer py-0 border-t-0 border-b-0"
                  >
                    <div className="relative w-full h-52 sm:h-64 overflow-hidden">
                      <img
                        src={logoUrl}
                        alt={`Logo de ${escuderia.name}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/src/assets/descalifica2logo.png";
                          target.className =
                            "absolute inset-0 w-full h-full object-contain bg-slate-900/50";
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>

                      {flagUrl && (
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                          <img
                            src={flagUrl}
                            alt={`Bandera de ${escuderia.nationality}`}
                            className="w-8 h-6 sm:w-14 sm:h-10 object-cover rounded shadow-2xl border border-white/20 sm:border-2"
                          />
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 z-10">
                        <h3 className="text-base sm:text-2xl font-bold text-white tracking-tight leading-tight line-clamp-2">
                          {escuderia.name}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 sm:mt-12">
          <img
            src={new URL("../../assets/f2-logo.png", import.meta.url).href}
            alt="Logo de Formula 2"
            className="mx-auto w-40 sm:w-50 h-auto object-contain"
          />
        </div>
        <div className="mt-4">
          {f2Escuderias.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  No hay escuderías F2
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Aún no se han registrado escuderías en el sistema.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-8">
              {f2Escuderias.map((escuderia) => {
                const flagUrl = getAssetUrl(
                  `/flags/${escuderia.nationality}.svg`,
                );
                const logoUrl = getAssetUrl(escuderia.logo_image);
                return (
                  <Link to={`/escuderia/${escuderia.id}`} key={escuderia.id}>
                    <Card
                      className="relative bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden group cursor-pointer py-0 border-t-0 border-b-0"
                    >
                      <div className="relative w-full h-52 sm:h-64 overflow-hidden">
                        <img
                          src={logoUrl}
                          alt={`Logo de ${escuderia.name}`}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/src/assets/descalifica2logo.png";
                            target.className =
                              "absolute inset-0 w-full h-full object-contain bg-slate-900/50";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                        {flagUrl && (
                          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                            <img
                              src={flagUrl}
                              alt={`Bandera de ${escuderia.nationality}`}
                              className="w-8 h-6 sm:w-14 sm:h-10 object-cover rounded shadow-2xl border border-white/20 sm:border-2"
                            />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 z-10">
                          <h3 className="text-base sm:text-2xl font-bold text-white tracking-tight leading-tight line-clamp-2">
                            {escuderia.name}
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
    </div>
  );
}

export default ListadoEscuderias;
