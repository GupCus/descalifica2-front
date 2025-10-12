import { Outlet, Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

/* Los classname, como "mx-4" (agrega margenes de distancia 4 de ambos lados, sino es ml para izquierda o mr para derecha), vienen de tailwind, instalar extensión "Tailwind CSS Intellisense" */
function RootLayout() {
  return (
    <>
      <header>
        <NavigationMenu
          viewport={false}
          className="bg-primary max-w-full w-full justify-start pt-1 pb-1"
        >
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className="mx-4 font-extrabold">
                Descalifica2
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="dark">
              <NavigationMenuTrigger className="font-semibold bg-accent">
                Wiki
              </NavigationMenuTrigger>
              <NavigationMenuContent className="z-50">
                <NavigationMenuLink href="pilotos">Pilotos</NavigationMenuLink>
                <NavigationMenuLink href="escuderias">
                  Escuderías
                </NavigationMenuLink>
                <NavigationMenuLink href="marcas">Marcas</NavigationMenuLink>
                <NavigationMenuLink href="temporadas">
                  Temporadas
                </NavigationMenuLink>
                <NavigationMenuLink href="categorias">
                  Categorias
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem className="dark">
              <NavigationMenuLink className="font-semibold">
                Noticias
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="dark">
              <NavigationMenuLink href="dondever" className="font-semibold">
                ¿Dónde Ver?
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="dark">
              <NavigationMenuLink className="font-semibold">
                Foro
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="dark">
              <NavigationMenuLink className="font-semibold">
                Calendario
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p className="text-center leading-7 mt-6">© 2025 Descalifica2</p>
      </footer>
    </>
  );
}

export default RootLayout;
