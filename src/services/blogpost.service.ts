import { BlogPost, NewBlogPost } from '../entities/blogPost.entity';
import { apiClient } from './httpClient.ts';

export async function getBlogPost(): Promise<BlogPost[]> {
  const response = await apiClient.get('/blogposts');
  return response.data.data ?? [];
}

export async function getOneBlogPost(id: number): Promise<BlogPost> {
  const response = await apiClient.get('/blogposts/' + id.toString());
  return response.data.data;
}

export async function postBlogPost(data: NewBlogPost): Promise<BlogPost> {
  const response = await apiClient.post('/blogposts/', data);
  return response.data.data;
}

export async function putBlogPost(
  id: number,
  data: BlogPost,
): Promise<BlogPost> {
  const response = await apiClient.put('/blogposts/' + id.toString(), data);
  return response.data.data;
}

export async function deleteBlogPost(id: number): Promise<BlogPost> {
  const response = await apiClient.delete('/blogposts/' + id.toString());
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
  const response = await apiClient.post('/blogposts/', formData);
  return response.data.data;
}

export async function getSuggestedBlogPosts(
  userId: number,
): Promise<BlogPost[]> {
  const response = await apiClient.get(
    '/blogposts/suggested/' + userId.toString(),
  );
  return response.data.data ?? [];
}
