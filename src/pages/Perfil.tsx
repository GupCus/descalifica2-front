import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { AuthService } from "@/services/auth.service.ts";
import { apiClient } from "@/services/httpClient";

interface ProfileData {
  id: number;
  name: string;
  username: string;
  email: string;
  telegram_username: string | null;
  avatar_url: string | null;
}

function Perfil() {
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
      setMessage("Perfil actualizado correctamente.");
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  const resolvedAvatar = avatarPreview || serverAvatar || null;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1
          className="text-gray-200 mb-8 text-4xl font-bold tracking-wider text-center uppercase"
          style={{
            fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
            letterSpacing: "0.1em",
          }}
        >
          Mi Perfil
        </h1>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-700 bg-gray-800 flex items-center justify-center">
              {resolvedAvatar ? (
                <img
                  src={resolvedAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl text-gray-500">
                  {(name || username || "U").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <label className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1">
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
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
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

          <InputGroup>
            <InputGroupInput
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputGroupInput
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputGroupInput
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputGroupInput
              placeholder="Usuario de Telegram (opcional)"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
          </InputGroup>

          <div className="border-t border-gray-800 pt-5 mt-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">
              Cambiar contraseña
            </h3>
            <InputGroup className="mb-4">
              <InputGroupInput
                placeholder="Nueva contraseña (dejar vacío sin cambios)"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={newPassword ? 6 : undefined}
              />
            </InputGroup>
            <InputGroup>
              <InputGroupInput
                placeholder="Repetir nueva contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </InputGroup>
          </div>

          <div className="flex w-full justify-between pt-4">
            <Button
              type="button"
              className="bg-gray-700 hover:bg-gray-800 text-white border border-gray-600"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>

          {message && (
            <p
              className={`text-sm text-center font-semibold ${
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

export default Perfil;
