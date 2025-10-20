import React, { useState } from "react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button.tsx";
import fondoPorsche from "../../assets/Porsche.jpeg";
import { NuevaMarca } from "@/entities/marca.entity.ts";
import { postMarca } from "@/services/marca.service.ts";

type FormState = {
  name: string;
  nationality: string;
  foundation: string;
};

function NuevaMarca() {
  const [form, setForm] = useState<FormState>({
    name: "",
    nationality: "",
    foundation: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

  const nuevamarca:NuevaMarca = {
        name: form.name,
        nationality: form.nationality,
        foundation: form.foundation,
      }
  postMarca(nuevamarca)
  .then(() => setMessage("Marca creada con éxito."))
  .then(() => setForm({
        name: "",
        nationality: "",
        foundation: "",
      }))
  .catch(err => setMessage(`Error: ${err.message || "No se pudo crear la marca"}`))
  .finally(() => setSubmitting(false))
  };
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoPorsche})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.5)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/65 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-gray-700/40"
        >
          <h1
            className="text-gray-200 mt-5 scroll-m-20 text-4xl font-bold tracking-wider text-center uppercase"
            style={{
              fontFamily: "'Orbitron', 'Rajdhani',sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            Alta marca
          </h1>

          <InputGroup className="mt-5 mb-5 w-full">
            <InputGroupInput
              placeholder="Nombre de la marca"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup className="mb-5 w-full">
            <InputGroupInput
              placeholder="Nacionalidad"
              id="nationality"
              value={form.nationality}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup className="mb-5 w-full">
            <InputGroupInput
              type="number"
              placeholder="Año de fundación"
              id="foundation"
              value={form.foundation}
              onChange={handleChange}
              required
              min="1800"
              max={new Date().getFullYear()}
            />
          </InputGroup>

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
              className="bg-red-800 hover:bg-red-900 text-white font-semibold shadow-lg shadow-red-900/50 border-0"
            >
              {submitting ? "Enviando..." : "Crear nueva marca"}
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

export default NuevaMarca;
