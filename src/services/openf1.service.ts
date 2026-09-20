import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: URL_API,
});

export async function postCarrera(id: number): Promise<string> {
  const response = await client.post('/openf1/actualizarresultados/' + id);
  return response.data.message;
}
