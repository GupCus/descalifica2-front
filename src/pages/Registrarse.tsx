import { InputGroup, InputGroupInput } from "@/components/ui/input-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { AuthService } from "@/services/auth.service.ts";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { CalendarIcon, Upload, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDropzone } from "react-dropzone";

// TODO: falta estilizar esta página!!!!

type FormState = {
  name: string;
  email: string;
  password: string;
  username: string;
  date_of_birth: Date | null;
  avatar: File | null;
};

function Registrarse() {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [openBirthDate, setOpenBirthDate] = React.useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    name: "",
    username: "",
    email: "",
    password: "",
    date_of_birth: null,
    avatar: null,
  });

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setForm((s) => ({ ...s, avatar: file }));

      // Crear preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
  });

  const removeAvatar = () => {
    setForm((s) => ({ ...s, avatar: null }));
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("🔵 handleSubmit ejecutado");
    e.preventDefault();
    console.log("🔵 preventDefault ejecutado");

    setSubmitting(true);
    setMessage(null);
    setMessageType(null);

    try {
      console.log("🔵 Form state:", form);

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

      console.log("🔵 Validación completada");

      const birthDateString = form.date_of_birth.toISOString().split("T")[0];
      console.log("🔵 Fecha convertida:", birthDateString);

      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("username", form.username);
      formData.append("date_of_birth", birthDateString);
      formData.append("name", form.name);
      if (form.avatar) {
        formData.append("avatar", form.avatar);
      }

      console.log("🔵 FormData creado, enviando...");

      // Enviar datos al backend
      const response = await AuthService.RegisterUser(formData);

      console.log("🔵 Respuesta:", response);

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
        avatar: null,
      });
      removeAvatar();

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
          <div className="mb-10">
            {!form.avatar ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-400">
                  {isDragActive
                    ? "Suelta la imagen aquí..."
                    : "Arrastra tu avatar o haz clic para seleccionar"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, GIF hasta 5MB
                </p>
              </div>
            ) : (
              <div className="relative border-2 border-gray-700 rounded-lg p-4 bg-gray-800/50">
                <div className="flex items-center gap-4">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-300">
                      {form.avatar.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(form.avatar.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAvatar}
                    className="hover:bg-red-500/10 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
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
