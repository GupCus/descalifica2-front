import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Upload,
  X,
  ArrowLeft,
  Trophy,
  Flag,
  MapPin,
  FileText,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthService } from "@/services/auth.service.ts";
import { apiClient } from "@/services/httpClient";
import { getAssetUrl } from "@/utils/asset.util.ts";
import { useFavoritosCatalogs } from "@/hooks/useFavoritosCatalogs";
import { useTelegramLink } from "@/hooks/useTelegramLink";
import { BirthDatePicker } from "@/components/BirthDatePicker";
import { TelegramLinkField } from "@/components/TelegramLinkField";
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
  avatar_url?: string | null;
  avatar?: string | null;
}

function EditarPerfil() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
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

  const { pilotosList, escuderiasList, circuitosList } = useFavoritosCatalogs();

  const {
    telegramLinked,
    telegramPending,
    telegramOtp,
    telegramUsername,
    linkingTelegram,
    unlinkingTelegram,
    verifyInitialStatus,
    handleLinkTelegram,
    handleCancelPending,
    handleUnlinkTelegram,
  } = useTelegramLink({
    mode: "authenticated",
    onMessage: (msg, type) => {
      setMessage(msg);
      setMessageType(type);
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const me = await AuthService.getCurrentUser();
        if (!me) {
          navigate("/login");
          return;
        }
        setUserId(me.id);
        if (me.avatar) {
          setServerAvatar(me.avatar);
        }
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
          }
        }
        setFavDriver(data.fav_driver ?? "");
        setFavTeam(data.fav_team ?? "");
        setFavCircuit(data.fav_circuit ?? "");
        setBio(data.bio ?? "");
        const avatarPath = data.avatar || data.avatar_url || me.avatar;
        setServerAvatar(avatarPath ?? null);

        await verifyInitialStatus(data);
      } catch {
        setMessageType("error");
        setMessage("Error al cargar los datos del perfil.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate, verifyInitialStatus]);

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
      const updatedAvatarPath =
        updated.data.data.avatar || updated.data.data.avatar_url;
      setServerAvatar(updatedAvatarPath ?? null);

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

  const resolvedAvatar =
    avatarPreview || (serverAvatar ? getAssetUrl(serverAvatar) : null);

  return (
    <div className="relative min-h-screen py-4 sm:py-8 flex flex-col justify-start">
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

      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoPerfil})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) brightness(0.35)",
        }}
      />

      <div className="relative z-10 max-w-xl w-full mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Link
            to="/perfil"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-all bg-gray-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-700/60 hover:border-gray-500 text-xs sm:text-sm"
          >
            <ArrowLeft size={18} />
            Volver al perfil
          </Link>
        </div>

        <div className="bg-gray-950/80 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/60 shadow-2xl">
          <h1
            className="text-gray-200 mb-4 text-xl sm:text-2xl font-bold tracking-wider text-center uppercase"
            style={{
              fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
              letterSpacing: "0.08em",
            }}
          >
            Editar Perfil
          </h1>

          <form onSubmit={handleSave} className="space-y-3.5">
            <div className="flex flex-col items-center mb-3">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-gray-700 shadow-md">
                {resolvedAvatar && (
                  <AvatarImage
                    src={resolvedAvatar}
                    alt="Avatar"
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="text-xl sm:text-2xl text-gray-500 font-semibold bg-gray-900">
                  {(name || username || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-3 mt-2">
                <label className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1 font-medium">
                  <Upload size={13} />
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
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <X size={13} />
                    Quitar foto
                  </button>
                )}
              </div>
              {avatarFile && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Nueva foto seleccionada (se guarda al guardar cambios)
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <Label className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
                  Nombre *
                </Label>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                    required
                  />
                </InputGroup>
              </div>

              <div>
                <Label className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
                  Apellido
                </Label>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Apellido"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                  />
                </InputGroup>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <Label className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
                  Nombre de Usuario *
                </Label>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                    required
                  />
                </InputGroup>
              </div>

              <div>
                <Label className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
                  Correo Electrónico *
                </Label>
                <InputGroup>
                  <InputGroupInput
                    placeholder="correo@ejemplo.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                    required
                  />
                </InputGroup>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="relative w-full">
                <Label className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
                  Fecha de Nacimiento
                </Label>
                <BirthDatePicker
                  id="birth_date_edit_btn"
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                  variant="dark"
                />
              </div>

              <div>
                <Label className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Send size={11} className="text-blue-400" />
                  Telegram
                </Label>

                <TelegramLinkField
                  telegramLinked={telegramLinked}
                  telegramPending={telegramPending}
                  telegramUsername={telegramUsername}
                  telegramOtp={telegramOtp}
                  linkingTelegram={linkingTelegram}
                  unlinkingTelegram={unlinkingTelegram}
                  allowUnlink={true}
                  onLink={handleLinkTelegram}
                  onCancelPending={handleCancelPending}
                  onUnlink={handleUnlinkTelegram}
                />
              </div>
            </div>

            <div className="border-t border-gray-700/60 pt-3 mt-3">
              <h3 className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase mb-2 tracking-wider flex items-center gap-1.5">
                <Trophy size={13} className="text-amber-400" />
                Preferencias y Favoritos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <Label className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Trophy size={11} className="text-amber-400" />
                    Piloto Favorito
                  </Label>
                  <InputGroup>
                    <InputGroupInput
                      list="pilotos-list"
                      placeholder="ej. Franco Colapinto"
                      value={favDriver}
                      onChange={(e) => setFavDriver(e.target.value)}
                      className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>

                <div>
                  <Label className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Flag size={11} className="text-red-400" />
                    Escudería Favorita
                  </Label>
                  <InputGroup>
                    <InputGroupInput
                      list="escuderias-list"
                      placeholder="ej. Williams Racing"
                      value={favTeam}
                      onChange={(e) => setFavTeam(e.target.value)}
                      className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>

                <div>
                  <Label className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MapPin size={11} className="text-emerald-400" />
                    Circuito Favorito
                  </Label>
                  <InputGroup>
                    <InputGroupInput
                      list="circuitos-list"
                      placeholder="ej. Monza"
                      value={favCircuit}
                      onChange={(e) => setFavCircuit(e.target.value)}
                      className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700/60 pt-3 mt-3">
              <h3 className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase mb-2 tracking-wider flex items-center gap-1.5">
                <FileText size={13} className="text-blue-400" />
                Sobre Mí
              </h3>
              <textarea
                placeholder="Cuéntanos sobre tu pasión por el automovilismo..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-xs sm:text-sm text-gray-200 placeholder:text-gray-500/50 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <div className="border-t border-gray-700/60 pt-3 mt-3">
              <h3 className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase mb-2 tracking-wider">
                Cambiar Contraseña
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <InputGroup>
                  <InputGroupInput
                    placeholder="Nueva contraseña (opcional)"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                    minLength={newPassword ? 6 : undefined}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Repetir nueva contraseña"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="placeholder:text-gray-500/50 text-xs sm:text-sm"
                  />
                </InputGroup>
              </div>
            </div>

            <div className="flex w-full justify-between pt-3 gap-3">
              <Button
                type="button"
                className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 px-4 sm:px-5 py-2 text-xs sm:text-sm cursor-pointer"
                onClick={() => navigate("/perfil")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-4 sm:px-5 py-2 text-xs sm:text-sm cursor-pointer"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>

            {message && (
              <p
                className={`text-xs sm:text-sm text-center font-semibold pt-1 ${
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
