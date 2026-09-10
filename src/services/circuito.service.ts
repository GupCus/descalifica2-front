import { Circuito } from "@/entities/circuito.entity.ts";
import { apiClient } from "./httpClient.ts";

export async function getCircuito(): Promise<Circuito[]> {
  const response = await apiClient.get("/circuitos/");
  return response.data.data;
}

export async function getOneCircuito(id: number): Promise<Circuito> {
  const response = await apiClient.get("/circuitos/" + id.toString());
  return response.data.data;
}

export async function postCircuito(data: Circuito): Promise<Circuito> {
  const response = await apiClient.post("/circuitos/", data);
  return response.data.data;
}

export async function putCircuito(
  id: number,
  data: Circuito,
): Promise<Circuito> {
  const response = await apiClient.put("/circuitos/" + id.toString(), data);
  return response.data.data;
}

export async function deleteCircuito(id: number): Promise<Circuito> {
  const response = await apiClient.delete("/circuitos/" + id.toString());
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

  const response = await apiClient.post("/circuitos/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function putCircuitoFormData(
  id: number,
  data: Partial<Omit<Circuito, "id">>,
  file?: File,
): Promise<Circuito> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string);
    }
  });

  if (file) {
    formData.append("image", file);
  }

  const response = await apiClient.put(`/circuitos/${id}`, formData, {
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

  const response = await apiClient.patch(`/circuitos/${id}/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function uploadTrackImage(id: number, image: File): Promise<any> {
  const formData = new FormData();
  formData.append("image", image);

  const response = await apiClient.patch(`/circuitos/${id}/track-map`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
