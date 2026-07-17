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
import NuevoPiloto from "./pages/admin/NuevoPiloto.tsx";
import MenuAdmin from "./pages/admin/MenuAdmin.tsx";
import NuevaEscuderia from "./pages/admin/NuevaEscuderia.tsx";
import NuevoCircuito from "./pages/admin/NuevoCircuito.tsx";
import DetalleEscuderia from "./pages/escuderias/DetalleEscuderia.tsx";
import NuevaMarca from "./pages/admin/NuevaMarca.tsx";
import NuevaCarrera from "./pages/admin/NuevaCarrera.tsx";
import NuevaTemporada from "./pages/admin/NuevaTemporada.tsx";
import NuevaCategoria from "./pages/admin/NuevaCategoria.tsx";
import ListadoPilotos from "./pages/pilotos/ListadoPilotos.tsx";
import NuevaSesion from "./pages/admin/NuevaSesion.tsx";
import CargarDatosSesion from "./pages/admin/CargarDatosSesion.tsx";
import DetalleCircuito from "./pages/circuitos/DetalleCircuito.tsx";
import DetallePiloto from "./pages/pilotos/DetallePiloto.tsx";
import DetalleTemporada from "./pages/temporada/DetalleTemporada.tsx";
import DetalleMarca from "./pages/marcas/DetalleMarca.tsx";
import Registrarse from "./pages/Registrarse.tsx";
import Login from "./pages/Login.tsx";
import RutaProtegida from "./shared/RutaProtegida.tsx";
import RutaProtegidaAdmin from "./shared/RutaProtegidaAdmin.tsx";
import AdminUsuarios from "./pages/admin/AdminUsuarios.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* Rutas públicas */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="pilotos" element={<ListadoPilotos />} />
        <Route path="escuderias" element={<ListadoEscuderias />} />
        <Route path="marcas" element={<ListadoMarcas />} />
        <Route path="circuitos" element={<ListadoCircuitos />} />
        <Route path="temporadas" element={<ListadoTemporadas />} />
        <Route path="dondever" element={<DondeVer />} />
        <Route path="registrarse" element={<Registrarse />} />
        <Route path="login" element={<Login />} />

        {/* Rutas de detalle */}
        <Route path="escuderia/:id" element={<DetalleEscuderia />} />
        <Route path="circuito/:id" element={<DetalleCircuito />} />
        <Route path="piloto/:id" element={<DetallePiloto />} />
        <Route path="temporada/:id" element={<DetalleTemporada />} />
        <Route path="marca/:id" element={<DetalleMarca />} />

        {/* Rutas de administrador protegidas */}
        <Route
          path="menuadmin"
          element={
            <RutaProtegidaAdmin>
              <MenuAdmin />
            </RutaProtegidaAdmin>
          }
        >
          <Route path="nuevopiloto" element={<NuevoPiloto />} />
          <Route path="nuevaescuderia" element={<NuevaEscuderia />} />
          <Route path="nuevocircuito" element={<NuevoCircuito />} />
          <Route path="nuevamarca" element={<NuevaMarca />} />
          <Route path="nuevacarrera" element={<NuevaCarrera />} />
          <Route path="nuevatemporada" element={<NuevaTemporada />} />
          <Route path="nuevacategoria" element={<NuevaCategoria />} />
          <Route path="nuevasesion" element={<NuevaSesion />} />
          <Route path="cargarsesion" element={<CargarDatosSesion />} />
          <Route path="adminusuarios" element={<AdminUsuarios />} />
        </Route>

        {/* 404 - debe ir al final */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
