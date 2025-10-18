import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Pilotos from "./pages/pilotos/Pilotos.tsx";
import ListadoEscuderias from "./pages/escuderias/ListadoEscuderias.tsx";
import Marcas from "./pages/marcas/Marcas.tsx";
import Circuitos from "./pages/circuitos/Circuitos.tsx";
import Categorias from "./pages/categorias/Categorias.tsx";
import Temporadas from "./pages/temporada/Temporadas.tsx";
import DondeVer from "./pages/DondeVer.tsx";
import Calendario from "./pages/Calendario.tsx";
import NuevoPiloto from "./pages/pilotos/NuevoPiloto.tsx";
import MenuAdmin from "./pages/MenuAdmin.tsx";
import NuevaEscuderia from "./pages/escuderias/NuevaEscuderia.tsx";
import NuevoCircuito from "./pages/circuitos/NuevoCircuito.tsx";
import GetEscuderia from "./pages/escuderias/GetEscuderia.tsx";
import NuevaMarca from "./pages/marcas/NuevaMarca.tsx";
import NuevaCarrera from "./pages/carrera/NuevaCarrera.tsx";
import NuevaTemporada from "./pages/temporada/NuevaTemporada.tsx";
import NuevaCategoria from "./pages/categorias/NuevaCategoria.tsx";
import NuevaSesion from "./pages/sesion/NuevaSesion.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="*" element={<NotFound />} />
        <Route path="pilotos" element={<Pilotos />} />
        <Route path="escuderias" element={<ListadoEscuderias />} />
        <Route path="marcas" element={<Marcas />} />
        <Route path="circuitos" element={<Circuitos />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="temporadas" element={<Temporadas />} />
        <Route path="dondever" element={<DondeVer />} />
        <Route path="menuadmin" element={<MenuAdmin />} />
        <Route path="menuadmin/nuevopiloto" element={<NuevoPiloto />} />
        <Route path="menuadmin/nuevaescuderia" element={<NuevaEscuderia />} />
        <Route path="menuadmin/nuevocircuito" element={<NuevoCircuito />} />
        <Route path="menuadmin/nuevamarca" element={<NuevaMarca />} />
        <Route path="menuadmin/nuevacarrera" element={<NuevaCarrera />} />
        <Route path="menuadmin/nuevatemporada" element={<NuevaTemporada />} />
        <Route path="menuadmin/nuevacategoria" element={<NuevaCategoria />} />
        <Route path="menuadmin/nuevasesion" element={<NuevaSesion />} />
      </Route>
    </Routes>
  );
}

export default App;
