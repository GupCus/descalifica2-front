import { Outlet, Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function RootLayout() {
  return (
    <>
      <header className="sticky top-0 z-50">
        <div
          className="flex justify-between items-center w-full pt-0.5 pb-0.5 px-4"
          style={{ background: "var(--fondodescalifica2)" }}
        >
          {/* NavigationMenu con menús */}
          <NavigationMenu viewport={false} className="flex-1">
            <NavigationMenuList className="flex items-center gap-4">
              <NavigationMenuItem>
                <Link to="/">
                  <img
                    src="./src/assets/descalifica2logo.png"
                    alt="Descalifica2"
                    className="mt-2 mb-2 ml-6 h-auto w-32 object-contain hover:scale-105 transition-transform"
                  />
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="calendario" className="font-semibold">
                  Calendario
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">
                  Wiki
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-50">
                  <NavigationMenuLink href="pilotos">
                    Pilotos
                  </NavigationMenuLink>
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

              <NavigationMenuItem>
                <NavigationMenuLink href="about" className="font-semibold">
                  Sobre Nosotros
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Avatar className="rounded-3xl border cursor-pointer hover:ring-2 hover:ring-accent transition-all mr-6">
            <AvatarImage src="https://a.espncdn.com/combiner/i?img=/i/headshots/rpm/players/full/5498.png&w=350&h=254" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p className="text-center bg-background sticky pb-2 pt-2 bottom-0 right-0 left-0 leading-5">
          © 2025 Descalifica2
        </p>
      </footer>
    </>
  );
}

export default RootLayout;
