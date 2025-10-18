import type React from "react";
import { useState, useEffect } from "react";
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
import fondoFranco from "../../assets/franco-2.jpg";

//DEFINICIONES DE CLASES
type FormState = {
  name: string;
  escuderia: string;
  num: string;
  nationality: string;
  role: string;
  racing_series: string;
};

type Escuderia = {
  id: string;
  name: string;
};

type Categoria = {
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
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  //obtiene escuderías para el select
  useEffect(() => {
    fetch(`${api}/escuderias`)
      .then((res) => res.json())
      .then((data) => {
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

  //obtiene categorias, también para el select
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
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoFranco})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.5)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/80 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-gray-700/40"
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
              placeholder="Nombre completo"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
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

            <InputGroup>
              <InputGroupInput
                placeholder="Número del piloto"
                id="num"
                value={form.num}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </div>

          <InputGroup className="mb-5 w-full">
            <InputGroupInput
              placeholder="Nacionalidad"
              id="nationality"
              value={form.nationality}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, role: value }))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent className="border-secondary">
                  <SelectGroup>
                    <SelectLabel>Posibles roles</SelectLabel>
                    <SelectItem value="Primer piloto">Primer piloto</SelectItem>
                    <SelectItem value="Segundo piloto">
                      Segundo piloto
                    </SelectItem>
                    <SelectItem value="Piloto reserva">
                      Piloto reserva
                    </SelectItem>
                    <SelectItem value="Piloto de pruebas">
                      Piloto de pruebas
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </InputGroup>

            <InputGroup>
              <Select
                value={form.racing_series}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, racing_series: value }))
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
              className="bg-transparent hover:bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-900/50 border-0"
            >
              {submitting ? "Enviando..." : "Crear nuevo piloto"}
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

export default NuevoPiloto;
