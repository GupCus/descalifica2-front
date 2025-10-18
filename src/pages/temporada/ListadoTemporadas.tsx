import { useEffect,useState } from "react";
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import AnimatedList from "@/components/ui/animated-list.tsx";


type Temporada = {
  id: string;
  year: number;
  description?: string;
};

const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const ListadoTemporadas: React.FC = () => {
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const items = temporadas.map(t => `${t.year} - ${t.description || ''}`);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${api}/temporadas`);
        const data = await response.json();
        setTemporadas(data);
      } catch (error) {
        console.error("Error fetching temporadas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold white" >Listado de Temporadas</h1>
      <AnimatedList
        items={items}
        onItemSelect={(item, index) => console.log(item, index)}
        showGradients={true}
        enableArrowNavigation={true}
        displayScrollbar={true}
      />
    </div>
  );
};

export default ListadoTemporadas;
