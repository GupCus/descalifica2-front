import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ChromaGrid } from '@/components/ui/Chroma-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService, VerifyTokenResponse } from '@/services/auth.service';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogPost } from '@/entities/blogPost.entity';
import { getBlogPost, deleteBlogPost } from '@/services/blogpost.service';
import { getComentarioByBlogPost } from '@/services/comentario.service';
import { getAssetUrl } from '@/utils/asset.util';
import fondoMonza from '../assets/Monza.jpg';

function Foro() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<VerifyTokenResponse['user'] | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    getBlogPost()
      .then(async (data) => {
        setPosts(data ?? []);
        // Cargar conteo de comentarios por post
        const counts: Record<number, number> = {};
        await Promise.all(
          data.map(async (post) => {
            try {
              const comentarios = await getComentarioByBlogPost(post.id);
              counts[post.id] = comentarios.length;
            } catch {
              counts[post.id] = 0;
            }
          }),
        );
        setCommentCounts(counts);
      })
      .catch((err) => {
        setError('Error cargando las publicaciones: ' + err);
      })
      .finally(() => setLoading(false));

    AuthService.getCurrentUser().then(setUser);
  }, []);

  const puedeEliminarPost = (post: BlogPost): boolean => {
    if (!user) return false;
    const authorId =
      typeof post.author === 'object' && post.author !== null
        ? (post.author as unknown as { id: number }).id
        : post.author;
    return user.user_type === 'admin' || Number(user.id) === Number(authorId);
  };

  const handleEliminarPost = async (e: React.MouseEvent, post: BlogPost) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`¿Estás seguro de que querés eliminar "${post.title}"?`))
      return;
    try {
      await deleteBlogPost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      console.error(err);
      setError('Error al eliminar la publicación');
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <ChromaGrid />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <Skeleton className="h-12 w-64 mx-auto mb-2" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="bg-slate-900/50 border-slate-700 overflow-hidden w-full"
              >
                <Skeleton className="h-64 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen">
        <ChromaGrid />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <Card className="bg-red-900/50 border-red-700">
            <CardHeader>
              <CardTitle className="text-red-200">Error</CardTitle>
              <div className="text-red-300">{error}</div>
            </CardHeader>
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
      
      <ChromaGrid />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">FORO</h1>
          <p className="text-gray-300">
            Las publicaciones de la comunidad
          </p>
        </div>
      </div>

      {/* Botón flotante para nueva publicación */}
      {user && (
        <Link
          to="/blogpost/nuevo"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-5 py-3 rounded-full shadow-lg shadow-emerald-900/40 transition-all duration-200 hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Nueva publicación</span>
        </Link>
      )}

      {posts.length === 0 ? (
        <Card className="relative z-10 bg-slate-900/50 border-slate-700 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Todavía no hay publicaciones
            </CardTitle>
          </CardHeader>
        </Card>
      ) : (
        <div className="relative z-10 container mx-auto px-4 pb-8">
          <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="bg-slate-900/50 border-slate-700 overflow-hidden group w-full py-0 border-t-0 border-b-0"
              >
                {/* Imagen solo si tiene */}
                {post.cover_image && (
                  <div className="relative w-full overflow-hidden">
                    <img
                      src={getAssetUrl(post.cover_image)}
                      alt={post.title}
                      className="w-full max-h-96 object-cover"
                    />
                  </div>
                )}

                {/* Título + contenido completo */}
                <CardHeader className="pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl font-bold text-white flex-1">
                      {post.title}
                    </CardTitle>
                    {puedeEliminarPost(post) && (
                      <button
                        onClick={(e) => handleEliminarPost(e, post)}
                        title="Eliminar publicación"
                        className="shrink-0 p-1.5 rounded-md bg-red-900/70 text-red-300 hover:bg-red-800 hover:text-red-100 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-5">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                  <Link
                    to={`/foro/${post.id}`}
                    className="inline-block mt-4 text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    Ver comentarios ({commentCounts[post.id] ?? 0}) →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Foro;
