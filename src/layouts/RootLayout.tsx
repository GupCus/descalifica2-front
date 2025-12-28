import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoDescalifica2 from "../assets/descalifica2logo.png";
import { AuthService } from "@/services/auth.service.ts";

function RootLayout() {
  const [user, setUser] = useState<{
    username: string;
    user_type: string;
  } | null>(null);

  const loadUser = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        setUser(JSON.parse(userString));
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Leer usuario del localStorage al montar el componente
    loadUser();

    // Listener para evento de login
    window.addEventListener("userLoggedIn", loadUser);

    // Listener para detectar cambios en el localStorage (logout desde otra pestaña)
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userLoggedIn", loadUser);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
    window.dispatchEvent(new Event("userLoggedOut"));
  };

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
                    src={logoDescalifica2}
                    alt="Descalifica2"
                    className="mt-2 mb-2 ml-6 h-auto w-32 object-cover [overflow-clip-margin:unset] hover:scale-102 transition-transform"
                  />
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/calendario"
                  className="font-semibold"
                >
                  Calendario
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">
                  Wiki
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-50">
                  <NavigationMenuLink href="/pilotos">
                    Pilotos
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/escuderias">
                    Escuderías
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/circuitos">
                    Circuitos
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/marcas">Marcas</NavigationMenuLink>
                  <NavigationMenuLink href="/temporadas">
                    Temporadas
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/dondever" className="font-semibold">
                  ¿Dónde Ver?
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="font-semibold opacity-50 cursor-not-allowed pointer-events-none">
                  Foro
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/about" className="font-semibold">
                  Sobre Nosotros
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-3 mr-6">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-200">
                  {user.username}
                </span>
                <Link to="/menuadmin">
                  <Avatar className="rounded-3xl border cursor-pointer hover:ring-2 hover:ring-accent transition-all">
                    <AvatarFallback>
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded-lg transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login">
                <span className="text-sm font-semibold hover:text-gray-300 transition-colors">
                  LOGIN
                </span>
              </Link>
            )}
          </div>

          {/* TODO: implementacion de avatares y su respectivo guardado con MULTER al backend. */}
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
