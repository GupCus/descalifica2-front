import { Temporada, NewTemporada } from "@/entities/temporada.entity.ts";
import { apiClient } from "./httpClient.ts";

export async function getTemporada(): Promise<Temporada[]> {
  const response = await apiClient.get("/temporadas/");
  return response.data.data;
}

export async function getOneTemporada(id: number): Promise<Temporada> {
  const response = await apiClient.get("/temporadas/" + id.toString());
  return response.data.data;
}

export async function postTemporada(data: NewTemporada): Promise<Temporada> {
  const response = await apiClient.post("/temporadas/", data);
  return response.data.data;
}

export async function putTemporada(
  id: number,
  data: Temporada
): Promise<Temporada> {
  const response = await apiClient.put("/temporadas/" + id.toString(), data);
  return response.data.data;
}

export async function deleteTemporada(id: number): Promise<Temporada> {
  const response = await apiClient.delete("/temporadas/" + id.toString());
  return response.data.data;
}

export async function postTemporadaFormData(data: NewTemporada, file?: File): Promise<Temporada> {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  if (file) {
    formData.append("image", file);
  }

  const response = await apiClient.post("/temporadas/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function putTemporadaFormData(
  id: number,
  data: Partial<NewTemporada>,
  file?: File,
): Promise<Temporada> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string);
    }
  });

  if (file) {
    formData.append("image", file);
  }

  const response = await apiClient.put(`/temporadas/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function uploadTemporadaImage(id: number, file: File): Promise<any> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiClient.post(`/temporadas/${id}/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
