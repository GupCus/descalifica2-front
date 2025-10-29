import React, { useEffect, useState } from "react";
import fondoGrilla from "../../assets/grilla-cola-2021.jpg";
import { getCategoria } from "@/services/categoria.service.ts";
import { Categoria } from "@/entities/categoria.entity.ts";
import { Carrera } from "@/entities/carrera.entity.ts";
import { Sesion } from "@/entities/sesion.entity.ts";
import { Piloto } from "@/entities/piloto.entity.ts";
import { getPiloto } from "@/services/piloto.service.ts";
import { getCarrera } from "@/services/carrera.service.ts";
import { getSesion, putSesion } from "@/services/sesion.service.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function CargarDatosSesion() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [pilotos, setPilotos] = useState<Piloto[]>([]);
  const [categoria, setCategoria] = useState<string>("");
  const [carrera, setCarrera] = useState<string>("");
  const [sesion, setSesion] = useState<string>("");
  const [tiempos, setTiempos] = useState<[string, string][]>([]);
  const [, setError] = useState<string | null>();

  useEffect(() => {
    getCategoria()
      .then((data) => setCategorias(data))
      .catch((err) => setError(err));
    getPiloto()
      .then((data) => setPilotos(data))
      .catch((err) => setError(err));
    getCarrera()
      .then((data) => setCarreras(data))
      .catch((err) => setError(err));
    getSesion()
      .then((data) => setSesiones(data))
      .catch((err) => setError(err));
  }, []);

  /* DEBUGGING COMENTADO POR AHORA
  console.log(`CATEGORIAS`);
  console.log(categorias);
  console.log(`CARRERAS`);
  console.log(carreras);
  console.log(`PILOTOS`);
  console.log(pilotos);
*/

  // Filtrar carreras y pilotos según la categoría seleccionada
  const carrerasFiltradas = carreras.filter(
    (c) => String(c.id) === String(categoria)
  );
  //console.log(carrerasFiltradas);
  const pilotosFiltrados = pilotos.filter(
    (p) => String(p.racing_series.id) === String(categoria)
  );
  //console.log("PILOTOS FILTRADOS");
  //console.log(pilotosFiltrados);
  const sesionesFiltradas = sesiones.filter((s) => String(s.race) === carrera);
  //console.log(sesionesFiltradas);

  // Resetear selección dependiente
  useEffect(() => {
    setCarrera("");
    setSesion("");
  }, [categoria]);

  useEffect(() => {
    setSesion("");
  }, [carrera]);

  const handleTiempoChange = (pilotoName: string, value: string) => {
    setTiempos((prev) => {
      const index = prev.findIndex(([id]) => id === pilotoName);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = [pilotoName, value];
        return updated;
      } else {
        return [...prev, [pilotoName, value]];
      }
    });
  };

  const handleGuardar = async () => {
    if (!sesion) return;

    const sesionActual = sesiones.find((s) => String(s.id) === sesion);
    if (!sesionActual) {
      alert("Sesión no encontrada");
      return;
    }

    const sesionActualizada: Sesion = {
      ...sesionActual,
      results: tiempos,
    };

    try {
      await putSesion(sesionActual.id!, sesionActualizada);
      alert("Tiempos guardados correctamente");
    } catch (err) {
      alert("Error al guardar los tiempos");
    }

    console.log({ categoria, carrera, sesion, tiempos });
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoGrilla})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.5)",
        }}
      />
      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10">
        <form
          className="space-y-6 w-full max-w-2xl mx-8 bg-gray-950/70 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-yellow-700/40"
          onSubmit={(e) => {
            e.preventDefault();
            handleGuardar();
          }}
        >
          <h2 className="text-white-100 text-3xl font-bold text-center mb-6 uppercase tracking-wider">
            Cargar datos de sesión
          </h2>
          {/* Selector de Categoría */}
          <div>
            <Label className="text-white-100 mb-1">Categoría</Label>
            <Select
              value={categoria}
              onValueChange={(value) => setCategoria(value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Selector de Carrera */}
          <div>
            <Label className="text-white-100 mb-1">Carrera</Label>
            <Select
              value={carrera}
              onValueChange={(value) => setCarrera(value)}
              disabled={!categoria}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar carrera" />
              </SelectTrigger>
              <SelectContent>
                {carrerasFiltradas.map((car) => (
                  <SelectItem key={car.id} value={String(car.id)}>
                    {car.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Selector de Sesión */}
          <div>
            <Label className="text-white-100 mb-1">Sesión</Label>
            <Select
              value={sesion}
              onValueChange={(value) => setSesion(value)}
              disabled={!carrera}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar sesión" />
              </SelectTrigger>
              <SelectContent>
                {sesionesFiltradas.map((ses) => (
                  <SelectItem key={ses.id} value={String(ses.id)}>
                    {ses.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {sesion && (
            <div>
              <h3 className="text-white-100 text-xl font-semibold mb-2">
                Ingresar tiempos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pilotosFiltrados.map((piloto) => {
                  const tiempoActual =
                    tiempos.find(
                      ([name]) => name === String(piloto.name)
                    )?.[1] || "";
                  return (
                    <div key={piloto.id} className="flex flex-col gap-1">
                      <Label className="text-white-100">{piloto.name}</Label>
                      <Input
                        type="text"
                        value={tiempoActual}
                        onChange={(e) =>
                          handleTiempoChange(piloto.name, e.target.value)
                        }
                        placeholder="00:00.000"
                        className="bg-background"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Botón de guardar */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={!sesion}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold shadow-lg shadow-yellow-900/50 border-0"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CargarDatosSesion;
