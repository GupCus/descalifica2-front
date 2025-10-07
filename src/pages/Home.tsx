import DashboardAccordion from "@/components/DashboardAccordion.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TextType from "@/components/ui/TextType.tsx";

function Home() {
  return (
    <>
      <div className="relative pt-20 pb-20 text-center flex flex-col justify-center items-center overflow-hidden">
        {/* Pseudo-element for blurred background */}
        <div
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: "url('./src/assets/ferrari-lluvia-sainz.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(4px)",
          }}
        />
        {/* Content stays sharp */}
        <div className="relative z-10">
          <TextType
            className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance"
            text={[
              "Bienvenido al foro más conocido del automovilismo.",
              "Welcome to the most famous motorsport forum.",
              "Willkommen im berühmtesten Motorsportforum.",
              "Bem-vindo ao mais famoso fórum de automobilismo",
            ]}
            typingSpeed={75}
            pauseDuration={3500}
            showCursor={true}
            textColors={["white"]}
            cursorCharacter="_"
            cursorClassName="text-white"
          />
          <h3 className="text-white mt-2 scroll-m-20 text-2xl font-semibold tracking-tight text-center">
            En este foro vas a encontrar toda la información que necesitás para
            tu deporte motor favorito.
          </h3>
        </div>
      </div>
      <div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-15 text-center">
          Algunos resultados recientes:{" "}
        </h4>
        <Accordion
          className="max-w-2xl w-full mx-auto px-4 bg-gray-400 rounded-lg mt-1"
          type="single"
          collapsible
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="mx-auto">
              GRAN PREMIO DE SINGAPUR
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex h-auto">
                <div className="flex-3 w-full h-full">
                  <DashboardAccordion />
                </div>
                <img
                  src="./src/assets/gp-singapur.png"
                  alt="Gran Premio de Singapur"
                  className="flex-1 max-w-[30%] object-contain"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}

export default Home;
