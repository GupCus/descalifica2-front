import { Carrera, NewCarrera } from '@/entities/carrera.entity.ts';
import { apiClient } from './httpClient.ts';

export async function getCarrera(year?: number): Promise<Carrera[]> {
  let response;
  if (year) {
    response = await apiClient.get('/carreras?year=' + year);
  } else {
    response = await apiClient.get('/carreras');
  }
  return response.data.data;
}

export async function getOneCarrera(id: number): Promise<Carrera> {
  const response = await apiClient.get('/carreras/' + id.toString());
  return response.data.data;
}

export async function postCarrera(data: NewCarrera): Promise<Carrera> {
  const response = await apiClient.post('/carreras', data);
  return response.data.data;
}

export async function putCarrera(id: number, data: Carrera): Promise<Carrera> {
  const response = await apiClient.put('/carreras/' + id.toString(), data);
  return response.data.data;
}

export async function deleteCarrera(id: number): Promise<Carrera> {
  const response = await apiClient.delete('/carreras/' + id.toString());
  return response.data.data;
}
