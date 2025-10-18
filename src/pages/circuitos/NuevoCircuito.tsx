import React, { useState } from "react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button.tsx";
import fondoSpa from "../../assets/Spa-Fondo.jpg";

//DEFINICIONES DE CLASES
type FormState = {
  name: string;
  country: string;
  length: string;
  year: string;
  imagen: string;
};

function NuevoCircuito() {
  const [form, setForm] = useState<FormState>({
    name: "",
    country: "",
    length: "",
    year: "",
    imagen: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
      const res = await fetch(`${api}/circuitos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      setMessage("Circuito creado con éxito.");
      setForm({
        name: "",
        country: "",
        length: "",
        year: "",
        imagen: "",
      });
    } catch (err: any) {
      console.error(err);
      setMessage(`Error: ${err.message || "No se pudo crear el circuito"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Fondo Spa blurreado */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoSpa})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.5)",
        }}
      />

      {/* Contenido del formulario */}
      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/50 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-gray-700/40"
        >
          <h1
            className="text-gray-200 mt-5 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Alta Circuitos
          </h1>

          <InputGroup className="mt-5 mb-5 w-full">
            <InputGroupInput
              placeholder="Nombre oficial del circuito"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
              <InputGroupInput
                placeholder="País"
                id="country"
                value={form.country}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <InputGroupInput
                placeholder="Longitud (km)"
                id="length"
                type="number"
                step="0.001"
                value={form.length}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
              <InputGroupInput
                placeholder="Año de inauguración"
                id="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                required
                min="1800"
                max={new Date().getFullYear()}
              />
            </InputGroup>
            <InputGroup>
              <InputGroupInput
                placeholder="Link imagen del trazado"
                id="imagen"
                value={form.imagen}
                onChange={handleChange}
                required
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
              className="bg-emerald-900 hover:bg-green-800 text-white font-semibold shadow-lg shadow-green-900/50 border-0"
            >
              {submitting ? "Enviando..." : "Crear nuevo circuito"}
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

export default NuevoCircuito;
