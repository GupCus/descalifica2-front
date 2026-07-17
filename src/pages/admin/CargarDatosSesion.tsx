import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { Temporada } from "@/entities/temporada.entity.ts";
import { getTemporada } from "@/services/temporada.service.ts";

function CargarDatosSesion() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [pilotos, setPilotos] = useState<Piloto[]>([]);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [categoria, setCategoria] = useState<string>("");
  const [carrera, setCarrera] = useState<string>("");
  const [sesion, setSesion] = useState<string>("");
  const [temporada, setTemporada] = useState<string>("");
  const [tiempos, setTiempos] = useState<[string, string][]>([]);
  const [, setError] = useState<string | null>();
  const [message, setMessage] = useState<string | null>();

  useEffect(() => {
    getTemporada()
      .then((data) => setTemporadas(data))
      .catch((err) => setError(err));
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
  console.log("TEMPORADAS");
  console.log(temporadas);

  //FILTROS PARA LO QUE SELECCIONE EL USUARIO
  const carrerasFiltradas = carreras.filter(
    (c) =>
      String(c.season?.racing_series.id) === String(categoria) &&
      String(c.season?.id) === temporada
  );
  console.log("CARRERAS FILTRADAS");
  console.log(carrerasFiltradas);
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

  useEffect(() => {
    if (!sesion) {
      setTiempos([]);
      return;
    }
    const sesionActual = sesiones.find((s) => String(s.id) === sesion);
    if (sesionActual && Array.isArray(sesionActual.results)) {
      setTiempos(sesionActual.results);
    } else {
      setTiempos([]);
    }
  }, [sesion, sesiones]);

  const handleTiempoChange = (pilotoID: string, value: string) => {
    setTiempos((prev) => {
      const index = prev.findIndex(([id]) => id === pilotoID);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = [pilotoID, value];
        return updated;
      } else {
        return [...prev, [pilotoID, value]];
      }
    });
  };

  const handleGuardar = async () => {
    if (!sesion) return;

    const sesionActual = sesiones.find((s) => String(s.id) === sesion);
    if (!sesionActual) {
      setMessage("Sesión no encontrada");
      return;
    }

    const sesionActualizada: Sesion = {
      ...sesionActual,
      results: tiempos,
    };

    try {
      await putSesion(sesionActual.id!, sesionActualizada);
      setMessage("Tiempos guardados correctamente");
    } catch (err) {
      setMessage("Error al guardar los tiempos");
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
          <div className="flex justify-between">
            <div className="flex-1 mr-5">
              <Label className="text-white-100 mb-1">Temporada</Label>
              <Select
                value={temporada}
                onValueChange={(value) => setTemporada(value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar temporada" />
                </SelectTrigger>
                <SelectContent>
                  {temporadas.map((temp) => (
                    <SelectItem key={temp.id} value={String(temp.id)}>
                      {temp.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="text-white-100 mb-1">Categoría</Label>
              <Select
                value={categoria}
                onValueChange={(value) => setCategoria(value)}
                disabled={!temporada}
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
          </div>
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
                    tiempos.find(([id]) => id === String(piloto.id))?.[1] || "";
                  return (
                    <div key={piloto.id} className="flex flex-col gap-1">
                      <Label className="text-white-100">{piloto.name}</Label>
                      <Input
                        type="text"
                        value={tiempoActual}
                        onChange={(e) =>
                          handleTiempoChange(String(piloto.id), e.target.value)
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
          <div className="flex w-full justify-between pt-4">
            <Link to="/menuadmin">
              <Button
                className="bg-transparent hover:bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300"
                type="button"
              >
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={!sesion}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold shadow-lg shadow-yellow-900/50 border-0"
            >
              Guardar
            </Button>
          </div>
          {message && (
            <p className="mt-2 text-sm text-center font-semibold text-yellow-200">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default CargarDatosSesion;
