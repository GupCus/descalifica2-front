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
      <div className="bg-[url('./src/assets/ferrari-lluvia-sainz.jpg')] bg-cover bg-center pt-20 pb-20 text-center flex flex-col justify-center items-center">
        <TextType
          className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance"
          text={[
            "Bienvenido al foro más conocido del automovilismo.",
            "Nos alegramos de tenerte aquí.",
          ]}
          typingSpeed={75}
          pauseDuration={3500}
          showCursor={true}
          textColors={["white"]}
          cursorCharacter=""
        />
        <h3 className="text-white mt-2 scroll-m-20 text-2xl font-semibold tracking-tight text-center">
          En este foro vas a encontrar toda la información que necesitás para tu
          deporte motor favorito.
        </h3>
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
            <AccordionTrigger className="mx-auto">GP SINGAPUR</AccordionTrigger>
            <AccordionContent>
              <p>
                ACA IRIA ARRAY DE PILOTOS, de largada o de llegada dependiendo
                el caso. Popular todos los accordions con la info necesaria.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}

export default Home;
