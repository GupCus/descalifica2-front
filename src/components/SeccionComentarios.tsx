import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Comentario } from '@/entities/comentarios.entity';
import { Usuario } from '@/entities/usuario.entity';
import {
  addComentario,
  deleteComentario,
  getComentarioByBlogPost,
} from '@/services/comentario.service';
import { getUsuarios } from '@/services/usuario.service';
import { AuthService } from '@/services/auth.service';

interface SeccionComentariosProps {
  postId: number;
}

function SeccionComentarios({ postId }: SeccionComentariosProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [user, setUser] = useState<{
    id: number;
    username: string;
    user_type: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargarComentarios = useCallback(async () => {
    try {
      const data = await getComentarioByBlogPost(postId);
      data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setComentarios(data);
    } catch (err) {
      setError('Error al cargar los comentarios');
      console.error(err);
    }
  }, [postId]);

  useEffect(() => {
    Promise.all([
      cargarComentarios(),
      getUsuarios(),
      AuthService.getCurrentUser(),
    ])
      .then(([, usuariosData, currentUser]) => {
        setUsuarios(usuariosData);
        setUser(currentUser);
      })
      .finally(() => setLoading(false));
  }, [cargarComentarios]);

  const usernameDe = (authorId: number): string => {
    const usuario = usuarios.find((u) => u.id === authorId);
    return usuario?.username ?? 'Usuario eliminado';
  };

  const puedeEliminar = (comentario: Comentario): boolean => {
    if (!user) return false;
    return user.user_type === 'admin' || user.id === comentario.author;
  };

  const handleComentar = async () => {
    if (!nuevoComentario.trim() || !user || enviando) return;
    setEnviando(true);
    setError(null);
    try {
      await addComentario({
        content: nuevoComentario.trim(),
        author: user.id,
        blogpost: postId,
      });
      setNuevoComentario('');
      await cargarComentarios();
    } catch (err) {
      setError('Error al publicar el comentario');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar este comentario?'))
      return;
    try {
      await deleteComentario(id);
      await cargarComentarios();
    } catch (err) {
      setError('Error al eliminar el comentario');
      console.error(err);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-white mb-6">
        Comentarios ({loading ? '...' : comentarios.length})
      </h2>

      {error && (
        <Card className="bg-red-900/50 border-red-700 mb-4">
          <CardContent className="p-4 text-red-300">{error}</CardContent>
        </Card>
      )}

      {user ? (
        <Card className="bg-slate-900/60 backdrop-blur-md border-slate-700/40 mb-8">
          <CardContent className="p-4">
            <Textarea
              placeholder={`¿Qué querés comentar, ${user.username}?`}
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              className="bg-slate-800/60 border-slate-600 text-white resize-none min-h-[80px]"
            />
            <div className="flex justify-end mt-3">
              <Button
                onClick={handleComentar}
                disabled={!nuevoComentario.trim() || enviando}
                className="bg-accent hover:bg-accent/80 text-white"
              >
                {enviando ? 'Publicando...' : 'Comentar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        !loading && (
          <Card className="bg-slate-900/60 backdrop-blur-md border-slate-700/40 mb-8">
            <CardContent className="p-4 text-center text-gray-400">
              <Link to="/login" className="text-sky-400 hover:text-sky-300 font-medium">
                Iniciá sesión
              </Link>{' '}
              para poder comentar
            </CardContent>
          </Card>
        )
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 items-start">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="grow space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comentarios.length === 0 ? (
        <p className="text-gray-400 text-center py-4">
          Todavía no hay comentarios. ¡Sé el primero en comentar!
        </p>
      ) : (
        <div className="space-y-4">
          {comentarios.map((comentario) => (
            <Card
              key={comentario.id}
              className="bg-slate-900/60 backdrop-blur-md border-slate-700/40"
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="shrink-0">
                    <AvatarFallback className="bg-slate-700 text-white">
                      {usernameDe(comentario.author).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-white">
                          {usernameDe(comentario.author)}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDistanceToNow(new Date(comentario.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                      {puedeEliminar(comentario) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEliminar(comentario.id)}
                          title="Eliminar comentario"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/30 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap break-words mt-1">
                      {comentario.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default SeccionComentarios;
