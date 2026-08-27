import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SeccionComentarios from '@/components/SeccionComentarios';
import { BlogPost } from '@/entities/blogPost.entity';
import { Usuario } from '@/entities/usuario.entity';
import { getOneBlogPost, deleteBlogPost } from '@/services/blogpost.service';
import { getUsuarios } from '@/services/usuario.service';
import { getAssetUrl } from '@/utils/asset.util';
import { AuthService, VerifyTokenResponse } from '@/services/auth.service';
import fondoMonza from '../../assets/Monza.jpg';

function DetallePost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<VerifyTokenResponse['user'] | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    if (!id) return;
    getOneBlogPost(Number(id))
      .then((data) => setPost(data))
      .catch((err) => {
        setError('Error cargando la publicación');
        console.error(err);
      })
      .finally(() => setLoading(false));

    AuthService.getCurrentUser().then(setUser);
    getUsuarios().then(setUsuarios).catch(console.error);
  }, [id]);

  const getAuthorId = (p: BlogPost): number => {
    if (typeof p.author === 'object' && p.author !== null) {
      return (p.author as unknown as { id: number }).id;
    }
    return p.author;
  };

  const usernameDe = (authorId: number): string => {
    const usuario = usuarios.find((u) => u.id === authorId);
    return usuario?.username ?? usuario?.name ?? 'Usuario eliminado';
  };

  const puedeEliminarPost = (): boolean => {
    if (!user || !post) return false;
    const authorId =
      typeof post.author === 'object' && post.author !== null
        ? (post.author as unknown as { id: number }).id
        : post.author;
    return user.user_type === 'admin' || Number(user.id) === Number(authorId);
  };

  const handleEliminarPost = async () => {
    if (!post) return;
    if (!window.confirm(`¿Estás seguro de que querés eliminar "${post.title}"?`))
      return;
    try {
      await deleteBlogPost(post.id);
      navigate('/foro');
    } catch (err) {
      setError('Error al eliminar la publicación');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-40 mb-6" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-64 w-full rounded-lg mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="relative min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="bg-red-900/50 border-red-700">
            <CardContent className="p-6 text-red-300 text-center">
              {error ?? 'Publicación no encontrada'}
              <div className="mt-4">
                <Button asChild variant="outline">
                  <Link to="/foro">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Volver al Foro
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Fondo Monza blurreado */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoMonza})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(6px) brightness(0.5)',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" className="text-gray-300 hover:text-white">
            <Link to="/foro">
              <ArrowLeft className="h-4 w-4 mr-2" /> Volver al Foro
            </Link>
          </Button>
          {puedeEliminarPost() && (
            <Button
              variant="ghost"
              onClick={handleEliminarPost}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar publicación
            </Button>
          )}
        </div>

        <article>
          <h1 className="text-4xl font-bold text-white mb-2">{post.title}</h1>

          <div className="flex items-center gap-2 mb-4 text-gray-400">
            <User className="h-4 w-4" />
            <span className="text-sm">Publicado por <span className="font-medium text-gray-300">{usernameDe(getAuthorId(post))}</span></span>
          </div>

          {post.cover_image && (
            <img
              src={getAssetUrl(post.cover_image)}
              alt={post.title}
              className="w-full h-72 object-cover rounded-lg border border-slate-700/40 mb-6"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}

          <div className="bg-slate-900/60 backdrop-blur-md rounded-lg border border-slate-700/40 p-6">
            <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>
        </article>

        {id && <SeccionComentarios postId={Number(id)} />}
      </div>
    </div>
  );
}

export default DetallePost;
