import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "../pages/NotFound";

describe("Pagina NotFound(404)", () => {
  //Compruebo textos y encabezados
  it("debe renderizar el titulo 404 y el mensaje de error", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    //buscamos el encabezado 404 y el texto de error
    const heading = screen.getByRole("heading", { level: 1, name: /404/i });
    const mensaje = screen.getByText(/La página que buscas no existe/i);

    expect(heading).toBeInTheDocument();
    expect(mensaje).toBeInTheDocument();
  });

  it('debe tener un botón para volver al inicio que apunte a la ruta "/"', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    //busco el link por su texto
    const volverLink = screen.getByRole("link", { name: /volver al inicio/i });

    expect(volverLink).toBeInTheDocument();
    expect(volverLink).toHaveAttribute("href", "/");
  });
});
