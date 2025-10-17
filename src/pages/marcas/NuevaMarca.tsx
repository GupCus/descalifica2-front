import React, { useState } from "react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button.tsx";

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
      const res = await fetch(`${api}/marcas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      setMessage("Marca creada con éxito.");
      setForm({
        name: "",
        nationality: "",
        foundation: "",
      });
    } catch (err: any) {
      console.error(err);
      setMessage(`Error: ${err.message || "No se pudo crear la marca"}`);
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
            Alta marca
          </h1>

          <InputGroup className="mt-5 mb-5 w-96">
            <InputGroupInput
              placeholder="Nombre de la marca"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup className="mb-5 w-96">
            <InputGroupInput
              placeholder="Nacionalidad"
              id="nationality"
              value={form.nationality}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup className="mb-5 w-96">
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
        </div>

        <div className="flex w-96 justify-between">
          <Button
            type="button"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Crear nueva marca"}
          </Button>
        </div>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
      <div className="bg-[url('./src/assets/piastri-1.webp')] bg-cover bg-center max-w-[25%] w-full flex-1 " />
    </div>
  );
}

export default NuevaMarca;
