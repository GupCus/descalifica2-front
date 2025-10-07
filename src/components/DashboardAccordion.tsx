import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";

function DasboardAccordion() {
  return (
    <>
      <header className="max-w-[100%] w-full mb-1">
        <ButtonGroup className="">
          <Button variant="outline" className="w-20 dark text-white">
            P1
          </Button>
          <Button variant="outline" className="w-20 dark text-white">
            P2
          </Button>
          <Button variant="outline" className="w-20 dark text-white">
            P3
          </Button>
          <Button variant="outline" className="w-25 dark text-white">
            Qualy
          </Button>
          <Button variant="outline" className="w-25 dark text-white">
            Race
          </Button>
        </ButtonGroup>
      </header>
      <main className="bg-gray-900 mr-10">
        <Button className="items-center">aaa</Button>
      </main>
    </>
  );
}

export default DasboardAccordion;
