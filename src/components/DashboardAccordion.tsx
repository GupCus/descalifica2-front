import { Sesion } from '@/entities/sesion.entity.ts';
import { useEffect, useState } from 'react';
import { AuthService } from '@/services/auth.service.ts';
import { postCarrera } from '@/services/openf1.service.ts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, User, Hash, Building2, Timer } from 'lucide-react';
import { Session_Result } from '@/entities/session_result.entity.ts';
import { Circuito } from '@/entities/circuito.entity.ts';
import { Escuderia } from '@/entities/escuderia.entity.ts';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group.tsx';

function formateartiempo(resultado: string) {
  let [segundos, ms] = resultado.split('.');
  const horas = Math.floor(Number.parseInt(segundos) / 3600);
  const minutos = Math.floor((Number.parseInt(segundos) % 3600) / 60);
  segundos = (
    Number.parseInt(segundos) -
    (horas * 3600 + minutos * 60)
  ).toString();
  if (horas === 0) {
    if (minutos === 0) {
      return resultado;
    } else {
      return minutos.toString() + ':' + segundos + '.' + ms;
    }
  } else {
    return (
      horas.toString() + ':' + minutos.toString() + ':' + segundos + '.' + ms
    );
  }
}
function formatResultTime(resultado: Session_Result): string {
  if (resultado.dsq) return 'DSQ';
  if (resultado.dns) return 'DNS';
  if (resultado.dnf) return 'DNF';

  if (resultado.duration && resultado.duration !== 'null')
    if (resultado.duration.includes(',')) {
      const duraciones = resultado.duration
        .split(',')
        .filter((s) => s.length !== 0);
      let nuevoresultado: string;
      switch (duraciones.length) {
        case 1:
          nuevoresultado = formateartiempo(duraciones[0]);
          break;
        case 2:
          nuevoresultado =
            formateartiempo(duraciones[0]) +
            ' - ' +
            formateartiempo(duraciones[1]);
          break;
        case 3:
          nuevoresultado =
            formateartiempo(duraciones[0]) +
            ' - ' +
            formateartiempo(duraciones[1]) +
            ' - ' +
            formateartiempo(duraciones[2]);
          break;
        default:
          nuevoresultado = resultado.duration;
          break;
      }
      return nuevoresultado;
    } else {
      return formateartiempo(resultado.duration);
    }
  if (resultado.gap_to_leader && resultado.gap_to_leader !== 'null')
    return resultado.gap_to_leader;

  return '-';
}

