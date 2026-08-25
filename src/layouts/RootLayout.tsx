import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLocation } from "react-router-dom";
import { Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logoDescalifica2 from "../assets/descalifica2logo.png";
import { AuthService } from "@/services/auth.service.ts";
import HeaderSearch from "@/components/HeaderSearch";

function RootLayout() {
  const location = useLocation();
  const [user, setUser] = useState<{
    username: string;
    user_type: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    const handleLoginEvent = () => {
      loadUser();
    };

    window.addEventListener("userLoggedIn", handleLoginEvent);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        setUser(null);
      } else if (e.key === "token" && e.newValue) {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userLoggedIn", handleLoginEvent);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50">
        <div 
          className="flex justify-between items-center relative w-full py-2 md:pt-0.5 md:pb-0.5 px-4"
          style={{ background: "var(--fondodescalifica2)" }}
        >
          
          {/* MÓVIL: Menú Hamburguesa */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-white p-2">
                  <Menu size={28} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-black/60 backdrop-blur-xl border-gray-800 text-white w-64">
                <div className="flex flex-col gap-6 mt-8">
                  <Link to="/" className="text-xl font-bold">Inicio</Link>
                  <Link to="/calendario" className="text-xl font-semibold">Calendario</Link>
                  <div className="flex flex-col gap-3">
                    <span className="text-xl font-semibold opacity-50">Wiki</span>
                    <Link to="/pilotos" className="ml-4 text-lg">Pilotos</Link>
                    <Link to="/escuderias" className="ml-4 text-lg">Escuderías</Link>
                    <Link to="/circuitos" className="ml-4 text-lg">Circuitos</Link>
                    <Link to="/marcas" className="ml-4 text-lg">Marcas</Link>
                    <Link to="/temporadas" className="ml-4 text-lg">Temporadas</Link>
                  </div>
                  <Link to="/dondever" className="text-xl font-semibold">¿Dónde Ver?</Link>
                  <span className="text-xl font-semibold opacity-50 cursor-not-allowed">Foro</span>
                  <Link to="/about" className="text-xl font-semibold">Sobre Nosotros</Link>
                </div>
              </SheetContent>
            </Sheet>

          </div>

          {/* MÓVIL: Logo Centrado */}
          <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/">
              <img src={logoDescalifica2} alt="Descalifica2" className="h-10 w-auto object-cover" />
            </Link>
          </div>

          {/* ESCRITORIO: NavigationMenu Original */}
          <NavigationMenu viewport={false} className="hidden md:flex flex-1">
            <NavigationMenuList className="flex items-center gap-4">
              <NavigationMenuItem>
                <Link to="/">
                  <img
                    src={logoDescalifica2}
                    alt="Descalifica2"
                    className="my-2 ml-6 h-auto w-32 object-cover [overflow-clip-margin:unset] hover:scale-102 transition-transform"
                  />
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/calendario" className="font-semibold">
                  Calendario
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">
                  Wiki
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-50">
                  <NavigationMenuLink href="/pilotos">Pilotos</NavigationMenuLink>
                  <NavigationMenuLink href="/escuderias">Escuderías</NavigationMenuLink>
                  <NavigationMenuLink href="/circuitos">Circuitos</NavigationMenuLink>
                  <NavigationMenuLink href="/marcas">Marcas</NavigationMenuLink>
                  <NavigationMenuLink href="/temporadas">Temporadas</NavigationMenuLink>
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

          <HeaderSearch />

          {/* Login / Usuario (Visible en ambos) */}
          <div className="flex items-center gap-3 md:mr-6">
            {loading ? (
              <div className="text-sm text-gray-400">Cargando...</div>
            ) : user ? (
              <>
                <Link to="/perfil" className="text-sm font-medium text-gray-200 hover:text-white transition-colors">
                  {user.username}
                </Link>
                <Link to="/menuadmin">
                  <Avatar className="rounded-3xl border cursor-pointer hover:ring-2 hover:ring-accent transition-all">
                    <AvatarFallback>{user.username}</AvatarFallback>
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
        </div>
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<div className="flex h-[calc(100vh-200px)] items-center justify-center text-xl font-semibold">Cargando...</div>}>
              <Outlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
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
