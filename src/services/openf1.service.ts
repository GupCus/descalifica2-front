import { apiClient } from './httpClient.ts';

export async function postCarrera(id: number): Promise<string> {
  const response = await apiClient.post('/openf1/actualizarresultados/' + id);
  return response.data.message;
}
