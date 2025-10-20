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
import fondoFerrari from "../../assets/Ferrari-foto.jpg";
import { Categoria } from "@/entities/categoria.entity.ts";
import { Marca } from "@/entities/marca.entity.ts";
import { getCategoria } from "@/services/categoria.service.ts";
import { getMarca } from "@/services/marca.service.ts";
import { NewEscuderia } from "@/entities/escuderia.entity.ts";
import { postEscuderia } from "@/services/escuderia.service.ts";

type FormState = {
  name: string;
  foundation: string;
  nationality: string;
  engine: string;
  marca: string;
  categoria: string;
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

  //Gets
  useEffect(() => {
    getCategoria()
      .then(data => setCategorias(data))
      .catch(err => {
              setCategorias([]);
              console.error("Error cargando categorías", err);
            });
    getMarca()
      .then(data => setMarcas(data))
      .catch(err => {
              setMarcas([]);
              console.error("Error cargando marcas", err);
            });
  }, []);

  //handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

  const nuevaescuderia:NewEscuderia= {
        name: form.name,
        fundation: form.foundation,
        engine: form.engine,
        nationality: form.nationality,
        marca: form.marca,
        categoria: form.categoria,
      }
  postEscuderia(nuevaescuderia)
  .then(() => setMessage("Escudería creada con éxito."))
  .then(() => setForm({
        name: "",
        foundation: "",
        engine: "",
        nationality: "",
        marca: "",
        categoria: "",
      }))
  .catch(err => setMessage(`Error: ${err.message || "No se pudo crear la escudería"}`))
  .finally(() => setSubmitting(false))
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoFerrari})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.6)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-red-950/90 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-red-800/50"
        >
          <h1
            className="text-gray-200 mt-5 scroll-m-20 text-4xl font-bold tracking-wider text-center uppercase"
            style={{
              fontFamily: "'Orbitron', 'Rajdhani',sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            Alta escudería
          </h1>

          <InputGroup className="mt-5 mb-5 w-full">
            <InputGroupInput
              placeholder="Nombre"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
              <InputGroupInput
                placeholder="Año de fundación"
                id="foundation"
                type="number"
                value={form.foundation}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <InputGroupInput
                placeholder="Nacionalidad"
                id="nationality"
                value={form.nationality}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </div>

          <InputGroup className="mb-5 w-full">
            <InputGroupInput
              placeholder="Nombre del motor"
              id="engine"
              value={form.engine}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
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

            <InputGroup>
              <Select
                value={form.categoria}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, categoria: value }))
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

          <div className="flex w-full justify-between pt-4">
            <Button
              type="button"
              className="bg-gray-700 hover:bg-gray-800 text-white border border-gray-600"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-red-700 hover:bg-red-800 text-white border border-red-600"
            >
              {submitting ? "Enviando..." : "Crear nueva esc."}
            </Button>
          </div>

          {message && (
            <p className="mt-2 text-sm text-center font-semibold text-red-200">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default NuevaEscuderia;
