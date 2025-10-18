import React, { useState, useEffect } from "react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import fondoHamVers from "../../assets/HamVers-1.jpg";

//DEFINICIONES DE CLASES
type FormState = {
  year: string;
  racing_series: string;
  winner_driver: string;
  winner_team: string;
};

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
      const res = await fetch(`${api}/temporadas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      setMessage("Temporada creada con éxito.");
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
          backgroundImage: `url(${fondoHamVers})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.5)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/80 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-purple-700/40"
        >
          <h1
            className="text-purple-100 mt-5 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Alta Temporada
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
              <InputGroupInput
                placeholder="Año"
                id="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                required
                min="1950"
                max={new Date().getFullYear() + 1}
                className="focus-visible:ring-purple-500 focus-visible:border-purple-500 hover:border-purple-600"
              />
            </InputGroup>

            <InputGroup>
              <Select
                value={form.racing_series}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, racing_series: value }))
                }
                required
              >
                <SelectTrigger className="w-full focus-visible:ring-purple-500 focus-visible:border-purple-500 hover:border-purple-600">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
              <InputGroupInput
                placeholder="Piloto ganador"
                id="winner_driver"
                value={form.winner_driver}
                onChange={handleChange}
                className="focus-visible:ring-purple-500 focus-visible:border-purple-500 hover:border-purple-600"
              />
            </InputGroup>

            <InputGroup>
              <InputGroupInput
                placeholder="Escudería ganadora"
                id="winner_team"
                value={form.winner_team}
                onChange={handleChange}
                className="focus-visible:ring-purple-500 focus-visible:border-purple-500 hover:border-purple-600"
              />
            </InputGroup>
          </div>

          <div className="flex w-full justify-between pt-4">
            <Button
              type="button"
              className="bg-transparent hover:bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-900/50 border-0"
            >
              {submitting ? "Enviando..." : "Crear nueva temporada"}
            </Button>
          </div>

          {message && (
            <p className="mt-2 text-sm text-center font-semibold text-purple-200">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default NuevaTemporada;
