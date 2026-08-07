import { Marca } from "@/entities/marca.entity.ts";
import axios from "axios";

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: (URL_API) + "/marcas"
});

export async function getMarca(): Promise<Marca[]> {
  const response = await client.get('/');
  return response.data.data;
}

export async function getOneMarca(id: number): Promise<Marca> {
  const response = await client.get('/' + id.toString());
  return response.data.data;
}

export async function postMarca(data: Marca): Promise<Marca> {
  const response = await client.post('/', data);
  return response.data.data;
}

export async function putMarca(id: number, data: Marca): Promise<Marca> {
  const response = await client.put('/' + id.toString(), data);
  return response.data.data;
}

export async function deleteMarca(id: number): Promise<Marca> {
  const response = await client.delete('/' + id.toString());
  return response.data.data;
}

export async function postMarcaFormData(data: Omit<Marca, 'id'>, file?: File): Promise<Marca> {
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

export async function uploadMarcaImage(id: number, file: File): Promise<any> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await client.post(`/${id}/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

