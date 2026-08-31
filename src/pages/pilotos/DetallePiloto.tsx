import { Piloto } from "@/entities/piloto.entity.ts";
import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { uploadPilotoImage } from "@/services/piloto.service.ts";
import { AuthService } from "@/services/auth.service.ts";
import { getAssetUrl } from "@/utils/asset.util.ts";

function DetallePiloto() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [piloto, setPiloto] = useState<Piloto | null>(
    location.state?.piloto || null,
  );
  const [loading, setLoading] = useState(!location.state?.piloto);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [nationalityName, setNationalityName] = useState<string>("");

  useEffect(() => {
    AuthService.isAdmin().then((res) => setIsAdmin(Boolean(res)));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile || !piloto || !piloto.id) return;
    setUploadingImage(true);
    try {
      await uploadPilotoImage(piloto.id, selectedFile);
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
    if (location.state?.piloto) return;
    if (!id) return;

    fetch(`${api}/pilotos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPiloto(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, api, location.state]);

  useEffect(() => {
    if (piloto?.nationality) {
      fetch(`${api}/nationalities/${piloto.nationality}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (data.data && data.data.name) {
            setNationalityName(data.data.name);
          }
        })
        .catch((err) => console.error("Error fetching nationality:", err));
    }
  }, [piloto?.nationality, api]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando piloto...</div>
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

  if (!piloto) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Piloto no encontrado</div>
      </div>
    );
  }

  const flagUrl = getAssetUrl(`/flags/${piloto.nationality}.svg`);
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 py-4 sm:py-8">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url(${getAssetUrl(piloto.profile_image)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(50px) brightness(0.4)",
        }}
      />

      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 max-w-5xl">
        <Link
          to="/pilotos"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors bg-slate-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700/50 mb-4"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          Volver al listado
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-5">
            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-slate-700/50">
              <div className="relative w-full h-72 sm:h-96 lg:h-[460px] overflow-hidden bg-slate-950/40">
                <img
                  src={getAssetUrl(piloto.profile_image)}
                  alt={piloto.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.onerror = null;
                    target.src = new URL(
                      "../../assets/descalifica2logo.png",
                      import.meta.url,
                    ).href;
                    target.classList.add(
                      "object-contain",
                      "p-6",
                      "bg-slate-900/80",
                    );
                  }}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg border border-slate-700/50 flex items-center justify-between">
              <div className="min-w-0 flex-1 pr-2">
                <span className="text-[10px] sm:text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-0.5">
                  {piloto.racing_series?.name || "Piloto"}
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight truncate">
                  {piloto.name}
                </h1>
              </div>
              <div className="text-3xl sm:text-5xl font-black text-blue-500/90 tracking-tighter drop-shadow-md shrink-0">
                #{piloto.num}
              </div>
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
                      alt={`Bandera de ${piloto.nationality}`}
                      className="w-6 h-4 sm:w-8 sm:h-5 object-cover rounded shadow border border-white/10 shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <p className="text-xs sm:text-base font-semibold text-white truncate">
                    {nationalityName || piloto.nationality}
                  </p>
                </div>
              </div>

              {piloto.team && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Escudería
                  </h3>
                  <p className="text-xs sm:text-base font-semibold text-white truncate">
                    {piloto.team.name}
                  </p>
                </div>
              )}

              {piloto.role && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Rol
                  </h3>
                  <p className="text-xs sm:text-base font-semibold text-white truncate">
                    {piloto.role}
                  </p>
                </div>
              )}

              {piloto.racing_series && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Categoría
                  </h3>
                  <p className="text-xs sm:text-base font-semibold text-white truncate">
                    {piloto.racing_series.name}
                  </p>
                </div>
              )}

              {piloto.birth_date && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all col-span-2">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Fecha de Nacimiento
                  </h3>
                  <p className="text-xs sm:text-base font-semibold text-white">
                    {new Date(piloto.birth_date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="mt-4 bg-slate-900/60 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-slate-700/40">
                <h3 className="text-xs sm:text-sm font-bold mb-2.5 text-white uppercase tracking-wider">
                  Actualizar Imagen del Piloto
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

export default DetallePiloto;
