import { baseEntity } from './baseEntity.entity.js';
import { Categoria } from './categoria.entity.js';
import { Carrera } from './carrera.entity.js';

export class Temporada extends baseEntity {
  year?: number;
  races?: Carrera[];
  racing_series?: Categoria;
  winner_driver?: string;
  winner_team?: string;
}
