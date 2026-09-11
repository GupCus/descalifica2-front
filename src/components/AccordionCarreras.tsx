import { Carrera } from '@/entities/carrera.entity.ts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import DashboardAccordion from './DashboardAccordion.tsx';
import { Escuderia } from '@/entities/escuderia.entity.ts';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group.tsx';

export default function AccordionCarreras({
  carrerasAnteriores,
  escuderiasdata,
  setanio,
  anio,
}: {
  carrerasAnteriores: Carrera[] | undefined;
  escuderiasdata: Escuderia[];
  setanio: (anio: number) => void;
  anio: number;
}) {
  const anios = ['2026', '2025', '2024', '2023'];
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <h4 className="text-xl lg:text-xl text-center lg:text-left font-semibold tracking-tight lg:mt-0">
          🏁 Grandes premios:
        </h4>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <p className="text-sm font-medium text-muted-foreground text-center sm:text-left">
            ¿Querés ver más? Elegí un año:
          </p>
          <ToggleGroup
            className="bg-muted rounded-md overflow-hidden"
            type="single"
            value={anio.toString()}
            onValueChange={(val) => {
              if (val) setanio(Number.parseInt(val));
            }}
          >
            {anios.map((a) => (
              <ToggleGroupItem key={a} value={a}>
                {a}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <Accordion
        className="w-full bg-card rounded-xl border shadow-sm overflow-hidden"
        type="single"
        collapsible
      >
        {carrerasAnteriores ? (
          carrerasAnteriores.map((gp) =>
            !gp ? null : (
              <AccordionItem
                key={gp.id}
                value={gp.id.toString()}
                className="last:border-0"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 transition-colors text-xl md:text-2xl font-bold tracking-tight hover:no-underline data-[state=open]:bg-muted/30">
                  {gp.name}
                </AccordionTrigger>

                <AccordionContent className="!p-0 border-t">
                  <div className="w-full min-w-0 md:flex-1 h-full">
                    <DashboardAccordion
                      sesiones={gp.sessions}
                      circuito={gp.track!}
                      escuderiasdata={escuderiasdata!}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ),
          )
        ) : (
          <div className="py-8 text-center text-muted-foreground font-medium">
            No hay grandes premios recientes para mostrar.
          </div>
        )}
      </Accordion>
    </>
  );
}
