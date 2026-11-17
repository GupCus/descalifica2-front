import { useState } from 'react';
import * as React from 'react';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const WEEKDAY_NAMES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

export interface BirthDatePickerProps {
  id?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  variant?: 'default' | 'dark';
}

export function BirthDatePicker({
  id = 'birth_date_btn',
  value,
  onChange,
  variant = 'default',
}: BirthDatePickerProps) {
  const currentYear = new Date().getFullYear();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState<number>(() =>
    value ? value.getUTCFullYear() : 2000,
  );
  const [viewMonth, setViewMonth] = useState<number>(() =>
    value ? value.getUTCMonth() : 0,
  );

  const handleSelectDay = (day: number) => {
    const selectedDate = new Date(Date.UTC(viewYear, viewMonth, day));
    onChange(selectedDate);
    setOpen(false);
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      if (viewYear < currentYear) {
        setViewMonth(0);
        setViewYear((y) => y + 1);
      }
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Lunes = 0
  const yearsOptions = Array.from(
    { length: currentYear - 1920 + 1 },
    (_, i) => currentYear - i,
  );

  const isDark = variant === 'dark';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          onClick={() => {
            if (!open && value) {
              setViewYear(value.getUTCFullYear());
              setViewMonth(value.getUTCMonth());
            }
          }}
          className={
            isDark
              ? 'w-full h-9 border border-input dark:bg-input/30 rounded-md px-2.5 sm:px-3 flex items-center justify-between text-left cursor-pointer hover:border-ring/50 transition-colors select-none'
              : 'w-full h-9 border border-input rounded-md px-3 flex items-center justify-between text-left cursor-pointer hover:border-ring/50 transition-colors select-none bg-background text-foreground'
          }
        >
          <span
            className={
              value
                ? isDark
                  ? 'text-foreground font-medium text-xs sm:text-sm truncate'
                  : 'text-foreground font-medium text-sm truncate'
                : isDark
                  ? 'text-gray-500/50 text-xs sm:text-sm truncate'
                  : 'text-muted-foreground text-sm truncate'
            }
          >
            {value
              ? value.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  timeZone: 'UTC',
                })
              : 'Seleccionar'}
          </span>
          <CalendarIcon
            className={
              isDark
                ? 'h-3.5 w-3.5 text-muted-foreground opacity-50 shrink-0'
                : 'h-4 w-4 text-muted-foreground opacity-50 shrink-0'
            }
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={
          isDark
            ? 'w-72 max-w-[calc(100vw-2rem)] p-3 sm:p-4 bg-gray-900 border-gray-700 text-gray-200 shadow-2xl z-50'
            : 'w-72 max-w-[calc(100vw-2rem)] p-4 bg-popover border-border text-popover-foreground shadow-2xl z-50'
        }
        align="start"
      >
        <div className="flex items-center justify-between gap-1 mb-2.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            className={
              isDark
                ? 'p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors'
                : 'p-1 text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded transition-colors'
            }
            title="Mes anterior"
          >
            <ChevronLeft size={15} />
          </button>

          <div className="flex items-center gap-1 flex-1 justify-center">
            <select
              value={viewMonth}
              onChange={(e) => setViewMonth(Number(e.target.value))}
              className={
                isDark
                  ? 'bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded px-1.5 py-1 outline-none focus:border-blue-500 cursor-pointer'
                  : 'bg-background border border-input text-foreground text-xs rounded px-1.5 py-1 outline-none focus:ring-1 focus:ring-ring cursor-pointer'
              }
            >
              {MONTH_NAMES.map((month, idx) => (
                <option
                  key={month}
                  value={idx}
                  className={isDark ? 'bg-gray-900' : 'bg-background'}
                >
                  {month}
                </option>
              ))}
            </select>

            <select
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
              className={
                isDark
                  ? 'bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded px-1.5 py-1 outline-none focus:border-blue-500 cursor-pointer'
                  : 'bg-background border border-input text-foreground text-xs rounded px-1.5 py-1 outline-none focus:ring-1 focus:ring-ring cursor-pointer'
              }
            >
              {yearsOptions.map((year) => (
                <option
                  key={year}
                  value={year}
                  className={isDark ? 'bg-gray-900' : 'bg-background'}
                >
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            disabled={
              viewYear >= currentYear && viewMonth >= new Date().getMonth()
            }
            className={
              isDark
                ? 'p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                : 'p-1 text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
            }
            title="Mes siguiente"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {WEEKDAY_NAMES.map((d) => (
            <span
              key={d}
              className={
                isDark
                  ? 'text-[10px] font-semibold text-gray-400 select-none'
                  : 'text-[10px] font-semibold text-muted-foreground select-none'
              }
            >
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-7 w-7" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNumber = i + 1;
            const isSelected =
              value &&
              value.getUTCFullYear() === viewYear &&
              value.getUTCMonth() === viewMonth &&
              value.getUTCDate() === dayNumber;

            return (
              <button
                key={dayNumber}
                type="button"
                onClick={() => handleSelectDay(dayNumber)}
                className={`h-7 w-7 text-xs rounded-md flex items-center justify-center transition-all cursor-pointer select-none ${
                  isSelected
                    ? isDark
                      ? 'bg-blue-600 text-white font-bold shadow-md'
                      : 'bg-primary text-primary-foreground font-bold shadow-md'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {dayNumber}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
