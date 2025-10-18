import React, { useState, useEffect } from "react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import axios from "axios";
import { Carrera } from "@/entities/carrera.entity.ts";
import { Temporada } from "@/entities/temporada.entity.ts";
import { Categoria } from "@/entities/categoria.entity.ts";

//DEFINICIONES DE CLASES - FALTA INTEGRAR LOS RESULTADOS!!!!! (capaz es mejor ponerlos en otro lado?)
type FormState = {
  name: string;
  tipoSesion: string;
  fecha_hora_inicio: Date | null;
  fecha_hora_fin: Date | null;
  carrera: string;
};

//Necesarios para mostrar la carrera, con su año y temporada para mayor claridad.


const client = axios.create({
  baseURL: "http://localhost:3000/api/carreras" 
});
async function getCarreras(): Promise<Carrera[]> {
  try {
    const response = await client.get('/');
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    throw error;
  }
}
//--------------------------------------------------------------

function NuevaSesion() {
  const [form, setForm] = useState<FormState>({
    name: "",
    tipoSesion: "",
    fecha_hora_inicio: null,
    fecha_hora_fin: null,
    carrera: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);

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
        console.error(err)
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

    try {
      const res = await fetch(`${api}/sesion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      setMessage("Sesión creada con éxito.");
      setForm({
        name: "",
        tipoSesion: "",
        fecha_hora_inicio: null,
        fecha_hora_fin: null,
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
                  value={form.tipoSesion}
                  onValueChange={(value) =>
                    setForm((s) => ({ ...s, tipoSesion: value }))
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
            <div className="flex justify-between">
              <InputGroup className="mb-5 w-45">
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
                  {carreras.length > 0 &&
                    temporadas.length > 0 &&
                    categorias.length > 0 && (
                      <SelectContent className="border-secondary">
                        {carreras.map((car:Carrera) => {
                          
                          console.log({})
                          return (
                            <SelectItem key={car.id} value={String(car.id)}>
                              {(car ? car.name : "??") + " "} 
                              ({car.temporada ? car.temporada?.year : "??"})
                              ({car.temporada ? (car.temporada.racing_series ? car.temporada?.racing_series.name : "??") : "??"})
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    )}
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
              {submitting ? "Enviando..." : "Crear nueva temporada"}
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
