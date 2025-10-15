import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Pilotos from "./pages/Pilotos.tsx";
import Escuderias from "./pages/Escuderias.tsx";
import Marcas from "./pages/Marcas.tsx";
import Circuitos from "./pages/Circuitos.tsx";
import Categorias from "./pages/Categorias.tsx";
import Temporadas from "./pages/Temporadas.tsx";
import DondeVer from "./pages/DondeVer.tsx";
import Calendario from "./pages/Calendario.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="*" element={<NotFound />} />
        <Route path="pilotos" element={<Pilotos />} />
        <Route path="escuderias" element={<Escuderias />} />
        <Route path="marcas" element={<Marcas />} />
        <Route path="circuitos" element={<Circuitos />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="temporadas" element={<Temporadas />} />
        <Route path="dondever" element={<DondeVer />} />
      </Route>
    </Routes>
  );
}

export default App;
