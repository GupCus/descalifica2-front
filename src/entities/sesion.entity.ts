import { baseEntity } from './baseEntity.entity.js';
import { Piloto } from './piloto.entity.js';
import { Carrera } from './carrera.entity.js';

export class Sesion extends baseEntity {
  tipoSesion?: string;
  fecha_Hora_sesion?: Date; 
  carrera?: Carrera;
  resultados?: Piloto[];

}
