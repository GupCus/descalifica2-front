import { useEffect,useState } from "react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import AnimatedList from "@/components/ui/animated-list.tsx";
import { Temporada } from "@/entities/temporada.entity.ts";
import { getTemporada } from "@/services/temporada.service.ts";
import { useNavigate } from "react-router-dom";



function ListadoTemporadas() {
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTemporada()
      .then(data => setTemporadas(data))
      .catch(err => {
        console.error("Error fetching temporadas:", err);
        setError("Error fetching temporadas");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }


  const f1Temporadas = temporadas.filter(t => t.racing_series?.name === 'F1' || t.racing_series?.name === 'Formula 1' || t.racing_series?.name === 'Fórmula 1' );
  const f2Temporadas = temporadas.filter(t => t.racing_series?.name === 'F2' || t.racing_series?.name === 'Formula 2' || t.racing_series?.name === 'Fórmula 2' );
  console.log('F1 Temporadas:', f1Temporadas.map(t => t.year));
  console.log('F2 Temporadas:', f2Temporadas.map(t => t.year));

  const SelectHandler= (list:Temporada[]) => (label:string,index:number) => {
    const selectedTemporada = list[index];
    navigate(`/temporada/${selectedTemporada.id}`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <div
        className="absolute inset-0 w-full h-full -z-10 blur-sm opacity-20"
        style={{
          backgroundImage: `url(${new URL('../../assets/fondo-temporadas.jpg', import.meta.url).href})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="w-full max-w-5xl z-10 ">
        <div className =" grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lista F1 */}
          <div className="bg-transparent p-4 rounded-lg">
            <div className="flex justify-center mb-4">
              <img src={new URL('../../assets/f1-logo.png', import.meta.url).href} alt="logof1" className="mx-auto w-50 h-auto object-contain"/>
            </div>
          <div className="max-h-[50vg] ">
            {f1Temporadas.length === 0 ? (
              <div className="text-slate-400 p-4 ">No hay temporadas F1.</div>
            ) : (
              <AnimatedList
                items={f1Temporadas.map(t => `Temporada ${t.year}`)}
                showGradients={false}
                onItemSelect={SelectHandler(f1Temporadas)}
                displayScrollbar={true}
                className="max-h-[60vh] overflow-y-auto pr-4 space-y-4"
              />
            )}
          </div>
          </div>
          {/* Lista F2 */}
          <div className="bg-transparent p-4 rounded-lg">
          <div className="flex justify-center mb-4">
            <img src={new URL('../../assets/f2-logo.png', import.meta.url).href} alt="Logo de Formula 2" className="mx-auto w-50 h-auto object-contain" />
          </div>
          {/* Lista F2 */}
          <div className="overflow-hidden">
            {f2Temporadas.length === 0 ? (
              <div className="text-slate-400 p-4">No hay temporadas F2.</div>
            ) : (
              <AnimatedList
                items={f2Temporadas.map(t => `Temporada ${t.year}`)}
                showGradients={false}
                onItemSelect={SelectHandler(f2Temporadas)}
                displayScrollbar={true}
                className="max-h-[60vh] overflow-hidden"
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