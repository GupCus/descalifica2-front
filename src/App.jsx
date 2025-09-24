
//RECORDAR HACER pnpm install PARA INSTALAR TODOS LOS MODULOS
// estamos siguiendo: https://urianviera.com/reactjs/react-router-dom-guia

import { Routes, Route } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Pilotos from './pages/Pilotos'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="pilotos" element={<Pilotos />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
