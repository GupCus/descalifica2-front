import { Comentario, NewComentario } from '../entities/comentarios.entity.js';
import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: URL_API + '/comentarios',
});

export async function getComentarioByBlogPost(
  blogpostId: number,
): Promise<Comentario[]> {
  const response = await client.get('/');
  const comentarios: Comentario[] = response.data.data;
  return comentarios.filter((c) => c.blogpost === blogpostId);
}

export async function addComentario(data: NewComentario): Promise<Comentario> {
  const response = await client.post('/', data);
  return response.data.data;
}

export async function deleteComentario(id: number): Promise<Comentario> {
  const response = await client.delete('/' + id.toString());
  return response.data.data;
}
