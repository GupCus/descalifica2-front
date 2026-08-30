import { baseEntity } from './baseEntity.entity.js';
import { Carrera } from './carrera.entity.js';
import { Session_Result } from './session_result.entity.js';

export class Sesion extends baseEntity {
  name!: string;
  type!: string;
  start_time!: Date;
  end_time!: Date;
  race?: Carrera;
  session_result?: Session_Result[];
}

export class NewSesion {
  id?: number;
  name!: string;
  type!: string;
  start_time?: Date;
  end_time?: Date;
  race?: string | number;
  session_result?: Session_Result[];
}
