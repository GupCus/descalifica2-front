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
    <div className="flex relative min-h-screen">
      <div className="bg-[url('./src/assets/franco-1.webp')] bg-cover bg-center max-w-[25%] w-full flex-1" />
      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex-2 mx-8 mt-20 flex flex-col items-center"
      >
        <div className="">
          <h1 className="text-primary-foreground mt-5 scroll-m-20 text-4xl font-semibold tracking-tight text-center">
            Alta circuitos
          </h1>
          <InputGroup className="mt-5 mb-5 w-96">
            <InputGroupInput
              placeholder="Nombre oficial del circuito"
              id="name"
              value={form.name}
              onChange={handleChange}
            />
          </InputGroup>
          <div className="flex">
            <InputGroup className="mb-5 w-45 mr-6">
              <InputGroupInput
                placeholder="País"
                id="country"
                value={form.country}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup className="mb-5 w-45">
              <InputGroupInput
                placeholder="Longitud (km)"
                id="length"
                value={form.length}
                onChange={handleChange}
              />
            </InputGroup>
          </div>
          <div className="flex">
            <InputGroup className="mb-5 w-45 mr-6">
              <InputGroupInput
                placeholder="Año de inaguración"
                id="year"
                value={form.year}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup className="mb-5 w-45">
              <InputGroupInput
                placeholder="Link imagen del trazado"
                id="imagen"
                value={form.imagen}
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
            {submitting ? "Enviando..." : "Crear nuevo circuito"}
          </Button>
        </div>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
      <div className="bg-[url('./src/assets/piastri-1.webp')] bg-cover bg-center max-w-[25%] w-full flex-1 " />
    </div>
  );
}

export default NuevoCircuito;
