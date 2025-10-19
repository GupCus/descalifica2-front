import { Categoria } from "@/entities/categoria.entity.ts";
import axios from "axios";

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: (URL_API) + "/categorias"
});

export async function getCategoria(): Promise<Categoria[]> {
  const response = await client.get('/');
  return response.data.data;
}

export async function getOneCategoria(id: number): Promise<Categoria> {
  const response = await client.get('/' + id.toString());
  return response.data.data;
}

export async function postCategoria(data: Categoria): Promise<Categoria> {
  const response = await client.post('/', data);
  return response.data.data;
}

export async function putCategoria(id: number, data: Categoria): Promise<Categoria> {
  const response = await client.put('/' + id.toString(), data);
  return response.data.data;
}

export async function deleteCategoria(id: number): Promise<Categoria> {
  const response = await client.delete('/' + id.toString());
  return response.data.data;
}