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

//DEFINICIONES DE CLASES
type FormState = {
  name: string;
  escuderia: string; // ahora será el id de la escudería
  num: string;
  nationality: string;
  role: string;
  racing_series: string;
};

type Escuderia = {
  id: string;
  name: string;
};

type Categoria = {
  id: string;
  name: string;
};

function NuevoPiloto() {
  const [form, setForm] = useState<FormState>({
    name: "",
    escuderia: "",
    num: "",
    nationality: "",
    role: "",
    racing_series: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [escuderias, setEscuderias] = useState<Escuderia[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  //obtiene escuderías para el select
  useEffect(() => {
    fetch(`${api}/escuderias`)
      .then((res) => res.json()) //convierte a JSON
      .then((data) => {
        if (Array.isArray(data.data)) {
          setEscuderias(data.data); //si dentro de data es array, lo carga a escuderias
        } else {
          setEscuderias([]);
          console.error(
            "La respuesta no contiene un array de escuderías.",
            data
          );
        }
      })
      .catch((err) => {
        setEscuderias([]);
        console.error("Error cargando escuderías", err);
      });
  }, [api]);

  //obtiene categorias, también para el select
  useEffect(() => {
    fetch(`${api}/categorias`)
      .then((res) => res.json()) //convierte a JSON
      .then((data) => {
        if (Array.isArray(data.data)) {
          setCategorias(data.data); //si dentro de data es array, lo carga a escuderias
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
      const res = await fetch(`${api}/pilotos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      setMessage("Piloto creado con éxito.");
      setForm({
        name: "",
        escuderia: "",
        num: "",
        nationality: "",
        role: "",
        racing_series: "",
      });
    } catch (err: any) {
      console.error(err);
      setMessage(`Error: ${err.message || "No se pudo crear el piloto"}`);
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

      {/* Quita el overlay o ponle z-index menor que la imagen */}
      {/* <div className="absolute inset-0 w-full h-full z-0 bg-black/40" /> */}

      {/* Contenido por encima del fondo */}
      <div className="relative z-10 flex min-h-screen">
        <div className="bg-[url('./src/assets/franco-1.jpg')] bg-cover bg-center max-w-[25%] w-full flex-1" />

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex-2 mx-8 mt-20 flex flex-col items-center"
        >
          <div className="">
            <h1 className="text-primary-foreground mt-5 scroll-m-20 text-4xl font-semibold tracking-tight text-center">
              Alta pilotos
            </h1>
            <InputGroup className="mt-5 mb-5 w-96">
              <InputGroupInput
                placeholder="Nombre completo"
                id="name"
                value={form.name}
                onChange={handleChange}
              />
            </InputGroup>
            <div className="flex">
              <InputGroup className="mb-5 w-45 mr-6">
                <Select
                  value={form.escuderia}
                  onValueChange={(value) =>
                    setForm((s) => ({ ...s, escuderia: value }))
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escudería" />
                  </SelectTrigger>
                  <SelectContent className="border-secondary">
                    {escuderias.map((e) => (
                      <SelectItem key={e.id} value={String(e.id)}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InputGroup>
              <InputGroup className="mb-5 w-45">
                <InputGroupInput
                  placeholder="Número del piloto"
                  id="num"
                  value={form.num}
                  onChange={handleChange}
                />
              </InputGroup>
            </div>
            <InputGroup className="mb-5 w-96">
              <InputGroupInput
                placeholder="Nacionalidad"
                id="nationality"
                value={form.nationality}
                onChange={handleChange}
              />
            </InputGroup>
            <div className="flex">
              <InputGroup className="mb-5 w-45 mr-6">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent className="border-secondary">
                    <SelectGroup>
                      <SelectLabel>Posibles roles</SelectLabel>
                      <SelectItem value="Primer piloto">
                        Primer piloto
                      </SelectItem>
                      <SelectItem value="Segundo piloto">
                        Segundo piloto
                      </SelectItem>
                      <SelectItem value="Piloto reserva">
                        Piloto reserva
                      </SelectItem>
                      <SelectItem value="Piloto de pruebas">
                        Piloto de pruebas
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </InputGroup>
              <InputGroup className="mb-5 w-45">
                <Select
                  value={form.racing_series}
                  onValueChange={(value) =>
                    setForm((s) => ({ ...s, racing_series: value }))
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent className="border-secondary">
                    {categorias.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InputGroup>
            </div>
          </div>

          <div className="flex w-96 justify-between">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Enviando..." : "Crear nuevo piloto"}
            </Button>
          </div>

          {message && <p className="mt-2 text-sm">{message}</p>}
        </form>

        <div className="bg-[url('./src/assets/piastri-1.webp')] bg-cover bg-center max-w-[25%] w-full flex-1 " />
      </div>
    </div>
  );
}

export default NuevoPiloto;
