import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

interface Carrera {
  id: number;
  nombre: string;
  fecha: string;
  pais: string;
  disneyPlus: boolean;
  foxSports: boolean;
  codigoPais: string;
  imagenPais: string;
}

function DondeVer() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);

  useEffect(() => {
    const calendario: Carrera[] = [
      {
        id: 1,
        nombre: "GP AUSTRALIA",
        fecha: "14-16 de marzo",
        pais: "Australia",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "AU",
        imagenPais: "./src/assets/banderas-paises/Australia.png",
      },
      {
        id: 2,
        nombre: "GP CHINA",
        fecha: "21-23 de marzo",
        pais: "China",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "CN",
        imagenPais: "./src/assets/banderas-paises/China.png",
      },
      {
        id: 3,
        nombre: "GP JAPÓN",
        fecha: "4-6 de abril",
        pais: "Japón",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "JP",
        imagenPais: "./src/assets/banderas-paises/Japon.png",
      },
      {
        id: 4,
        nombre: "GP BAHRÉIN",
        fecha: "11-13 de abril",
        pais: "Bahréin",
        disneyPlus: true,
        foxSports: false,
        codigoPais: "BH",
        imagenPais: "./src/assets/banderas-paises/bahrain.png",
      },
      {
        id: 5,
        nombre: "GP ARABIA SAUDITA",
        fecha: "18-20 de abril",
        pais: "Arabia Saudita",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "SA",
        imagenPais: "./src/assets/banderas-paises/Arabia_Saudita.png",
      },
      {
        id: 6,
        nombre: "GP MIAMI",
        fecha: "2-4 de mayo",
        pais: "Estados Unidos",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "US",
        imagenPais: "./src/assets/banderas-paises/USA.png",
      },
      {
        id: 7,
        nombre: "GP EMILIA ROMAGNA",
        fecha: "16-18 de mayo",
        pais: "Italia",
        disneyPlus: true,
        foxSports: false,
        codigoPais: "IT",
        imagenPais: "./src/assets/banderas-paises/Italia.png",
      },
      {
        id: 8,
        nombre: "GP MÓNACO",
        fecha: "23-25 de mayo",
        pais: "Mónaco",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "MC",
        imagenPais: "./src/assets/banderas-paises/Monaco.png",
      },
      {
        id: 9,
        nombre: "GP ESPAÑA",
        fecha: "30 may - 1 de junio",
        pais: "España",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "ES",
        imagenPais: "./src/assets/banderas-paises/Espana.png",
      },
      {
        id: 10,
        nombre: "GP CANADÁ",
        fecha: "13-15 de junio",
        pais: "Canadá",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "CA",
        imagenPais: "./src/assets/banderas-paises/Canada.png",
      },
      {
        id: 11,
        nombre: "GP AUSTRIA",
        fecha: "27-29 de junio",
        pais: "Austria",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "AT",
        imagenPais: "./src/assets/banderas-paises/Austria.png",
      },
      {
        id: 12,
        nombre: "GP GRAN BRETAÑA",
        fecha: "4-6 de julio",
        pais: "Reino Unido",
        disneyPlus: true,
        foxSports: false,
        codigoPais: "GB",
        imagenPais: "./src/assets/banderas-paises/UK.png",
      },
      {
        id: 13,
        nombre: "GP BÉLGICA",
        fecha: "25-27 de julio",
        pais: "Bélgica",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "BE",
        imagenPais: "./src/assets/banderas-paises/Belgica.png",
      },
      {
        id: 14,
        nombre: "GP HUNGRÍA",
        fecha: "1-3 de agosto",
        pais: "Hungría",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "HU",
        imagenPais: "./src/assets/banderas-paises/Hungria.png",
      },
      {
        id: 15,
        nombre: "GP PAÍSES BAJOS",
        fecha: "29-31 de agosto",
        pais: "Países Bajos",
        disneyPlus: true,
        foxSports: false,
        codigoPais: "NL",
        imagenPais: "./src/assets/banderas-paises/Paises_Bajos.png",
      },
      {
        id: 16,
        nombre: "GP ITALIA",
        fecha: "5-7 de septiembre",
        pais: "Italia",
        disneyPlus: true,
        foxSports: false,
        codigoPais: "IT",
        imagenPais: "./src/assets/banderas-paises/Italia.png",
      },
      {
        id: 17,
        nombre: "GP AZERBAIYÁN",
        fecha: "19-21 de septiembre",
        pais: "Azerbaiyán",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "AZ",
        imagenPais: "./src/assets/banderas-paises/Azerbaiyan.png",
      },
      {
        id: 18,
        nombre: "GP SINGAPUR",
        fecha: "3-5 de octubre",
        pais: "Singapur",
        disneyPlus: true,
        foxSports: false,
        codigoPais: "SG",
        imagenPais: "./src/assets/banderas-paises/Singapur.png",
      },
      {
        id: 19,
        nombre: "GP ESTADOS UNIDOS",
        fecha: "17-19 de octubre",
        pais: "Estados Unidos",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "US",
        imagenPais: "./src/assets/banderas-paises/USA.png",
      },
      {
        id: 20,
        nombre: "GP MÉXICO",
        fecha: "24-26 de octubre",
        pais: "México",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "MX",
        imagenPais: "./src/assets/banderas-paises/Mexico.png",
      },
      {
        id: 21,
        nombre: "GP BRASIL",
        fecha: "7-9 de noviembre",
        pais: "Brasil",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "BR",
        imagenPais: "./src/assets/banderas-paises/Brasil.png",
      },
      {
        id: 22,
        nombre: "GP LAS VEGAS",
        fecha: "20-22 de noviembre",
        pais: "Estados Unidos",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "US",
        imagenPais: "./src/assets/banderas-paises/USA.png",
      },
      {
        id: 23,
        nombre: "GP QATAR",
        fecha: "28-30 de noviembre",
        pais: "Qatar",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "QA",
        imagenPais: "./src/assets/banderas-paises/Catar.png",
      },
      {
        id: 24,
        nombre: "GP ABU DHABI",
        fecha: "5-7 de diciembre",
        pais: "Abu Dhabi",
        disneyPlus: true,
        foxSports: true,
        codigoPais: "AE",
        imagenPais: "./src/assets/banderas-paises/EAU.png",
      },
    ];

    setCarreras(calendario);
  }, []);

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0 blur-sm opacity-30"
        style={{
          backgroundImage: "url('https://img.jakpost.net/c/2022/05/09/2022_05_09_125440_1652083789._large.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    <div className="relative z-10 min-h-screen bg-background/10 text-foreground">

      <h1 className="text-2xl md:text-3xl font-bold text-center px-4 mt-10 mb-2">
        TRANSMISIÓN DE LA F1 PARA ARGENTINA 2025
      </h1>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Descripción informativa */}
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-300 mb-4">
            En Argentina, la Fórmula 1 se transmite a través de{" "}
            <span className="text-orange-500 font-semibold">Fox Sports</span> y{" "}
            <span className="text-blue-400 font-semibold">Disney+</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna Izquierda */}
          <div>
            <div className="bg-muted/80 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">GRAN PREMIO</h2>
                <div className="flex gap-4">
                  <span className="text-blue-400 font-semibold">Disney+</span>
                  <span className="text-orange-500 font-semibold">FOX</span>
                </div>
              </div>

              <div className="space-y-3">
                {carreras.slice(0, 12).map((carrera) => (
                  <div
                    key={carrera.id}
                    className="flex items-center justify-between py-2 border-b border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      {/* Imagen del país */}
                      <div className="w-12 h-8 flex-shrink-0">
                        <img
                          src={carrera.imagenPais}
                          alt={`${carrera.pais}`}
                          className="w-full h-full object-cover rounded border border-gray-600"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            (e.currentTarget
                              .nextElementSibling as HTMLElement)!.style.display =
                              "block";
                          }}
                        />
                        <div className="w-full h-full hidden items-center justify-center bg-gray-700 rounded text-xs font-mono text-gray-300">
                          {carrera.codigoPais}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{carrera.nombre}</div>
                        <div className="text-sm text-gray-400">
                          {carrera.fecha}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-8 flex justify-center">
                        {carrera.disneyPlus ? (
                          <Check className="h-6 w-6 text-green-500" />
                        ) : (
                          <X className="h-6 w-6 text-red-500" />
                        )}
                      </div>
                      <div className="w-8 flex justify-center">
                        {carrera.foxSports ? (
                          <Check className="h-6 w-6 text-green-500" />
                        ) : (
                          <X className="h-6 w-6 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div>
            <div className="bg-muted/80 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">GRAN PREMIO</h2>
                <div className="flex gap-4">
                  <span className="text-blue-400 font-semibold">Disney+</span>
                  <span className="text-orange-500 font-semibold">FOX</span>
                </div>
              </div>

              <div className="space-y-3">
                {carreras.slice(12).map((carrera) => (
                  <div
                    key={carrera.id}
                    className="flex items-center justify-between py-2 border-b border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 flex-shrink-0">
                        <img
                          src={carrera.imagenPais}
                          alt={`${carrera.pais}`}
                          className="w-full h-full object-cover rounded border border-gray-600"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            (e.currentTarget
                              .nextElementSibling as HTMLElement)!.style.display =
                              "block";
                          }}
                        />
                        <div className="w-full h-full hidden items-center justify-center bg-gray-700 rounded text-xs font-mono text-gray-300">
                          {carrera.codigoPais}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{carrera.nombre}</div>
                        <div className="text-sm text-gray-400">
                          {carrera.fecha}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-8 flex justify-center">
                        {carrera.disneyPlus ? (
                          <Check className="h-6 w-6 text-green-500" />
                        ) : (
                          <X className="h-6 w-6 text-red-500" />
                        )}
                      </div>
                      <div className="w-8 flex justify-center">
                        {carrera.foxSports ? (
                          <Check className="h-6 w-6 text-green-500" />
                        ) : (
                          <X className="h-6 w-6 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer con notas */}
        <div className="mt-8 bg-muted/80 rounded-lg p-6">
          <div className="text-sm tracking-wide">
            <div>
              <p className="text-gray-300">
                * <span className="font-semibold">FOX SPORTS</span> transmitirá
                EN VIVO el 75% de las carreras del calendario. Se irán
                confirmando en el transcurso de la temporada.
              </p>
            </div>
            <div>
              <p className="text-gray-300">
                * <span className="font-semibold text-blue-400">DISNEY+</span>{" "}
                transmitirá EN VIVO y sin cortes todos los Grandes Premios de la
                temporada 2025.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default DondeVer;
