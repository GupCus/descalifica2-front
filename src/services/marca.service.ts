import { Marca } from "@/entities/marca.entity.ts";
import { apiClient } from "./httpClient.ts";

export async function getMarca(): Promise<Marca[]> {
  const response = await apiClient.get("/marcas/");
  return response.data.data;
}

export async function getOneMarca(id: number): Promise<Marca> {
  const response = await apiClient.get("/marcas/" + id.toString());
  return response.data.data;
}

export async function postMarca(data: Marca): Promise<Marca> {
  const response = await apiClient.post("/marcas/", data);
  return response.data.data;
}

export async function putMarca(id: number, data: Marca): Promise<Marca> {
  const response = await apiClient.put("/marcas/" + id.toString(), data);
  return response.data.data;
}

export async function deleteMarca(id: number): Promise<Marca> {
  const response = await apiClient.delete("/marcas/" + id.toString());
  return response.data.data;
}

export async function postMarcaFormData(
  data: Omit<Marca, "id">,
  file?: File,
): Promise<Marca> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  if (file) {
    formData.append("image", file);
  }

  const response = await apiClient.post("/marcas/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function putMarcaFormData(
  id: number,
  data: Partial<Omit<Marca, "id">>,
  file?: File,
): Promise<Marca> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string);
    }
  });

  if (file) {
    formData.append("image", file);
  }

  const response = await apiClient.put(`/marcas/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function uploadMarcaImage(id: number, file: File): Promise<any> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiClient.patch(`/marcas/${id}/logo-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
