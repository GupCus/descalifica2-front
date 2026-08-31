import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { ChromaGrid } from "@/components/ui/Chroma-grid";
import { getAssetUrl } from "@/utils/asset.util";

interface CarreraCanal {
  id: number;
  nombre: string;
  fecha: string;
  pais: string;
  paisCode: string;
  disneyPlus: boolean;
  foxSports: boolean;
}

function DondeVer() {
  const [carreras, setCarreraCanals] = useState<CarreraCanal[]>([]);

  useEffect(() => {
    const calendario: CarreraCanal[] = [
      {
        id: 1,
        nombre: "GP AUSTRALIA",
        fecha: "14-16 de marzo",
        pais: "Australia",
        paisCode: "AUS",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 2,
        nombre: "GP CHINA",
        fecha: "21-23 de marzo",
        pais: "China",
        paisCode: "CHN",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 3,
        nombre: "GP JAPÓN",
        fecha: "4-6 de abril",
        pais: "Japón",
        paisCode: "JPN",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 4,
        nombre: "GP BAHRÉIN",
        fecha: "11-13 de abril",
        pais: "Bahréin",
        paisCode: "BRN",
        disneyPlus: true,
        foxSports: false,
      },
      {
        id: 5,
        nombre: "GP ARABIA SAUDITA",
        fecha: "18-20 de abril",
        pais: "Arabia Saudita",
        paisCode: "KSA",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 6,
        nombre: "GP MIAMI",
        fecha: "2-4 de mayo",
        pais: "Estados Unidos",
        paisCode: "USA",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 7,
        nombre: "GP EMILIA ROMAGNA",
        fecha: "16-18 de mayo",
        pais: "Italia",
        paisCode: "ITA",
        disneyPlus: true,
        foxSports: false,
      },
      {
        id: 8,
        nombre: "GP MÓNACO",
        fecha: "23-25 de mayo",
        pais: "Mónaco",
        paisCode: "MON",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 9,
        nombre: "GP ESPAÑA",
        fecha: "30 may - 1 de junio",
        pais: "España",
        paisCode: "ESP",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 10,
        nombre: "GP CANADÁ",
        fecha: "13-15 de junio",
        pais: "Canadá",
        paisCode: "CAN",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 11,
        nombre: "GP AUSTRIA",
        fecha: "27-29 de junio",
        pais: "Austria",
        paisCode: "AUT",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 12,
        nombre: "GP GRAN BRETAÑA",
        fecha: "4-6 de julio",
        pais: "Reino Unido",
        paisCode: "GBR",
        disneyPlus: true,
        foxSports: false,
      },
      {
        id: 13,
        nombre: "GP BÉLGICA",
        fecha: "25-27 de julio",
        pais: "Bélgica",
        paisCode: "BEL",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 14,
        nombre: "GP HUNGRÍA",
        fecha: "1-3 de agosto",
        pais: "Hungría",
        paisCode: "HUN",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 15,
        nombre: "GP PAÍSES BAJOS",
        fecha: "29-31 de agosto",
        pais: "Países Bajos",
        paisCode: "NED",
        disneyPlus: true,
        foxSports: false,
      },
      {
        id: 16,
        nombre: "GP ITALIA",
        fecha: "5-7 de septiembre",
        pais: "Italia",
        paisCode: "ITA",
        disneyPlus: true,
        foxSports: false,
      },
      {
        id: 17,
        nombre: "GP AZERBAIYÁN",
        fecha: "19-21 de septiembre",
        pais: "Azerbaiyán",
        paisCode: "AZE",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 18,
        nombre: "GP SINGAPUR",
        fecha: "3-5 de octubre",
        pais: "Singapur",
        paisCode: "SGP",
        disneyPlus: true,
        foxSports: false,
      },
      {
        id: 19,
        nombre: "GP ESTADOS UNIDOS",
        fecha: "17-19 de octubre",
        pais: "Estados Unidos",
        paisCode: "USA",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 20,
        nombre: "GP MÉXICO",
        fecha: "24-26 de octubre",
        pais: "México",
        paisCode: "MEX",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 21,
        nombre: "GP BRASIL",
        fecha: "7-9 de noviembre",
        pais: "Brasil",
        paisCode: "BRA",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 22,
        nombre: "GP LAS VEGAS",
        fecha: "20-22 de noviembre",
        pais: "Estados Unidos",
        paisCode: "USA",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 23,
        nombre: "GP QATAR",
        fecha: "28-30 de noviembre",
        pais: "Qatar",
        paisCode: "QAT",
        disneyPlus: true,
        foxSports: true,
      },
      {
        id: 24,
        nombre: "GP ABU DHABI",
        fecha: "5-7 de diciembre",
        pais: "Abu Dhabi",
        paisCode: "UAE",
        disneyPlus: true,
        foxSports: true,
      },
    ];

    setCarreraCanals(calendario);
  }, []);

  const renderColumna = (lista: CarreraCanal[]) => (
    <div className="bg-slate-950/70 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-5 border border-slate-800 shadow-xl flex flex-col">
      <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800/80">
        <h2 className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-200 uppercase tracking-wider">
          Gran Premio
        </h2>
        <div className="flex gap-1.5 sm:gap-3 md:gap-4 items-center shrink-0">
          <span className="text-[9px] sm:text-xs md:text-sm text-blue-400 font-bold w-5 sm:w-7 md:w-8 text-center">
            D+
          </span>
          <span className="text-[9px] sm:text-xs md:text-sm text-orange-500 font-bold w-5 sm:w-7 md:w-8 text-center">
            FOX
          </span>
        </div>
      </div>

      <div className="space-y-1 sm:space-y-1.5 flex-1">
        {lista.map((carrera) => {
          const flagUrl = getAssetUrl(`/flags/${carrera.paisCode}.svg`);
          return (
            <div
              key={carrera.id}
              className="flex items-center justify-between py-1 px-1 sm:px-2 rounded-lg hover:bg-slate-900/60 transition-colors border-b border-slate-800/40 last:border-0"
            >
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 pr-1">
                <div className="w-5 h-3.5 sm:w-7 sm:h-5 flex-shrink-0">
                  <img
                    src={flagUrl}
                    alt={carrera.pais}
                    className="w-full h-full object-cover rounded shadow-sm border border-white/10"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[10px] sm:text-xs md:text-sm text-white truncate">
                    {carrera.nombre}
                  </div>
                  <div className="text-[8.5px] sm:text-[10.5px] text-gray-400 truncate leading-tight">
                    {carrera.fecha}
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5 sm:gap-3 md:gap-4 shrink-0">
                <div className="w-5 sm:w-7 md:w-8 flex justify-center">
                  {carrera.disneyPlus ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-emerald-400" />
                  ) : (
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-500" />
                  )}
                </div>
                <div className="w-5 sm:w-7 md:w-8 flex justify-center">
                  {carrera.foxSports ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-emerald-400" />
                  ) : (
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen py-6 sm:py-10 flex flex-col justify-start">
      <div
        className="absolute inset-0 w-full h-full z-0 blur-sm opacity-25"
        style={{
          backgroundImage:
            "url('https://img.jakpost.net/c/2022/05/09/2022_05_09_125440_1652083789._large.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <ChromaGrid />

      <div className="relative z-10 container mx-auto px-2 sm:px-4 max-w-6xl">
        <header className="mb-4 sm:mb-6 text-center">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white uppercase drop-shadow-lg mb-2">
            Transmisión F1 Argentina 2025
          </h1>
          <p className="text-xs sm:text-base text-gray-300">
            En Argentina, la Fórmula 1 se transmite a través de{" "}
            <span className="text-orange-500 font-semibold">Fox Sports</span> y{" "}
            <span className="text-blue-400 font-semibold">Disney+</span>
          </p>
        </header>

        {/* 2 Columnas paralelas en todos los dispositivos */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
          {renderColumna(carreras.slice(0, 12))}
          {renderColumna(carreras.slice(12))}
        </div>

        <div className="mt-4 sm:mt-6 bg-slate-950/70 backdrop-blur-md rounded-xl p-3 sm:p-5 border border-slate-800 text-xs sm:text-sm text-gray-300 space-y-1">
          <p>
            * <span className="font-semibold text-orange-400">FOX SPORTS</span>{" "}
            transmitirá EN VIVO el 75% de las carreras del calendario. Se irán
            confirmando en el transcurso de la temporada.
          </p>
          <p>
            * <span className="font-semibold text-blue-400">DISNEY+</span>{" "}
            transmitirá EN VIVO y sin cortes todos los Grandes Premios de la
            temporada 2025.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DondeVer;
