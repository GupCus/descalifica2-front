import { InputGroup, InputGroupInput } from "@/components/ui/input-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover.tsx";
import { useState, useEffect, useCallback } from "react";
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
    null,
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
    >,
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
        form.date_of_birth.getUTCMonth() + 1,
      ).padStart(2, "0")}-${String(form.date_of_birth.getUTCDate()).padStart(
        2,
        "0",
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

      const response = await AuthService.RegisterUser(formData);

      setMessageType("success");
      setMessage(
        response?.message || "¡Usuario creado con éxito! Redirigiendo...",
      );

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
        }`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Lunes = 0

  const yearsOptions = Array.from(
    { length: currentYear - 1920 + 1 },
    (_, i) => currentYear - i,
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center py-6 sm:py-10 px-3 sm:px-4">
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

      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoRegistro})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.35)",
        }}
      />

      <div className="relative z-10 w-full max-w-xl p-4 sm:p-7 bg-gray-950/80 backdrop-blur-md rounded-xl sm:rounded-2xl border border-gray-700/60 shadow-2xl my-4">
        <div className="flex items-center justify-between mb-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Ir al login
          </Link>
        </div>

        <h1
          className="text-gray-200 text-xl sm:text-2xl font-bold tracking-wider text-center uppercase"
          style={{
            fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
            letterSpacing: "0.08em",
          }}
        >
          Crear Cuenta
        </h1>
        <p className="text-gray-400 text-xs text-center mt-1 mb-4">
          Únete a la comunidad de Descalifica2
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <Label
                htmlFor="name"
                className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block"
              >
                Nombre *
              </Label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Nombre"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                  required
                />
              </InputGroup>
            </div>

            <div>
              <Label
                htmlFor="surname"
                className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block"
              >
                Apellido
              </Label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Apellido"
                  id="surname"
                  value={form.surname}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                />
              </InputGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div>
              <Label
                htmlFor="username"
                className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block"
              >
                Nombre de Usuario *
              </Label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Nombre de usuario"
                  id="username"
                  value={form.username}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                  required
                />
              </InputGroup>
            </div>

            <div>
              <Label
                htmlFor="email"
                className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block"
              >
                Correo Electrónico *
              </Label>
              <InputGroup>
                <InputGroupInput
                  placeholder="correo@ejemplo.com"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                  required
                />
              </InputGroup>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <Label
                htmlFor="password"
                className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block"
              >
                Contraseña *
              </Label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Mín. 6 caracteres"
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                  required
                  minLength={6}
                />
              </InputGroup>
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block"
              >
                Confirmar *
              </Label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Repite contraseña"
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                  required
                  minLength={6}
                />
              </InputGroup>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="relative w-full">
              <Label
                htmlFor="birth_date_btn"
                className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block"
              >
                Fecha de Nacimiento *
              </Label>
              <Popover open={openBirthDate} onOpenChange={setOpenBirthDate}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    id="birth_date_btn"
                    onClick={() => {
                      if (!openBirthDate && form.date_of_birth) {
                        setViewYear(form.date_of_birth.getUTCFullYear());
                        setViewMonth(form.date_of_birth.getUTCMonth());
                      }
                    }}
                    className="w-full h-9 border border-input dark:bg-input/30 rounded-md px-2.5 sm:px-3 flex items-center justify-between text-left cursor-pointer hover:border-ring/50 transition-colors select-none"
                  >
                    <span
                      className={
                        form.date_of_birth
                          ? "text-foreground font-medium text-xs sm:text-sm truncate"
                          : "text-gray-500/50 text-xs sm:text-sm truncate"
                      }
                    >
                      {form.date_of_birth
                        ? form.date_of_birth.toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            timeZone: "UTC",
                          })
                        : "Seleccionar"}
                    </span>
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground opacity-50 shrink-0" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-72 max-w-[calc(100vw-2rem)] p-3 sm:p-4 bg-gray-900 border-gray-700 text-gray-200 shadow-2xl z-50"
                  align="start"
                >
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                      title="Mes anterior"
                    >
                      <ChevronLeft size={15} />
                    </button>

                    <div className="flex items-center gap-1 flex-1 justify-center">
                      <select
                        value={viewMonth}
                        onChange={(e) => setViewMonth(Number(e.target.value))}
                        className="bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded px-1.5 py-1 outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {MONTH_NAMES.map((month, idx) => (
                          <option
                            key={month}
                            value={idx}
                            className="bg-gray-900"
                          >
                            {month}
                          </option>
                        ))}
                      </select>

                      <select
                        value={viewYear}
                        onChange={(e) => setViewYear(Number(e.target.value))}
                        className="bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded px-1.5 py-1 outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {yearsOptions.map((year) => (
                          <option
                            key={year}
                            value={year}
                            className="bg-gray-900"
                          >
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextMonth}
                      disabled={
                        viewYear >= currentYear &&
                        viewMonth >= new Date().getMonth()
                      }
                      className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mes siguiente"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {WEEKDAY_NAMES.map((d) => (
                      <span
                        key={d}
                        className="text-[10px] font-semibold text-gray-400 select-none"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

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
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label
                htmlFor="telegram_username"
                className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block"
              >
                Telegram (opcional)
              </Label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Sin @"
                  id="telegram_username"
                  value={form.telegram_username}
                  onChange={handleChange}
                  className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                />
              </InputGroup>
            </div>
          </div>

          <div className="border-t border-gray-800/80 pt-3 mt-3">
            <h3 className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase mb-2 tracking-wider flex items-center gap-1.5">
              <Trophy size={13} className="text-amber-400" />
              Preferencias y Favoritos (opcional)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div>
                <Label
                  htmlFor="fav_driver"
                  className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"
                >
                  <Trophy size={11} className="text-amber-400" />
                  Piloto Favorito
                </Label>
                <InputGroup>
                  <InputGroupInput
                    list="pilotos-reg-list"
                    placeholder="ej. Franco Colapinto"
                    id="fav_driver"
                    value={form.fav_driver}
                    onChange={handleChange}
                    className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                  />
                </InputGroup>
              </div>

              <div>
                <Label
                  htmlFor="fav_team"
                  className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"
                >
                  <Flag size={11} className="text-red-400" />
                  Escudería Favorita
                </Label>
                <InputGroup>
                  <InputGroupInput
                    list="escuderias-reg-list"
                    placeholder="ej. Williams Racing"
                    id="fav_team"
                    value={form.fav_team}
                    onChange={handleChange}
                    className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                  />
                </InputGroup>
              </div>

              <div>
                <Label
                  htmlFor="fav_circuit"
                  className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"
                >
                  <MapPin size={11} className="text-emerald-400" />
                  Circuito Favorito
                </Label>
                <InputGroup>
                  <InputGroupInput
                    list="circuitos-reg-list"
                    placeholder="ej. Monza"
                    id="fav_circuit"
                    value={form.fav_circuit}
                    onChange={handleChange}
                    className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                  />
                </InputGroup>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800/80 pt-3 mt-3">
            <Label
              htmlFor="bio"
              className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block"
            >
              Sobre Mí (opcional)
            </Label>
            <textarea
              id="bio"
              placeholder="Cuéntanos un poco sobre ti..."
              value={form.bio}
              onChange={handleChange}
              rows={2}
              className="w-full bg-gray-900/60 border border-gray-700/80 rounded-lg p-2.5 text-xs sm:text-sm text-gray-200 placeholder:text-gray-500/50 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div>
            <Label className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
              Foto de Perfil (opcional)
            </Label>
            {!form.avatar ? (
              <div
                {...getRootProps()}
                className={`border border-dashed rounded-lg p-2.5 sm:p-3 text-center cursor-pointer transition-all flex items-center justify-center gap-2 ${
                  isDragActive
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700 hover:border-gray-500 bg-gray-900/50 hover:bg-gray-900/80"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-4 w-4 text-gray-400 shrink-0" />
                <p className="text-xs text-gray-300 font-medium truncate">
                  {isDragActive
                    ? "Suelta la imagen aquí..."
                    : "Arrastra una foto o haz clic para subirla (PNG, JPG, WEBP)"}
                </p>
              </div>
            ) : (
              <div className="relative border border-gray-700 rounded-lg p-2 bg-gray-900/60 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-10 w-10 rounded-full object-cover border-2 border-blue-500 shadow-md shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-200 truncate">
                      {form.avatar.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {(form.avatar.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAvatar}
                    className="hover:bg-red-500/20 hover:text-red-400 text-gray-400 cursor-pointer p-1.5 h-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex w-full justify-between pt-3 gap-3">
            <Button
              type="button"
              className="flex-1 bg-gray-800/80 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:text-white px-4 py-2 text-xs sm:text-sm cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-900/50 border-0 px-4 py-2 text-xs sm:text-sm cursor-pointer"
            >
              {submitting ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </div>

          {message && (
            <p
              className={`mt-2 text-xs sm:text-sm text-center font-semibold pt-1 ${
                messageType === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <div className="mt-3.5 text-center border-t border-gray-800/80 pt-3">
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
