"use client"

//import * as React from "react"
import { es } from "react-day-picker/locale"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Sesion } from "@/entities/sesion.entity.ts";
import { cn } from "@/lib/utils.ts";
import { Carrera } from "@/entities/carrera.entity.ts";

export default function Calendar21({ carreras }: { carreras?: Carrera[] }) {
  //const [selected, setSelected] = React.useState<Date>();

  if (!carreras || carreras.length === 0) {
    return <div>No hay carreras</div>;
  }

  const sesion: Sesion[] = carreras
  .flatMap(c => c.sessions || [])
  .filter((s:Sesion) => s !== undefined && s !== null);

  return (
    <Calendar
      mode= "single"
      locale={es}
      defaultMonth={new Date()}
      //selected={selected}
      //onSelect={setSelected}
      numberOfMonths={3}
      showOutsideDays={false}
      captionLayout="label"
      className="rounded-lg bg-background/70 text-primary-foreground border shadow-2xl [--cell-size:--spacing(11)] md:[--cell-size:--spacing(13)]"
      components={{
        DayButton: ({ children, modifiers, day, ...props }) => {
          
          const sesionesDelDia = sesion.filter(s => {
            const fechaSesion = typeof s.start_time === 'string'
              ? new Date(s.start_time)
              : s.start_time;
            
            return fechaSesion?.toDateString() === day.date.toDateString();
          });

          return (
            <CalendarDayButton 
              day={day} 
              modifiers={modifiers} 
              {...props}
              className={cn(
                props.className,
                sesionesDelDia.length > 0 
              )}
            >
              <span className={cn(sesionesDelDia.length > 0 && "font-bold text-primary-foreground")}>
                {children}
              </span>
              
              {!modifiers.outside && sesionesDelDia.length > 0 && (
                <div className="flex flex-col gap-[2px] w-full px-1 mt-0.5">
                  {sesionesDelDia.map((s, i) => (
                    <span 
                      key={i} 
                      className={cn(
                        "text-[8px] md:text-[9px] leading-tight font-semibold uppercase tracking-wider rounded px-1 py-0.5 w-full truncate shadow-sm",
                        s.type === "GP" ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
                      )}
                      title={s.type}
                    >
                      {s.type}
                    </span>
                  ))}
                </div>
              )}
            </CalendarDayButton>
          )
        },
      }}
    />
  )
}
