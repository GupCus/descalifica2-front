import { NewPiloto, Piloto } from "@/entities/piloto.entity.ts";
import { apiClient } from "./httpClient.ts";

export async function getPiloto(): Promise<Piloto[]> {
  const response = await apiClient.get("/pilotos/");
  return response.data.data;
}

export async function getOnePiloto(id: number): Promise<Piloto> {
  const response = await apiClient.get("/pilotos/" + id.toString());
  return response.data.data;
}

export async function postPiloto(data: NewPiloto): Promise<Piloto> {
  const response = await apiClient.post("/pilotos/", data);
  return response.data.data;
}

export async function putPiloto(id: number, data: Piloto): Promise<Piloto> {
  const response = await apiClient.put("/pilotos/" + id.toString(), data);
  return response.data.data;
}

export async function deletePiloto(id: number): Promise<Piloto> {
  const response = await apiClient.delete("/pilotos/" + id.toString());
  return response.data.data;
}

export async function postPilotoFormData(
  data: NewPiloto,
  file?: File,
): Promise<Piloto> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  if (file) {
    formData.append("image", file);
  }

  const response = await apiClient.post("/pilotos/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function putPilotoFormData(
  id: number,
  data: Partial<NewPiloto>,
  file?: File,
): Promise<Piloto> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string);
    }
  });

  if (file) {
    formData.append("image", file);
  }

  const response = await apiClient.put(`/pilotos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function uploadPilotoImage(id: number, file: File): Promise<any> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiClient.patch(`/pilotos/${id}/portrait-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
