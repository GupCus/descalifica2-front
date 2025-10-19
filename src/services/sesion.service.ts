import { Sesion } from "@/entities/sesion.entity.ts";
import axios from "axios";

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: (URL_API) + "/sesion"
});

export async function getSesion(): Promise<Sesion[]> {
  const response = await client.get('/');
  return response.data.data;
}

export async function getOneSesion(id: number): Promise<Sesion> {
  const response = await client.get('/' + id.toString());
  return response.data.data;
}

export async function postSesion(data: Sesion): Promise<Sesion> {
  const response = await client.post('/', data);
  return response.data.data;
}

export async function putSesion(id: number, data: Sesion): Promise<Sesion> {
  const response = await client.put('/' + id.toString(), data);
  return response.data.data;
}

export async function deleteSesion(id: number): Promise<Sesion> {
  const response = await client.delete('/' + id.toString());
  return response.data.data;
}

