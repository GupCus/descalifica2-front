import { Usuario, NewUsuario } from '@/entities/usuario.entity.ts';
import { apiClient } from './httpClient.ts';

export async function getUsuarios(): Promise<Usuario[]> {
  const response = await apiClient.get<{ data: Usuario[] }>('/usuarios/public');
  return response.data.data ?? [];
}

export async function postUsuario(data: NewUsuario): Promise<Usuario> {
  const response = await apiClient.post<{ data: Usuario }>('/usuarios', data);
  return response.data.data;
}
