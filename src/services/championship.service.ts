import { Driver_Championship } from "@/entities/driver_championship.entity.ts";
import { Team_Championship } from "@/entities/team_championship.entity.ts";
import { apiClient } from "./httpClient";

const client = apiClient;

export async function getteam_championship(): Promise<Team_Championship[]> {
  const response = await client.get("/championship?tipo=escuderias");
  return response.data.data;
}

export async function getdrivers_championship(): Promise<
  Driver_Championship[]
> {
  const response = await client.get("/championship?tipo=pilotos");
  return response.data.data;
}
