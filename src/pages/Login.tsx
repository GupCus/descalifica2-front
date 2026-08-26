import { InputGroup, InputGroupInput } from "@/components/ui/input-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { AuthService } from "@/services/auth.service.ts";
import { useNavigate, Link } from "react-router-dom";
import * as React from "react";
import fondoLogin from "../assets/grilla-cola-2021.jpg";

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

      // Guardar token en localStorage / sessionStorage
      if (response.token) {
        AuthService.saveToken(response.token, rememberMe);

        // Disparar evento para que RootLayout se actualice
        window.dispatchEvent(new Event("userLoggedIn"));
      }

      // Limpiar formulario
      setForm({
        mail: "",
        password: "",
      });

      // Redirigir después de 1 segundo
      setTimeout(() => {
        navigate("/");
      }, 1000);
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
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4">
      {/* Imagen de fondo con blur y overlay */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoLogin})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.35)",
        }}
      />

      {/* Tarjeta de login */}
      <div className="relative z-10 w-full max-w-md p-8 bg-gray-950/75 backdrop-blur-md rounded-2xl border border-gray-700/60 shadow-2xl">
        <h1
          className="text-gray-200 mb-6 text-3xl font-bold tracking-wider text-center uppercase"
          style={{
            fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
            letterSpacing: "0.1em",
          }}
        >
          Iniciar Sesión
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="mail"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
            >
              Correo Electrónico
            </label>
            <InputGroup>
              <InputGroupInput
                placeholder="correo@ejemplo.com"
                id="mail"
                type="email"
                value={form.mail}
                onChange={handleChange}
                className="placeholder:text-gray-500/50"
                required
              />
            </InputGroup>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
            >
              Contraseña
            </label>
            <InputGroup>
              <InputGroupInput
                placeholder="••••••••"
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="placeholder:text-gray-500/50"
                required
              />
            </InputGroup>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="w-4 h-4 cursor-pointer accent-blue-600 rounded"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-gray-300 cursor-pointer select-none"
            >
              Recuérdame
            </label>
          </div>

          <div className="flex w-full justify-between pt-4 gap-4">
            <Button
              type="button"
              className="flex-1 bg-gray-800/80 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:text-white cursor-pointer"
              onClick={() => navigate("/registrarse")}
            >
              Registrarse
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-900/50 border-0 cursor-pointer"
            >
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </div>

          {message && (
            <p
              className={`mt-4 text-sm text-center font-semibold pt-1 ${
                messageType === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <div className="mt-6 text-center border-t border-gray-800/80 pt-4">
          <Link
            to="/"
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
