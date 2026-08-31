import { baseEntity } from "./baseEntity.entity.ts";

export class Usuario extends baseEntity {
  name!: string;
  username?: string;
  email!: string;
  password!: string;
  username!: string;
  declare name: string;
  surname?: string;
  date_of_birth?: Date | string;
  fav_driver?: string;
  fav_team?: string;
  fav_circuit?: string;
  bio?: string;
  telegram_username?: string;
  avatar_url?: string;
  user_type?: string;
}

export class NewUsuario {
  id?: number;
  name!: string;
  surname?: string;
  username!: string;
  email!: string;
  password!: string;
  date_of_birth?: string;
  fav_driver?: string;
  fav_team?: string;
  fav_circuit?: string;
  bio?: string;
  telegram_username?: string;
}
