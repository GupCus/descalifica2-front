import { useEffect, useState } from "react";
import { ChromaGrid } from "@/components/ui/Chroma-grid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Piloto } from "@/entities/piloto.entity.ts";
import { getPiloto } from "@/services/piloto.service.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Escuderia } from "@/entities/escuderia.entity.ts";
import { getEscuderia } from "@/services/escuderia.service.ts";
import { Link } from "react-router-dom";

// Helper para banderas
const getCountryFlag = (nationality?: string): string => {
  if (!nationality) return "";
  const specialCases: Record<string, string> = {
    "Reino Unido": "UK",
    "Estados Unidos": "USA",
    "Países Bajos": "Paises_Bajos",
    "Emiratos Árabes Unidos": "EAU",
    Baréin: "bahrain",
    Bahréin: "bahrain",
    Azerbaiyán: "Azerbaiyan",
  };
  if (specialCases[nationality]) {
    try {
      return new URL(
        `../../assets/banderas-paises/${specialCases[nationality]}.png`,
        import.meta.url
      ).href;
    } catch {
      return "";
    }
  }
  const normalizedName = nationality
    .normalize("NFD")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");
  try {
    return new URL(
      `../../assets/banderas-paises/${normalizedName}.png`,
      import.meta.url
    ).href;
  } catch {
    return "";
  }
};

// Helper para foto del piloto (intenta en assets/pilotos, sino placeholder)
const getPilotoPhoto = (name?: string): string => {
  if (!name) return "";
  const normalizedName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  // Try common extensions in order
  const exts = ["png", "webp", "jpg", "jpeg"];
  for (const ext of exts) {
    try {
      return new URL(
        `../../assets/pilotos/${normalizedName}.${ext}`,
        import.meta.url
      ).href;
    } catch {
      // continue
    }
  }
  return "";
};

const getRacingSeries = (cat?: { id?: string; name?: string } | string) => {
  if (!cat) return "";
  if (typeof cat === "string") return cat.trim().toLowerCase();
  return String(cat.name ?? "")
    .trim()
    .toLowerCase();
};

