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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: getAssetUrl(piloto.profile_image),
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(50px) brightness(0.4)",
        }}
      />

      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Link
          to="/pilotos"
          className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Volver al listado
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border">
              <img
                src={getAssetUrl(piloto.profile_image)}
                alt={piloto.name}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x500/1e293b/cbd5e1?text=Piloto";
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/70 backdrop-blur-md rounded-lg p-6 shadow-lg border border-slate-700/50">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">{piloto.name}</h1>
                <div className="text-5xl font-bold text-primary">
                  #{piloto.num}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                <h3 className="text-sm font-semibold text-slate-400 mb-2">
                  NACIONALIDAD
                </h3>
                <div className="flex items-center gap-3">
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={`Bandera de ${piloto.nationality}`}
                      className="w-8 h-6 object-cover rounded shadow"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <p className="text-lg font-semibold text-white">
                    {piloto.nationality}
                  </p>
                </div>
              </div>

              {piloto.team && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    ESCUDERÍA
                  </h3>
                  <p className="text-lg font-semibold text-white">
                    {piloto.team.name}
                  </p>
                </div>
              )}

              {piloto.role && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    ROL
                  </h3>
                  <p className="text-lg font-semibold text-white">
                    {piloto.role}
                  </p>
                </div>
              )}

              {piloto.racing_series && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    CATEGORÍA
                  </h3>
                  <p className="text-lg font-semibold text-white">
                    {piloto.racing_series.name}
                  </p>
                </div>
              )}

              {piloto.birth_date && (
                <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-4 shadow border border-slate-700/40 hover:bg-slate-900/80 transition-all md:col-span-2">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    FECHA DE NACIMIENTO
                  </h3>
                  <p className="text-lg font-semibold text-white">
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
              <div className="mt-10 bg-slate-900/60 backdrop-blur-md p-6 rounded-lg border border-slate-700/40">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Actualizar Imagen del Piloto
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full sm:w-auto text-sm text-slate-300
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-600 file:text-white
                      hover:file:bg-blue-700"
                  />
                  <button
                    onClick={handleUploadImage}
                    disabled={!selectedFile || uploadingImage}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-0"
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
