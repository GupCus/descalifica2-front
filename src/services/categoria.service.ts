import { Categoria } from "@/entities/categoria.entity.ts";
import { apiClient } from "./httpClient.ts";

export async function getCategoria(): Promise<Categoria[]> {
  const response = await apiClient.get("/categorias/");
  return response.data.data;
}

export async function getOneCategoria(id: number): Promise<Categoria> {
  const response = await apiClient.get("/categorias/" + id.toString());
  return response.data.data;
}

export async function postCategoria(data: Categoria): Promise<Categoria> {
  const response = await apiClient.post("/categorias/", data);
  return response.data.data;
}

export async function putCategoria(id: number, data: Partial<Categoria>): Promise<Categoria> {
  const response = await apiClient.put("/categorias/" + id.toString(), data);
  return response.data.data;
}

export async function deleteCategoria(id: number): Promise<Categoria> {
  const response = await apiClient.delete("/categorias/" + id.toString());
  return response.data.data;
}
