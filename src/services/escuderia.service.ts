import { Escuderia, NewEscuderia } from "@/entities/escuderia.entity.ts";
import { apiClient } from "./httpClient.ts";

export async function getEscuderia(): Promise<Escuderia[]> {
  const response = await apiClient.get("/escuderias/");
  return response.data.data;
}

export async function getOneEscuderia(id: number): Promise<Escuderia> {
  const response = await apiClient.get("/escuderias/" + id.toString());
  return response.data.data;
}

export async function postEscuderia(data: NewEscuderia): Promise<Escuderia> {
  const response = await apiClient.post("/escuderias/", data);
  return response.data.data;
}

export async function putEscuderia(
  id: number,
  data: Escuderia,
): Promise<Escuderia> {
  const response = await apiClient.put("/escuderias/" + id.toString(), data);
  return response.data.data;
}

export async function deleteEscuderia(id: number): Promise<Escuderia> {
  const response = await apiClient.delete("/escuderias/" + id.toString());
  return response.data.data;
}

export async function postEscuderiaFormData(
  data: NewEscuderia,
  file?: File,
): Promise<Escuderia> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  if (file) {
    formData.append("image", file);
  }

  const response = await apiClient.post("/escuderias/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function putEscuderiaFormData(
  id: number,
  data: Partial<NewEscuderia>,
  file?: File,
): Promise<Escuderia> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string);
    }
  });

  if (file) {
    formData.append("image", file);
  }

  const response = await apiClient.put(`/escuderias/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function uploadEscuderiaImage(
  id: number,
  file: File,
): Promise<any> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiClient.patch(`/escuderias/${id}/logo-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function uploadEscuderiaCarImage(
  id: number,
  file: File,
): Promise<any> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiClient.patch(`/escuderias/${id}/car-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
