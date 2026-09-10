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
import fondoSpa from "../../assets/Spa-fondo.jpg";
import { postCircuitoFormData, getCircuito, putCircuitoFormData, deleteCircuito } from "@/services/circuito.service.ts";
import { Circuito } from "@/entities/circuito.entity.ts";

type FormState = {
  name: string;
  country: string;
  length: string;
  year: string;
  track_map_url: string;
};

const initialState: FormState = {
  name: "",
  country: "",
  length: "",
  year: "",
  track_map_url: "",
};

function NuevoCircuito() {
  const [form, setForm] = useState<FormState>(initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [circuitos, setCircuitos] = useState<Circuito[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>("new");

  const isEditing = selectedEntityId !== "new";

  useEffect(() => {
    getCircuito()
      .then((data) => setCircuitos(data))
      .catch((err) => console.error("Error cargando circuitos", err));
  }, []);

  const handleEntitySelect = (value: string) => {
    setSelectedEntityId(value);
    setMessage(null);
    setSelectedFile(null);
    if (value === "new") {
      setForm(initialState);
    } else {
      const selected = circuitos.find(c => String(c.id) === value);
      if (selected) {
        setForm({
          name: selected.name,
          country: selected.country,
          length: String(selected.length),
          year: String(selected.year),
          track_map_url: selected.track_map_url || "",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };

  const handleDelete = async () => {
    if (!isEditing || !window.confirm("¿Estás seguro de que deseas eliminar este circuito?")) return;
    
    setSubmitting(true);
    try {
      await deleteCircuito(Number(selectedEntityId));
      setMessage("Circuito eliminado con éxito.");
      setForm(initialState);
      setSelectedEntityId("new");
      setCircuitos(circuitos.filter(c => String(c.id) !== selectedEntityId));
    } catch (err: any) {
      setMessage(`Error al eliminar: ${err.message || "No se pudo eliminar el circuito"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (isEditing) {
        const updated = await putCircuitoFormData(Number(selectedEntityId), form as any, selectedFile || undefined);
        setMessage("Circuito actualizado con éxito.");
        setCircuitos(circuitos.map(c => c.id === updated.id ? updated : c));
      } else {
        const created = await postCircuitoFormData(form as any, selectedFile || undefined);
        setMessage("Circuito creado con éxito.");
        setForm(initialState);
        setCircuitos([...circuitos, created]);
      }
      setSelectedFile(null);
    } catch (err: any) {
      setMessage(`Error: ${err.message || "No se pudo procesar la solicitud"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoSpa})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.5)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10 pb-20">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/50 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-gray-700/40"
        >
          <h1
            className="text-gray-200 mt-2 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Alta / Edición Circuito
          </h1>

          <div className="mb-6 pt-4 border-b border-emerald-800/50 pb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seleccionar circuito existente
            </label>
            <Select value={selectedEntityId} onValueChange={handleEntitySelect}>
              <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="-- Crear nuevo circuito --" />
              </SelectTrigger>
              <SelectContent className="border-secondary max-h-60">
                <SelectItem value="new" className="font-bold text-emerald-400">
                  -- Crear nuevo circuito --
                </SelectItem>
                {circuitos.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                id="track_map_url"
                value={form.track_map_url}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Imagen del Circuito (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-emerald-900 file:text-white
                hover:file:bg-green-800
                bg-gray-900 rounded-md border border-gray-700"
            />
          </div>

          <div className="flex w-full justify-between pt-4">
            <div className="flex gap-2">
              <Button
                type="button"
                className="bg-transparent hover:bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300"
                onClick={() => window.history.back()}
              >
                Volver
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={submitting}
                >
                  Eliminar
                </Button>
              )}
            </div>
            
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-900 hover:bg-green-800 text-white font-semibold shadow-lg shadow-green-900/50 border-0"
            >
              {submitting ? "Enviando..." : (isEditing ? "Guardar cambios" : "Crear nuevo circuito")}
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
