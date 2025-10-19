import { Piloto } from "@/entities/piloto.entity.ts";
import axios from "axios";

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: (URL_API) + "/pilotos"
});

export async function getPiloto(): Promise<Piloto[]> {
  const response = await client.get('/');
  return response.data.data;
}

export async function getOnePiloto(id: number): Promise<Piloto> {
  const response = await client.get('/' + id.toString());
  return response.data.data;
}

export async function postPiloto(data: Piloto): Promise<Piloto> {
  const response = await client.post('/', data);
  return response.data.data;
}

export async function putPiloto(id: number, data: Piloto): Promise<Piloto> {
  const response = await client.put('/' + id.toString(), data);
  return response.data.data;
}

export async function deletePiloto(id: number): Promise<Piloto> {
  const response = await client.delete('/' + id.toString());
  return response.data.data;
}

