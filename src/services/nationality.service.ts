import axios from "axios";

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: URL_API + "/nationalities",
});

export type Nationality = {
  code: string;
  name: string;
};

export async function getNationalities(): Promise<Nationality[]> {
  const response = await client.get("/");
  return response.data.data;
}
