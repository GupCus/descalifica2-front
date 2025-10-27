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
import { getEscuderia } from "@/services/escuderia.service.ts";
import { Escuderia } from "@/entities/escuderia.entity.ts";

// Helper function para obtener la bandera del país automáticamente
const getCountryFlag = (nationality: string): string => {
  if (!nationality) return "";

  // Mapa de casos especiales (opcional, para nacionalidades con nombres diferentes al archivo)
  const specialCases: Record<string, string> = {
    "Reino Unido": "UK",
    "Estados Unidos": "USA",
    "Países Bajos": "Paises_Bajos",
    "Emiratos Árabes Unidos": "EAU",
    Baréin: "bahrain",
    Barein: "bahrain",
    Azerbaiyán: "Azerbaiyan",
  };

  // Si hay un caso especial, usarlo
  if (specialCases[nationality]) {
    return new URL(
      `../../assets/banderas-paises/${specialCases[nationality]}.png`,
      import.meta.url
    ).href;
  }

  // Normalizar el nombre del país para que coincida con los archivos
  const normalizedName = nationality
    .normalize("NFD") // Descompone caracteres con acentos
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
    .replace(/\s+/g, "_") // Reemplaza espacios con guiones bajos
    .replace(/[^a-zA-Z0-9_]/g, ""); // Elimina caracteres especiales

  // Construye la ruta automáticamente
  try {
    return new URL(
      `../../assets/banderas-paises/${normalizedName}.png`,
      import.meta.url
    ).href;
  } catch {
    return "";
  }
};

// Helper function para obtener la imagen de la escudería automáticamente desde assets
const getEscuderiaLogo = (name: string): string => {
  if (!name) return "";

  // Normalizar el nombre de la escudería para que coincida con los archivos
  const normalizedName = name
    .toLowerCase() // Convertir a minúsculas
    .normalize("NFD") // Descompone caracteres con acentos
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
    .replace(/\s+/g, "-") // Reemplaza espacios con guiones
    .replace(/[^a-z0-9-]/g, ""); // Elimina caracteres especiales

  // Buscar siempre en assets
  try {
    return new URL(
      `../../assets/escuderias/${normalizedName}.png`,
      import.meta.url
    ).href;
  } catch {
    return "";
  }
};

function ListadoEscuderias() {
  const [escuderias, setEscuderias] = useState<Escuderia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEscuderia()
      .then((data) => setEscuderias(data))
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="bg-slate-900/50 border-slate-700 overflow-hidden"
              >
                <Skeleton className="h-48 w-full" />
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

  //helper para extraer el nombre de categoria
  const getCategoryName = (cat?: { id?: string; name?: string } | string) => {
    if (!cat) return "";
    if (typeof cat === "string") return cat.trim().toLowerCase();
    return String(cat.name ?? "")
      .trim()
      .toLowerCase();
  };

  //Separamos por categoria

  const f2Escuderias = escuderias.filter((e) => {
    if (!e.brand) return false;
    return (
      getCategoryName(e.brand.name) === "f2" || e.brand.name === "Fórmula 2"
    );
  });

  const f1Escuderias = escuderias.filter((e) => {
    if (!e.brand) return false;
    return (
      getCategoryName(e.brand.name) === "f1" || e.brand.name === "Fórmula 1"
    );
  });

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
            className="mx-auto w-50 h-auto object-contain"
          />
        </div>

        {/* Grid de Escuderías F1 */}
        {f1Escuderias.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">No hay escuderías F1</CardTitle>
              <CardDescription className="text-slate-400">
                Aún no se han registrado escuderías en el sistema.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {f1Escuderias.map((escuderia) => {
              const flagUrl = getCountryFlag(escuderia.nationality);
              const logoUrl = getEscuderiaLogo(escuderia.name);

              return (
                <Card
                  key={escuderia.id}
                  className="relative bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden group cursor-pointer py-0 border-t-0 border-b-0"
                >
                  {/* Imagen de la escudería (ocupa toda la card) */}
                  <div className="relative w-full h-64 overflow-hidden">
                    <img
                      src={logoUrl}
                      alt={`Logo de ${escuderia.name}`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // reemplazar con placeholder si no existe
                        target.src = "/src/assets/descalifica2logo.png";
                        target.className =
                          "absolute inset-0 w-full h-full object-contain bg-slate-900/50";
                      }}
                    />

                    {/* Overlay oscuro para mejorar legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>

                    {/* Bandera en la esquina superior derecha */}
                    {flagUrl && (
                      <div className="absolute top-4 right-4 z-10">
                        <img
                          src={flagUrl}
                          alt={`Bandera de ${escuderia.nationality}`}
                          className="w-14 h-10 object-cover rounded shadow-2xl border-2 border-white/20"
                        />
                      </div>
                    )}

                    {/* Nombre de la escudería en la parte inferior */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {escuderia.name}
                      </h3>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* LOGO F2 */}
        <div>
          <img
            src={new URL("../../assets/f2-logo.png", import.meta.url).href}
            alt="Logo de Formula 2"
            className="mx-auto w-50 h-auto object-contain"
          />
        </div>
        <div>
          {/* Grid de Escuderías F2 */}

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {f2Escuderias.map((escuderia) => {
                const flagUrl = getCountryFlag(escuderia.nationality);
                const logoUrl = getEscuderiaLogo(escuderia.name);
                return (
                  <Card
                    key={escuderia.id}
                    className="relative bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden group cursor-pointer py-0 border-t-0 border-b-0"
                  >
                    <div className="relative w-full h-64 overflow-hidden">
                      <img
                        src={logoUrl}
                        alt={`Logo de ${escuderia.name}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // reemplazar con placeholder si no existe
                          target.src = "/src/assets/descalifica2logo.png";
                          target.className =
                            "absolute inset-0 w-full h-full object-contain bg-slate-900/50";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                      {flagUrl && (
                        <div className="absolute top-4 right-4 z-10">
                          <img
                            src={flagUrl}
                            alt={`Bandera de ${escuderia.nationality}`}
                            className="w-14 h-10 object-cover rounded shadow-2xl border-2 border-white/20"
                          />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <h3 className="text-2xl font-bold text-white tracking-tight">
                          {escuderia.name}
                        </h3>
                      </div>
                    </div>
                  </Card>
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
