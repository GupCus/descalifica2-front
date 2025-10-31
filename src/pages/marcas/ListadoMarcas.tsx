import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChromaGrid } from "@/components/ui/Chroma-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Marca } from "@/entities/marca.entity.ts";
import { getMarca } from "@/services/marca.service.ts";

const getMarcaLogo = (name?: string) => {
  if (!name) return "";
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const exts = ["png", "webp", "jpg", "jpeg"];
  for (const ext of exts) {
    try {
      return new URL(
        `../../assets/marcas/${normalized}.${ext}`,
        import.meta.url
      ).href;
    } catch {}
  }
  return "";
};

const getCountryFlag = (country?: string) => {
  if (!country) return "";
  const specialCases: Record<string, string> = {
    "Reino Unido": "UK",
    "Estados Unidos": "USA",
    "Países Bajos": "Paises_Bajos",
    "Emiratos Árabes Unidos": "EAU",
    Baréin: "bahrain",
    Barein: "bahrain",
    Azerbaiyán: "Azerbaiyan",
  };
  if (specialCases[country]) {
    try {
      return new URL(
        `../../assets/banderas-paises/${specialCases[country]}.png`,
        import.meta.url
      ).href;
    } catch {
      return "";
    }
  }
  const normalized = country
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");
  try {
    return new URL(
      `../../assets/banderas-paises/${normalized}.png`,
      import.meta.url
    ).href;
  } catch {
    return "";
  }
};

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="bg-slate-900/50 border-slate-700 overflow-hidden"
              >
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
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
      <div>
        <h1 className="text-4xl font-bold text-white text-center pt-8">
          MARCAS
        </h1>
      </div>
      <div>
        <img
          className="absolute inset-0 w-full h-full blur-sm opacity-35"
          src={new URL("../../assets/fondomarcas.png", import.meta.url).href}
          alt="Fondo marcas"
        />
      </div>
      <ChromaGrid />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {marcas.map((marca) => {
            const logo = getMarcaLogo(marca.name);
            const flagUrl = getCountryFlag(marca.nationality);
            return (
              <Link to={`/marca/${marca.id}`} key={marca.id}>
                <Card className="relative bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 overflow-hidden group cursor-pointer py-0 border-t-0 border-b-0">
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={logo}
                      alt={marca.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 overflow-hidden"
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
                    {flagUrl && (
                      <div className="absolute top-4 right-4 z-10">
                        <img
                          src={flagUrl}
                          alt={`Bandera de ${marca.nationality}`}
                          className="w-14 h-10 object-cover rounded shadow-2xl border-2 border-white/20"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <h3 className="text-lg font-semibold text-white truncate">
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
