import {
  Driver_Championship,
  NewDriver_Championship,
} from '@/entities/driver_championship.entity.ts';
import {
  Team_Championship,
  NewTeam_Championship,
} from '@/entities/team_championship.entity.ts';
import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: URL_API,
});

export async function getteam_championship(): Promise<Team_Championship[]> {
  const response = await client.get('/championship?tipo=escuderias');

  return response.data.data;
}

export async function postteam_championship(
  data: NewTeam_Championship,
): Promise<Team_Championship> {
  const response = await client.post('/championship?tipo=escuderias', data);
  return response.data.data;
}

export async function putteam_championship(
  id: number,
  data: Team_Championship,
): Promise<Team_Championship> {
  const response = await client.put(
    '/championship?tipo=escuderias/' + id.toString(),
    data,
  );
  return response.data.data;
}

export async function deleteteam_championship(
  id: number,
): Promise<Team_Championship> {
  const response = await client.delete(
    '/championship?tipo=escuderias/' + id.toString(),
  );
  return response.data.data;
}

export async function getdrivers_championship(): Promise<
  Driver_Championship[]
> {
  const response = await client.get('/championship?tipo=pilotos');

  return response.data.data;
}

export async function postdrivers_championship(
  data: NewDriver_Championship,
): Promise<Driver_Championship> {
  const response = await client.post('/championship?tipo=pilotos', data);
  return response.data.data;
}

export async function putdrivers_championship(
  id: number,
  data: Driver_Championship,
): Promise<Driver_Championship> {
  const response = await client.put(
    '/championship?tipo=pilotos/' + id.toString(),
    data,
  );
  return response.data.data;
}

export async function deletedrivers_championship(
  id: number,
): Promise<Driver_Championship> {
  const response = await client.delete(
    '/championship?tipo=pilotos/' + id.toString(),
  );
  return response.data.data;
}
