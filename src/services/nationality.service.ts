import { apiClient } from "./httpClient.ts";

export type Nationality = {
  code: string;
  name: string;
};

export async function getNationalities(): Promise<Nationality[]> {
  const response = await apiClient.get("/nationalities/");
  return response.data.data;
}

export async function getNationalityByCode(code: string): Promise<Nationality> {
  const response = await apiClient.get(`/nationalities/${code}`);
  return response.data.data;
}
