import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import RutaProtegida from "./shared/RutaProtegida.tsx";
import RutaProtegidaAdmin from "./shared/RutaProtegidaAdmin.tsx";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ListadoEscuderias = lazy(() => import("./pages/escuderias/ListadoEscuderias.tsx"));
const ListadoMarcas = lazy(() => import("./pages/marcas/ListadoMarcas.tsx"));
const ListadoCircuitos = lazy(() => import("./pages/circuitos/ListadoCircuitos.tsx"));
const ListadoTemporadas = lazy(() => import("./pages/temporada/ListadoTemporadas.tsx"));
const DondeVer = lazy(() => import("./pages/DondeVer.tsx"));
const Calendario = lazy(() => import("./pages/Calendario.tsx"));
const NuevoPiloto = lazy(() => import("./pages/admin/NuevoPiloto.tsx"));
const MenuAdmin = lazy(() => import("./pages/admin/MenuAdmin.tsx"));
const NuevaEscuderia = lazy(() => import("./pages/admin/NuevaEscuderia.tsx"));
const NuevoCircuito = lazy(() => import("./pages/admin/NuevoCircuito.tsx"));
const DetalleEscuderia = lazy(() => import("./pages/escuderias/DetalleEscuderia.tsx"));
const NuevaMarca = lazy(() => import("./pages/admin/NuevaMarca.tsx"));
const NuevaCarrera = lazy(() => import("./pages/admin/NuevaCarrera.tsx"));
const NuevaTemporada = lazy(() => import("./pages/admin/NuevaTemporada.tsx"));
const NuevaCategoria = lazy(() => import("./pages/admin/NuevaCategoria.tsx"));
const ListadoPilotos = lazy(() => import("./pages/pilotos/ListadoPilotos.tsx"));
const NuevaSesion = lazy(() => import("./pages/admin/NuevaSesion.tsx"));
const CargarDatosSesion = lazy(() => import("./pages/admin/CargarDatosSesion.tsx"));
const DetalleCircuito = lazy(() => import("./pages/circuitos/DetalleCircuito.tsx"));
const DetallePiloto = lazy(() => import("./pages/pilotos/DetallePiloto.tsx"));
const DetalleTemporada = lazy(() => import("./pages/temporada/DetalleTemporada.tsx"));
const DetalleMarca = lazy(() => import("./pages/marcas/DetalleMarca.tsx"));
const Registrarse = lazy(() => import("./pages/Registrarse.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const AdminUsuarios = lazy(() => import("./pages/admin/AdminUsuarios.tsx"));
const Perfil = lazy(() => import("./pages/Perfil.tsx"));

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
          path="perfil"
          element={
            <RutaProtegida>
              <Perfil />
            </RutaProtegida>
          }
        />

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
