import { useState, useEffect } from "react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Link } from "react-router-dom";
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

//DEFINICIONES DE CLASES
type FormState = {
  name: string;
  start_date: Date | null;
  end_date: Date | null;
  circuito: string;
  temporada: string;
};

type Circuito = {
  id: string;
  name: string;
};

type Categoria = {
  id: string;
  name: string;
};

type Temporada = {
  id: string;
  year: string;
  racing_series: string;
};

function NuevaCarrera() {
  const [form, setForm] = useState<FormState>({
    name: "",
    start_date: null,
    end_date: null,
    circuito: "",
    temporada: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);
  const [circuitos, setCircuitos] = useState<Circuito[]>([]);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  //getAll circuitos
  useEffect(() => {
    fetch(`${api}/circuitos`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setCircuitos(data.data);
        } else {
          setCircuitos([]);
          console.error(
            "La respuesta no contiene un array de circuitos.",
            data
          );
        }
      })
      .catch((err) => {
        setCircuitos([]);
        console.error("Error cargando circuitos", err);
      });
  }, [api]);

  //getAll temporadas
  useEffect(() => {
    fetch(`${api}/temporadas`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setTemporadas(data.data);
        } else {
          setTemporadas([]);
          console.error(
            "La respuesta no contiene un array de temporadas.",
            data
          );
        }
      })
      .catch((err) => {
        setTemporadas([]);
        console.error("Error cargando temporadas", err);
      });
  }, [api]);

  // getAll categorias
  useEffect(() => {
    fetch(`${api}/categorias`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setCategorias(data.data);
        } else {
          setCategorias([]);
          console.error(
            "La respuesta no contiene un array de categorías.",
            data
          );
        }
      })
      .catch((err) => {
        setCategorias([]);
        console.error("Error cargando categorías", err);
      });
  }, [api]);

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

    try {
      const res = await fetch(`${api}/carreras`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      setMessage("Carrera creada con éxito.");
      setForm({
        name: "",
        start_date: null,
        end_date: null,
        circuito: "",
        temporada: "",
      });
    } catch (err: any) {
      console.error(err);
      setMessage(`Error: ${err.message || "No se pudo crear la carrera"}`);
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

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/65 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-gray-700/40"
        >
          <h1
            className="text-white-200 mt-5 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Nueva Carrera
          </h1>

          <InputGroup className="mt-5 mb-5 w-full">
            <InputGroupInput
              placeholder="Nombre de la carrera"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
              className="focus-visible:ring-slate-500 focus-visible:border-slate-500 hover:border-slate-600"
            />
          </InputGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Popover open={openStart} onOpenChange={setOpenStart}>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal focus-visible:ring-slate-500 focus-visible:border-slate-500 hover:border-slate-600"
                  type="button"
                >
                  {form.start_date
                    ? form.start_date.toLocaleDateString()
                    : "Fecha de inicio"}
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0 border-none"
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
              <PopoverTrigger>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal focus-visible:ring-slate-500 focus-visible:border-slate-500 hover:border-slate-600"
                  type="button"
                >
                  {form.end_date
                    ? form.end_date.toLocaleDateString()
                    : "Fecha de fin"}
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0 border-none"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
              <Select
                value={form.circuito}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, circuito: value }))
                }
                required
              >
                <SelectTrigger className="w-full focus-visible:ring-slate-500 focus-visible:border-slate-500 hover:border-slate-600">
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
                value={form.temporada}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, temporada: value }))
                }
                required
              >
                <SelectTrigger className="w-full focus-visible:ring-slate-500 focus-visible:border-slate-500 hover:border-slate-600">
                  <SelectValue placeholder="Temporada" />
                </SelectTrigger>
                <SelectContent className="border-secondary">
                  {temporadas.map((t) => {
                    const categoria = categorias.find(
                      (c) => String(c.id) === String(t.racing_series)
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

          <div className="flex w-full justify-between pt-4">
            <Link to="/menuadmin">
              <Button
                className="bg-transparent hover:bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300"
                type="button"
              >
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-slate-600 hover:bg-slate-700 text-white font-semibold shadow-lg shadow-slate-900/50 border-0"
            >
              {submitting ? "Enviando..." : "Crear nueva carrera"}
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
