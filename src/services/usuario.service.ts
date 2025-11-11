import { Usuario, NewUsuario } from "@/entities/usuario.entity.ts";
import axios from "axios";

const URL_API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: URL_API + "/usuarios",
});

//creo lo necesario para testear el registro de un usuario, hay que agregar las demás funciones.

export async function postUsuario(data: NewUsuario): Promise<Usuario> {
  const response = await client.post("/", data);
  return response.data.data;
}
