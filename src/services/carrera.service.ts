import { Carrera } from "@/entities/carrera.entity.ts";
import axios from "axios";

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: (URL_API) + "/carreras"
});

export async function getCarrera(): Promise<Carrera[]> {
  const response = await client.get('/');
  return response.data.data;
}

export async function getOneCarrera(id: number): Promise<Carrera> {
  const response = await client.get('/' + id.toString());
  return response.data.data;
}

export async function postCarrera(data: Carrera): Promise<Carrera> {
  const response = await client.post('/', data);
  return response.data.data;
}

export async function putCarrera(id: number, data: Carrera): Promise<Carrera> {
  const response = await client.put('/' + id.toString(), data);
  return response.data.data;
}

export async function deleteCarrera(id: number): Promise<Carrera> {
  const response = await client.delete('/' + id.toString());
  return response.data.data;
}

