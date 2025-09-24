
//RECORDAR HACER pnpm install PARA INSTALAR TODOS LOS MODULOS
// estamos siguiendo: https://urianviera.com/reactjs/react-router-dom-guia

import { Routes, Route, BrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Pilotos from './pages/Pilotos'
import Prueba from './pages/Prueba'
import Login from './pages/Login'
import { AuthProvider } from './contexts/auth.jsx'

function App() {
  return (
  <AuthProvider>
   <div className="App">
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="pilotos" element={<Pilotos />} />
        <Route path="prueba" element={<Prueba />} />
        <Route path="*" element={<NotFound />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
    </div>
    </AuthProvider> 
  )
}

export default App
