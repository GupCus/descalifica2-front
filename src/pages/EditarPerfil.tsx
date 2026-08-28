import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Upload,
  X,
  ArrowLeft,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Flag,
  MapPin,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { AuthService } from "@/services/auth.service.ts";
import { apiClient } from "@/services/httpClient";
import { getPiloto } from "@/services/piloto.service";
import { getEscuderia } from "@/services/escuderia.service";
import { getCircuito } from "@/services/circuito.service";
import fondoPerfil from "../assets/Pitwall.jpg";

interface ProfileData {
  id: number;
  name: string;
  surname: string | null;
  username: string;
  email: string;
  date_of_birth: string | null;
  fav_driver: string | null;
  fav_team: string | null;
  fav_circuit: string | null;
  bio: string | null;
  telegram_username: string | null;
  avatar_url: string | null;
}

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

function EditarPerfil() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [telegram, setTelegram] = useState("");
  const [favDriver, setFavDriver] = useState("");
  const [favTeam, setFavTeam] = useState("");
  const [favCircuit, setFavCircuit] = useState("");
  const [bio, setBio] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [serverAvatar, setServerAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  // Datalists para sugerencias
  const [pilotosList, setPilotosList] = useState<string[]>([]);
  const [escuderiasList, setEscuderiasList] = useState<string[]>([]);
  const [circuitosList, setCircuitosList] = useState<string[]>([]);

  // Date picker state
  const currentYear = new Date().getFullYear();
  const [openBirthDate, setOpenBirthDate] = useState(false);
  const [viewYear, setViewYear] = useState<number>(2000);
  const [viewMonth, setViewMonth] = useState<number>(0);
  const datePickerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const load = async () => {
      try {
        const me = await AuthService.getCurrentUser();
        if (!me) {
          navigate("/login");
          return;
        }
        setUserId(me.id);
        const response = await apiClient.get<{ data: ProfileData }>(
          `/usuarios/${me.id}`
        );
        const data = response.data.data;
        setName(data.name ?? "");
        setSurname(data.surname ?? "");
        setUsername(data.username ?? "");
        setEmail(data.email ?? "");
        if (data.date_of_birth) {
          const parsed = new Date(data.date_of_birth);
          if (!isNaN(parsed.getTime())) {
            setDateOfBirth(parsed);
            setViewYear(parsed.getUTCFullYear());
            setViewMonth(parsed.getUTCMonth());
          }
        }
        setTelegram(data.telegram_username ?? "");
        setFavDriver(data.fav_driver ?? "");
        setFavTeam(data.fav_team ?? "");
        setFavCircuit(data.fav_circuit ?? "");
        setBio(data.bio ?? "");
        setServerAvatar(data.avatar_url ?? null);

        // Cargar sugerencias
        getPiloto()
          .then((res) => setPilotosList(getUniqueNames(res)))
          .catch(() => {});
        getEscuderia()
          .then((res) => setEscuderiasList(getUniqueNames(res)))
          .catch(() => {});
        getCircuito()
          .then((res) => setCircuitosList(getUniqueNames(res)))
          .catch(() => {});
      } catch {
        setMessageType("error");
        setMessage("Error al cargar los datos del perfil.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const removeAvatarPreview = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleDeleteAvatar = async () => {
    if (!userId) return;
    try {
      await apiClient.delete(`/usuarios/${userId}/avatar`);
      setServerAvatar(null);
      removeAvatarPreview();
      setMessageType("success");
      setMessage("Avatar eliminado.");
      window.dispatchEvent(new Event("userLoggedIn"));
    } catch {
      setMessageType("error");
      setMessage("Error al eliminar el avatar.");
    }
  };

  const handleSelectDay = (day: number) => {
    const selectedDate = new Date(Date.UTC(viewYear, viewMonth, day));
    setDateOfBirth(selectedDate);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setMessage(null);
    setMessageType(null);

    if (!name.trim() || !username.trim() || !email.trim()) {
      setMessageType("error");
      setMessage("Nombre, usuario y email son obligatorios.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setMessageType("error");
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setMessageType("error");
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (telegram.trim()) {
      const cleanTg = telegram.trim().replace(/^@/, "");
      if (/\s/.test(cleanTg)) {
        setMessageType("error");
        setMessage("El usuario de Telegram no debe contener espacios.");
        return;
      }
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("surname", surname.trim());
      formData.append("username", username.trim());
      formData.append("email", email.trim());
      if (dateOfBirth) {
        const birthDateString = `${dateOfBirth.getUTCFullYear()}-${String(
          dateOfBirth.getUTCMonth() + 1
        ).padStart(2, "0")}-${String(dateOfBirth.getUTCDate()).padStart(2, "0")}`;
        formData.append("date_of_birth", birthDateString);
      }
      formData.append("telegram_username", telegram.trim());
      formData.append("fav_driver", favDriver.trim());
      formData.append("fav_team", favTeam.trim());
      formData.append("fav_circuit", favCircuit.trim());
      formData.append("bio", bio.trim());

      if (newPassword) {
        formData.append("password", newPassword);
      }
      if (avatarFile) {
        formData.append("image", avatarFile);
      }

      await apiClient.patch(`/usuarios/${userId}`, formData);

      setMessageType("success");
      setMessage("Perfil actualizado correctamente. Redirigiendo...");
      setNewPassword("");
      setConfirmPassword("");
      setAvatarFile(null);
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }

      const updated = await apiClient.get<{ data: ProfileData }>(
        `/usuarios/${userId}`
      );
      setServerAvatar(updated.data.data.avatar_url ?? null);

      window.dispatchEvent(new Event("userLoggedIn"));

      setTimeout(() => {
        navigate("/perfil");
      }, 1000);
    } catch (err: any) {
      setMessageType("error");
      setMessage(
        err.response?.data?.message || "Error al guardar los cambios."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  const resolvedAvatar = avatarPreview || serverAvatar || null;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const yearsOptions = Array.from(
    { length: currentYear - 1920 + 1 },
    (_, i) => currentYear - i
  );

  return (
    <div className="relative min-h-screen py-10 flex flex-col justify-start">
      {/* Listas de autocompletado para datos favoritos */}
      <datalist id="pilotos-list">
        {pilotosList.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
      <datalist id="escuderias-list">
        {escuderiasList.map((e) => (
          <option key={e} value={e} />
        ))}
      </datalist>
      <datalist id="circuitos-list">
        {circuitosList.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      {/* Fondo de pantalla */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoPerfil})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.35)",
        }}
      />

      <div className="relative z-10 max-w-2xl w-full mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/perfil"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-all bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700/60 hover:border-gray-500"
          >
            <ArrowLeft size={16} />
            Volver al perfil
          </Link>
        </div>

        <div className="bg-gray-950/75 backdrop-blur-md rounded-2xl p-8 border border-gray-700/60 shadow-2xl">
          <h1
            className="text-gray-200 mb-8 text-3xl md:text-4xl font-bold tracking-wider text-center uppercase"
            style={{
              fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            Editar Perfil
          </h1>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-700 bg-gray-900 flex items-center justify-center shadow-lg">
                {resolvedAvatar ? (
                  <img
                    src={resolvedAvatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-gray-500 font-semibold">
                    {(name || username || "U").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <label className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1 font-medium">
                  <Upload size={14} />
                  Cambiar foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                {(resolvedAvatar || avatarFile) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (avatarFile) {
                        removeAvatarPreview();
                      } else {
                        handleDeleteAvatar();
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-medium"
                  >
                    <X size={14} />
                    Quitar foto
                  </button>
                )}
              </div>
              {avatarFile && (
                <p className="text-xs text-gray-500 mt-1">
                  Nueva foto seleccionada (se guarda al guardar cambios)
                </p>
              )}
            </div>

            {/* Fila: Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Nombre *
                </label>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="placeholder:text-gray-500/50"
                    required
                  />
                </InputGroup>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Apellido
                </label>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Apellido"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="placeholder:text-gray-500/50"
                  />
                </InputGroup>
              </div>
            </div>

            {/* Fila: Nombre de Usuario y Correo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Nombre de Usuario *
                </label>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="placeholder:text-gray-500/50"
                    required
                  />
                </InputGroup>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Correo Electrónico *
                </label>
                <InputGroup>
                  <InputGroupInput
                    placeholder="correo@ejemplo.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="placeholder:text-gray-500/50"
                    required
                  />
                </InputGroup>
              </div>
            </div>

            {/* Fila: Fecha de Nacimiento y Telegram */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative w-full" ref={datePickerRef}>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Fecha de Nacimiento
                </label>
                <InputGroup
                  id="birth_date_edit_btn"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (!openBirthDate && dateOfBirth) {
                      setViewYear(dateOfBirth.getUTCFullYear());
                      setViewMonth(dateOfBirth.getUTCMonth());
                    }
                    setOpenBirthDate((prev) => !prev);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (!openBirthDate && dateOfBirth) {
                        setViewYear(dateOfBirth.getUTCFullYear());
                        setViewMonth(dateOfBirth.getUTCMonth());
                      }
                      setOpenBirthDate((prev) => !prev);
                    }
                  }}
                  className="cursor-pointer px-3 justify-between hover:border-ring/50 hover:dark:bg-input/50 transition-colors select-none"
                >
                  <span
                    className={
                      dateOfBirth
                        ? "text-foreground font-medium text-sm"
                        : "text-gray-500/50 text-sm"
                    }
                  >
                    {dateOfBirth
                      ? dateOfBirth.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          timeZone: "UTC",
                        })
                      : "Seleccionar fecha"}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground opacity-50" />
                </InputGroup>

                {openBirthDate && (
                  <div className="absolute top-full left-0 mt-2 z-50 p-4 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-72 max-w-[calc(100vw-2rem)]">
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

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDayIndex }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-7 w-7" />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNumber = i + 1;
                        const isSelected =
                          dateOfBirth &&
                          dateOfBirth.getUTCFullYear() === viewYear &&
                          dateOfBirth.getUTCMonth() === viewMonth &&
                          dateOfBirth.getUTCDate() === dayNumber;

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
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Usuario de Telegram (opcional)
                </label>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Sin @"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="placeholder:text-gray-500/50"
                  />
                </InputGroup>
              </div>
            </div>

            {/* Preferencias de Automovilismo */}
            <div className="border-t border-gray-700/60 pt-5 mt-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4 tracking-wider flex items-center gap-2">
                <Trophy size={16} className="text-amber-400" />
                Preferencias y Favoritos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Trophy size={13} className="text-amber-400" />
                    Piloto Favorito
                  </label>
                  <InputGroup>
                    <InputGroupInput
                      list="pilotos-list"
                      placeholder="ej. Franco Colapinto"
                      value={favDriver}
                      onChange={(e) => setFavDriver(e.target.value)}
                      className="placeholder:text-gray-500/50"
                    />
                  </InputGroup>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Flag size={13} className="text-red-400" />
                    Escudería Favorita
                  </label>
                  <InputGroup>
                    <InputGroupInput
                      list="escuderias-list"
                      placeholder="ej. Williams Racing"
                      value={favTeam}
                      onChange={(e) => setFavTeam(e.target.value)}
                      className="placeholder:text-gray-500/50"
                    />
                  </InputGroup>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-emerald-400" />
                    Circuito Favorito
                  </label>
                  <InputGroup>
                    <InputGroupInput
                      list="circuitos-list"
                      placeholder="ej. Monza"
                      value={favCircuit}
                      onChange={(e) => setFavCircuit(e.target.value)}
                      className="placeholder:text-gray-500/50"
                    />
                  </InputGroup>
                </div>
              </div>
            </div>

            {/* Biografía */}
            <div className="border-t border-gray-700/60 pt-5 mt-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3 tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-blue-400" />
                Biografía / Sobre Mí
              </h3>
              <textarea
                placeholder="Cuéntanos sobre tu pasión por el automovilismo..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-gray-200 placeholder:text-gray-500/50 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Contraseña */}
            <div className="border-t border-gray-700/60 pt-5 mt-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4 tracking-wider">
                Cambiar Contraseña
              </h3>
              <div className="space-y-3">
                <InputGroup>
                  <InputGroupInput
                    placeholder="Nueva contraseña (opcional)"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="placeholder:text-gray-500/50"
                    minLength={newPassword ? 6 : undefined}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Repetir nueva contraseña"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="placeholder:text-gray-500/50"
                  />
                </InputGroup>
              </div>
            </div>

            <div className="flex w-full justify-between pt-6 gap-4">
              <Button
                type="button"
                className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 px-6 cursor-pointer"
                onClick={() => navigate("/perfil")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-6 cursor-pointer"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>

            {message && (
              <p
                className={`text-sm text-center font-semibold pt-2 ${
                  messageType === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfil;
