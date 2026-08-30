import { Circuito } from "@/entities/circuito.entity.ts";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Trash2 } from "lucide-react";
import {
  deleteCircuito,
  uploadCircuitoImage,
  uploadTrackImage,
} from "@/services/circuito.service.ts";
import { AuthService } from "@/services/auth.service.ts";
import { getAssetUrl } from "@/utils/asset.util.ts";


function DetalleCircuito() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [circuito, setCircuito] = useState<Circuito | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    AuthService.isAdmin().then((res) => setIsAdmin(Boolean(res)));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile || !circuito || !circuito.id) return;
    setUploadingImage(true);
    try {
      await uploadCircuitoImage(circuito.id, selectedFile);
      alert("Imagen actualizada correctamente");
      // Opcional: Recargar el circuito actualizando el componente
      window.location.reload();
    } catch (error) {
      alert("Error al actualizar la imagen");
    } finally {
      setUploadingImage(false);
      setSelectedFile(null);
    }
  };

  const handleTrackImage = async () => {
    if (!selectedFile || !circuito || !circuito.id) return;
    setUploadingImage(true);
    try {
      await uploadTrackImage(circuito.id, selectedFile);
      alert("Imagen actualizada correctamente");
      // Opcional: Recargar el circuito actualizando el componente
      window.location.reload();
    } catch (error) {
      alert("Error al actualizar la imagen");
    } finally {
      setUploadingImage(false);
      setSelectedFile(null);
    }
  };

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  useEffect(() => {
    if (!id) return;

    fetch(`${api}/circuitos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCircuito(data.data ?? data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, api]);

  const handleDelete = async () => {
    if (!circuito?.id || !isAdmin) return;

    if (confirm(`¿Estás seguro de eliminar "${circuito.name}"?`)) {
      try {
        await deleteCircuito(circuito.id);
        navigate("/circuitos");
      } catch (err) {
        console.error("Error eliminando circuito", err);
        alert("Error al eliminar el circuito");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-xl text-white">Cargando circuito...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!circuito) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-xl text-white">Circuito no encontrado</div>
      </div>
    );
  }

  const flagUrl = getAssetUrl(`/flags/${circuito.country}.svg`);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 py-4 sm:py-8">
      <div
        className="absolute inset-0 w-full h-full blur-sm opacity-50 -z-10"
        style={{
          backgroundImage: `url(${new URL("../../assets/Spa-fondo.jpg", import.meta.url).href})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(50px) brightness(0.35)",
        }}
      />

      <div className="relative z-10 container mx-auto px-3 sm:px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <Link
            to="/circuitos"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors bg-slate-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700/50"
          >
            ← Volver al listado
          </Link>
          {isAdmin && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              size="sm"
              className="flex items-center gap-1.5 text-xs h-8 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-6">
            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-slate-700/50 flex items-center justify-center p-3 sm:p-5 h-64 sm:h-80 lg:h-[400px]">
              <img
                src={getAssetUrl(circuito.track_map_image)}
                alt={circuito.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src = new URL(
                    "../../assets/descalifica2logo.png",
                    import.meta.url,
                  ).href;
                  target.classList.add("object-contain", "p-4");
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg border border-slate-700/50">
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-0.5">
                Circuito
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight truncate">
                {circuito.name}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  País
                </h3>
                <div className="flex items-center gap-2">
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={`Bandera de ${circuito.country}`}
                      className="w-6 h-4 sm:w-8 sm:h-5 object-cover rounded shadow border border-white/10 shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <p className="text-xs sm:text-base font-semibold text-white truncate">
                    {circuito.country}
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Inauguración
                </h3>
                <p className="text-xs sm:text-base font-semibold text-white truncate">
                  {circuito.year || "—"}
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all col-span-2">
                <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Longitud
                </h3>
                <p className="text-xs sm:text-base font-semibold text-white">
                  {circuito.length}
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="space-y-3">
                <div className="bg-slate-900/60 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-slate-700/40">
                  <h3 className="text-xs sm:text-sm font-bold mb-2 text-white uppercase tracking-wider">
                    Actualizar Imagen del Circuito
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-slate-300
                        file:mr-3 file:py-1.5 file:px-3
                        file:rounded-md file:border-0
                        file:text-xs file:font-semibold
                        file:bg-emerald-900 file:text-white
                        hover:file:bg-green-800 cursor-pointer"
                    />
                    <button
                      onClick={handleUploadImage}
                      disabled={!selectedFile || uploadingImage}
                      className="px-4 py-1.5 bg-emerald-900 hover:bg-green-800 text-white rounded-md text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-0 shrink-0 cursor-pointer"
                    >
                      {uploadingImage ? "Subiendo..." : "Subir Imagen"}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-slate-700/40">
                  <h3 className="text-xs sm:text-sm font-bold mb-2 text-white uppercase tracking-wider">
                    Actualizar Imagen del trazado
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-slate-300
                        file:mr-3 file:py-1.5 file:px-3
                        file:rounded-md file:border-0
                        file:text-xs file:font-semibold
                        file:bg-emerald-900 file:text-white
                        hover:file:bg-green-800 cursor-pointer"
                    />
                    <button
                      onClick={handleTrackImage}
                      disabled={!selectedFile || uploadingImage}
                      className="px-4 py-1.5 bg-emerald-900 hover:bg-green-800 text-white rounded-md text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-0 shrink-0 cursor-pointer"
                    >
                      {uploadingImage ? "Subiendo..." : "Subir Imagen"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleCircuito;
