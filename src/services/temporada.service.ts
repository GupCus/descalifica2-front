import { Temporada, NewTemporada } from "@/entities/temporada.entity.ts";
import axios from "axios";

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: URL_API + "/temporadas",
});

export async function getTemporada(): Promise<Temporada[]> {
  const response = await client.get("/");
  return response.data.data;
}

export async function getOneTemporada(id: number): Promise<Temporada> {
  const response = await client.get("/" + id.toString());
  return response.data.data;
}

export async function postTemporada(data: NewTemporada): Promise<Temporada> {
  const response = await client.post("/", data);
  return response.data.data;
}

export async function putTemporada(
  id: number,
  data: Temporada
): Promise<Temporada> {
  const response = await client.put("/" + id.toString(), data);
  return response.data.data;
}

export async function deleteTemporada(id: number): Promise<Temporada> {
  const response = await client.delete("/" + id.toString());
  return response.data.data;
}
