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
import fondoFerrari from "../../assets/Ferrari-foto.jpg";
import { Categoria } from "@/entities/categoria.entity.ts";
import { Marca } from "@/entities/marca.entity.ts";
import { getCategoria } from "@/services/categoria.service.ts";
import { getMarca } from "@/services/marca.service.ts";
import { NewEscuderia, Escuderia } from "@/entities/escuderia.entity.ts";
import { postEscuderiaFormData, getEscuderia, putEscuderiaFormData, deleteEscuderia } from "@/services/escuderia.service.ts";
import { getNationalities, Nationality } from "@/services/nationality.service.ts";

type FormState = {
  name: string;
  foundation: string;
  nationality: string;
  engine: string;
  brand: string | null;
  racing_series: string;
};

const initialState: FormState = {
  name: "",
  foundation: "",
  engine: "",
  nationality: "",
  brand: "",
  racing_series: "",
};

function NuevaEscuderia() {
  const [form, setForm] = useState<FormState>(initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  
  const [escuderias, setEscuderias] = useState<Escuderia[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>("new");
  
  const isEditing = selectedEntityId !== "new";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  //Gets
  useEffect(() => {
    getCategoria()
      .then((data) => setCategorias(data))
      .catch((err) => {
        setCategorias([]);
        console.error("Error cargando categorías", err);
      });
    getMarca()
      .then((data) => setMarcas(data))
      .catch((err) => {
        setMarcas([]);
        console.error("Error cargando marcas", err);
      });
    getNationalities()
      .then((data) => setNationalities(data))
      .catch((err) => {
        setNationalities([]);
        console.error("Error cargando nacionalidades", err);
      });
    getEscuderia()
      .then((data) => setEscuderias(data))
      .catch((err) => {
        setEscuderias([]);
        console.error("Error cargando escuderias", err);
      });
  }, []);

  const handleEntitySelect = (value: string) => {
    setSelectedEntityId(value);
    setMessage(null);
    setSelectedFile(null);
    if (value === "new") {
      setForm(initialState);
    } else {
      const selected = escuderias.find(e => String(e.id) === value);
      if (selected) {
        setForm({
          name: selected.name,
          foundation: String(selected.fundation),
          engine: selected.engine,
          nationality: selected.nationality,
          brand: selected.brand ? String(selected.brand.id) : "Ninguna",
          racing_series: selected.racing_series ? String(selected.racing_series.id) : "",
        });
      }
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !window.confirm("¿Estás seguro de que deseas eliminar esta escudería?")) return;
    
    setSubmitting(true);
    try {
      await deleteEscuderia(Number(selectedEntityId));
      setMessage("Escudería eliminada con éxito.");
      setForm(initialState);
      setSelectedEntityId("new");
      setEscuderias(escuderias.filter(e => String(e.id) !== selectedEntityId));
    } catch (err: any) {
      setMessage(`Error al eliminar: ${err.message || "No se pudo eliminar la escudería"}`);
    } finally {
      setSubmitting(false);
    }
  };

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

    const valorBrand = form.brand === "Ninguna" || !form.brand ? null : form.brand;

    const payload: NewEscuderia = {
      name: form.name,
      fundation: form.foundation,
      engine: form.engine,
      nationality: form.nationality,
      brand: valorBrand,
      racing_series: form.racing_series,
    };
    
    try {
      if (isEditing) {
        const updated = await putEscuderiaFormData(Number(selectedEntityId), payload, selectedFile || undefined);
        setMessage("Escudería actualizada con éxito.");
        setEscuderias(escuderias.map(e => e.id === updated.id ? updated : e));
      } else {
        const created = await postEscuderiaFormData(payload, selectedFile || undefined);
        setMessage("Escudería creada con éxito.");
        setForm(initialState);
        setEscuderias([...escuderias, created]);
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
          backgroundImage: `url(${fondoFerrari})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.6)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10 pb-20">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-red-950/90 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-red-800/50"
        >
          <h1
            className="text-gray-200 mt-2 scroll-m-20 text-4xl font-bold tracking-wider text-center uppercase"
            style={{
              fontFamily: "'Orbitron', 'Rajdhani',sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            Alta / Edición escudería
          </h1>

          <div className="mb-6 pt-4 border-b border-red-800 pb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seleccionar escudería existente
            </label>
            <Select value={selectedEntityId} onValueChange={handleEntitySelect}>
              <SelectTrigger className="w-full bg-red-900 border-red-700 text-white">
                <SelectValue placeholder="-- Crear nueva escudería --" />
              </SelectTrigger>
              <SelectContent className="border-secondary max-h-60">
                <SelectItem value="new" className="font-bold text-red-400">
                  -- Crear nueva escudería --
                </SelectItem>
                {escuderias.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <InputGroup className="mt-5 mb-5 w-full">
            <InputGroupInput
              placeholder="Nombre"
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
              />
            </InputGroup>
            <InputGroup>
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

          <InputGroup className="mb-5 w-full">
            <InputGroupInput
              placeholder="Nombre del motor"
              id="engine"
              value={form.engine}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
              <Select
                value={form.brand ?? ""}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    brand: value,
                  }))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent className="border-secondary">
                  <SelectItem value="Ninguna">Ninguna</SelectItem>
                  {marcas.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.name}
                    </SelectItem>
                  ))}
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

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Imagen de la Escudería (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-red-700 file:text-white
                hover:file:bg-red-800
                bg-gray-900 rounded-md border border-gray-700"
            />
          </div>

          <div className="flex w-full justify-between pt-4">
            <div className="flex gap-2">
              <Button
                type="button"
                className="bg-gray-700 hover:bg-gray-800 text-white border border-gray-600"
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
              className="bg-red-700 hover:bg-red-800 text-white border border-red-600"
            >
              {submitting ? "Enviando..." : (isEditing ? "Guardar cambios" : "Crear nueva esc.")}
            </Button>
          </div>

          {message && (
            <p className="mt-2 text-sm text-center font-semibold text-red-200">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default NuevaEscuderia;
