import { useState, useEffect } from "react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";
import { Calendar as ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import fondoCarrera from "../../assets/Monaco-Fondo.webp";
import { getCategoria } from "@/services/categoria.service.ts";
import { Circuito } from "@/entities/circuito.entity.ts";
import { Temporada } from "@/entities/temporada.entity.ts";
import { Categoria } from "@/entities/categoria.entity.ts";
import { getTemporada } from "@/services/temporada.service.ts";
import { getCircuito } from "@/services/circuito.service.ts";
import { postCarrera, getCarrera, putCarrera, deleteCarrera } from "@/services/carrera.service.ts";
import { Carrera } from "@/entities/carrera.entity.ts";

type FormState = {
  name: string;
  start_date: Date | null;
  end_date: Date | null;
  track: string;
  season: string;
};

const initialState: FormState = {
  name: "",
  start_date: null,
  end_date: null,
  track: "",
  season: "",
};

function NuevaCarrera() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);
  const [circuitos, setCircuitos] = useState<Circuito[]>([]);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>("new");

  const isEditing = selectedEntityId !== "new";

  useEffect(() => {
    getCircuito()
      .then((data) => setCircuitos(data))
      .catch((err) => console.error("Error cargando circuitos", err));
    getTemporada()
      .then((data) => setTemporadas(data))
      .catch((err) => console.error("Error cargando temporadas", err));
    getCategoria()
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error cargando categorías", err));
    getCarrera()
      .then((data) => setCarreras(data))
      .catch((err) => console.error("Error cargando carreras", err));
  }, []);

  const handleEntitySelect = (value: string) => {
    setSelectedEntityId(value);
    setMessage(null);
    if (value === "new") {
      setForm(initialState);
    } else {
      const selected = carreras.find(c => String(c.id) === value);
      if (selected) {
        setForm({
          name: selected.name,
          start_date: selected.start_date ? new Date(selected.start_date) : null,
          end_date: selected.end_date ? new Date(selected.end_date) : null,
          track: selected.track ? String(selected.track.id) : "",
          season: selected.season ? String(selected.season.id) : "",
        });
      }
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

  const handleDelete = async () => {
    if (!isEditing || !window.confirm("¿Estás seguro de que deseas eliminar esta carrera?")) return;
    
    setSubmitting(true);
    try {
      await deleteCarrera(Number(selectedEntityId));
      setMessage("Carrera eliminada con éxito.");
      setForm(initialState);
      setSelectedEntityId("new");
      setCarreras(carreras.filter(c => String(c.id) !== selectedEntityId));
    } catch (err: any) {
      setMessage(`Error al eliminar: ${err.message || "No se pudo eliminar la carrera"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (!form.start_date || !form.end_date) {
      setMessage("Por favor selecciona las fechas");
      setSubmitting(false);
      return;
    }

    const payload = {
      name: form.name,
      start_date: form.start_date,
      end_date: form.end_date,
      track: form.track,
      season: form.season,
    } as any;

    try {
      if (isEditing) {
        const updated = await putCarrera(Number(selectedEntityId), payload);
        setMessage("Carrera actualizada con éxito.");
        setCarreras(carreras.map(c => c.id === updated.id ? updated : c));
      } else {
        const created = await postCarrera(payload);
        setMessage("Carrera creada con éxito.");
        setForm(initialState);
        setCarreras([...carreras, created]);
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
          backgroundImage: `url(${fondoCarrera})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.5)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10 pb-20">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/65 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-gray-700/40"
        >
          <h1
            className="text-gray-200 mt-2 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Alta / Edición Carrera
          </h1>

          <div className="mb-6 pt-4 border-b border-gray-700 pb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seleccionar carrera existente
            </label>
            <Select value={selectedEntityId} onValueChange={handleEntitySelect}>
              <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="-- Crear nueva carrera --" />
              </SelectTrigger>
              <SelectContent className="border-secondary max-h-60">
                <SelectItem value="new" className="font-bold text-slate-400">
                  -- Crear nueva carrera --
                </SelectItem>
                {carreras.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <InputGroup className="mt-5 mb-5 w-full">
            <InputGroupInput
              placeholder="Nombre de la carrera"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
              className="focus-visible:ring-slate-500 focus-visible:border-slate-500 hover:border-slate-600 text-white"
            />
          </InputGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Popover open={openStart} onOpenChange={setOpenStart}>
              <PopoverTrigger className="w-full">
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal focus-visible:ring-slate-500 focus-visible:border-slate-500 hover:border-slate-600 bg-transparent text-white border-gray-600"
                  type="button"
                >
                  {form.start_date
                    ? form.start_date.toLocaleDateString()
                    : "Fecha de inicio"}
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0 border-none z-50"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={form.start_date ?? undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    if (date)
                      setForm((prev) => ({ ...prev, start_date: date }));
                    setOpenStart(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            <Popover open={openEnd} onOpenChange={setOpenEnd}>
              <PopoverTrigger className="w-full">
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal focus-visible:ring-slate-500 focus-visible:border-slate-500 hover:border-slate-600 bg-transparent text-white border-gray-600"
                  type="button"
                >
                  {form.end_date
                    ? form.end_date.toLocaleDateString()
                    : "Fecha de fin"}
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0 border-none z-50"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={form.end_date ?? undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    if (date) setForm((prev) => ({ ...prev, end_date: date }));
                    setOpenEnd(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <InputGroup>
              <Select
                value={form.track}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, track: value }))
                }
                required
              >
                <SelectTrigger className="w-full focus-visible:ring-slate-500 focus-visible:border-slate-500 hover:border-slate-600 bg-transparent text-white border-gray-600">
                  <SelectValue placeholder="Circuito" />
                </SelectTrigger>
                <SelectContent className="border-secondary">
                  {circuitos.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputGroup>

            <InputGroup>
              <Select
                value={form.season}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, season: value }))
                }
                required
              >
                <SelectTrigger className="w-full focus-visible:ring-slate-500 focus-visible:border-slate-500 hover:border-slate-600 bg-transparent text-white border-gray-600">
                  <SelectValue placeholder="Temporada" />
                </SelectTrigger>
                <SelectContent className="border-secondary">
                  {temporadas.map((t) => {
                    const categoria = categorias.find(
                      (c) => String(c.id) === String(t.racing_series) || (t.racing_series && String(c.id) === String((t.racing_series as any).id))
                    );
                    return (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {String(t.year)}
                        {categoria ? ` (${categoria.name})` : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </InputGroup>
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
              className="bg-slate-600 hover:bg-slate-700 text-white font-semibold shadow-lg shadow-slate-900/50 border-0"
            >
              {submitting ? "Enviando..." : (isEditing ? "Guardar cambios" : "Crear nueva carrera")}
            </Button>
          </div>

          {message && (
            <p className="mt-2 text-sm text-center font-semibold text-gray-300">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default NuevaCarrera;
