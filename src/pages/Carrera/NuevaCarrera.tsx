import { useState, useEffect } from "react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import * as React from "react";
import { Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);
  const [circuitos, setCircuitos] = useState<Circuito[]>([]);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  //getAll circuitos
  useEffect(() => {
    fetch(`${api}/circuitos`)
      .then((res) => res.json()) //convierte a JSON
      .then((data) => {
        if (Array.isArray(data.data)) {
          setCircuitos(data.data); //si dentro de data es array, lo carga a escuderias
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
      .then((res) => res.json()) //convierte a JSON
      .then((data) => {
        if (Array.isArray(data.data)) {
          setTemporadas(data.data); //si dentro de data es array, lo carga a escuderias
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
    > //agregado HTMLSelectElement para resolver error en los select
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
    <div className="flex relative min-h-screen">
      <div className="bg-[url('./src/assets/franco-1.webp')] bg-cover bg-center max-w-[25%] w-full flex-1" />
      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex-2 mx-8 mt-20 flex flex-col items-center"
      >
        <div className="">
          <h1 className="text-primary-foreground mt-5 scroll-m-20 text-4xl font-semibold tracking-tight text-center">
            Nueva carrera
          </h1>
          <div className="flex mt-10">
            <InputGroup className="mb-5 w-96">
              <InputGroupInput
                placeholder="Nombre"
                id="name"
                value={form.name}
                onChange={handleChange}
              />
            </InputGroup>
          </div>
          <div className="flex justify-between">
            <Popover open={openStart} onOpenChange={setOpenStart}>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  id="date"
                  className="w-45 justify-between font-normal"
                  type="button"
                >
                  {form.start_date
                    ? form.start_date.toLocaleDateString()
                    : "Fecha de inicio"}
                  <ChevronDownIcon />
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
                  className="w-45 justify-between font-normal"
                  type="button"
                >
                  {form.end_date
                    ? form.end_date.toLocaleDateString()
                    : "Fecha de fin"}
                  <ChevronDownIcon />
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
          <div className="flex mt-5">
            <InputGroup className="mb-5 w-45 mr-6">
              <Select
                value={form.circuito}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, circuito: value }))
                }
                required
              >
                <SelectTrigger className="w-full">
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
            <InputGroup className="mb-5 w-45">
              <Select
                value={form.temporada}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, temporada: value }))
                }
                required
              >
                <SelectTrigger className="w-full">
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
        </div>

        <div className="flex w-96 justify-between">
          <Link to="/menuadmin">
            <Button
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
              type="button"
            >
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Crear nueva carrera"}
          </Button>
        </div>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
      <div className="bg-[url('./src/assets/piastri-1.webp')] bg-cover bg-center max-w-[25%] w-full flex-1 " />
    </div>
  );
}

export default NuevaCarrera;
