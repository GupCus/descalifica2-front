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
      <header className="sticky top-0 z-50">
        <NavigationMenu
          viewport={false}
          className="max-w-full w-full justify-start pt-0.5 pb-0.5"
          style={{ background: 'var(--fondodescalifica2)' }}
        >
          <NavigationMenuList className="w-full flex justify-between">
            <NavigationMenuItem>
              <Link to="/">
                <img 
                  src="./src/assets/descalifica2logo.png" 
                  alt="Descalifica2"
                  className="mt-2 mb-2 ml-10 mr-10 h-auto w-32 object-contain hover:scale-105 transition-transform"
                />
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink href="calendario" className="font-semibold">
                Calendario
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem >
              <NavigationMenuTrigger className="font-semibold">
                Wiki
              </NavigationMenuTrigger>
              <NavigationMenuContent className="z-50">
                <NavigationMenuLink href="pilotos">Pilotos</NavigationMenuLink>
                <NavigationMenuLink href="escuderias">
                  Escuderías
                </NavigationMenuLink>
                <NavigationMenuLink href="marcas">
                  Marcas
                </NavigationMenuLink>
                <NavigationMenuLink href="temporadas">
                  Temporadas
                </NavigationMenuLink>
                <NavigationMenuLink href="categorias">
                  Categorias
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>


            <NavigationMenuItem>
              <NavigationMenuLink href="dondever" className="font-semibold">
                ¿Dónde Ver?
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink className="font-semibold opacity-50 cursor-not-allowed pointer-events-none">
                Foro
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem >
              <NavigationMenuLink href="about" className="font-semibold">
                Sobre Nosotros
              </NavigationMenuLink>
            </NavigationMenuItem>


          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p className="text-center bg-background sticky pb-2 pt-2 bottom-0 right-0 left-0 leading-5 ">© 2025 Descalifica2</p>
      </footer>
    </>
  );
}

export default RootLayout;
