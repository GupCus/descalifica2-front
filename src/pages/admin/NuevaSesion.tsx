import React, { useState, useEffect } from "react";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Carrera } from "@/entities/carrera.entity.ts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import fondoSesion from "../../assets/sesion.webp";
import { getCarrera } from "@/services/carrera.service.ts";
import { NewSesion, Sesion } from "@/entities/sesion.entity.ts";
import { postSesion, getSesion, putSesion, deleteSesion } from "@/services/sesion.service.ts";

type FormState = {
  name: string;
  type: string;
  fecha_inicio: Date | null;
  hora_inicio: string;
  fecha_fin: Date | null;
  hora_fin: string;
  race: string;
};

const getTipoSesionAbreviacion = (tipoSesion: string): string => {
  const abreviaciones: Record<string, string> = {
    "Free Practice 1": "FP1",
    "Free Practice 2": "FP2",
    "Free Practice 3": "FP3",
    Qualifying: "Q",
    "Sprint Qualifying": "SQ",
    "Sprint Race": "Sprint",
    Race: "GP",
  };
  return abreviaciones[tipoSesion] || tipoSesion;
};

const initialState: FormState = {
  name: "",
  type: "",
  fecha_inicio: null,
  hora_inicio: "00:00:00",
  fecha_fin: null,
  hora_fin: "00:00:00",
  race: "",
};

