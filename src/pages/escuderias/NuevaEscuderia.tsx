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

type FormState = {
  name: string;
  foundation: string;
  nationality: string;
  engine: string;
  marca: string;
  categoria: string;
};

type Categoria = {
  id: string;
  name: string;
};

type Marca = {
  id: string;
  name: string;
};

function NuevaEscuderia() {
  const [form, setForm] = useState<FormState>({
    name: "",
    foundation: "",
    engine: "",
    nationality: "",
    marca: "",
    categoria: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  //getAll categorias
  useEffect(() => {
    fetch(`${api}/categorias`)
      .then((res) => res.json()) //convierte a JSON
      .then((data) => {
        if (Array.isArray(data.data)) {
          setCategorias(data.data); //si dentro de data es array, lo carga a escuderias
        } else {
          setCategorias([]);
          console.error(
            "La respuesta no contiene un array de escuderías.",
            data
          );
        }
      })
      .catch((err) => {
        setCategorias([]);
        console.error("Error cargando escuderías", err);
      });
  }, [api]);

  //getAll marcas
  useEffect(() => {
    fetch(`${api}/marcas`)
      .then((res) => res.json()) //convierte a JSON
      .then((data) => {
        if (Array.isArray(data.data)) {
          setMarcas(data.data); //si dentro de data es array, lo carga a escuderias
        } else {
          setMarcas([]);
          console.error("La respuesta no contiene un array de marcas.", data);
        }
      })
      .catch((err) => {
        setCategorias([]);
        console.error("Error cargando marcas", err);
      });
  }, [api]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`${api}/escuderias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      setMessage("Escudería creada con éxito.");
      setForm({
        name: "",
        foundation: "",
        engine: "",
        nationality: "",
        marca: "",
        categoria: "",
      });
    } catch (err: any) {
      console.error(err);
      setMessage(`Error: ${err.message || "No se pudo crear la escudería"}`);
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
            Alta escuderia
          </h1>
          <InputGroup className="mt-5 mb-5 w-96">
            <InputGroupInput
              placeholder="Nombre"
              id="name"
              value={form.name}
              onChange={handleChange}
            />
          </InputGroup>
          <div className="flex">
            <InputGroup className="mb-5 w-45 mr-6">
              <InputGroupInput
                placeholder="Año de fundación"
                id="foundation"
                value={form.foundation}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup className="mb-5 w-45">
              <InputGroupInput
                placeholder="Nacionalidad"
                id="nationality"
                value={form.nationality}
                onChange={handleChange}
              />
            </InputGroup>
          </div>
          <InputGroup className="mb-5 w-96">
            <InputGroupInput
              placeholder="Nombre del motor"
              id="engine"
              value={form.engine}
              onChange={handleChange}
            />
          </InputGroup>
          <div className="flex">
            <InputGroup className="mb-5 w-45 mr-6">
              <Select
                value={form.marca}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, marca: value }))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent className="border-secondary">
                  <SelectItem value="Ninguna">Ninguna</SelectItem>
                  {marcas.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputGroup>
            <InputGroup className="mb-5 w-45">
              <Select
                value={form.categoria}
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
            {submitting ? "Enviando..." : "Crear nueva esc."}
          </Button>
        </div>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
      <div className="bg-[url('./src/assets/piastri-1.webp')] bg-cover bg-center max-w-[25%] w-full flex-1 " />
    </div>
  );
}

export default NuevaEscuderia;
