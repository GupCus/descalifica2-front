"use client"

import * as React from "react"
import { es } from "react-day-picker/locale"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Sesion } from "@/entities/sesion.entity.ts";
import { cn } from "@/lib/utils.ts";

export default function Calendar21() {
  const [selected, setSelected] = React.useState<Date>();

  const sesiones: Sesion[] = [
    {
      id: 1,
      name:"FP1",
      tipoSesion: "FP1",
      fecha_Hora_sesion: new Date(2025, 9, 17, 14,30),
    },
    {
      id: 2,
      name:"QS",
      tipoSesion: "QS",
      fecha_Hora_sesion: new Date(2025, 9, 17, 18, 30),
    },
    {
      id: 3,
      name:"Sprint",
      tipoSesion: "Sprint",
      fecha_Hora_sesion: new Date(2025, 9, 18, 14),
    },
        {
      id: 4,
      name:"Qualy",
      tipoSesion: "Qualy",
      fecha_Hora_sesion: new Date(2025, 9, 18, 18),
    },
    {
      id: 5,
      name:"GP",
      tipoSesion: "GP",
      fecha_Hora_sesion: new Date(2025, 9, 19, 16),
    },
  ];
  return (
    <Calendar
      mode= "single"
      locale={es}
      defaultMonth={new Date()}
      selected={selected}
      onSelect={setSelected}
      numberOfMonths={3}
      captionLayout="label"
      className="rounded-lg text-primary-foreground border shadow-2xl [--cell-size:--spacing(11)] md:[--cell-size:--spacing(13)]"

      components={{

        DayButton: ({ children, modifiers, day, ...props }) => {

            const sesionesDelDia = sesiones.filter(sesion => {
            const fechaSesion = typeof sesion.fecha_Hora_sesion === 'string' 
              ? new Date(sesion.fecha_Hora_sesion) 
              : sesion.fecha_Hora_sesion;
            
            // Comparar solo año, mes y día (ignorar hora)
            return fechaSesion?.toDateString() === day.date.toDateString();
          });

          // Crear label con los tipos de sesión del día
          const gpLabel = sesionesDelDia.length > 0 
            ? sesionesDelDia[0].tipoSesion
            : null;

          return (
            <CalendarDayButton 
              day={day} 
              modifiers={modifiers} 
              {...props}
              className={cn(
                props.className,
                gpLabel && " rounded-es-2xl !bg-destructive !text-destructive-foreground"
              )}
            >
              
              {children}
              {!modifiers.outside && gpLabel && (
                <span className="text-xs font-bold block">{gpLabel}</span>
              )}
            </CalendarDayButton>
          )
        },
      }}
    />
  )
}
