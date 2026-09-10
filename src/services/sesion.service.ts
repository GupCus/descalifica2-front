import { NewSesion, Sesion } from "@/entities/sesion.entity.ts";
import { apiClient } from "./httpClient.ts";

export async function getSesion(): Promise<Sesion[]> {
  const response = await apiClient.get("/sesion/");
  return response.data.data;
}

export async function getOneSesion(id: number): Promise<Sesion> {
  const response = await apiClient.get("/sesion/" + id.toString());
  return response.data.data;
}

export async function postSesion(data: NewSesion): Promise<Sesion> {
  const response = await apiClient.post("/sesion/", data);
  return response.data.data;
}

export async function putSesion(id: number, data: Partial<NewSesion> | Sesion): Promise<Sesion> {
  const response = await apiClient.put("/sesion/" + id.toString(), data);
  return response.data.data;
}

export async function patchSesion(id: number, data: Partial<NewSesion> | Sesion): Promise<Sesion> {
  const response = await apiClient.patch("/sesion/" + id.toString(), data);
  return response.data.data;
}

export async function deleteSesion(id: number): Promise<Sesion> {
  const response = await apiClient.delete("/sesion/" + id.toString());
  return response.data.data;
}
