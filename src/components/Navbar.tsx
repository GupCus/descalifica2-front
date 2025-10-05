import Pilotos from "@/pages/Pilotos.tsx";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <NavigationMenu orientation="horizontal">
        <NavigationMenuList>
          <NavigationMenuItem>Descalifica2</NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Wiki</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink asChild>
                <Link to="pilotos">Pilotos</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>Escuderías</NavigationMenuLink>
              <NavigationMenuLink asChild>Marcas</NavigationMenuLink>
              <NavigationMenuLink asChild>Temporadas</NavigationMenuLink>
              <NavigationMenuLink asChild>Categorias</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink>Noticias</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default Navbar;
