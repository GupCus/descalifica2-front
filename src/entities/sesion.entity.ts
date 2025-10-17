import { baseEntity } from './baseEntity.entity.js';
import { Piloto } from './piloto.entity.js';
import { Carrera } from './carrera.entity.js';

export class Sesion extends baseEntity {
  tipo_Sesion?: string;
  fecha_Hora_inicio?: Date;
  fecha_Hora_fin?: Date; 
  carrera?: Carrera;
  resultados?: Piloto[];

}