function DashboardAccordion({
  sesiones,
  circuito,
  escuderiasdata,
  carreraId,
}: {
  sesiones?: Sesion[];
  circuito: Circuito;
  escuderiasdata: Escuderia[];
  carreraId?: number;
}) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    AuthService.isAdmin().then((res) => setIsAdmin(Boolean(res)));
  }, []);
  const [sesionSeleccionada, setSesionSeleccionada] = useState<
    Sesion | undefined
  >(undefined);

  useEffect(() => {
    //Selecciona fp1 siempre al abrir el dashboard
    if (sesiones && !sesionSeleccionada) {
      setSesionSeleccionada(sesiones.find((s) => s.type === 'FP1'));
    }
  }, [sesiones, sesionSeleccionada]);

  if (sesiones) {
    return (
      <main className="flex flex-col md:flex-row w-full bg-card overflow-hidden">
        <div className="w-full md:w-[30%] flex flex-col border-b md:border-b-0 md:border-r bg-muted/10">
          <div className="w-full h-48 p-4 flex items-center justify-center bg-background border-b relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-muted/50 to-transparent opacity-50" />
            <img
              src={circuito.track_map_url}
              alt={circuito.name}
              className="w-full h-full object-contain drop-shadow-md relative z-10"
            />
          </div>

          {sesionSeleccionada && (
            <div className="flex flex-col p-6 border-b bg-card">
              <span className="text-xl font-bold tracking-tight">
                {sesionSeleccionada.name}
              </span>
              <span className="text-sm font-medium text-muted-foreground capitalize mt-1">
                {new Date(sesionSeleccionada.start_time).toLocaleString(
                  'es-ES',
                  {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  },
                )}
              </span>
            </div>
          )}

          <div className="flex-1 bg-background">
            <ToggleGroup
              className="flex flex-row md:flex-col w-full h-full overflow-x-auto"
              type="single"
              orientation="vertical"
              spacing={0}
              defaultValue="FP1"
              onValueChange={(value) =>
                setSesionSeleccionada(sesiones.find((s) => s.type === value))
              }
            >
              <ToggleGroupItem
                className="flex-1 md:flex-none md:w-full justify-center md:justify-start !rounded-none h-11 md:h-14 px-2 md:px-6 border-b-4 md:border-b-0 md:border-l-4 border-transparent data-[state=on]:bg-primary/50 data-[state=on]:text-foreground data-[state=on]:border-primary data-[state=on]:font-bold hover:bg-muted/50 transition-all"
                value="FP1"
              >
                FP1
              </ToggleGroupItem>
              {sesiones.find((s) => s.type === 'FP2') ? (
                <>
                  <ToggleGroupItem
                    className="flex-1 md:flex-none md:w-full justify-center md:justify-start !rounded-none h-11 md:h-14 px-2 md:px-6 border-b-4 md:border-b-0 md:border-l-4 border-transparent data-[state=on]:bg-primary/50 data-[state=on]:text-foreground data-[state=on]:border-primary data-[state=on]:font-bold hover:bg-muted/50 transition-all"
                    value="FP2"
                  >
                    FP2
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="flex-1 md:flex-none md:w-full justify-center md:justify-start !rounded-none h-11 md:h-14 px-2 md:px-6 border-b-4 md:border-b-0 md:border-l-4 border-transparent data-[state=on]:bg-primary/50 data-[state=on]:text-foreground data-[state=on]:border-primary data-[state=on]:font-bold hover:bg-muted/50 transition-all"
                    value="FP3"
                  >
                    FP3
                  </ToggleGroupItem>
                </>
              ) : (
                <>
                  <ToggleGroupItem
                    className="flex-1 md:flex-none md:w-full justify-center md:justify-start !rounded-none h-11 md:h-14 px-2 md:px-6 border-b-4 md:border-b-0 md:border-l-4 border-transparent data-[state=on]:bg-primary/50 data-[state=on]:text-foreground data-[state=on]:border-primary data-[state=on]:font-bold hover:bg-muted/50 transition-all"
                    value="SQ"
                  >
                    SQ
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="flex-1 md:flex-none md:w-full justify-center md:justify-start !rounded-none h-11 md:h-14 px-2 md:px-6 border-b-4 md:border-b-0 md:border-l-4 border-transparent data-[state=on]:bg-primary/50 data-[state=on]:text-foreground data-[state=on]:border-primary data-[state=on]:font-bold hover:bg-muted/50 transition-all"
                    value="Sprint"
                  >
                    Sprint
                  </ToggleGroupItem>
                </>
              )}
              <ToggleGroupItem
                className="flex-1 md:flex-none md:w-full justify-center md:justify-start !rounded-none h-11 md:h-14 px-2 md:px-6 border-b-4 md:border-b-0 md:border-l-4 border-transparent data-[state=on]:bg-primary/50 data-[state=on]:text-foreground data-[state=on]:border-primary data-[state=on]:font-bold hover:bg-muted/50 transition-all"
                value="Q"
              >
                Q
              </ToggleGroupItem>
              <ToggleGroupItem
                className="flex-1 md:flex-none md:w-full justify-center md:justify-start !rounded-none h-11 md:h-14 px-2 md:px-6 border-b-4 md:border-b-0 md:border-l-4 border-transparent data-[state=on]:bg-primary/50 data-[state=on]:text-foreground data-[state=on]:border-primary data-[state=on]:font-bold hover:bg-muted/50 transition-all"
                value="GP"
              >
                GP
              </ToggleGroupItem>
              {isAdmin && (
                <ToggleGroupItem
                  className="flex-1 md:flex-none md:w-full justify-center md:justify-start !rounded-none h-11 md:h-14 px-2 md:px-6 border-b-4 md:border-b-0 md:border-l-4 border-transparent text-destructive hover:bg-destructive/10 transition-all"
                  value="actualizar"
                  onClick={async () => {
                    if (carreraId) {
                      await postCarrera(carreraId);
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    }
                  }}
                >
                  Actualizar Carrera
                </ToggleGroupItem>
              )}
            </ToggleGroup>
          </div>
        </div>

        <div className="w-full md:w-[70%] bg-card flex flex-col min-w-0">
          <div className="overflow-x-auto w-full h-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="w-[80px] font-bold h-12">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      Pos
                    </div>
                  </TableHead>
                  <TableHead className="font-bold h-12">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Piloto
                    </div>
                  </TableHead>
                  <TableHead className="w-[120px] font-bold h-12">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      Tiempo
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px] font-bold h-12">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      Núm
                    </div>
                  </TableHead>
                  <TableHead className="font-bold h-12">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      Escudería
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sesionSeleccionada?.session_result &&
                sesionSeleccionada.session_result.length > 0 ? (
                  sesionSeleccionada.session_result
                    .slice()
                    .map((resultado, i: number) => {
                      const e = escuderiasdata.find(
                        (e) => resultado.piloto?.team === e.id,
                      );
                      return (
                        <TableRow
                          key={i}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <TableCell className="font-bold">
                            <Badge
                              variant={
                                i === 0
                                  ? 'default'
                                  : i < 3
                                    ? 'secondary'
                                    : 'outline'
                              }
                              className="w-10 justify-center h-6"
                            >
                              {i + 1}
                            </Badge>
                          </TableCell>

                          <TableCell className="font-semibold">
                            {resultado.piloto?.name ?? 'Desconocido'}
                          </TableCell>
                          <TableCell className="font-medium text-muted-foreground tabular-nums">
                            {formatResultTime(resultado)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            #{resultado.piloto?.num ?? '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 font-medium">
                              {e?.name ?? '-'}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No hay resultados aún 😭
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    );
  }

  return null;
}

export default DashboardAccordion;
