import { baseEntity } from "./baseEntity.entity.ts";

export class Usuario extends baseEntity {
  email!: string;
  password!: string;
  username!: string;
  declare name: string;
  telegram_username?: string;
  avatar_url?: string;
}

export class NewUsuario {
  id?: number;
  name!: string;
  username!: string;
  email!: string;
  password!: string;
  telegram_username?: string;
}
