import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.tsx";
import { ChromaGrid } from "@/components/ui/Chroma-grid.tsx";
import AnimatedList from "@/components/ui/animated-list.tsx";
import { Temporada } from "@/entities/temporada.entity.ts";
import { getTemporada } from "@/services/temporada.service.ts";
import { useNavigate } from "react-router-dom";
import fondoTemporadas from "../../assets/fondo-temporadas.jpg";

function ListadoTemporadas() {
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTemporada()
      .then((data) => setTemporadas(data))
      .catch((err) => {
        console.error("Error fetching temporadas:", err);
        setError("Error al cargar las temporadas");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div
          className="absolute inset-0 w-full h-full blur-sm opacity-35 z-0"
          style={{
            backgroundImage: `url(${fondoTemporadas})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <ChromaGrid />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <Skeleton className="h-10 w-48 mx-auto mb-3" />
            <Skeleton className="h-5 w-72 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 sm:p-6 space-y-4"
              >
                <Skeleton className="h-12 w-36 mx-auto mb-4" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
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
          className="absolute inset-0 w-full h-full blur-sm opacity-35 z-0"
          style={{
            backgroundImage: `url(${fondoTemporadas})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <ChromaGrid />
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
          <Card className="bg-red-900/50 border-red-700">
            <CardHeader>
              <CardTitle className="text-red-200">Error</CardTitle>
              <CardDescription className="text-red-300">{error}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const f1Temporadas = temporadas.filter(
    (t) =>
      t.racing_series?.name === "F1" ||
      t.racing_series?.name === "Formula 1" ||
      t.racing_series?.name === "Fórmula 1",
  );
  const f2Temporadas = temporadas.filter(
    (t) =>
      t.racing_series?.name === "F2" ||
      t.racing_series?.name === "Formula 2" ||
      t.racing_series?.name === "Fórmula 2",
  );

  const SelectHandler = (list: Temporada[]) => (_label: string, index: number) => {
    const selectedTemporada = list[index];
    if (selectedTemporada) {
      navigate(`/temporada/${selectedTemporada.id}`);
    }
  };

  return (
    <div className="relative min-h-screen py-8 sm:py-12 flex flex-col justify-start">
      <div
        className="absolute inset-0 w-full h-full blur-sm opacity-45 z-0"
        style={{
          backgroundImage: `url(${fondoTemporadas})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <ChromaGrid />

      <div className="relative z-10 container mx-auto px-3 sm:px-4 max-w-5xl">
        <header className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg uppercase">
            Temporadas
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* F1 Section */}
          <div className="bg-slate-950/60 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
            <div className="flex justify-center mb-4">
              <img
                src={new URL("../../assets/f1-logo.png", import.meta.url).href}
                alt="Logo Formula 1"
                className="w-36 sm:w-44 h-auto object-contain"
              />
            </div>
            <div className="w-full flex-1">
              {f1Temporadas.length === 0 ? (
                <div className="text-slate-400 p-6 text-center text-sm">
                  No hay temporadas F1 registradas.
                </div>
              ) : (
                <AnimatedList
                  items={f1Temporadas.map((t) => `Temporada ${t.year}`)}
                  showGradients={false}
                  onItemSelect={SelectHandler(f1Temporadas)}
                  displayScrollbar={true}
                  className="w-full"
                />
              )}
            </div>
          </div>

          {/* F2 Section */}
          <div className="bg-slate-950/60 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
            <div className="flex justify-center mb-4">
              <img
                src={new URL("../../assets/f2-logo.png", import.meta.url).href}
                alt="Logo Formula 2"
                className="w-36 sm:w-44 h-auto object-contain"
              />
            </div>
            <div className="w-full flex-1">
              {f2Temporadas.length === 0 ? (
                <div className="text-slate-400 p-6 text-center text-sm">
                  No hay temporadas F2 registradas.
                </div>
              ) : (
                <AnimatedList
                  items={f2Temporadas.map((t) => `Temporada ${t.year}`)}
                  showGradients={false}
                  onItemSelect={SelectHandler(f2Temporadas)}
                  displayScrollbar={true}
                  className="w-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListadoTemporadas;