import { InputGroup, InputGroupInput } from "@/components/ui/input-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { NewUsuario } from "@/entities/usuario.entity.ts";
import { postUsuario } from "@/services/usuario.service.ts";

type FormState = {
  name: string;
  email: string;
  password: string;
  //username: string;
};

function Registrarse() {
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    //username: "",
    email: "",
    password: "",
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

    const nuevoUsuario: NewUsuario = {
      email: form.email,
      password: form.password,
      name: form.name,
      //username: form.username,
    };

    console.log("Datos a enviar:", nuevoUsuario);

    postUsuario(nuevoUsuario)
      .then(() => setMessage("Usuario creado con éxito."))
      /*.then(() =>
        setForm({
          email: "",
          password: "",
        })
      ) */
      .catch((err) => {
        console.error("Error completo:", err);
        console.error("Respuesta del servidor:", err.response?.data);
        setMessage(
          `Error: ${
            err.response?.data?.error ||
            err.message ||
            "No se pudo crear el usuario"
          }`
        );
      })
      .finally(() => setSubmitting(false));
  };
  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <InputGroup className="mb-10">
            <InputGroupInput
              placeholder="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
            ></InputGroupInput>
          </InputGroup>
          <InputGroup className="mb-10">
            <InputGroupInput
              placeholder="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
            ></InputGroupInput>
          </InputGroup>
          <InputGroup className="mb-10">
            <InputGroupInput
              placeholder="Nombre"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
            ></InputGroupInput>
          </InputGroup>
          {/*
          <InputGroup className="mb-10">
            <InputGroupInput
              placeholder="username"
              id="username"
              value={form.username}
              onChange={handleChange}
              required
            ></InputGroupInput>
          </InputGroup> */}

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
            <p className="mt-2 text-sm text-center font-semibold text-gray-300">
              {message}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
export default Registrarse;
