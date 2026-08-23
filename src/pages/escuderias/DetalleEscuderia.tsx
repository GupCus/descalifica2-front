import { Escuderia } from "@/entities/escuderia.entity.ts";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Trash2 } from "lucide-react";
import {
  deleteEscuderia,
  getOneEscuderia,
  uploadEscuderiaImage,
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
    if (!escuderia?.id) return;

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

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: getAssetUrl(escuderia.logo_image),
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) brightness(0.4)",
        }}
      />

      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10">
        <div className="w-full max-w-4xl mx-8">
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/escuderias"
              className="inline-block text-gray-300 hover:text-white transition-all bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 hover:border-red-500"
            >
              ← Volver al listado
            </Link>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>

          <div 
            className="bg-gray-950/70 backdrop-blur-md rounded-lg p-8 shadow-2xl border relative overflow-hidden"
          >
            <div className="relative z-10">
            <h1
              className="text-white-100 mt-5 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase mb-8"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              {escuderia.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                  Nacionalidad
                </h3>
                <div className="flex items-center gap-3">
                  {flagUrl && (
                    <img
                      src={getAssetUrl(`/flags/${escuderia.nationality}.svg`)}
                      alt="AT"
                      className="w-12 h-8 object-cover rounded shadow-lg"
                    />
                  )}
                  <p className="text-2xl font-bold text-white">
                    {escuderia.nationality}
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                  Motor
                </h3>
                <p className="text-2xl font-bold text-white">
                  {escuderia.engine}
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                  Marca
                </h3>
                <p className="text-2xl font-bold text-white">
                  {typeof escuderia.brand === "string"
                    ? escuderia.brand
                    : escuderia.brand?.name || "—"}
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                  Categoría
                </h3>
                <p className="text-2xl font-bold text-white">
                  {typeof escuderia.racing_series === "string"
                    ? escuderia.racing_series
                    : escuderia.racing_series?.name || "—"}
                </p>
              </div>

              {escuderia.fundation && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 md:col-span-2">
                  <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                    Año de Fundación
                  </h3>
                  <p className="text-2xl font-bold text-white">
                    {escuderia.fundation}
                  </p>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="mt-10 bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Actualizar Imagen de la Escudería
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full sm:w-auto text-sm text-gray-300
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-red-700 file:text-white
                      hover:file:bg-red-800"
                  />
                  <button
                    onClick={handleUploadImage}
                    disabled={!selectedFile || uploadingImage}
                    className="px-6 py-2 bg-red-700 hover:bg-red-800 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-0"
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
  </div>
  );
}

export default DetalleEscuderia;
