import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/services/httpClient";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Usuario {
  id: number;
  username: string;
  email: string;
  user_type: string;
  name: string;
  telegram_username?: string;
}

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [tgValue, setTgValue] = useState("");
  const [savingTg, setSavingTg] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ data: Usuario[] }>("/usuarios");
      const usuariosData = response.data.data;
      setUsuarios(usuariosData);
      console.log("usuarios: ", usuariosData);
      setError(null);
    } catch (err: any) {
      setError("Error al cargar usuarios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cambiarRol = async (idUser: number, nuevoRol: string) => {
    try {
      const response = await apiClient.patch(`/usuarios/${idUser}`, {
        user_type: nuevoRol,
      });
      console.log("respuesta del servidor: ", response);

      // Refrescar los usuarios desde el backend para verificar el cambio
      await fetchUsuarios();
    } catch (err: any) {
      console.error("Error al cambiar rol:", err);
      alert("Error al cambiar el rol del usuario");
    }
  };

  const guardarTelegram = async () => {
    if (!editingUser) return;
    setSavingTg(true);
    try {
      const payload = { telegram_username: tgValue.trim() || null };
      await apiClient.patch(`/usuarios/${editingUser.id}`, payload);
      await fetchUsuarios();
      setEditingUser(null);
    } catch (err: any) {
      console.error("Error guardando telegram:", err);
      alert("Error al guardar el usuario de Telegram");
    } finally {
      setSavingTg(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Administrar Usuarios
        </h1>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">ID</TableHead>
                <TableHead className="text-gray-300">Nombre</TableHead>
                <TableHead className="text-gray-300">Username</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Telegram</TableHead>
                <TableHead className="text-gray-300">Rol</TableHead>
                <TableHead className="text-gray-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="text-gray-300">{usuario.id}</TableCell>
                  <TableCell className="text-gray-300">
                    {usuario.name}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {usuario.username}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {usuario.email}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <span className="flex items-center gap-2">
                      {usuario.telegram_username
                        ? `@${usuario.telegram_username}`
                        : "—"}
                      <button
                        onClick={() => {
                          setEditingUser(usuario);
                          setTgValue(usuario.telegram_username ?? "");
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 underline"
                      >
                        Editar
                      </button>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        usuario.user_type === "admin" ? "default" : "secondary"
                      }
                      className={
                        usuario.user_type === "admin"
                          ? "bg-red-600"
                          : "bg-blue-600"
                      }
                    >
                      {usuario.user_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {usuario.user_type === "user" ? (
                        <Button
                          size="sm"
                          onClick={() => cambiarRol(usuario.id, "admin")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Hacer Admin
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => cambiarRol(usuario.id, "user")}
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                        >
                          Quitar Admin
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={editingUser !== null}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
      >
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Editar Telegram</DialogTitle>
          </DialogHeader>
          <Input
            value={tgValue}
            onChange={(e) => setTgValue(e.target.value)}
            placeholder="usuario de Telegram"
            className="bg-gray-900 border-gray-600 text-white"
          />
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300"
              onClick={() => setEditingUser(null)}
            >
              Cancelar
            </Button>
            <Button
              onClick={guardarTelegram}
              disabled={savingTg}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {savingTg ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminUsuarios;
