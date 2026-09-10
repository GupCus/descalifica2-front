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
import { Textarea } from "@/components/ui/textarea";
import fondomarcas from "../../assets/fondomarcas.png";
import { postMarcaFormData, getMarca, putMarcaFormData, deleteMarca } from "@/services/marca.service.ts";
import { Marca } from "@/entities/marca.entity.ts";
import { getNationalities, Nationality } from "@/services/nationality.service.ts";

type FormState = {
  name: string;
  foundation: string;
  nationality: string;
  description: string;
  website: string;
};

const initialState: FormState = {
  name: "",
  foundation: "",
  nationality: "",
  description: "",
  website: "",
};

function NuevaMarca() {
  const [form, setForm] = useState<FormState>(initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>("new");

  const isEditing = selectedEntityId !== "new";

  useEffect(() => {
    getNationalities()
      .then((data) => setNationalities(data))
      .catch((err) => console.error("Error cargando nacionalidades", err));
    getMarca()
      .then((data) => setMarcas(data))
      .catch((err) => console.error("Error cargando marcas", err));
  }, []);

  const handleEntitySelect = (value: string) => {
    setSelectedEntityId(value);
    setMessage(null);
    setSelectedFile(null);
    if (value === "new") {
      setForm(initialState);
    } else {
      const selected = marcas.find(m => String(m.id) === value);
      if (selected) {
        setForm({
          name: selected.name,
          foundation: String(selected.foundation),
          nationality: selected.nationality,
          description: (selected as any).description || "",
          website: (selected as any).website || "",
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
    if (!isEditing || !window.confirm("¿Estás seguro de que deseas eliminar esta marca?")) return;
    
    setSubmitting(true);
    try {
      await deleteMarca(Number(selectedEntityId));
      setMessage("Marca eliminada con éxito.");
      setForm(initialState);
      setSelectedEntityId("new");
      setMarcas(marcas.filter(m => String(m.id) !== selectedEntityId));
    } catch (err: any) {
      setMessage(`Error al eliminar: ${err.message || "No se pudo eliminar la marca"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      name: form.name,
      foundation: Number(form.foundation),
      nationality: form.nationality,
      description: form.description,
      website: form.website,
    };

    try {
      if (isEditing) {
        const updated = await putMarcaFormData(Number(selectedEntityId), payload, selectedFile || undefined);
        setMessage("Marca actualizada con éxito.");
        setMarcas(marcas.map(m => m.id === updated.id ? updated : m));
      } else {
        const created = await postMarcaFormData(payload, selectedFile || undefined);
        setMessage("Marca creada con éxito.");
        setForm(initialState);
        setMarcas([...marcas, created]);
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
          backgroundImage: `url(${fondomarcas})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px) brightness(0.6)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10 pb-20">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-blue-950/70 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-blue-800/50"
        >
          <h1
            className="text-gray-200 mt-2 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Alta / Edición Marca
          </h1>

          <div className="mb-6 pt-4 border-b border-blue-800/50 pb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seleccionar marca existente
            </label>
            <Select value={selectedEntityId} onValueChange={handleEntitySelect}>
              <SelectTrigger className="w-full bg-blue-900/50 border-blue-700 text-white">
                <SelectValue placeholder="-- Crear nueva marca --" />
              </SelectTrigger>
              <SelectContent className="border-secondary max-h-60">
                <SelectItem value="new" className="font-bold text-blue-400">
                  -- Crear nueva marca --
                </SelectItem>
                {marcas.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <InputGroup className="mt-5 mb-5 w-full">
            <InputGroupInput
              placeholder="Nombre de la marca"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
              <InputGroupInput
                placeholder="Año de fundación"
                id="foundation"
                type="number"
                value={form.foundation}
                onChange={handleChange}
                required
                min="1800"
                max={new Date().getFullYear()}
              />
            </InputGroup>
            <InputGroup className="w-full">
              <Select
                value={form.nationality}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, nationality: value }))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Nacionalidad" />
                </SelectTrigger>
                <SelectContent className="border-secondary">
                  {nationalities.map((n) => (
                    <SelectItem key={n.code} value={n.code}>
                      {n.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputGroup>
          </div>

          <div className="mt-4">
            <Textarea
              placeholder="Descripción (opcional)"
              id="description"
              value={form.description}
              onChange={handleChange}
              className="bg-transparent border-gray-600 text-white placeholder-gray-400 resize-none"
              rows={4}
            />
          </div>

          <div className="mt-4">
            <InputGroup className="w-full">
              <InputGroupInput
                placeholder="Sitio Web (opcional)"
                id="website"
                type="url"
                value={form.website}
                onChange={handleChange}
              />
            </InputGroup>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Logo de la Marca (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-800 file:text-white
                hover:file:bg-blue-700
                bg-blue-950/50 rounded-md border border-blue-800/50"
            />
          </div>

          <div className="flex w-full justify-between pt-4">
            <div className="flex gap-2">
              <Button
                type="button"
                className="bg-transparent hover:bg-blue-900/50 text-gray-400 border border-blue-800/50 hover:text-gray-300"
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
              className="bg-blue-800 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-900/50 border-0"
            >
              {submitting ? "Enviando..." : (isEditing ? "Guardar cambios" : "Crear nueva marca")}
            </Button>
          </div>

          {message && (
            <p className="mt-2 text-sm text-center font-semibold text-blue-200">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default NuevaMarca;
