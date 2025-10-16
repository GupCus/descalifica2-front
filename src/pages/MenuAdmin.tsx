import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

function MenuAdmin() {
  return (
    <div className="flex justify-center items-center flex-col mb-20">
      <h1 className="font-extrabold text-5xl mt-20">MENÚ ADMIN</h1>
      <div className="col mx-20 mt-20 mb-10">
        <Link to="nuevopiloto" className="mx-5">
          <Button>Nuevo PILOTO</Button>
        </Link>
        <Link to="nuevocircuito" className="mx-5">
          <Button>Nuevo CIRCUITO</Button>
        </Link>
        <Link to="nuevaescuderia" className="mx-5">
          <Button>Nueva ESCUDERIA</Button>
        </Link>
        <Link to="nuevacarrera" className="mx-5">
          <Button>Nueva CARRERA</Button>
        </Link>
      </div>
      <div>
        <Link to="nuevasesion" className="mx-5">
          <Button>Nueva SESION</Button>
        </Link>
        <Link to="nuevamarca" className="mx-5">
          <Button>Nueva MARCA</Button>
        </Link>
        <Link to="nuevacategoria" className="mx-5">
          <Button>Nueva CATEGORIA</Button>
        </Link>
        <Link to="nuevatemporada" className="mx-5">
          <Button>Nueva TEMPORADA</Button>
        </Link>
      </div>
    </div>
  );
}

export default MenuAdmin;
