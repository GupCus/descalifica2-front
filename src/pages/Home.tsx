import DashboardAccordion from "@/components/DashboardAccordion.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TextType from "@/components/ui/TextType.tsx";

function Home() {
    const grandesPremios = [
    {
      id: "item-1",
      nombre: "GRAN PREMIO DE SINGAPUR",
      imagen: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.webp",
    },
    {
      id: "item-2",
      nombre: "GRAN PREMIO DE JAPÓN",
      imagen: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit.webp",
    },
    {
      id: "item-3",
      nombre: "GRAN PREMIO DE QATAR",
      imagen: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Qatar_Circuit.webp",
    },
  ];

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
            className="scroll-m-20 text-4xl font-extrabold tracking-tight text-primary-foreground"
            text={[
              "Bienvenido al mejor foro sobre automovilismo.",
              "Welcome to the best motorsport forum.",
              "Willkommen im berühmtesten Motorsportforum.",
              "Bem-vindo ao mais melhor fórum do automobilismo",
              "Hikinawa kyoto nagasaki hiroyima"
            ]}
            typingSpeed={75}
            pauseDuration={3500}
            showCursor={true}
            cursorCharacter="_"
          />
          <h3 className="text-primary-foreground mt-5 scroll-m-20 text-xl font-semibold tracking-tight text-center">
            En descalifica2 vas a encontrar toda la información que necesitás para
            tu deporte motor favorito.
          </h3>
        </div>
      </div>
      <div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-5 mb-5 text-center">
          Últimos grandes premios:{" "}
        </h4>
                <Accordion
          className="max-w-3xl w-full mx-auto px-4 bg-secondary rounded-lg mt-1"
          type="single"
          collapsible
        >
          {grandesPremios.map((gp) => (
            <AccordionItem key={gp.id} value={gp.id}>
              <AccordionTrigger className="mx-auto">
                {gp.nombre}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex h-auto">
                  <div className="flex-3 w-full h-full">
                    <DashboardAccordion />
                  </div>
                  <img
                    src={gp.imagen}
                    alt={gp.nombre}
                    className="flex-1 max-w-[40%]"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}

export default Home;
