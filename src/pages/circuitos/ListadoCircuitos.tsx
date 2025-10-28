import {useEffect, useState} from "react";
import {ChromaGrid} from "@/components/ui/Chroma-grid";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Circuito} from "@/entities/circuito.entity.ts";
import {getCircuito} from "@/services/circuito.service.ts";

// Helper function para obtener la bandera del país automáticamente
const getCountryFlag = (country: string): string => {
  if (!country) return "";

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
  if (specialCases[country]) {
    return new URL(
      `../../assets/banderas-paises/${specialCases[country]}.png`,
      import.meta.url
    ).href;
  }

  // Normalizar el nombre del país para que coincida con los archivos
  const normalizedName = country
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

// Helper function para obtener la imagen del circuito automáticamente desde assets
const getImagenCircuito = (name: string): string => {
  if (!name) return "";

  // Normalizar el nombre del circuito para que coincida con los archivos
  const normalizedName = name
    .toLowerCase() // Convertir a minúsculas
    .normalize("NFD") // Descompone caracteres con acentos
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
    .replace(/\s+/g, "-") // Reemplaza espacios con guiones
    .replace(/[^a-z0-9-]/g, ""); // Elimina caracteres especiales

  // Buscar siempre en assets
  try {
    return new URL(
      `../../assets/circuitos/${normalizedName}.png`,
      import.meta.url
    ).href;
  } catch {
    return "";
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
        console.error("Error cargando circuitos", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return ( 
      <div className='relative min-h-screen'>
        <ChromaGrid />
        <div className='relative z-10 container mx-auto px-4 py-8'>
          <div className="mb-8">
            <Skeleton className="h-12 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />            
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-700 overflow-hidden">
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-6 w-32" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
      <div className = 'absolute inset-0 w-full h-full blur-sm opacity-35'
        style ={{
          backgroundImage: `url(${new URL('../../assets/circuitosFondo.jpg', import.meta.url).href})`,
          backgroundSize: "auto 100% ",
          backgroundPosition: "center",
        }}
      ></div>
      <ChromaGrid />
      <div className="relative z-10 container mx-auto px-4 py-8">
        {circuitos.length === 0 ? (
          <Card className = 'bg-slate-900/50 border-slate-700'>
            <CardHeader>
              <CardTitle>No hay circuitos disponibles</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          circuitos.map((circuito) => (
            <Card key={circuito.id} className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>{circuito.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={getImagenCircuito(circuito.name)} alt={circuito.name} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}


export default ListadoCircuitos;