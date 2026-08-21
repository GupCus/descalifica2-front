import { Circuito } from "@/entities/circuito.entity.ts";
import axios from "axios";
import { API_BASE_URL } from "./httpClient.ts";

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: URL_API + "/circuitos",
});

export async function getCircuito(): Promise<Circuito[]> {
  const response = await client.get("/");
  return response.data.data;
}

export async function getOneCircuito(id: number): Promise<Circuito> {
  const response = await client.get("/" + id.toString());
  return response.data.data;
}

export async function postCircuito(data: Circuito): Promise<Circuito> {
  const response = await client.post("/", data);
  return response.data.data;
}

export async function putCircuito(
  id: number,
  data: Circuito,
): Promise<Circuito> {
  const response = await client.put("/" + id.toString(), data);
  return response.data.data;
}

export async function deleteCircuito(id: number): Promise<Circuito> {
  const response = await client.delete("/" + id.toString());
  return response.data.data;
}

export async function postCircuitoFormData(
  data: Omit<Circuito, "id">,
  file?: File,
): Promise<Circuito> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  if (file) {
    formData.append("image", file);
  }

  const response = await client.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function uploadCircuitoImage(
  id: number,
  image: File,
): Promise<any> {
  const formData = new FormData();
  formData.append("image", image);

  const response = await client.patch(`/${id}/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function uploadTrackImage(id: number, image: File): Promise<any> {
  const formData = new FormData();
  formData.append("image", image);

  const response = await client.patch(`/${id}/track-map`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
