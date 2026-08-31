import { BlogPost, NewBlogPost } from '../entities/blogPost.entity';
import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: URL_API + '/blogposts',
});

export async function getBlogPost(): Promise<BlogPost[]> {
  const response = await client.get('/');
  return response.data.data ?? [];
}

export async function getOneBlogPost(id: number): Promise<BlogPost> {
  const response = await client.get('/' + id.toString());
  return response.data.data;
}

export async function postBlogPost(data: NewBlogPost): Promise<BlogPost> {
  const response = await client.post('/', data);
  return response.data.data;
}

export async function putBlogPost(
  id: number,
  data: BlogPost,
): Promise<BlogPost> {
  const response = await client.put('/' + id.toString(), data);
  return response.data.data;
}

export async function deleteBlogPost(id: number): Promise<BlogPost> {
  const response = await client.delete('/' + id.toString());
  return response.data.data;
}

export async function postBlogPostFormData(
  data: NewBlogPost,
  file?: File,
): Promise<BlogPost> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('content', data.content);
  if (data.author !== undefined) {
    formData.append('authorID', String(data.author));
  }
  if (data.tags && data.tags.length > 0) {
    formData.append('tags', JSON.stringify(data.tags));
  }
  if (file) {
    formData.append('image', file);
  }
  const response = await client.post('/', formData);
  return response.data.data;
}

export async function getSuggestedBlogPosts(
  userId: number,
): Promise<BlogPost[]> {
  const response = await client.get('/suggested/' + userId.toString());
  return response.data.data ?? [];
}