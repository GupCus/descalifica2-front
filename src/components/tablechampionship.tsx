import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Driver_Championship } from '@/entities/driver_championship.entity.ts';
import { Team_Championship } from '@/entities/team_championship.entity.ts';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group.tsx';
import { useState } from 'react';
import { Escuderia } from '@/entities/escuderia.entity.ts';
import { Drill, Flag, Medal, Trophy, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TableChampionship = ({
  drivers,
  teams,
  escuderiasdata,
}: {
  drivers: Driver_Championship[];
  teams: Team_Championship[];
  escuderiasdata: Escuderia[];
}) => {
  const [seleccion, setSeleccion] = useState<'Pilotos' | 'Escuderias'>(
    'Pilotos',
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 w-full">
        <h4 className="text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap m-0">
          🏆 ¿Cómo va el torneo?
        </h4>
        <ToggleGroup
          className="bg-muted rounded-md overflow-hidden"
          type="single"
          value={seleccion}
          onValueChange={(val) => {
            if (val) setSeleccion(val as 'Pilotos' | 'Escuderias');
          }}
          spacing={0}
        >
          <ToggleGroupItem value="Pilotos">Pilotos</ToggleGroupItem>
          <ToggleGroupItem value="Escuderias">Escuderías</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="w-full overflow-hidden rounded-xl border bg-card shadow-sm">
        {seleccion === 'Pilotos' ? (
          <div className="w-full overflow-x-auto">
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
                  <TableHead className="w-[100px] font-bold h-12">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      Puntos
                    </div>
                  </TableHead>
                  <TableHead className="w-[140px] font-bold h-12 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Drill className="h-4 w-4 text-muted-foreground" />
                      Escudería
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((row) => {
                  const e = escuderiasdata.find(
                    (e) => row.piloto.team === e.id,
                  );
                  return (
                    <TableRow
                      key={row.id}
                      className="transition-colors hover:bg-muted/40"
                      style={{
                        backgroundColor: e?.color
                          ? `color-mix(in srgb, #${e.color} 15%, transparent)`
                          : undefined,
                        borderLeft: e?.color
                          ? `4px solid #${e.color}`
                          : '4px solid transparent',
                      }}
                    >
                      <TableCell className="font-medium">
                        <Badge
                          variant={
                            row.position === 1
                              ? 'default'
                              : row.position < 4
                                ? 'secondary'
                                : 'outline'
                          }
                          className="w-10 justify-center h-6"
                        >
                          {row.position}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {row.piloto.name}
                      </TableCell>
                      <TableCell className="font-medium tabular-nums text-foreground">
                        {row.points}
                      </TableCell>
                      <TableCell className="text-right font-medium text-muted-foreground">
                        {e?.name}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
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
                      <Drill className="h-4 w-4 text-muted-foreground" />
                      Escudería
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px] font-bold h-12">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      Puntos
                    </div>
                  </TableHead>
                  <TableHead className="w-[140px] font-bold h-12 text-right">
                    <div className="flex items-center gap-2 ml-6">
                      <Medal className="h-4 w-4 text-muted-foreground " />
                      Torneos
                    </div>
                    {'  '}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((row) => {
                  const e = escuderiasdata.find(
                    (e) => row.escuderia.id === e.id,
                  );
                  return (
                    <TableRow
                      key={row.id}
                      className="transition-colors hover:bg-muted/40"
                      style={{
                        backgroundColor: row.escuderia.color
                          ? `color-mix(in srgb, #${row.escuderia.color} 15%, transparent)`
                          : undefined,
                        borderLeft: row.escuderia.color
                          ? `4px solid #${row.escuderia.color}`
                          : '4px solid transparent',
                      }}
                    >
                      <TableCell className="font-medium">
                        <Badge
                          variant={
                            row.position === 1
                              ? 'default'
                              : row.position < 4
                                ? 'secondary'
                                : 'outline'
                          }
                          className="w-10 justify-center h-6"
                        >
                          {row.position}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {row.escuderia.name}
                      </TableCell>
                      <TableCell className="font-medium tabular-nums text-foreground">
                        {row.points}
                      </TableCell>
                      <TableCell className="text-center">
                        {e?.wccs?.length}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default TableChampionship;
