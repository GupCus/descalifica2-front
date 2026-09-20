import { Usuario } from '@/entities/usuario.entity.ts';
import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: URL_API,
});

export async function postCarrera(user: Usuario): Promise<string> {
  const response = await client.post('/telegram/generarcodigo', user);
  return response.data.message;
}
