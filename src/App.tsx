import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ListadoEscuderias from "./pages/escuderias/ListadoEscuderias.tsx";
import ListadoMarcas from "./pages/marcas/ListadoMarcas.tsx";
import ListadoCircuitos from "./pages/circuitos/ListadoCircuitos.tsx";
import ListadoTemporadas from "./pages/temporada/ListadoTemporadas.tsx";
import DondeVer from "./pages/DondeVer.tsx";
import Calendario from "./pages/Calendario.tsx";
import NuevoPiloto from "./pages/pilotos/NuevoPiloto.tsx";
import MenuAdmin from "./pages/MenuAdmin.tsx";
import NuevaEscuderia from "./pages/escuderias/NuevaEscuderia.tsx";
import NuevoCircuito from "./pages/circuitos/NuevoCircuito.tsx";
import DetalleEscuderia from "./pages/escuderias/DetalleEscuderia.tsx";
import NuevaMarca from "./pages/marcas/NuevaMarca.tsx";
import NuevaCarrera from "./pages/carreras/NuevaCarrera.tsx";
import NuevaTemporada from "./pages/temporada/NuevaTemporada.tsx";
import NuevaCategoria from "./pages/categorias/NuevaCategoria.tsx";
import ListadoPilotos from "./pages/pilotos/ListadoPilotos.tsx";
import NuevaSesion from "./pages/sesion/NuevaSesion.tsx";
import CargarDatosSesion from "./pages/sesion/CargarDatosSesion.tsx";
import DetalleCircuito from "./pages/circuitos/DetalleCircuito.tsx";
import DetallePiloto from "./pages/pilotos/DetallePiloto.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="*" element={<NotFound />} />
        <Route path="pilotos" element={<ListadoPilotos />} />
        <Route path="escuderias" element={<ListadoEscuderias />} />
        <Route path="marcas" element={<ListadoMarcas />} />
        <Route path="circuitos" element={<ListadoCircuitos />} />
        <Route path="temporadas" element={<ListadoTemporadas />} />
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
        <Route path="menuadmin/cargarsesion" element={<CargarDatosSesion />} />
        <Route path="/escuderia/:id" element={<DetalleEscuderia />} />
        <Route path="/circuito/:id" element={<DetalleCircuito />} />
        <Route path="/piloto/:id" element={<DetallePiloto />} />
      </Route>
    </Routes>
  );
}

export default App;
