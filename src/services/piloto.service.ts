import { NewPiloto, Piloto } from "@/entities/piloto.entity.ts";
import axios from "axios";

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: URL_API + "/pilotos",
});

export async function getPiloto(): Promise<Piloto[]> {
  const response = await client.get("/");
  return response.data.data;
}

export async function getOnePiloto(id: number): Promise<Piloto> {
  const response = await client.get("/" + id.toString());
  return response.data.data;
}

export async function postPiloto(data: NewPiloto): Promise<Piloto> {
  const response = await client.post("/", data);
  return response.data.data;
}

export async function putPiloto(id: number, data: Piloto): Promise<Piloto> {
  const response = await client.put("/" + id.toString(), data);
  return response.data.data;
}

export async function deletePiloto(id: number): Promise<Piloto> {
  const response = await client.delete("/" + id.toString());
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

  const response = await client.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

// export async function getPilotoImage(id: number, file: File): Promise<any> {
//   const formData = new FormData();
//   formData.append("image", file);

//   const response = await client.get(`/${id}/portrait-image`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// }

export async function uploadPilotoImage(id: number, file: File): Promise<any> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await client.patch(`/${id}/portrait-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
