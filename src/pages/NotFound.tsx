import { Link } from "react-router-dom";
import FotoVerstappen from "../assets/verstappen-patada-baku.jpg";
function NotFound() {
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${FotoVerstappen})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px)",
        }}
      />
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen pt-20 pb-20 px-4">
        <h1 className="text-20xl md:text-9xl font-bold text-white drop-shadow-2xl mb-4 text-center">
          404
        </h1>
        <p className="text-lg text-white/90 drop-shadow-md mb-8 text-center max-w-md font-bold">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link
          to="/"
          className="bg-white/20 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
