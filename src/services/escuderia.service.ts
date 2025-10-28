import { Escuderia, NewEscuderia } from "@/entities/escuderia.entity.ts";
import axios from "axios";

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: URL_API + "/escuderias",
});

export async function getEscuderia(): Promise<Escuderia[]> {
  const response = await client.get("/");
  return response.data.data;
}

export async function getOneEscuderia(id: number): Promise<Escuderia> {
  const response = await client.get("/" + id.toString());
  return response.data.data;
}

export async function postEscuderia(data: NewEscuderia): Promise<Escuderia> {
  const response = await client.post("/", data);
  return response.data.data;
}

export async function putEscuderia(
  id: number,
  data: Escuderia
): Promise<Escuderia> {
  const response = await client.put("/" + id.toString(), data);
  return response.data.data;
}

export async function deleteEscuderia(id: number): Promise<Escuderia> {
  const response = await client.delete("/" + id.toString());
  return response.data.data;
}
