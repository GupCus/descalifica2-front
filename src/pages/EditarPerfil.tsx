import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Upload, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { AuthService } from "@/services/auth.service.ts";
import { apiClient } from "@/services/httpClient";
import fondoPerfil from "../assets/Pitwall.jpg";

interface ProfileData {
  id: number;
  name: string;
  username: string;
  email: string;
  telegram_username: string | null;
  avatar_url: string | null;
}

function EditarPerfil() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
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
        setUsername(data.username ?? "");
        setEmail(data.email ?? "");
        setTelegram(data.telegram_username ?? "");
        setServerAvatar(data.avatar_url ?? null);
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
      formData.append("username", username.trim());
      formData.append("email", email.trim());
      const trimmedTg = telegram.trim();
      if (trimmedTg.length > 0) {
        formData.append("telegram_username", trimmedTg);
      } else {
        formData.append("telegram_username", "");
      }
      if (newPassword) {
        formData.append("password", newPassword);
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
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

  return (
    <div className="relative min-h-screen py-10 flex flex-col justify-start">
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

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Nombre Completo
              </label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Nombre y apellido"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="placeholder:text-gray-500/50"
                  required
                />
              </InputGroup>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Nombre de Usuario
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
                Correo Electrónico
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
