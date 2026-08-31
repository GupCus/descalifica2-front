import { Marca } from "@/entities/marca.entity.ts";
import { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { deleteMarca, uploadMarcaImage } from "@/services/marca.service.ts";
import { AuthService } from "@/services/auth.service.ts";
import { getAssetUrl } from "@/utils/asset.util.ts";

function DetalleMarca() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [marca, setMarca] = useState<Marca | null>(
    location.state?.marca || null,
  );
  const [loading, setLoading] = useState(!location.state?.marca);
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
    if (!selectedFile || !marca || !marca.id) return;
    setUploadingImage(true);
    try {
      await uploadMarcaImage(marca.id, selectedFile);
      alert("Imagen actualizada correctamente");
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
    if (location.state?.marca) return;
    if (!id) return;

    fetch(`${api}/marcas/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMarca(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, api, location.state]);

  const handleDelete = async () => {
    if (!marca?.id || !isAdmin) return;

    if (confirm(`¿Estás seguro de eliminar "${marca.name}"?`)) {
      try {
        await deleteMarca(marca.id);
        navigate("/marcas");
      } catch (err) {
        console.error("Error eliminando marca", err);
        alert("Error al eliminar la marca");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando marca...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!marca) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Marca no encontrada</div>
      </div>
    );
  }

  const flagUrl = getAssetUrl(`/flags/${marca.nationality}.svg`);
  const logoUrl = getAssetUrl(marca.logo_image);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      {logoUrl && (
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url(${logoUrl})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(8px) brightness(0.4)",
          }}
        />
      )}

      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <Link
            to="/marcas"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors bg-slate-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700/50"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            Volver al listado
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
            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-slate-700/50 p-4 sm:p-6 flex items-center justify-center h-56 sm:h-72 lg:h-[400px]">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={marca.name}
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
                  {marca.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg border border-slate-700/50">
              <span className="text-[10px] sm:text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-0.5">
                Marca
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight truncate">
                {marca.name}
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
                      alt={`Bandera de ${marca.nationality}`}
                      className="w-6 h-4 sm:w-8 sm:h-5 object-cover rounded shadow border border-white/10 shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <p className="text-xs sm:text-base font-semibold text-white truncate">
                    {marca.nationality}
                  </p>
                </div>
              </div>

              {marca.foundation && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Año de Fundación
                  </h3>
                  <p className="text-xs sm:text-base font-semibold text-white truncate">
                    {marca.foundation}
                  </p>
                </div>
              )}

              {marca.teams && marca.teams.length > 0 && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all col-span-2">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Escuderías Asociadas
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {marca.teams.map((escuderia) => (
                      <Link
                        key={escuderia.id}
                        to={`/escuderia/${escuderia.id}`}
                        className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg text-xs font-medium transition-colors border border-slate-700/50"
                      >
                        {escuderia.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="mt-4 bg-slate-900/60 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-slate-700/40">
                <h3 className="text-xs sm:text-sm font-bold mb-2.5 text-white uppercase tracking-wider">
                  Actualizar Imagen de la Marca
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
                      file:bg-blue-600 file:text-white
                      hover:file:bg-blue-700 cursor-pointer"
                  />
                  <button
                    onClick={handleUploadImage}
                    disabled={!selectedFile || uploadingImage}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-0 shrink-0 cursor-pointer"
                  >
                    {uploadingImage ? "Subiendo..." : "Subir Imagen"}
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

export default DetalleMarca;
