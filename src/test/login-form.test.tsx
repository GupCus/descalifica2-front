import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LoginForm } from "../components/login-form";
import { AuthService } from "../services/auth.service";

//Mockeo el botón de Google para no necesitar las credenciales de Google en los tests
vi.mock("../components/botongoogle", () => ({
  BotonGoogle: () => <div>Google Login Mock</div>,
}));

describe("Formulario de Login", () => {
  // Prueba de renderizado de campos.

  it("debería renderizar los campos de email, contraseña y el botón de submit", () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i }),
    ).toBeInTheDocument();
  });

  // Prueba de validadación de contraseña (<6 caracteres)
  it("debería mostrar un mensaje de error si la contraseña tiene menos de 6 caracteres", async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    // Simulo la entrada de datos en los campos
    await userEvent.type(emailInput, "descalifica@test.com");
    await userEvent.type(passwordInput, "123");
    await userEvent.click(submitButton);

    // Verifico que se muestre el mensaje de error
    expect(
      await screen.findByText(
        /la contraseña debe tener al menos 6 caracteres/i,
      ),
    ).toBeInTheDocument();
  });

  // Prueba de envió de formulario con datos válidos
  it("debería llamar a AuthService.login con los datos correctos al enviar el formulario", async () => {
    // Mockeo la función login de AuthService
    const loginMock = vi.spyOn(AuthService, "login").mockResolvedValue({
      token: "fake-jwt-token",
      user: { id: 1, username: "Test User", user_type: "cliente" },
    });
    vi.spyOn(AuthService, "saveToken").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    // Simulo la entrada de datos válidos
    await userEvent.type(emailInput, "descalifica@test.com");
    await userEvent.type(passwordInput, "123456");
    await userEvent.click(submitButton);

    //Compuebo que la función login fue llamada con los datos correctos
    expect(loginMock).toHaveBeenCalledWith({
      mail: "descalifica@test.com",
      password: "123456",
    });
  });
});
