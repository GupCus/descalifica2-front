import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SeccionComentarios from '@/components/SeccionComentarios';
import { BlogPost } from '@/entities/blogPost.entity';
import { getOneBlogPost } from '@/services/blogpost.service';
import { getAssetUrl } from '@/utils/asset.util';

function DetallePost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getOneBlogPost(Number(id))
      .then((data) => setPost(data))
      .catch((err) => {
        setError('Error cargando la publicación');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 text-gray-300 hover:text-white">
          <Link to="/foro">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver al Foro
          </Link>
        </Button>

        <article>
          <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>

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
