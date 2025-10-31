import DashboardAccordion from "@/components/DashboardAccordion.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TextType from "@/components/ui/TextType.tsx";
import { Carrera } from "@/entities/carrera.entity.ts";
import { getCarrera } from "@/services/carrera.service.ts";
import { useEffect, useState } from "react";

function Home() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCarrera()
      .then((data) => setCarreras(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  if(loading){<div> Cargando carreras... </div>}
  if(error){<div> Error cargando carreras... </div>}

  const carrerasAnteriores =
    carreras.length === 0
      ? undefined
      :  carreras
                  .filter((c) => new Date(c.end_date) < new Date())
                  .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  return (
    <>
      <div className="relative pt-20 pb-20 text-center flex flex-col justify-center items-center overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full z-0 blur-[3px]"
          style={{
            backgroundImage: "url('./src/assets/ferrari-lluvia-sainz.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10">
          <TextType
            className="text-5xl font-extrabold tracking-tight text-primary-foreground"
            text={[
              "Bienvenido al mejor foro sobre automovilismo.",
              "Welcome to the best motorsport forum.",
              "Willkommen im berühmtesten Motorsportforum.",
              "Bem-vindo ao mais melhor fórum do automobilismo",
              "モータースポーツに関する最高のフォーラムへようこそ",
            ]}
            typingSpeed={75}
            pauseDuration={3500}
            showCursor={true}
            cursorCharacter="_"
          />
          <h3 className="text-primary-foreground mt-5 scroll-m-20 text-xl font-semibold tracking-tight text-center">
            En descalifica2 vas a encontrar toda la información que necesitás
            para tu deporte motor favorito.
          </h3>
        </div>
      </div>

      <div>
        <h4 className="text-xl font-semibold tracking-tight mt-5 mb-5 text-center">
          Últimos grandes premios:{" "}
        </h4>
        <Accordion
          className="max-w-5xl w-full mx-auto px-4 bg-secondary rounded-lg"
          type="single"
          collapsible
        >
          {carrerasAnteriores
            ? carrerasAnteriores.map((gp) => !gp ? null : (
                <AccordionItem
                  key={gp.id}
                  value={gp.id.toString()}
                >
                  <AccordionTrigger className="mx-auto text-2xl font-semibold">
                    {gp.name}
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="flex h-auto">
                      <div className="flex-3 w-99 h-full">
                        <DashboardAccordion sesiones={gp.sessions} />
                      </div>
                     
                        <img
                          src={gp.track?.track_map_url}
                          alt={gp.track?.name}
                          className="max-w-[40%] max-h-48 w-auto h-auto object-contain"
                        />
                  
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))
            : null}
        </Accordion>
      </div>
    </>
  );
}

export default Home;
