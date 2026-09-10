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
import fondoHamVers from "../../assets/HamVers-1.jpg";
import { NewTemporada, Temporada } from "@/entities/temporada.entity.ts";
import { postTemporadaFormData, getTemporada, putTemporadaFormData, deleteTemporada } from "@/services/temporada.service.ts";
import { Categoria } from "@/entities/categoria.entity.ts";
import { getCategoria } from "@/services/categoria.service.ts";
import { getPiloto } from "@/services/piloto.service.ts";
import { getEscuderia } from "@/services/escuderia.service.ts";
import { Piloto } from "@/entities/piloto.entity.ts";
import { Escuderia } from "@/entities/escuderia.entity.ts";

type FormState = {
  year: string;
  racing_series: string;
  winner_driver: string | null;
  winner_team: string | null;
};

const initialState: FormState = {
  year: "",
  racing_series: "",
  winner_driver: null,
  winner_team: null,
};

function NuevaTemporada() {
  const [form, setForm] = useState<FormState>(initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pilotos, setPilotos] = useState<Piloto[]>([]);
  const [escuderias, setEscuderias] = useState<Escuderia[]>([]);
  
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>("new");

  const isEditing = selectedEntityId !== "new";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };

  useEffect(() => {
    getCategoria().then((data) => setCategorias(data)).catch((err) => console.error(err));
    getPiloto().then((data) => setPilotos(data)).catch((err) => console.error(err));
    getEscuderia().then((data) => setEscuderias(data)).catch((err) => console.error(err));
    getTemporada().then((data) => setTemporadas(data)).catch((err) => console.error(err));
  }, []);

  const handleEntitySelect = (value: string) => {
    setSelectedEntityId(value);
    setMessage(null);
    setSelectedFile(null);
    if (value === "new") {
      setForm(initialState);
    } else {
      const selected = temporadas.find(t => String(t.id) === value);
      if (selected) {
        setForm({
          year: String(selected.year),
          racing_series: selected.racing_series ? String((selected.racing_series as any).id || selected.racing_series) : "",
          winner_driver: selected.winner_driver ? String((selected.winner_driver as any).id || selected.winner_driver) : null,
          winner_team: selected.winner_team ? String((selected.winner_team as any).id || selected.winner_team) : null,
        });
      }
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !window.confirm("¿Estás seguro de que deseas eliminar esta temporada?")) return;
    
    setSubmitting(true);
    try {
      await deleteTemporada(Number(selectedEntityId));
      setMessage("Temporada eliminada con éxito.");
      setForm(initialState);
      setSelectedEntityId("new");
      setTemporadas(temporadas.filter(t => String(t.id) !== selectedEntityId));
    } catch (err: any) {
      setMessage(`Error al eliminar: ${err.message || "No se pudo eliminar la temporada"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload: NewTemporada = {
      year: Number(form.year),
      racing_series: form.racing_series,
      winner_driver: form.winner_driver === "null" || !form.winner_driver ? null : form.winner_driver,
      winner_team: form.winner_team === "null" || !form.winner_team ? null : form.winner_team,
    };
    
    try {
      if (isEditing) {
        const updated = await putTemporadaFormData(Number(selectedEntityId), payload, selectedFile || undefined);
        setMessage("Temporada actualizada con éxito.");
        setTemporadas(temporadas.map(t => t.id === updated.id ? updated : t));
      } else {
        const created = await postTemporadaFormData(payload, selectedFile || undefined);
        setMessage("Temporada creada con éxito.");
        setForm(initialState);
        setTemporadas([...temporadas, created]);
      }
      setSelectedFile(null);
    } catch (err: any) {
      setMessage(`Error: ${err.message || "No se pudo procesar la Temporada."}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoHamVers})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.5)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10 pb-20">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/65 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-purple-700/40"
        >
          <h1
            className="text-white mt-2 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Alta / Edición Temporada
          </h1>

          <div className="mb-6 pt-4 border-b border-purple-800/50 pb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seleccionar temporada existente
            </label>
            <Select value={selectedEntityId} onValueChange={handleEntitySelect}>
              <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="-- Crear nueva temporada --" />
              </SelectTrigger>
              <SelectContent className="border-secondary max-h-60">
                <SelectItem value="new" className="font-bold text-purple-400">
                  -- Crear nueva temporada --
                </SelectItem>
                {temporadas.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {String(t.year)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
              <InputGroupInput
                placeholder="Año"
                id="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                required
                min="1950"
                max={new Date().getFullYear() + 1}
                className="focus-visible:ring-purple-500 focus-visible:border-purple-500 hover:border-purple-600 text-white"
              />
            </InputGroup>

            <InputGroup>
              <Select
                value={form.racing_series}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, racing_series: value }))
                }
                required
              >
                <SelectTrigger className="w-full focus-visible:ring-purple-500 focus-visible:border-purple-500 hover:border-purple-600 bg-transparent text-white border-gray-600">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup>
              <Select
                value={form.winner_driver ?? "null"}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    winner_driver: value === "null" ? null : value,
                  }))
                }
              >
                <SelectTrigger className="w-full focus-visible:ring-purple-500 focus-visible:border-purple-500 hover:border-purple-600 bg-transparent text-white border-gray-600">
                  <SelectValue placeholder="Piloto ganador" />
                </SelectTrigger>

                <SelectContent className="border-secondary">
                  <SelectItem value="null">
                    En progreso/sin ganador definido.
                  </SelectItem>
                  {pilotos.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputGroup>

            <InputGroup>
              <Select
                value={form.winner_team ?? "null"}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    winner_team: value === "null" ? null : value,
                  }))
                }
              >
                <SelectTrigger className="w-full focus-visible:ring-purple-500 focus-visible:border-purple-500 hover:border-purple-600 bg-transparent text-white border-gray-600">
                  <SelectValue placeholder="Escudería ganadora" />
                </SelectTrigger>

                <SelectContent className="border-secondary">
                  <SelectItem value="null">
                    En progreso/sin ganador definido.
                  </SelectItem>
                  {escuderias.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputGroup>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Imagen de la Temporada (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-600 file:text-white
                hover:file:bg-purple-700
                bg-gray-900 rounded-md border border-gray-700"
            />
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
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-900/50 border-0"
            >
              {submitting ? "Enviando..." : (isEditing ? "Guardar cambios" : "Crear nueva temporada")}
            </Button>
          </div>

          {message && (
            <p className="mt-2 text-sm text-center font-semibold text-purple-200">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default NuevaTemporada;
