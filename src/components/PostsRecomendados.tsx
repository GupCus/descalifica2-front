import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogPost } from '@/entities/blogPost.entity';
import { Usuario } from '@/entities/usuario.entity';
import { getSuggestedBlogPosts } from '@/services/blogpost.service';
import { getComentarioByBlogPost } from '@/services/comentario.service';
import { getUsuarios } from '@/services/usuario.service';
import { AuthService } from '@/services/auth.service';
import { getAssetUrl } from '@/utils/asset.util';

function PostsRecomendados() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>(
    {},
  );
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    AuthService.getCurrentUser()
      .then(async (user) => {
        if (!user) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);

        try {
          const suggested = await getSuggestedBlogPosts(user.id);
          setPosts(suggested);

          // Obtener conteo de comentarios para cada post
          const counts: Record<number, number> = {};
          await Promise.all(
            suggested.map(async (post) => {
              try {
                const comentarios = await getComentarioByBlogPost(post.id);
                counts[post.id] = comentarios.length;
              } catch {
                counts[post.id] = 0;
              }
            }),
          );
          setCommentCounts(counts);
        } catch (err) {
          setError('Error cargando publicaciones sugeridas: ' + err);
        } finally {
          setLoading(false);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setLoading(false);
      });

    getUsuarios().then(setUsuarios).catch(console.error);
  }, []);

  const getAuthorId = (post: BlogPost): number => {
    if (typeof post.author === 'object' && post.author !== null) {
      return (post.author as unknown as { id: number }).id;
    }
    return post.author;
  };

  const usernameDe = (authorId: number): string => {
    const usuario = usuarios.find((u) => u.id === authorId);
    return usuario?.username ?? usuario?.name ?? 'Usuario eliminado';
  };

  // Si no está logueado, no mostramos el componente
  if (!isLoggedIn && !loading) return null;

  if (loading) {
    return (
      <div className="max-w-5xl w-full mx-auto px-4 mt-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[300px] flex-shrink-0">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4 mt-3" />
              <Skeleton className="h-4 w-full mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return null;

  // Si no hay posts sugeridos, mostrar mensaje
  if (posts.length === 0) {
    return (
      <div className="max-w-5xl w-full mx-auto px-4 mt-8 mb-4">
        <h4 className="text-xl font-semibold tracking-tight mb-4">
          📰 Publicaciones que te pueden interesar
        </h4>
        <Card className="bg-secondary/60 border-border">
          <CardContent className="py-8 text-center text-muted-foreground">
            No encontramos publicaciones que coincidan con tus intereses
            todavía. ¡Explorá el foro para descubrir contenido nuevo!
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link to="/foro" className="gap-2">
                  Ir al foro
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl w-full mx-auto px-4 mt-8 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-semibold tracking-tight">
          📰 Publicaciones que te pueden interesar
        </h4>
        <Button variant="ghost" size="sm" asChild>
          <Link
            to="/foro"
            className="gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Ver más posteos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Contenedor en grilla */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/foro/${post.id}`}
              className="min-w-[300px] max-w-[340px] flex-shrink-0 snap-start"
            >
              <Card className="h-full bg-secondary/60 border-border hover:bg-secondary/90 transition-colors duration-200 overflow-hidden py-0 group">
                {/* Imagen de portada */}
                {post.cover_image ? (
                  <div className="relative w-full h-40 overflow-hidden">
                    <img
                      src={getAssetUrl(post.cover_image)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-muted/50 flex items-center justify-center">
                    <MessageCircle className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}

                <CardHeader className="pt-4 pb-1 px-4">
                  <CardTitle className="text-base font-bold line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <User className="h-3 w-3" />
                    <span>{usernameDe(getAuthorId(post))}</span>
                  </div>
                </CardHeader>

                <CardContent className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-sky-400">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>
                      {commentCounts[post.id] ?? 0} comentario
                      {(commentCounts[post.id] ?? 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      );
      <div className="mt-4 flex justify-center sm:hidden">
        <Button variant="outline" asChild>
          <Link to="/foro" className="gap-2">
            Ver más posteos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
}

export default PostsRecomendados;
