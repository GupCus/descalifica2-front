import React, { useState } from "react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button.tsx";
import fondoWEC from "../../assets/wec.jpg";
import { Categoria } from "@/entities/categoria.entity.ts";
import { postCategoria } from "@/services/categoria.service.ts";

//DEFINICIONES DE CLASES
type FormState = {
  name: string;
  description: string;
};

function NuevaCategoria() {
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
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

    const nuevacategoria:Categoria = {
      name: form.name,
      description: form.description
    }
    postCategoria(nuevacategoria)
    .then(() => setMessage("Categoria creada con éxito."))
    .then(() => setForm({
                  name: "",
                  description: "",
                }))
    .catch(err => setMessage(`Error: ${err.message || "No se pudo crear la categoría"}`))
    .finally(() => setSubmitting(false))
  }

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoWEC})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.5)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/50 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-orange-700/40"
        >
          <h1
            className="text-white-100 mt-5 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Alta Categoría
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
              <InputGroupInput
                placeholder="Nombre"
                id="name"
                value={form.name}
                onChange={handleChange}
                required
                className="focus-visible:ring-orange-500 focus-visible:border-orange-500 hover:border-orange-600"
              />
            </InputGroup>

            <InputGroup>
              <InputGroupInput
                placeholder="Descripción"
                id="description"
                value={form.description}
                onChange={handleChange}
                required
                className="focus-visible:ring-orange-500 focus-visible:border-orange-500 hover:border-orange-600"
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
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-lg shadow-orange-900/50 border-0"
            >
              {submitting ? "Enviando..." : "Crear nueva categoría"}
            </Button>
          </div>

          {message && (
            <p className="mt-2 text-sm text-center font-semibold text-orange-200">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default NuevaCategoria;
