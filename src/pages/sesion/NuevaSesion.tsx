import React, { useState, useEffect } from "react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import axios from "axios";
import { Carrera } from "@/entities/carrera.entity.ts";
import { Temporada } from "@/entities/temporada.entity.ts";
import { Categoria } from "@/entities/categoria.entity.ts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

//DEFINICIONES DE CLASES - FALTA INTEGRAR LOS RESULTADOS!!!!! (capaz es mejor ponerlos en otro lado?)
type FormState = {
  name: string;
  tipo_Sesion: string;
  fecha_inicio: Date | null;
  hora_inicio: string;
  fecha_fin: Date | null;
  hora_fin: string;
  carrera: string;
};

//Necesarios para mostrar la carrera, con su año y temporada para mayor claridad.

const client = axios.create({
  baseURL: "http://localhost:3000/api/carreras",
});
async function getCarreras(): Promise<Carrera[]> {
  try {
    const response = await client.get("/");
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    throw error;
  }
}
//--------------------------------------------------------------

function NuevaSesion() {
  const [form, setForm] = useState<FormState>({
    name: "",
    tipo_Sesion: "",
    fecha_inicio: null,
    hora_inicio: "00:00:00",
    fecha_fin: null,
    hora_fin: "",
    carrera: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [, setCategorias] = useState<Categoria[]>([]);
  const [, setTemporadas] = useState<Temporada[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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

  //getAll temporadas
  useEffect(() => {
    fetch(`${api}/temporadas`)
      .then((res) => res.json()) //convierte a JSON
      .then((data) => {
        if (Array.isArray(data.data)) {
          setTemporadas(data.data); //si dentro de data es array, lo carga a Temporadas
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

  //getAll carreras
  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const data = await getCarreras();
        console.log(data);
        setCarreras(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCarreras();
  }, []);

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

    //Combinar fecha y hora
    const getDateTime = (date: Date | null, time: string) => {
      if (!date || !time) return null; //si alguno de los dos no existe, retorna null
      const [h, m, s] = time.split(":"); //divide la variable local time (que vino desde afuera) y la separa en 'h' 'm' y 's'
      const d = new Date(date); //agarra date y guarda en d como Date
      d.setHours(Number(h), Number(m), Number(s || 0)); //usa el arreglo de [h,m,s] y lo junta para hacer el tiempo, guarda en 'd'
      return d.toISOString();
    };

    //Guardar fecha y hora concatenadas al final del form
    const guardarFechas = {
      ...form,
      fecha_Hora_inicio: getDateTime(form.fecha_inicio, form.hora_inicio),
      fecha_Hora_fin: getDateTime(form.fecha_fin, form.hora_fin),
    };

    try {
      const res = await fetch(`${api}/sesion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guardarFechas),
      });
      console.log(form);

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }
      setMessage("Sesión creada con éxito.");
      setForm({
        name: "",
        tipo_Sesion: "",
        fecha_inicio: null,
        hora_inicio: "00:00:00",
        fecha_fin: null,
        hora_fin: "00:00:00",
        carrera: "",
      });
    } catch (err: any) {
      console.error(err);
      setMessage(`Error: ${err.message || "No se pudo crear la sesión"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url('./src/assets/F1-drivers-25.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.7)",
        }}
      />
      <div className="relative z-10 flex min-h-screen">
        <div className="bg-[url('./src/assets/franco-1.jpg')] bg-cover bg-center max-w-[25%] w-full flex-1" />

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex-2 mx-8 mt-20 flex flex-col items-center"
        >
          <div className="">
            <h1 className="text-primary-foreground mt-5 scroll-m-20 text-4xl font-semibold tracking-tight text-center">
              Alta sesión
            </h1>
            <div className="flex mt-5">
              <InputGroup className=" mb-5 w-45 mr-5">
                <InputGroupInput
                  placeholder="Nombre"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup className="mb-5 w-45">
                <Select
                  value={form.tipo_Sesion}
                  onValueChange={(value) =>
                    setForm((s) => ({ ...s, tipo_Sesion: value }))
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tipo de sesión" />
                  </SelectTrigger>
                  <SelectContent className="border-secondary">
                    <SelectItem value="Free Practice 1">
                      Free Practice 1
                    </SelectItem>
                    <SelectItem value="Free Practice 2">
                      Free Practice 2
                    </SelectItem>
                    <SelectItem value="Free Practice 3">
                      Free Practice 3
                    </SelectItem>
                    <SelectItem value="Qualifying">Qualifying</SelectItem>
                    <SelectItem value="Race">Race</SelectItem>
                    <SelectItem value="Sprint Qualifying">
                      Sprint Qualifying
                    </SelectItem>
                    <SelectItem value="Sprint Race">Sprint Race</SelectItem>
                  </SelectContent>
                </Select>
              </InputGroup>
            </div>
            <div className="flex">
              <InputGroup className="mb-5 w-96">
                <Select
                  value={form.carrera}
                  onValueChange={(value) =>
                    setForm((s) => ({ ...s, carrera: value }))
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Carrera" />
                  </SelectTrigger>

                  <SelectContent className="border-secondary">
                    {carreras.map((car: Carrera) => {
                      console.log({});
                      return (
                        <SelectItem key={car.id} value={String(car.id)}>
                          {(car ? car.name : "??") + " "}(
                          {car.temporada ? car.temporada?.year : "??"}) (
                          {car.temporada
                            ? car.temporada.racing_series
                              ? car.temporada?.racing_series.name
                              : "??"
                            : "??"}
                          )
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </InputGroup>
            </div>
            <div className="mb-5">
              <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="fecha_inicio" className="px-1">
                    Fecha de inicio
                  </Label>
                  <Popover open={openStart} onOpenChange={setOpenStart}>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        id="fecha_inicio"
                        className="w-56 justify-between font-normal"
                        type="button"
                      >
                        {form.fecha_inicio
                          ? form.fecha_inicio.toLocaleDateString()
                          : "Elegir fecha de inicio"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0 border-none"
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
                            }));
                          setOpenStart(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-3 w-35">
                  <Label htmlFor="hora_inicio" className="px-1">
                    Hora de inicio
                  </Label>
                  <Input
                    type="time"
                    id="hora_inicio"
                    step="1"
                    defaultValue="00:00:00"
                    value={form.hora_inicio}
                    onChange={handleChange}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="fecha_fin" className="px-1">
                    Fecha de finalización
                  </Label>
                  <Popover open={openEnd} onOpenChange={setOpenEnd}>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        id="fecha_fin"
                        className="w-56 justify-between font-normal"
                        type="button"
                      >
                        {form.fecha_fin
                          ? form.fecha_fin.toLocaleDateString()
                          : "Elegir fecha de finalización"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0 border-none"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={form.fecha_fin ?? undefined}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          if (date)
                            setForm((prev) => ({
                              ...prev,
                              fecha_fin: date,
                            }));
                          setOpenEnd(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-3 w-35">
                  <Label htmlFor="hora_fin" className="px-1">
                    Hora de fin
                  </Label>
                  <Input
                    type="time"
                    id="hora_fin"
                    step="1"
                    defaultValue="01:30:00"
                    value={form.hora_fin}
                    onChange={handleChange}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
              </div>
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
              {submitting ? "Enviando..." : "Crear nueva sesión"}
            </Button>
          </div>

          {message && <p className="mt-2 text-sm">{message}</p>}
        </form>

        <div className="bg-[url('./src/assets/piastri-1.webp')] bg-cover bg-center max-w-[25%] w-full flex-1 " />
      </div>
    </div>
  );
}

export default NuevaSesion;
