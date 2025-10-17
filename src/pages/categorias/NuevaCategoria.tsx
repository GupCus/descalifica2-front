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

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
      const res = await fetch(`${api}/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      setMessage("Categoría creado con éxito.");
      setForm({
        name: "",
        description: "",
      });
    } catch (err: any) {
      console.error(err);
      setMessage(`Error: ${err.message || "No se pudo crear la categoría"}`);
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
              Alta categoría
            </h1>
            <div className="flex mt-5">
              <InputGroup className="mb-5 w-45 mr-5">
                <InputGroupInput
                  placeholder="Nombre"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup className="mb-5 w-45">
                <InputGroupInput
                  placeholder="Descripción"
                  id="description"
                  value={form.description}
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
              {submitting ? "Enviando..." : "Crear nueva categoría"}
            </Button>
          </div>

          {message && <p className="mt-2 text-sm">{message}</p>}
        </form>

        <div className="bg-[url('./src/assets/piastri-1.webp')] bg-cover bg-center max-w-[25%] w-full flex-1 " />
      </div>
    </div>
  );
}

export default NuevaCategoria;
