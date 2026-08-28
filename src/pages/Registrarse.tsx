import { InputGroup, InputGroupInput } from "@/components/ui/input-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState, useRef, useEffect, useCallback } from "react";
import { AuthService } from "@/services/auth.service.ts";
import { useNavigate, Link } from "react-router-dom";
import * as React from "react";
import {
  CalendarIcon,
  Upload,
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Flag,
  MapPin,
  FileText,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { getPiloto } from "@/services/piloto.service";
import { getEscuderia } from "@/services/escuderia.service";
import { getCircuito } from "@/services/circuito.service";
import fondoRegistro from "../assets/Monaco-Fondo.webp";

type FormState = {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  telegram_username: string;
  date_of_birth: Date | null;
  fav_driver: string;
  fav_team: string;
  fav_circuit: string;
  bio: string;
  avatar: File | null;
};

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const WEEKDAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

function getUniqueNames(items: { name?: string }[]): string[] {
  const map = new Map<string, string>();
  items.forEach((item) => {
    const trimmed = item.name?.trim();
    if (trimmed) {
      const normalized = trimmed.toLowerCase();
      if (!map.has(normalized)) {
        map.set(normalized, trimmed);
      }
    }
  });
  return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
}

function Registrarse() {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [openBirthDate, setOpenBirthDate] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  // Datalists para sugerencias
  const [pilotosList, setPilotosList] = useState<string[]>([]);
  const [escuderiasList, setEscuderiasList] = useState<string[]>([]);
  const [circuitosList, setCircuitosList] = useState<string[]>([]);

  const [form, setForm] = useState<FormState>({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    telegram_username: "",
    date_of_birth: null,
    fav_driver: "",
    fav_team: "",
    fav_circuit: "",
    bio: "",
    avatar: null,
  });

  // Estado interno para la navegación en el calendario
  const currentYear = new Date().getFullYear();
  const [viewYear, setViewYear] = useState<number>(2000);
  const [viewMonth, setViewMonth] = useState<number>(0);

  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPiloto()
      .then((res) => setPilotosList(getUniqueNames(res)))
      .catch(() => {});
    getEscuderia()
      .then((res) => setEscuderiasList(getUniqueNames(res)))
      .catch(() => {});
    getCircuito()
      .then((res) => setCircuitosList(getUniqueNames(res)))
      .catch(() => {});
  }, []);

  // Cerrar picker al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setOpenBirthDate(false);
      }
    };
    if (openBirthDate) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openBirthDate]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
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

  const handleSelectDay = (day: number) => {
    const selectedDate = new Date(Date.UTC(viewYear, viewMonth, day));
    setForm((prev) => ({ ...prev, date_of_birth: selectedDate }));
    setOpenBirthDate(false);
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      if (viewYear < currentYear) {
        setViewMonth(0);
        setViewYear((y) => y + 1);
      }
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setMessage(null);
    setMessageType(null);

    try {
      if (
        !form.email ||
        !form.password ||
        !form.confirmPassword ||
        !form.name ||
        !form.username ||
        !form.date_of_birth
      ) {
        throw new Error("Todos los campos obligatorios deben ser completados.");
      }

      if (form.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres.");
      }

      if (form.password !== form.confirmPassword) {
        throw new Error("Las contraseñas no coinciden.");
      }

      const birthDateString = `${form.date_of_birth.getUTCFullYear()}-${String(
        form.date_of_birth.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(form.date_of_birth.getUTCDate()).padStart(
        2,
        "0"
      )}`;

      const formData = new FormData();
      formData.append("email", form.email.trim());
      formData.append("password", form.password);
      formData.append("username", form.username.trim());
      formData.append("date_of_birth", birthDateString);
      formData.append("name", form.name.trim());
      if (form.surname.trim()) {
        formData.append("surname", form.surname.trim());
      }
      const trimmedTelegram = form.telegram_username.trim().replace(/^@/, "");
      if (trimmedTelegram.length > 0) {
        if (/\s/.test(trimmedTelegram)) {
          throw new Error("El usuario de Telegram no debe contener espacios.");
        }
        formData.append("telegram_username", trimmedTelegram);
      }
      if (form.fav_driver.trim()) {
        formData.append("fav_driver", form.fav_driver.trim());
      }
      if (form.fav_team.trim()) {
        formData.append("fav_team", form.fav_team.trim());
      }
      if (form.fav_circuit.trim()) {
        formData.append("fav_circuit", form.fav_circuit.trim());
      }
      if (form.bio.trim()) {
        formData.append("bio", form.bio.trim());
      }
      if (form.avatar) {
        formData.append("avatar", form.avatar);
      }

      // Enviar datos al backend
      const response = await AuthService.RegisterUser(formData);

      setMessageType("success");
      setMessage(
        response?.message || "¡Usuario creado con éxito! Redirigiendo al login..."
      );

      // Limpiar formulario
      setForm({
        name: "",
        surname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        telegram_username: "",
        date_of_birth: null,
        fav_driver: "",
        fav_team: "",
        fav_circuit: "",
        bio: "",
        avatar: null,
      });
      removeAvatar();

      // Redirigir después de 2 segundos al login
      setTimeout(() => {
        navigate("/login");
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

  // Cálculo de días del mes para el calendario
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Lunes = 0

  const yearsOptions = Array.from(
    { length: currentYear - 1920 + 1 },
    (_, i) => currentYear - i
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4">
      {/* Datalists para sugerencias */}
      <datalist id="pilotos-reg-list">
        {pilotosList.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
      <datalist id="escuderias-reg-list">
        {escuderiasList.map((e) => (
          <option key={e} value={e} />
        ))}
      </datalist>
      <datalist id="circuitos-reg-list">
        {circuitosList.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      {/* Imagen de fondo con blur y oscurecimiento */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoRegistro})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.35)",
        }}
      />

      {/* Tarjeta de Registro */}
      <div className="relative z-10 w-full max-w-xl p-8 md:p-10 bg-gray-950/80 backdrop-blur-md rounded-2xl border border-gray-700/60 shadow-2xl my-6">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Ir al login
          </Link>
        </div>

        <h1
          className="text-gray-200 text-3xl font-bold tracking-wider text-center uppercase"
          style={{
            fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
            letterSpacing: "0.1em",
          }}
        >
          Crear Cuenta
        </h1>
        <p className="text-gray-400 text-sm text-center mt-1.5 mb-8">
          Únete a la comunidad de Descalifica2
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Fila 1: Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Nombre *
              </label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Nombre"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50"
                  required
                />
              </InputGroup>
            </div>

            <div>
              <label
                htmlFor="surname"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Apellido
              </label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Apellido"
                  id="surname"
                  value={form.surname}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50"
                />
              </InputGroup>
            </div>
          </div>

          {/* Fila 2: Nombre de Usuario y Correo Electrónico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Nombre de Usuario *
              </label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Nombre de usuario"
                  id="username"
                  value={form.username}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50"
                  required
                />
              </InputGroup>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Correo Electrónico *
              </label>
              <InputGroup>
                <InputGroupInput
                  placeholder="correo@ejemplo.com"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50"
                  required
                />
              </InputGroup>
            </div>
          </div>

          {/* Fila 3: Contraseña y Confirmar Contraseña */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Contraseña *
              </label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Al menos 6 caracteres"
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50"
                  required
                  minLength={6}
                />
              </InputGroup>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Confirmar Contraseña *
              </label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Repite tu contraseña"
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50"
                  required
                  minLength={6}
                />
              </InputGroup>
            </div>
          </div>

          {/* Fila 4: Fecha de Nacimiento y Telegram */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative w-full" ref={datePickerRef}>
              <label
                htmlFor="birth_date_btn"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Fecha de Nacimiento *
              </label>
              <InputGroup
                id="birth_date_btn"
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (!openBirthDate && form.date_of_birth) {
                    setViewYear(form.date_of_birth.getUTCFullYear());
                    setViewMonth(form.date_of_birth.getUTCMonth());
                  }
                  setOpenBirthDate((prev) => !prev);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!openBirthDate && form.date_of_birth) {
                      setViewYear(form.date_of_birth.getUTCFullYear());
                      setViewMonth(form.date_of_birth.getUTCMonth());
                    }
                    setOpenBirthDate((prev) => !prev);
                  }
                }}
                className="cursor-pointer px-3 justify-between hover:border-ring/50 hover:dark:bg-input/50 transition-colors select-none"
              >
                <span
                  className={
                    form.date_of_birth
                      ? "text-foreground font-medium text-sm"
                      : "text-gray-500/50 text-sm"
                  }
                >
                  {form.date_of_birth
                    ? form.date_of_birth.toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        timeZone: "UTC",
                      })
                    : "Fecha de nacimiento"}
                </span>
                <CalendarIcon className="h-4 w-4 text-muted-foreground opacity-50" />
              </InputGroup>

              {/* Panel de selección de fecha */}
              {openBirthDate && (
                <div className="absolute top-full left-0 mt-2 z-50 p-4 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-72 max-w-[calc(100vw-2rem)]">
                  {/* Encabezado: Selects de Mes y Año con Flechas */}
                  <div className="flex items-center justify-between gap-1 mb-3">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                      title="Mes anterior"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <div className="flex items-center gap-1.5 flex-1 justify-center">
                      {/* Select de Mes */}
                      <select
                        value={viewMonth}
                        onChange={(e) => setViewMonth(Number(e.target.value))}
                        className="bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded px-2 py-1 outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {MONTH_NAMES.map((month, idx) => (
                          <option key={month} value={idx} className="bg-gray-900">
                            {month}
                          </option>
                        ))}
                      </select>

                      {/* Select de Año */}
                      <select
                        value={viewYear}
                        onChange={(e) => setViewYear(Number(e.target.value))}
                        className="bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded px-2 py-1 outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {yearsOptions.map((year) => (
                          <option key={year} value={year} className="bg-gray-900">
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextMonth}
                      disabled={viewYear >= currentYear && viewMonth >= new Date().getMonth()}
                      className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mes siguiente"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Nombres de días de la semana */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {WEEKDAY_NAMES.map((d) => (
                      <span
                        key={d}
                        className="text-[11px] font-semibold text-gray-400 select-none"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Grilla de días */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-7 w-7" />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNumber = i + 1;
                      const isSelected =
                        form.date_of_birth &&
                        form.date_of_birth.getUTCFullYear() === viewYear &&
                        form.date_of_birth.getUTCMonth() === viewMonth &&
                        form.date_of_birth.getUTCDate() === dayNumber;

                      return (
                        <button
                          key={dayNumber}
                          type="button"
                          onClick={() => handleSelectDay(dayNumber)}
                          className={`h-7 w-7 text-xs rounded-md flex items-center justify-center transition-all cursor-pointer select-none ${
                            isSelected
                              ? "bg-blue-600 text-white font-bold shadow-md"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }`}
                        >
                          {dayNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="telegram_username"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Telegram (opcional)
              </label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Sin @"
                  id="telegram_username"
                  value={form.telegram_username}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50"
                />
              </InputGroup>
            </div>
          </div>

          {/* Preferencias de Automovilismo */}
          <div className="border-t border-gray-800/80 pt-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 tracking-wider flex items-center gap-1.5">
              <Trophy size={14} className="text-amber-400" />
              Preferencias y Favoritos (opcional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="fav_driver"
                  className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"
                >
                  <Trophy size={12} className="text-amber-400" />
                  Piloto Favorito
                </label>
                <InputGroup>
                  <InputGroupInput
                    list="pilotos-reg-list"
                    placeholder="ej. Franco Colapinto"
                    id="fav_driver"
                    value={form.fav_driver}
                    onChange={handleChange}
                    className="placeholder:text-gray-500/50 text-xs"
                  />
                </InputGroup>
              </div>

              <div>
                <label
                  htmlFor="fav_team"
                  className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"
                >
                  <Flag size={12} className="text-red-400" />
                  Escudería Favorita
                </label>
                <InputGroup>
                  <InputGroupInput
                    list="escuderias-reg-list"
                    placeholder="ej. Williams Racing"
                    id="fav_team"
                    value={form.fav_team}
                    onChange={handleChange}
                    className="placeholder:text-gray-500/50 text-xs"
                  />
                </InputGroup>
              </div>

              <div>
                <label
                  htmlFor="fav_circuit"
                  className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"
                >
                  <MapPin size={12} className="text-emerald-400" />
                  Circuito Favorito
                </label>
                <InputGroup>
                  <InputGroupInput
                    list="circuitos-reg-list"
                    placeholder="ej. Monza"
                    id="fav_circuit"
                    value={form.fav_circuit}
                    onChange={handleChange}
                    className="placeholder:text-gray-500/50 text-xs"
                  />
                </InputGroup>
              </div>
            </div>
          </div>

          {/* Biografía */}
          <div className="border-t border-gray-800/80 pt-4">
            <label
              htmlFor="bio"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
            >
              <FileText size={14} className="text-blue-400" />
              Biografía / Sobre Mí (opcional)
            </label>
            <textarea
              id="bio"
              placeholder="Cuéntanos un poco sobre ti..."
              value={form.bio}
              onChange={handleChange}
              rows={2}
              className="w-full bg-gray-900/60 border border-gray-700/80 rounded-xl p-3 text-sm text-gray-200 placeholder:text-gray-500/50 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Foto de perfil (Dropzone) */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Foto de Perfil (opcional)
            </label>
            {!form.avatar ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700/80 hover:border-gray-500 bg-gray-900/50 hover:bg-gray-900/80"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-300 font-medium">
                  {isDragActive
                    ? "Suelta la imagen aquí..."
                    : "Arrastra una imagen o haz clic para seleccionarla"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP hasta 5MB
                </p>
              </div>
            ) : (
              <div className="relative border border-gray-700 rounded-xl p-3.5 bg-gray-900/60 backdrop-blur-sm">
                <div className="flex items-center gap-3.5">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-14 w-14 rounded-full object-cover border-2 border-blue-500 shadow-md"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {form.avatar.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(form.avatar.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAvatar}
                    className="hover:bg-red-500/20 hover:text-red-400 text-gray-400 cursor-pointer p-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex w-full justify-between pt-4 gap-4">
            <Button
              type="button"
              className="flex-1 bg-gray-800/80 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:text-white cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-900/50 border-0 cursor-pointer"
            >
              {submitting ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </div>

          {message && (
            <p
              className={`mt-3 text-sm text-center font-semibold pt-1 ${
                messageType === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <div className="mt-6 text-center border-t border-gray-800/80 pt-4">
          <p className="text-xs text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold underline ml-1"
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registrarse;
