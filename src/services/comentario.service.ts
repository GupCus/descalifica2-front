import { Comentario, NewComentario } from '../entities/comentarios.entity.js';
import { apiClient } from './httpClient.ts';

export async function addComentario(data: NewComentario): Promise<Comentario> {
  const response = await apiClient.post('/comentarios', data);
  return response.data.data;
}

export async function deleteComentario(id: number): Promise<Comentario> {
  const response = await apiClient.delete('/comentarios' + id.toString());
  return response.data.data;
}

export async function getComentarioByBlogPost(
  blogpostId: number,
): Promise<Comentario[]> {
  const response = await apiClient.get<{ data: Comentario[] }>('/comentarios', {
    params: { blogpost: blogpostId },
  });
  return response.data.data ?? [];
}

export async function getComentariosCount(
  blogpostIds: number[],
): Promise<Record<number, number>> {
  if (blogpostIds.length === 0) return {};
  const response = await apiClient.get<{ data: Record<number, number> }>(
    '/comentarios/counts',
    {
      params: { blogposts: blogpostIds.join(',') },
    },
  );
  return response.data.data ?? {};
}
