import Calendar21 from "@/components/calendar-21.tsx";
import { CountdownTimer } from "@/components/countdown-timer.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carrera } from "@/entities/carrera.entity.ts";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

//api
import axios from "axios";
const client = axios.create({
  baseURL: "http://localhost:3000/api/carreras" 
});
async function getCarreras(): Promise<Carrera[]> {
  try {
    const response = await client.get('/');
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    throw error;
  }
}

//Componente
function Calendario() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const data = await getCarreras();
        console.log(data);
        setCarreras(data);
      } catch (err) {
        console.error(err)
      }
    };
    fetchCarreras();
  }, []);

  //Si todavía no llegaron las carreras, retorna mensaje vacío
  const carreraActual = 
  carreras.length === 0 ?
  undefined
  :
  carreras
  .filter((c) => new Date(c.end_date) >= new Date()) 
  .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0];

  //Consigue la fecha de la sesión en caso de especificar tipo, o de la primera
  const getSesionFecha = (tipo?: string) => {
    if(!carreraActual){
      return undefined
    } else if (!tipo) {
      return new Date(carreraActual.sesiones[0].fecha_Hora_inicio);
    } else {
      const sesion = carreraActual.sesiones.find((s) => s.tipo_Sesion === tipo);
      return sesion ? new Date(sesion.fecha_Hora_inicio) : undefined;
    }
  };
  //En caso de haber f1 hoy, lo indica con un mensaje
  const esHoy = (c?:Carrera) =>{
    if(c){
    const hoy = new Date()
    const diaini = new Date(c.start_date)
    const diafin = new Date(c.end_date)
    diaini.setHours(0,0,0,0)
    diafin.setHours(0,0,0,0)
    if(diaini <= hoy && diafin >= hoy){
      return (      
      <div className="flex justify-center py-2">
          <h2 className="text-6xl font-black tracking-tight bg-gradient-to-r from-red-800 via-pink-800 to-purple-950 bg-clip-text text-transparent animate-bounce">
            ¡HOY HAY FÓRMULA 1!
          </h2>
      </div>);
    }}
    return undefined;
  }

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0 blur-sm opacity-20"
        style={{
          backgroundImage: "url('https://theenterpriseworld.com/wp-content/uploads/2025/07/2.-Ayrton-Senna-Source-history.co_.uk_.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    
    <div className="flex flex-col gap-8 py-10 px-4 max-w-6xl mx-auto relative z-10">
      {esHoy(carreraActual)}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div>
          <h1 className="text-4xl mb-6 font-bold tracking-tight text-primary-foreground">
            ¿Qué sigue?
          </h1>
          <div className="flex flex-col gap-4">
            <CountdownTimer
              targetDate={getSesionFecha()}
              title="Tiempo hasta la próxima sesión"
            />
            <CountdownTimer
              targetDate={getSesionFecha("GP")}
              title="Tiempo hasta el próximo GP"
            />
          </div>
        </div>

        {/* Columna derecha */ }
        <Card className="bg-gradient-to-br from-primary/70 via-accent/70 to-primary/70">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-primary-foreground flex gap-3 border-b-2 border-accent pb-3">
              <span>{carreraActual ? carreraActual.name : null}</span>
              <Badge variant="secondary" className="text-sm">
                {carreraActual ?
                  new Date(carreraActual.start_date).toLocaleDateString("es-ES", {
                    day: "numeric",
                  })
                  + " - " + 
                  new Date(carreraActual.end_date).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })
                  : null}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 max-h-80 overflow-y-auto">
              {carreraActual ? carreraActual.sesiones?.map((sesion) => { 
              return (
                <div
                  key={sesion.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/70 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={sesion.tipo_Sesion === "GP" ? "destructive" : "default"}
                      className="font-bold text-sm px-3 py-1"
                    >
                      {sesion.tipo_Sesion}
                    </Badge>
                    <span className="font-semibold text-foreground">
                      {new Date(sesion.fecha_Hora_inicio).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <span className="text-base font-mono font-bold text-foreground">
                    {new Date(sesion.fecha_Hora_inicio).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Calendar21 carreras={carreras}/>
      </div>
    </div>
  </div>
  );
}

export default Calendario;