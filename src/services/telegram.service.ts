import { Usuario } from '@/entities/usuario.entity.ts';
import { apiClient } from './httpClient.ts';

export async function postCarrera(user: Usuario): Promise<string> {
  const response = await apiClient.post('/telegram/generarcodigo', user);
  return response.data.message;
}
