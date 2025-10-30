import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Sesion } from "@/entities/sesion.entity.ts";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Piloto } from "@/entities/piloto.entity.ts";
import { Badge } from "@/components/ui/badge";
import { Trophy, User, Hash, Building2, Timer } from "lucide-react";
import { getPiloto } from "@/services/piloto.service.ts";

function DashboardAccordion({ sesiones }: { sesiones?: Sesion[] }) {
  const [sesionSeleccionada, setSesionSeleccionada] = useState<Sesion | null>(null);

  const [pilotos, setPilotos] = useState<Piloto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPiloto()
      .then((data) => setPilotos(data))
      .catch((err) => setError(err))
  },[])
  useEffect(() => {
    if (sesiones && !sesionSeleccionada) {
      setSesionSeleccionada(sesiones[0]);
    }
  }, [sesiones, sesionSeleccionada]);

  if (sesiones && !error) {
    return (
      <>
        <header className="w-full">
          <ButtonGroup className="flex ">
            {sesiones.map((s) => (
              <Button
                key={s.id}
                variant={sesionSeleccionada?.id === s.id ? "default" : "outline"}
                className="min-w-20 font-semibold transition-all"
                onClick={() => setSesionSeleccionada(s)}
              >
                {s.type}
              </Button>
            ))}
          </ButtonGroup>
        </header>

        <main className="bg-secondary mr-10 p-1 space-y-2">
          {sesionSeleccionada && (
            <div className="bg-muted/50 rounded-lg p-4 border">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{sesionSeleccionada.type}</span>
                <span className="text-muted-foreground">
                  {new Date(sesionSeleccionada.start_time).toLocaleString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )}

          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[80px] font-bold">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Pos
                    </div>
                  </TableHead>
                  <TableHead className="font-bold">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Piloto
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px] font-bold">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      Tiempo
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px] font-bold">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Núm
                    </div>
                  </TableHead>
                  <TableHead className="font-bold">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Escudería
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sesionSeleccionada?.results && sesionSeleccionada.results.length > 0 ? (
                  sesionSeleccionada.results.slice()
                  .sort((a,b) => ( parseFloat(a[1])- parseFloat(b[1]) ))
                  .map((resultado, i: number) => {

                    const p = pilotos.find(p => p.id?.toString() === resultado[0]);
                    if (!p) return null;
                    return (
                    <TableRow key={i}>
                      <TableCell className="font-bold">
                        <Badge
                          variant={(i === 0) ? "default" : "secondary"}
                          className="w-12 justify-center"
                        >
                          {i + 1}
                        </Badge>
                      </TableCell>

                      <TableCell className="font-semibold">{p.name}</TableCell>
                      <TableCell>{resultado[1]}</TableCell>
                      <TableCell>#{p.num}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {p.team.name}
                        </div>
                      </TableCell>
                    </TableRow>
                  )})
                ) : null}
              </TableBody>
            </Table>
          </div>
        </main>
      </>
    )
  }
}

export default DashboardAccordion;
