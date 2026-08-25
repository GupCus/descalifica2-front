import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ChromaGrid } from '@/components/ui/Chroma-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthService, VerifyTokenResponse } from '@/services/auth.service';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogPost } from '@/entities/blogPost.entity';
import { getBlogPost, deleteBlogPost } from '@/services/blogpost.service';
import { getAssetUrl } from '@/utils/asset.util';
import fondoMonza from '../assets/Monza.jpg';

function Foro() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<VerifyTokenResponse['user'] | null>(null);

  useEffect(() => {
    getBlogPost()
      .then((data) => setPosts(data))
      .catch((err) => {
        setError('Error cargando las publicaciones: ' + err);
      })
      .finally(() => setLoading(false));

    AuthService.getCurrentUser().then(setUser);
  }, []);

  const puedeEliminarPost = (post: BlogPost): boolean => {
    if (!user) return false;
    return user.user_type === 'admin' || user.id === post.author;
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="bg-slate-900/50 border-slate-700 overflow-hidden"
              >
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold text-white mb-1">FORO</h1>
            <p className="text-gray-400">
              Las publicaciones de la comunidad
            </p>
          </div>
          {user && (
            <Button
              asChild
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-900/40 transition-all duration-200"
            >
              <Link to="/blogpost/nuevo">
                <Plus className="h-5 w-5 mr-1.5" />
                Nueva publicación
              </Link>
            </Button>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-700 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Todavía no hay publicaciones
            </CardTitle>
          </CardHeader>
        </Card>
      ) : (
        <div className="relative z-10 container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link to={`/foro/${post.id}`} key={post.id}>
                <Card className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 overflow-hidden group cursor-pointer py-0 border-t-0 border-b-0 h-full flex flex-col">
                  <div className="relative w-full h-48 overflow-hidden shrink-0">
                    <img
                      src={
                        post.cover_image
                          ? getAssetUrl(post.cover_image)
                          : new URL(
                              '../assets/descalifica2logo.png',
                              import.meta.url,
                            ).href
                      }
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const t = e.currentTarget as HTMLImageElement;
                        t.onerror = null;
                        t.src = new URL(
                          '../assets/descalifica2logo.png',
                          import.meta.url,
                        ).href;
                        t.classList.add('object-contain', 'bg-slate-900/50');
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                    {puedeEliminarPost(post) && (
                      <button
                        onClick={(e) => handleEliminarPost(e, post)}
                        title="Eliminar publicación"
                        className="absolute top-2 right-2 z-20 p-1.5 rounded-md bg-red-900/70 text-red-300 hover:bg-red-800 hover:text-red-100 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-4 grow">
                    <p className="text-sm text-gray-400 line-clamp-3">
                      {post.content}
                    </p>
                    <span className="inline-block mt-3 text-sm font-medium text-sky-400 group-hover:text-sky-300 transition-colors">
                      Leer más →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Foro;
