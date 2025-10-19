import { Circuito } from "@/entities/circuito.entity.ts";
import axios from "axios";

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: (URL_API) + "/circuitos"
});

export async function getCircuito(): Promise<Circuito[]> {
  const response = await client.get('/');
  return response.data.data;
}

export async function getOneCircuito(id: number): Promise<Circuito> {
  const response = await client.get('/' + id.toString());
  return response.data.data;
}

export async function postCircuito(data: Circuito): Promise<Circuito> {
  const response = await client.post('/', data);
  return response.data.data;
}

export async function putCircuito(id: number, data: Circuito): Promise<Circuito> {
  const response = await client.put('/' + id.toString(), data);
  return response.data.data;
}

export async function deleteCircuito(id: number): Promise<Circuito> {
  const response = await client.delete('/' + id.toString());
  return response.data.data;
}

