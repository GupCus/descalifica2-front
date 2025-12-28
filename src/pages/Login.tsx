import { InputGroup, InputGroupInput } from "@/components/ui/input-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { AuthService } from "@/services/auth.service.ts";
import { useNavigate } from "react-router-dom";
import * as React from "react";

function Login() {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    mail: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setMessageType(null);

    try {
      // Validaciones básicas
      if (!form.mail || !form.password) {
        throw new Error("Email y contraseña son obligatorios.");
      }

      if (form.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres.");
      }

      // Enviar datos al backend
      const response = await AuthService.login({
        mail: form.mail,
        password: form.password,
      });

      setMessageType("success");
      setMessage("¡Sesión iniciada! Redirigiendo...");

      // Guardar token en localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        // Guardar preferencia de remember me
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        // Disparar evento para que RootLayout se actualice
        window.dispatchEvent(new Event("userLoggedIn"));
      }

      // Limpiar formulario
      setForm({
        mail: "",
        password: "",
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      setMessageType("error");
      console.error("Error completo:", err);
      console.error("Respuesta del servidor:", err.response?.data);

      setMessage(
        `Error: ${
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "No se pudo iniciar sesión"
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleSubmit}>
          <InputGroup className="mb-6">
            <InputGroupInput
              placeholder="Email"
              id="mail"
              type="email"
              value={form.mail}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup className="mb-6">
            <InputGroupInput
              placeholder="Contraseña"
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <div className="mb-6 flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-gray-300 cursor-pointer"
            >
              Recuérdame
            </label>
          </div>

          <div className="flex w-full justify-between pt-4 gap-4">
            <Button
              type="button"
              className="flex-1 bg-transparent hover:bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300"
              onClick={() => navigate("/registrarse")}
            >
              Registrarse
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-900/50 border-0"
            >
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </div>

          {message && (
            <p
              className={`mt-4 text-sm text-center font-semibold ${
                messageType === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
