import Calendar21 from "@/components/calendar-21.tsx";
import { CountdownTimer } from "@/components/countdown-timer.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carrera } from "@/entities/carrera.entity.ts";
import { Sesion } from "@/entities/sesion.entity.ts";
import { Badge } from "@/components/ui/badge";

function Calendario() {

  //Sesión y carrera en memoria
  const sesiones: Sesion[] = [
    {
      id: 1,
      name: "FP1",
      tipoSesion: "FP1",
      fecha_Hora_sesion: new Date(2025, 9, 17, 14, 30),
    },
    {
      id: 2,
      name: "QS",
      tipoSesion: "QS",
      fecha_Hora_sesion: new Date(2025, 9, 17, 18, 30),
    },
    {
      id: 3,
      name: "Sprint",
      tipoSesion: "Sprint",
      fecha_Hora_sesion: new Date(2025, 9, 18, 14),
    },
    {
      id: 4,
      name: "Qualy",
      tipoSesion: "Qualy",
      fecha_Hora_sesion: new Date(2025, 9, 18, 18),
    },
    {
      id: 5,
      name: "GP",
      tipoSesion: "GP",
      fecha_Hora_sesion: new Date(2025, 9, 19, 16),
    },
  ];

  const carreras: Carrera[] = [
    {
      id: 1,
      name: "🏁 GP de los EEUU",
      circuito: undefined,
      temporada: undefined,
      start_date: new Date(2025, 9, 17),
      end_date: new Date(2025, 9, 19),
      sesiones: sesiones,
    },
  ];

  const getSesionFecha = (tipo?: string) => {
    return tipo
      ? sesiones.find((s) => s.tipoSesion === tipo)?.fecha_Hora_sesion
      : sesiones[0]?.fecha_Hora_sesion;
  };

  // Carrera actual (primera del array por ahora)
  const carreraActual = carreras[0];

  return (
    <div className="flex flex-col gap-8 py-10 px-4 max-w-6xl mx-auto">
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

        {/* Columna derecha */}
        <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-primary-foreground flex gap-3 border-b-2 border-accent pb-3">
              <span>{carreraActual.name}</span>
              <Badge variant="secondary" className="text-sm">
                {carreraActual.start_date.toLocaleDateString("es-ES", {
                  day: "numeric",
                })
                + " - " + 
                carreraActual.end_date.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3">
              {carreraActual.sesiones?.map((sesion) => (
                <div
                  key={sesion.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={sesion.tipoSesion === "GP" ? "destructive" : "default"}
                      className="font-bold text-sm px-3 py-1"
                    >
                      {sesion.tipoSesion}
                    </Badge>
                    <span className="font-semibold text-foreground">
                      {sesion.fecha_Hora_sesion?.toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <span className="text-base font-mono font-bold text-foreground">
                    {sesion.fecha_Hora_sesion?.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Calendar21 />
      </div>
    </div>
  );
}

export default Calendario;