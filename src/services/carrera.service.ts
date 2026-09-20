import { Carrera, NewCarrera } from '@/entities/carrera.entity.ts';
import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: URL_API,
});

export async function getCarrera(year?: number): Promise<Carrera[]> {
  let response;
  if (year) {
    response = await client.get('/carreras?year=' + year);
  } else {
    response = await client.get('/carreras');
  }
  return response.data.data;
}

export async function getOneCarrera(id: number): Promise<Carrera> {
  const response = await client.get('/carreras/' + id.toString());
  return response.data.data;
}

export async function postCarrera(data: NewCarrera): Promise<Carrera> {
  const response = await client.post('/carreras', data);
  return response.data.data;
}

export async function putCarrera(id: number, data: Carrera): Promise<Carrera> {
  const response = await client.put('/carreras/' + id.toString(), data);
  return response.data.data;
}

export async function deleteCarrera(id: number): Promise<Carrera> {
  const response = await client.delete('/carreras/' + id.toString());
  return response.data.data;
}
