import { baseEntity } from "./baseEntity.entity.ts";

export class Usuario extends baseEntity {
  name!: string;
  username?: string;
  email!: string;
  password!: string;
}

export class NewUsuario {
  id?: number;
  name!: string;
  username!: string;
  email!: string;
  password!: string;
}
