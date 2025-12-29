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
import { NewTemporada } from "@/entities/temporada.entity.ts";
import { postTemporada } from "@/services/temporada.service.ts";
import { Categoria } from "@/entities/categoria.entity.ts";
import { getCategoria } from "@/services/categoria.service.ts";
import { getPiloto } from "@/services/piloto.service.ts";
import { getEscuderia } from "@/services/escuderia.service.ts";
import { Piloto } from "@/entities/piloto.entity.ts";
import { Escuderia } from "@/entities/escuderia.entity.ts";

type FormState = {
  year: string;
  racing_series: string;
  winner_driver: string | null;
  winner_team: string | null;
};

function NuevaTemporada() {
  const [form, setForm] = useState<FormState>({
    year: "",
    racing_series: "",
    winner_driver: null,
    winner_team: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pilotos, setPilotos] = useState<Piloto[]>([]);
  const [escuderias, setEscuderias] = useState<Escuderia[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };

  //gets
  useEffect(() => {
    getCategoria()
      .then((data) => setCategorias(data))
      .catch((err) => {
        setCategorias([]);
        console.error("Error cargando categorías", err);
      });

    getPiloto()
      .then((data) => setPilotos(data))
      .catch((err) => {
        setPilotos([]);
        console.error("Error cargando pilotos", err);
      });

    getEscuderia()
      .then((data) => setEscuderias(data))
      .catch((err) => {
        setEscuderias([]);
        console.error("Error cargando escuderías ", err);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const nuevatemporada: NewTemporada = {
      year: form.year,
      racing_series: form.racing_series,
      winner_driver: form.winner_driver,
      winner_team: form.winner_team,
    };
    postTemporada(nuevatemporada)
      .then(() => setMessage("Temporada creada con éxito."))
      .then(() =>
        setForm({
          year: "",
          racing_series: "",
          winner_driver: null,
          winner_team: null,
        })
      )
      .catch((err) =>
        setMessage(`Error: ${err.message || "No se pudo crear la Temporada."}`)
      )
      .finally(() => setSubmitting(false));
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
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/65 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-purple-700/40"
        >
          <h1
            className="text-white-100 mt-5 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase"
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
              <Select
                value={form.winner_driver ?? undefined}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    winner_driver: value === "null" ? null : value,
                  }))
                }
              >
                <SelectTrigger className="w-full focus-visible:ring-purple-500 focus-visible:border-purple-500 hover:border-purple-600">
                  <SelectValue placeholder="Piloto ganador" />
                </SelectTrigger>

                <SelectContent className="border-secondary">
                  <SelectItem value="null">
                    En progreso/sin ganador definido.
                  </SelectItem>
                  {pilotos.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputGroup>

            <InputGroup>
              <Select
                value={form.winner_team ?? undefined}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    winner_team: value === "null" ? null : value,
                  }))
                }
              >
                <SelectTrigger className="w-full focus-visible:ring-purple-500 focus-visible:border-purple-500 hover:border-purple-600">
                  <SelectValue placeholder="Escudería ganadora" />
                </SelectTrigger>

                <SelectContent className="border-secondary">
                  <SelectItem value="null">
                    En progreso/sin ganador definido.
                  </SelectItem>
                  {escuderias.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
