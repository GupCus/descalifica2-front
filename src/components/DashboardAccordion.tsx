/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";

function DashboardAccordion() {
  return (
    <>
      <header className="max-w-[100%] w-full mb-1">
        <ButtonGroup className="">
          <Button variant="outline" className="w-20 dark text-foreground">
            P1
          </Button>
          <Button variant="outline" className="w-20 dark text-foreground">
            P2
          </Button>
          <Button variant="outline" className="w-20 dark text-foreground">
            P3
          </Button>
          <Button variant="outline" className="w-25 dark text-foreground">
            Qualy
          </Button>
          <Button variant="outline" className="w-25 dark text-foreground">
            Race
          </Button>
        </ButtonGroup>
      </header>
      <main className="bg-secondary mr-10">
        <Button className="items-center">aaa</Button>
      </main>
    </>
  );
}

export default DashboardAccordion;
