import { Marca } from "@/entities/marca.entity.ts";
import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { uploadMarcaImage } from "@/services/marca.service.ts";
import { AuthService } from "@/services/auth.service.ts";

const getCountryFlag = (nationality: string): string => {
  if (!nationality) return "";

  const specialCases: Record<string, string> = {
    "Reino Unido": "UK",
    "Estados Unidos": "USA",
    "Países Bajos": "Paises_Bajos",
    "Emiratos Árabes Unidos": "EAU",
    Baréin: "bahrain",
    Bahréin: "bahrain",
    Azerbaiyán: "Azerbaiyan",
    "Reino de Bahréin": "bahrain",
    Inglaterra: "UK",
    Italia: "Italia",
    Austria: "Austria",
    Alemania: "Alemania",
    Francia: "Francia",
    Suiza: "Suiza",
  };

  if (specialCases[nationality]) {
    try {
      return new URL(
        `../../assets/banderas-paises/${specialCases[nationality]}.png`,
        import.meta.url
      ).href;
    } catch {
      return "";
    }
  }

  const normalizedName = nationality
    .normalize("NFD")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");

  try {
    return new URL(
      `../../assets/banderas-paises/${normalizedName}.png`,
      import.meta.url
    ).href;
  } catch {
    return "";
  }
};

const getMarcaLogo = (name: string): string => {
  const normalizedName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  try {
    return new URL(`../../assets/marcas/${normalizedName}.png`, import.meta.url)
      .href;
  } catch {
    return "";
  }
};

function DetalleMarca() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [marca, setMarca] = useState<Marca | null>(
    location.state?.marca || null
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

  const flagUrl = getCountryFlag(marca.nationality);
  const logoUrl = getMarcaLogo(marca.name);

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

      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Link
          to="/marcas"
          className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Volver al listado
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-gray-700/50 p-8 flex items-center justify-center min-h-[400px]">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={marca.name}
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="text-6xl font-bold text-gray-600">
                  {marca.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-700/50">
              <h1 className="text-4xl font-bold">{marca.name}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 shadow border border-gray-700/50 hover:bg-gray-800/70 transition-all">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">
                  NACIONALIDAD
                </h3>
                <div className="flex items-center gap-3">
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={`Bandera de ${marca.nationality}`}
                      className="w-8 h-6 object-cover rounded shadow"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <p className="text-lg font-semibold text-white">
                    {marca.nationality}
                  </p>
                </div>
              </div>

              {marca.foundation && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 shadow border border-gray-700/50 hover:bg-gray-800/70 transition-all">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">
                    AÑO DE FUNDACIÓN
                  </h3>
                  <p className="text-lg font-semibold text-white">
                    {marca.foundation}
                  </p>
                </div>
              )}

              {marca.teams && marca.teams.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 shadow border border-gray-700/50 hover:bg-gray-800/70 transition-all md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">
                    ESCUDERÍAS ASOCIADAS
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {marca.teams.map((escuderia) => (
                      <Link
                        key={escuderia.id}
                        to={`/escuderia/${escuderia.id}`}
                        className="bg-gray-700/50 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {escuderia.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>


            {isAdmin && (
              <div className="mt-8 bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-white">Actualizar Imagen de la Marca</h3>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="block w-full sm:w-auto text-sm text-gray-300
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-red-800 file:text-white
                      hover:file:bg-red-900"
                  />
                  <button 
                    onClick={handleUploadImage}
                    disabled={!selectedFile || uploadingImage}
                    className="px-6 py-2 bg-red-800 hover:bg-red-900 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-0"
                  >
                    {uploadingImage ? 'Subiendo...' : 'Subir Imagen'}
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