function ListadoPilotos() {
  const [pilotos, setPilotos] = useState<Piloto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [escuderias, setEscuderias] = useState<Escuderia[]>([]);
  const [filtroEscuderiaF1, setFiltroEscuderiaF1] = useState<string>("null");
  const [filtroEscuderiaF2, setFiltroEscuderiaF2] = useState<string>("null");

  useEffect(() => {
    getPiloto()
      .then((data) => setPilotos(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

    getEscuderia()
      .then((data) => setEscuderias(data))
      .catch((err) => {
        setEscuderias([]);
        console.error("Error cargando escuderías", err);
      });
  }, []);

  const f2Pilotos = pilotos.filter(
    (p) =>
      getRacingSeries(p.racing_series.name) === "f2" ||
      p.racing_series.name === "Fórmula 2"
  );
  const f1Pilotos = pilotos.filter(
    (p) =>
      getRacingSeries(p.racing_series.name) === "f1" ||
      p.racing_series.name === "Fórmula 1"
  );

  const f1Filtrados = f1Pilotos.filter(
    (p) =>
      filtroEscuderiaF1 === "null" ||
      String(p.team?.id ?? p.team) === filtroEscuderiaF1
  );
  const f2Filtrados = f2Pilotos.filter(
    (p) =>
      filtroEscuderiaF2 === "null" ||
      String(p.team?.id ?? p.team) === filtroEscuderiaF2
  );

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
                className="bg-slate-900/50 border-slate-700 overflow-hidden"
              >
                <Skeleton className="h-80 w-auto" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
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
              <CardDescription className="text-red-300">
                {error}
              </CardDescription>
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
            new URL("../../assets/Pilotosfondo.png", import.meta.url).href
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <ChromaGrid />
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* F1 */}
        <div className="mb-6">
          <img
            src={new URL("../../assets/f1-logo.png", import.meta.url).href}
            alt="F1"
            className="mx-auto w-50 h-auto object-contain"
          />
        </div>
        <div className="mb-6 max-w-md mx-auto">
          <Select
            value={filtroEscuderiaF1}
            onValueChange={setFiltroEscuderiaF1}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar F1 por escudería" />
            </SelectTrigger>
            <SelectContent className="border-none">
              <SelectItem value="null">Todos los pilotos F1</SelectItem>
              {escuderias.map((e) => (
                <SelectItem key={e.id} value={String(e.id)}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {f1Filtrados.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">No hay pilotos F1</CardTitle>
              <CardDescription className="text-slate-400">
                Aún no se han registrado pilotos en la categoría F1 o no hay
                pilotos registrados para esta escudería.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {f1Filtrados.map((piloto) => {
                const flagUrl = getCountryFlag(piloto.nationality);
                const photoUrl = getPilotoPhoto(piloto.name);
                return (
                  <Link to={`/piloto/${piloto.id}`} key={piloto.id}>
                    <Card
                      key={piloto.id}
                      className="relative bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden group cursor-pointer py-0 border-t-0 border-b-0"
                    >
                      <div className="relative w-auto h-80 overflow-hidden">
                        <img
                          src={photoUrl}
                          alt={`Foto de ${piloto.name}`}
                          className="absolute inset-0 w-full h-full object-cover overflow-hidden transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const t = e.currentTarget as HTMLImageElement;
                            t.onerror = null;
                            t.src = new URL(
                              "../../assets/descalifica2logo.png",
                              import.meta.url
                            ).href;
                            t.classList.add(
                              "object-contain",
                              "bg-slate-900/50",
                              "overflow-hidden"
                            );
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                        {flagUrl && (
                          <div className="absolute top-4 right-4 z-10">
                            <img
                              src={flagUrl}
                              alt={`Bandera de ${piloto.nationality}`}
                              className="w-14 h-10 object-cover rounded shadow-2xl border-2 border-white/20"
                            />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                          <h3 className="text-2xl font-bold text-white tracking-tight">
                            {piloto.name}
                          </h3>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-12 mb-6" />

        <div className="mb-6">
          <img
            src={new URL("../../assets/f2-logo.png", import.meta.url).href}
            alt="F2"
            className="mx-auto w-50 h-auto object-contain"
          />
        </div>
        <div className="mb-6 max-w-md mx-auto">
          <Select
            value={filtroEscuderiaF2}
            onValueChange={setFiltroEscuderiaF2}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar F2 por escudería" />
            </SelectTrigger>
            <SelectContent className="border-none">
              <SelectItem value="null">Todas los pilotos F2</SelectItem>
              {escuderias.map((e) => (
                <SelectItem key={e.id} value={String(e.id)}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {f2Filtrados.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">No hay pilotos F2</CardTitle>
              <CardDescription className="text-slate-400">
                Aún no se han registrado pilotos en la categoría F2 o no hay
                pilotos registrados para la escudería seleccionada.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {f2Filtrados.map((piloto) => {
              const flagUrl = getCountryFlag(piloto.nationality);
              const photoUrl = getPilotoPhoto(piloto.name);
              return (
                <Link to={`/piloto/${piloto.id}`} key={piloto.id}>
                  <Card
                    key={piloto.id}
                    className="relative bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden group cursor-pointer py-0 border-t-0 border-b-0"
                  >
                    <div className="relative w-auto h-80 overflow-hidden">
                      <img
                        src={photoUrl}
                        alt={`Foto de ${piloto.name}`}
                        className="absolute inset-0 w-full h-full object-cover overflow-hidden transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const t = e.currentTarget as HTMLImageElement;
                          t.onerror = null;
                          t.src = new URL(
                            "../../assets/descalifica2logo.png",
                            import.meta.url
                          ).href;
                          t.classList.add(
                            "object-contain",
                            "bg-slate-900/50",
                            "overflow-hidden"
                          );
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                      {flagUrl && (
                        <div className="absolute top-4 right-4 z-10">
                          <img
                            src={flagUrl}
                            alt={`Bandera de ${piloto.nationality}`}
                            className="w-14 h-10 object-cover rounded shadow-2xl border-2 border-white/20"
                          />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <h3 className="text-2xl font-bold text-white tracking-tight">
                          {piloto.name}
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

export default ListadoPilotos;
