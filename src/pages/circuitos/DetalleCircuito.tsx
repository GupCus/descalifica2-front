import { Circuito } from "@/entities/circuito.entity.ts";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  uploadCircuitoImage,
  uploadTrackImage,
} from "@/services/circuito.service.ts";
import { AuthService } from "@/services/auth.service.ts";
import { getAssetUrl } from "@/utils/asset.util.ts";


function DetalleCircuito() {
  const { id } = useParams<{ id: string }>();
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

  const flagUrl = new URL(`../../assets/banderas-paises/${circuito.country}.png`, import.meta.url).href

  return (
    <div className="relative min-h-screen flex items-start justify-center px-4 py-8">
      <div
        className="absolute inset-0 w-full h-full blur-sm opacity-70 -z-10"
        style={{
          backgroundImage: `url(${new URL("../../assets/Spa-fondo.jpg", import.meta.url).href})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="w-full max-w-4xl mx-4 z-10">
        <div className="bg-gray-950/70 backdrop-blur-md rounded-lg p-6 md:p-8 shadow-2xl border border-gray-700/40">
          <Link
            to="/circuitos"
            className="inline-block mb-4 text-gray-300 hover:text-white transition-all bg-gray-900/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700 hover:border-red-500"
          >
            ← Volver al listado
          </Link>

          <h1
            className="text-white mt-2 text-3xl md:text-4xl font-extrabold tracking-wider text-center uppercase mb-6"
            style={{ fontFamily: "'Oswald',sans-serif" }}
          >
            {circuito.name}
          </h1>

          {/* Datos arriba en 3 columnas en desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <h3 className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                Año de Inauguración
              </h3>
              <p className="text-2xl font-bold text-white">{circuito.year}</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <h3 className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                Longitud
              </h3>
              <p className="text-2xl font-bold text-white">{circuito.length}</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <h3 className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                País
              </h3>
              <div className="flex items-center gap-3">
                {flagUrl && (
                  <img
                    src={flagUrl}
                    alt={circuito.country}
                    className="w-12 h-8 object-cover rounded overflow-hidden"
                  />
                )}
                <p className="text-2xl font-bold text-white">
                  {circuito.country}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="rounded-lg overflow-hidden border border-gray-700/30 shadow-2xl">
              <img
                src={getAssetUrl(circuito.track_map_image)}
                alt={circuito.name}
                className="w-auto md:h-auto object-cover"
              />
            </div>
          </div>

          {isAdmin && (
            <div>
              <div className="mt-10 bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Actualizar Imagen del Circuito
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
                    file:bg-emerald-900 file:text-white
                    hover:file:bg-green-800"
                  />
                  <button
                    onClick={handleUploadImage}
                    disabled={!selectedFile || uploadingImage}
                    className="px-6 py-2 bg-emerald-900 hover:bg-green-800 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-0"
                  >
                    {uploadingImage ? "Subiendo..." : "Subir Imagen"}
                  </button>
                </div>
              </div>
              <div className="mt-10 bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Actualizar Imagen del trazado del Circuito
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
                    file:bg-emerald-900 file:text-white
                    hover:file:bg-green-800"
                  />
                  <button
                    onClick={handleTrackImage}
                    disabled={!selectedFile || uploadingImage}
                    className="px-6 py-2 bg-emerald-900 hover:bg-green-800 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-0"
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
  );
}

export default DetalleCircuito;
