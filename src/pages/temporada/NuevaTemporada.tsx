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

//DEFINICIONES DE CLASES
type FormState = {
  year: string;
  racing_series: string;
  winner_driver: string;
  winner_team: string;
};

//Escuderia y Piloto declarados por posible implementación futura.
type Escuderia = {
  id: string;
  name: string;
};

type Piloto = {
  id: string;
  name: string;
};
//--------------------------------------------------------------

type Categoria = {
  id: string;
  name: string;
};

function NuevaTemporada() {
  const [form, setForm] = useState<FormState>({
    year: "",
    racing_series: "",
    winner_driver: "",
    winner_team: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  //obtiene categorías para el select
  useEffect(() => {
    fetch(`${api}/categorias`)
      .then((res) => res.json()) //convierte a JSON
      .then((data) => {
        if (Array.isArray(data.data)) {
          setCategorias(data.data); //si dentro de data es array, lo carga a Categorias
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
      const res = await fetch(`${api}/temporadas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      setMessage("Temporada creado con éxito.");
      setForm({
        year: "",
        racing_series: "",
        winner_driver: "",
        winner_team: "",
      });
    } catch (err: any) {
      console.error(err);
      setMessage(`Error: ${err.message || "No se pudo crear la temporada"}`);
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
              Alta temporada
            </h1>
            <div className="flex mt-5">
              <InputGroup className=" mb-5 w-45 mr-5">
                <InputGroupInput
                  placeholder="Año"
                  id="year"
                  value={form.year}
                  onChange={handleChange}
                />
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
            <div className="flex justify-between">
              <InputGroup className="mb-5 w-45">
                <InputGroupInput
                  placeholder="Piloto ganador"
                  id="winner_driver"
                  value={form.winner_driver}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup className="mb-5 w-45">
                <InputGroupInput
                  placeholder="Escudería ganadora"
                  id="winner_team"
                  value={form.winner_team}
                  onChange={handleChange}
                />
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

export default NuevaTemporada;
