import { render, screen } from "@testing-library/react";

describe("Ejemplo de Test con React Testing Library", () => {
  it("renderiza un elemento correctamente", () => {
    render(<button>Hola Mundo</button>);
    const button = screen.getByRole("button", { name: /hola mundo/i });
    expect(button).toBeInTheDocument();
  });
});
