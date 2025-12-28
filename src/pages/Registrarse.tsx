import { InputGroup, InputGroupInput } from "@/components/ui/input-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { AuthService } from "@/services/auth.service.ts";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// TODO: falta estilizar esta página!!!!

type FormState = {
  name: string;
  email: string;
  password: string;
  username: string;
  date_of_birth: Date | null;
};

function Registrarse() {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [openBirthDate, setOpenBirthDate] = React.useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    name: "",
    username: "",
    email: "",
    password: "",
    date_of_birth: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setMessageType(null);

    try {
      // Validaciones básicas
      if (
        !form.email ||
        !form.password ||
        !form.name ||
        !form.username ||
        !form.date_of_birth
      ) {
        throw new Error("Todos los campos son obligatorios.");
      }

      if (form.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres.");
      }

      // Formatear la fecha a string (YYYY-MM-DD)
      const birthDateString = form.date_of_birth.toISOString().split("T")[0];

      // Enviar datos al backend
      const response = await AuthService.RegisterUser({
        email: form.email,
        password: form.password,
        username: form.username,
        date_of_birth: birthDateString,
        name: form.name,
      });

      setMessageType("success");
      setMessage(
        response?.message || "¡Usuario creado con éxito! Redirigiendo..."
      );

      // Limpiar formulario
      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        date_of_birth: null,
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
          "No se pudo crear el usuario"
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <InputGroup className="mb-10">
            <InputGroupInput
              placeholder="Email"
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup className="mb-10">
            <InputGroupInput
              placeholder="Usuario"
              id="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup className="mb-10">
            <InputGroupInput
              placeholder="Nombre"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup className="mb-10">
            <InputGroupInput
              placeholder="Contraseña"
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <div className="mb-10">
            <Popover open={openBirthDate} onOpenChange={setOpenBirthDate}>
              <PopoverTrigger>
                {/* dejar sin aschild porque sino no renderiza el calendario */}
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                  type="button"
                >
                  {form.date_of_birth
                    ? form.date_of_birth.toLocaleDateString()
                    : "Fecha de nacimiento"}
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0 border-none"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={form.date_of_birth ?? undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    if (date)
                      setForm((prev) => ({ ...prev, date_of_birth: date }));
                    setOpenBirthDate(false);
                  }}
                  fromYear={1930}
                  toYear={new Date().getFullYear()}
                  defaultMonth={new Date(2000, 0)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex w-full justify-between pt-4">
            <Button
              type="button"
              className="bg-transparent hover:bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-900/50 border-0"
            >
              {submitting ? "Enviando..." : "Crear nuevo usuario"}
            </Button>
          </div>

          {message && (
            <p
              className={`mt-2 text-sm text-center font-semibold ${
                messageType === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </>
  );
}

export default Registrarse;