function NuevaSesion() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [openStart, setOpenStart] = useState(false);
  const [, setError] = useState<string | null>();

  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>("new");

  const isEditing = selectedEntityId !== "new";

  useEffect(() => {
    getCarrera()
      .then((data) => setCarreras(data))
      .catch((err) => setError(err));
    getSesion()
      .then((data) => setSesiones(data))
      .catch((err) => setError(err));
  }, []);

  const formatTime = (date: Date) => {
    return date.toTimeString().split(" ")[0];
  };

  const handleEntitySelect = (value: string) => {
    setSelectedEntityId(value);
    setMessage(null);
    if (value === "new") {
      setForm(initialState);
    } else {
      const selected = sesiones.find(s => String(s.id) === value);
      if (selected) {
        const start = selected.start_time ? new Date(selected.start_time) : null;
        const end = selected.end_time ? new Date(selected.end_time) : null;
        
        setForm({
          name: selected.name,
          type: selected.type,
          fecha_inicio: start,
          hora_inicio: start ? formatTime(start) : "00:00:00",
          fecha_fin: end,
          hora_fin: end ? formatTime(end) : "00:00:00",
          race: selected.race ? String((selected.race as any).id || selected.race) : "",
        });
      }
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !window.confirm("¿Estás seguro de que deseas eliminar esta sesión?")) return;
    
    setSubmitting(true);
    try {
      await deleteSesion(Number(selectedEntityId));
      setMessage("Sesión eliminada con éxito.");
      setForm(initialState);
      setSelectedEntityId("new");
      setSesiones(sesiones.filter(s => String(s.id) !== selectedEntityId));
    } catch (err: any) {
      setMessage(`Error al eliminar: ${err.message || "No se pudo eliminar la sesión"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const getDateTime = (date: Date | null, time: string) => {
      if (!date || !time) return undefined;
      const [h, m, s] = time.split(":");
      const d = new Date(date);
      d.setHours(Number(h), Number(m), Number(s || 0));
      return d;
    };

    const payload: NewSesion = {
      name: form.name,
      type: form.type,
      start_time: getDateTime(form.fecha_inicio, form.hora_inicio),
      end_time: getDateTime(form.fecha_fin, form.hora_fin),
      race: form.race,
    };

    try {
      if (isEditing) {
        const updated = await putSesion(Number(selectedEntityId), payload as any);
        setMessage("Sesión actualizada con éxito.");
        setSesiones(sesiones.map(s => s.id === updated.id ? updated : s));
      } else {
        const created = await postSesion(payload);
        setMessage("Sesión creada con éxito.");
        setForm(initialState);
        setSesiones([...sesiones, created]);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message || "No se pudo procesar la solicitud"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoSesion})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.5)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10 pb-20">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/70 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-yellow-700/40"
        >
          <h1
            className="text-white-100 mt-2 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Alta / Edición Sesión
          </h1>

          <div className="mb-6 pt-4 border-b border-yellow-800/50 pb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seleccionar sesión existente
            </label>
            <Select value={selectedEntityId} onValueChange={handleEntitySelect}>
              <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="-- Crear nueva sesión --" />
              </SelectTrigger>
              <SelectContent className="border-secondary max-h-60">
                <SelectItem value="new" className="font-bold text-yellow-400">
                  -- Crear nueva sesión --
                </SelectItem>
                {sesiones.map((s) => {
                  const r = carreras.find(c => String(c.id) === String((s.race as any)?.id || s.race));
                  return (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name} - {r ? r.name : "..."}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <InputGroup className="w-full">
            <Select
              value={form.race}
              onValueChange={(value) => setForm((s) => ({ ...s, race: value }))}
              required
            >
              <SelectTrigger className="w-full focus-visible:ring-yellow-500 focus-visible:border-yellow-500 hover:border-yellow-600 bg-transparent text-white border-gray-600">
                <SelectValue placeholder="Carrera" />
              </SelectTrigger>
              <SelectContent className="border-secondary">
                {carreras.map((car: Carrera) => {
                  return (
                    <SelectItem key={car.id} value={String(car.id)}>
                      {car?.name || "??"} ({car.season?.year || "??"}) (
                      {car.season?.racing_series?.name || "??"})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </InputGroup>
          <InputGroup>
            <Select
              value={form.name}
              onValueChange={(value) =>
                setForm((s) => ({
                  ...s,
                  name: value,
                  type: getTipoSesionAbreviacion(value),
                }))
              }
              required
            >
              <SelectTrigger className="w-full focus-visible:ring-yellow-500 focus-visible:border-yellow-500 hover:border-yellow-600 bg-transparent text-white border-gray-600">
                <SelectValue placeholder="Tipo de sesión" />
              </SelectTrigger>
              <SelectContent className="border-secondary">
                <SelectItem value="Free Practice 1">Free Practice 1</SelectItem>
                <SelectItem value="Free Practice 2">Free Practice 2</SelectItem>
                <SelectItem value="Free Practice 3">Free Practice 3</SelectItem>
                <SelectItem value="Qualifying">Qualifying</SelectItem>
                <SelectItem value="Race">Race</SelectItem>
                <SelectItem value="Sprint Qualifying">
                  Sprint Qualifying
                </SelectItem>
                <SelectItem value="Sprint Race">Sprint Race</SelectItem>
              </SelectContent>
            </Select>
          </InputGroup>

          <Label htmlFor="fecha_inicio" className="text-white-100">
            Fecha de inicio
          </Label>
          <Popover open={openStart} onOpenChange={setOpenStart}>
            <PopoverTrigger className="w-full">
              <Button
                variant="outline"
                id="fecha_inicio"
                className="w-full justify-between font-normal focus-visible:ring-yellow-500 focus-visible:border-yellow-500 hover:border-yellow-600 bg-transparent text-white border-gray-600"
                type="button"
              >
                {form.fecha_inicio
                  ? form.fecha_inicio.toLocaleDateString()
                  : "Elegir fecha de inicio"}
                <ChevronDownIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0 border-none z-50"
              align="start"
            >
              <Calendar
                mode="single"
                selected={form.fecha_inicio ?? undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (date)
                    setForm((prev) => ({
                      ...prev,
                      fecha_inicio: date,
                      fecha_fin: date,
                    }));
                  setOpenStart(false);
                }}
              />
            </PopoverContent>
          </Popover>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hora_inicio" className="text-white-100">
                Hora de inicio
              </Label>
              <Input
                type="time"
                id="hora_inicio"
                step="1"
                value={form.hora_inicio}
                onChange={handleChange}
                className="bg-transparent text-white border-gray-600 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none focus-visible:ring-yellow-500 focus-visible:border-yellow-500 hover:border-yellow-600"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="hora_fin" className="text-white-100">
                Hora de fin
              </Label>
              <Input
                type="time"
                id="hora_fin"
                step="1"
                value={form.hora_fin}
                onChange={handleChange}
                className="bg-transparent text-white border-gray-600 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none focus-visible:ring-yellow-500 focus-visible:border-yellow-500 hover:border-yellow-600"
              />
            </div>
          </div>

          <div className="flex w-full justify-between pt-6">
            <div className="flex gap-2">
              <Button
                type="button"
                className="bg-transparent hover:bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300"
                onClick={() => window.history.back()}
              >
                Volver
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={submitting}
                >
                  Eliminar
                </Button>
              )}
            </div>
            
            <Button
              type="submit"
              disabled={submitting}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold shadow-lg shadow-yellow-900/50 border-0"
            >
              {submitting ? "Enviando..." : (isEditing ? "Guardar cambios" : "Crear nueva sesión")}
            </Button>
          </div>

          {message && (
            <p className="mt-2 text-sm text-center font-semibold text-yellow-200">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default NuevaSesion;
