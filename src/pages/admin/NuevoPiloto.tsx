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
import { Escuderia } from "@/entities/escuderia.entity.ts";
import { Categoria } from "@/entities/categoria.entity.ts";
import { getEscuderia } from "@/services/escuderia.service.ts";
import { getCategoria } from "@/services/categoria.service.ts";
import { postPilotoFormData, getPiloto, putPilotoFormData, deletePiloto } from "@/services/piloto.service.ts";
import { NewPiloto, Piloto } from "@/entities/piloto.entity.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as ChevronDownIcon } from "lucide-react";
import { getNationalities, Nationality } from "@/services/nationality.service.ts";

//DEFINICIONES DE CLASES
type FormState = {
  name: string;
  team: string;
  num: number | string;
  nationality: string;
  birth_date: Date | null;
  role: string;
  racing_series: string;
};

const initialState: FormState = {
  name: "",
  team: "",
  num: "",
  nationality: "",
  birth_date: null,
  role: "",
  racing_series: "",
};

function NuevoPiloto() {
  const [form, setForm] = useState<FormState>(initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [escuderias, setEscuderias] = useState<Escuderia[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [pilotos, setPilotos] = useState<Piloto[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>("new");
  const [, setError] = useState<string | null>();
  const [openBirthDate, setOpenBirthDate] = useState(false);

  const isEditing = selectedEntityId !== "new";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    getEscuderia()
      .then((data) => setEscuderias(data))
      .catch((err) => setError(err));
    getCategoria()
      .then((data) => setCategorias(data))
      .catch((err) => setError(err));
    getNationalities()
      .then((data) => setNationalities(data))
      .catch((err) => setError(err));
    getPiloto()
      .then((data) => setPilotos(data))
      .catch((err) => setError(err));
  }, []);

  const handleEntitySelect = (value: string) => {
    setSelectedEntityId(value);
    setMessage(null);
    setSelectedFile(null);
    if (value === "new") {
      setForm(initialState);
    } else {
      const selected = pilotos.find(p => String(p.id) === value);
      if (selected) {
        setForm({
          name: selected.name,
          team: selected.team ? String(selected.team.id) : "",
          num: selected.num,
          nationality: selected.nationality,
          birth_date: selected.birth_date ? new Date(selected.birth_date) : null,
          role: selected.role,
          racing_series: selected.racing_series ? String(selected.racing_series.id) : "",
        });
      }
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

  const handleDelete = async () => {
    if (!isEditing || !window.confirm("¿Estás seguro de que deseas eliminar este piloto?")) return;
    
    setSubmitting(true);
    try {
      await deletePiloto(Number(selectedEntityId));
      setMessage("Piloto eliminado con éxito.");
      setForm(initialState);
      setSelectedEntityId("new");
      setPilotos(pilotos.filter(p => String(p.id) !== selectedEntityId));
    } catch (err: any) {
      setMessage(`Error al eliminar: ${err.message || "No se pudo eliminar el piloto"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (!form.birth_date) {
      setMessage("Por favor selecciona una fecha de nacimiento");
      setSubmitting(false);
      return;
    }

    const payload: NewPiloto = {
      name: form.name,
      team: form.team,
      num: form.num,
      nationality: form.nationality,
      birth_date: form.birth_date.toISOString().split("T")[0],
      role: form.role,
      racing_series: form.racing_series,
    };

    try {
      if (isEditing) {
        const updated = await putPilotoFormData(Number(selectedEntityId), payload, selectedFile || undefined);
        setMessage("Piloto actualizado con éxito.");
        setPilotos(pilotos.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await postPilotoFormData(payload, selectedFile || undefined);
        setMessage("Piloto creado con éxito.");
        setPilotos([...pilotos, created]);
        setForm(initialState);
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
          backgroundImage: `url(${fondoFranco})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.5)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10 pb-20">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/80 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-gray-700/40"
        >
          <h1
            className="text-gray-200 mt-2 scroll-m-20 text-4xl font-bold tracking-wider text-center uppercase"
            style={{
              fontFamily: "'Orbitron', 'Rajdhani',sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            Alta / Edición piloto
          </h1>

          <div className="mb-6 pt-4 border-b border-gray-700 pb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seleccionar piloto existente
            </label>
            <Select value={selectedEntityId} onValueChange={handleEntitySelect}>
              <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="-- Crear nuevo piloto --" />
              </SelectTrigger>
              <SelectContent className="border-secondary max-h-60">
                <SelectItem value="new" className="font-bold text-blue-400">
                  -- Crear nuevo piloto --
                </SelectItem>
                {pilotos.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                value={form.team}
                onValueChange={(value) =>
                  setForm((s) => ({ ...s, team: value }))
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

          <Popover open={openBirthDate} onOpenChange={setOpenBirthDate}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-between font-normal h-10 ${
                  !form.birth_date ? "text-muted-foreground" : ""
                }`}
                type="button"
              >
                {form.birth_date
                  ? form.birth_date.toLocaleDateString()
                  : "Fecha de nacimiento *"}
                <ChevronDownIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0 border-none z-50"
              align="start"
            >
              <Calendar
                mode="single"
                selected={form.birth_date ?? undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (date) setForm((prev) => ({ ...prev, birth_date: date }));
                  setOpenBirthDate(false);
                }}
                fromYear={1950}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>

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

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Imagen del Piloto (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-900/50 border-0"
            >
              {submitting ? "Enviando..." : (isEditing ? "Guardar cambios" : "Crear nuevo piloto")}
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
