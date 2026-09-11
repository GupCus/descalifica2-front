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
import fondoWEC from "../../assets/wec.jpg";
import { Categoria } from "@/entities/categoria.entity.ts";
import { postCategoria, getCategoria, putCategoria, deleteCategoria } from "@/services/categoria.service.ts";

type FormState = {
  name: string;
  description: string;
};

const initialState: FormState = {
  name: "",
  description: "",
};

function NuevaCategoria() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>("new");

  const isEditing = selectedEntityId !== "new";

  useEffect(() => {
    getCategoria()
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error cargando categorías", err));
  }, []);

  const handleEntitySelect = (value: string) => {
    setSelectedEntityId(value);
    setMessage(null);
    if (value === "new") {
      setForm(initialState);
    } else {
      const selected = categorias.find(c => String(c.id) === value);
      if (selected) {
        setForm({
          name: selected.name,
          description: selected.description || "",
        });
      }
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) return;
    
    setSubmitting(true);
    try {
      await deleteCategoria(Number(selectedEntityId));
      setMessage("Categoría eliminada con éxito.");
      setForm(initialState);
      setSelectedEntityId("new");
      setCategorias(categorias.filter(c => String(c.id) !== selectedEntityId));
    } catch (err: any) {
      setMessage(`Error al eliminar: ${err.message || "No se pudo eliminar la categoría"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      name: form.name,
      description: form.description
    };

    try {
      if (isEditing) {
        const updated = await putCategoria(Number(selectedEntityId), payload as any);
        setMessage("Categoría actualizada con éxito.");
        setCategorias(categorias.map(c => c.id === updated.id ? updated : c));
      } else {
        const created = await postCategoria(payload as any);
        setMessage("Categoría creada con éxito.");
        setForm(initialState);
        setCategorias([...categorias, created]);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message || "No se pudo procesar la solicitud"}`);
    } finally {
      setSubmitting(false);
    }
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

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10 pb-20">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/50 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-orange-700/40"
        >
          <h1
            className="text-white-100 mt-2 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Alta / Edición Categoría
          </h1>

          <div className="mb-6 pt-4 border-b border-orange-800/50 pb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seleccionar categoría existente
            </label>
            <Select value={selectedEntityId} onValueChange={handleEntitySelect}>
              <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="-- Crear nueva categoría --" />
              </SelectTrigger>
              <SelectContent className="border-secondary max-h-60">
                <SelectItem value="new" className="font-bold text-orange-400">
                  -- Crear nueva categoría --
                </SelectItem>
                {categorias.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
              <InputGroupInput
                placeholder="Nombre"
                id="name"
                value={form.name}
                onChange={handleChange}
                required
                className="focus-visible:ring-orange-500 focus-visible:border-orange-500 hover:border-orange-600 text-white"
              />
            </InputGroup>

            <InputGroup>
              <InputGroupInput
                placeholder="Descripción"
                id="description"
                value={form.description}
                onChange={handleChange}
                required
                className="focus-visible:ring-orange-500 focus-visible:border-orange-500 hover:border-orange-600 text-white"
              />
            </InputGroup>
          </div>

          <div className="flex w-full justify-between pt-6">
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
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-lg shadow-orange-900/50 border-0"
            >
              {submitting ? "Enviando..." : (isEditing ? "Guardar cambios" : "Crear nueva categoría")}
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
