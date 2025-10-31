"use client"

import * as React from "react"
import { es } from "react-day-picker/locale"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Sesion } from "@/entities/sesion.entity.ts";
import { cn } from "@/lib/utils.ts";
import { Carrera } from "@/entities/carrera.entity.ts";

export default function Calendar21({ carreras }: { carreras?: Carrera[] }) {
  const [selected, setSelected] = React.useState<Date>();

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
      selected={selected}
      onSelect={setSelected}
      numberOfMonths={3}
      captionLayout="label"
      className="rounded-lg bg-background/70 text-primary-foreground border shadow-2xl [--cell-size:--spacing(11)] md:[--cell-size:--spacing(13)]"
      components={{
        DayButton: ({ children, modifiers, day, ...props }) => {
          
          const esSesion = sesion.find(s => {
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
                esSesion && " rounded-es-2xl !bg-destructive !text-destructive-foreground"
              )}
            >
              
              {children}
              {!modifiers.outside && esSesion && (
                <span className="text-xs font-bold block">{esSesion.type}</span>
              )}
            </CalendarDayButton>
          )
        },
      }}
    />
  )
}
