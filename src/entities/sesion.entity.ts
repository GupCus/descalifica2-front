import { baseEntity } from "./baseEntity.entity.js";
import { Piloto } from "./piloto.entity.js";
import { Carrera } from "./carrera.entity.js";

export class Sesion extends baseEntity {
  type!: string;
  start_time!: Date;
  end_time!: Date;
  race?: Carrera;
  results?: [string, string][];
}

export class NewSesion extends baseEntity {
  type!: string;
  start_time?: Date;
  end_time?: Date;
  race?: string | number;
  results?: [string, string][];
}
