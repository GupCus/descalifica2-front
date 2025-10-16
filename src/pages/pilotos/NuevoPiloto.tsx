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

type FormState = {
  name: string;
  escuderia: string; // ahora será el id de la escudería
  num: string;
  nationality: string;
  role: string;
  racing_series: string;
};

type Escuderia = {
  id: string;
  name: string;
};

function NuevoPiloto() {
  const [form, setForm] = useState<FormState>({
    name: "",
    escuderia: "",
    num: "",
    nationality: "",
    role: "",
    racing_series: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [escuderias, setEscuderias] = useState<Escuderia[]>([]);

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  //obtiene escuderías para el select
  useEffect(() => {
    fetch(`${api}/escuderias`)
      .then((res) => res.json())
      .then((data) => {
        // Si la respuesta es { escuderias: [...] }
        if (Array.isArray(data.data)) {
          setEscuderias(data.data);
        } else {
          setEscuderias([]);
          console.error(
            "La respuesta no contiene un array de escuderías.",
            data
          );
        }
      })
      .catch((err) => {
        setEscuderias([]);
        console.error("Error cargando escuderías", err);
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
      const res = await fetch(`${api}/pilotos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      setMessage("Piloto creado con éxito.");
      setForm({
        name: "",
        escuderia: "",
        num: "",
        nationality: "",
        role: "",
        racing_series: "",
      });
    } catch (err: any) {
      console.error(err);
      setMessage(`Error: ${err.message || "No se pudo crear el piloto"}`);
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
            Alta pilotos
          </h1>
          <InputGroup className="mt-5 mb-5 w-96">
            <InputGroupInput
              placeholder="Nombre completo"
              id="name"
              value={form.name}
              onChange={handleChange}
            />
          </InputGroup>
          <div className="flex">
            <InputGroup className="mb-5 w-45 mr-6">
              <Select
                value={form.escuderia}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, escuderia: value }))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escudería" />
                </SelectTrigger>
                <SelectContent className="border-secondary">
                  {escuderias.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputGroup>
            <InputGroup className="mb-5 w-45">
              <InputGroupInput
                placeholder="Número del piloto"
                id="num"
                value={form.num}
                onChange={handleChange}
              />
            </InputGroup>
          </div>
          <InputGroup className="mb-5 w-96">
            <InputGroupInput
              placeholder="Nacionalidad"
              id="nationality"
              value={form.nationality}
              onChange={handleChange}
            />
          </InputGroup>
          <div className="flex">
            <InputGroup className="mb-5 w-45 mr-6">
              <InputGroupInput
                placeholder="Rol"
                id="role"
                value={form.role}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup className="mb-5 w-45">
              <InputGroupInput
                placeholder="Categoría"
                id="racing_series"
                value={form.racing_series}
                onChange={handleChange}
              />
            </InputGroup>
          </div>
        </div>

        <div className="flex w-96 justify-between">
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Crear nuevo piloto"}
          </Button>
        </div>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
      <div className="bg-[url('./src/assets/piastri-1.webp')] bg-cover bg-center max-w-[25%] w-full flex-1 " />
    </div>
  );
}

export default NuevoPiloto;
