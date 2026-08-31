import { Escuderia } from "@/entities/escuderia.entity.ts";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Trash2 } from "lucide-react";
import {
  deleteEscuderia,
  getOneEscuderia,
  uploadEscuderiaImage,
  uploadEscuderiaCarImage,
} from "@/services/escuderia.service.ts";
import { AuthService } from "@/services/auth.service.ts";
import { getAssetUrl } from "@/utils/asset.util.ts";

function DetalleEscuderia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [escuderia, setEscuderia] = useState<Escuderia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedCarFile, setSelectedCarFile] = useState<File | null>(null);
  const [uploadingCarImage, setUploadingCarImage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    AuthService.isAdmin().then((res) => setIsAdmin(Boolean(res)));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedCarFile(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile || !escuderia || !escuderia.id) return;
    setUploadingImage(true);
    try {
      await uploadEscuderiaImage(escuderia.id, selectedFile);
      alert("Imagen actualizada correctamente");
      window.location.reload();
    } catch (error) {
      alert("Error al actualizar la imagen");
    } finally {
      setUploadingImage(false);
      setSelectedFile(null);
    }
  };

  const handleUploadCarImage = async () => {
    if (!selectedCarFile || !escuderia || !escuderia.id) return;
    setUploadingCarImage(true);
    try {
      await uploadEscuderiaCarImage(escuderia.id, selectedCarFile);
      alert("Imagen del monoplaza actualizada correctamente");
      window.location.reload();
    } catch (error) {
      alert("Error al actualizar la imagen del monoplaza");
    } finally {
      setUploadingCarImage(false);
      setSelectedCarFile(null);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("No se proporcionó un ID");
      setLoading(false);
      return;
    }
    getOneEscuderia(parseInt(id))
      .then((data) => setEscuderia(data))
      .catch((err) => {
        setError(err.message);
        console.error("Error cargando escudería", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!escuderia?.id || !isAdmin) return;

    if (confirm(`¿Estás seguro de eliminar "${escuderia.name}"?`)) {
      try {
        await deleteEscuderia(escuderia.id);
        navigate("/escuderias");
      } catch (err) {
        console.error("Error eliminando escudería", err);
        alert("Error al eliminar la escudería");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-xl text-white">Cargando escudería...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!escuderia) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Escudería no encontrada</div>
      </div>
    );
  }

  const flagUrl = getAssetUrl(`/flags/${escuderia.nationality}.svg`);
  const logoUrl = getAssetUrl(escuderia.logo_image);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 py-4 sm:py-8">
      {logoUrl && (
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url(${logoUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(50px) brightness(0.4)",
          }}
        />
      )}

      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-red-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <Link
            to="/escuderias"
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
          <div className="lg:col-span-5">
            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-slate-700/50 flex items-center justify-center p-4 sm:p-6 h-56 sm:h-72 lg:h-[400px]">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={escuderia.name}
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
              ) : (
                <div className="text-5xl sm:text-6xl font-bold text-gray-600">
                  {escuderia.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg border border-slate-700/50">
              <span className="text-[10px] sm:text-xs font-semibold text-red-400 uppercase tracking-wider block mb-0.5">
                {typeof escuderia.racing_series === "string"
                  ? escuderia.racing_series
                  : escuderia.racing_series?.name || "Escudería"}
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight truncate">
                {escuderia.name}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Nacionalidad
                </h3>
                <div className="flex items-center gap-2">
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={`Bandera de ${escuderia.nationality}`}
                      className="w-6 h-4 sm:w-8 sm:h-5 object-cover rounded shadow border border-white/10 shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <p className="text-xs sm:text-base font-semibold text-white truncate">
                    {escuderia.nationality}
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Motor
                </h3>
                <p className="text-xs sm:text-base font-semibold text-white truncate">
                  {escuderia.engine || "—"}
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Marca
                </h3>
                <p className="text-xs sm:text-base font-semibold text-white truncate">
                  {typeof escuderia.brand === "string"
                    ? escuderia.brand
                    : escuderia.brand?.name || "—"}
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Categoría
                </h3>
                <p className="text-xs sm:text-base font-semibold text-white truncate">
                  {typeof escuderia.racing_series === "string"
                    ? escuderia.racing_series
                    : escuderia.racing_series?.name || "—"}
                </p>
              </div>

              {escuderia.fundation && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all col-span-2">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Año de Fundación
                  </h3>
                  <p className="text-xs sm:text-base font-semibold text-white">
                    {escuderia.fundation}
                  </p>
                </div>
              )}
            </div>

            {escuderia.car_image && (
              <div className="mt-8 flex justify-center">
                <img
                  src={getAssetUrl(escuderia.car_image)}
                  alt="Monoplaza"
                  className="max-w-full h-auto rounded-lg shadow-2xl border border-gray-700/50"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            )}

            {isAdmin && (
              <div className="mt-4 bg-slate-900/60 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-slate-700/40">
                <h3 className="text-xs sm:text-sm font-bold mb-2.5 text-white uppercase tracking-wider">
                  Actualizar Imagen de la Escudería
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
                      file:bg-red-700 file:text-white
                      hover:file:bg-red-800 cursor-pointer"
                  />
                  <button
                    onClick={handleUploadImage}
                    disabled={!selectedFile || uploadingImage}
                    className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-md text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-0 shrink-0 cursor-pointer"
                  >
                    {uploadingImage ? "Subiendo..." : "Subir Imagen"}
                  </button>
                </div>

                <h3 className="text-xl font-bold mt-8 mb-4 text-white">
                  Actualizar Imagen del Monoplaza
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCarFileChange}
                    className="block w-full sm:w-auto text-sm text-gray-300
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-red-700 file:text-white
                      hover:file:bg-red-800"
                  />
                  <button
                    onClick={handleUploadCarImage}
                    disabled={!selectedCarFile || uploadingCarImage}
                    className="px-6 py-2 bg-red-700 hover:bg-red-800 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-0"
                  >
                    {uploadingCarImage ? "Subiendo..." : "Subir Monoplaza"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleEscuderia;
