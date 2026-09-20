import { Categoria } from './categoria.entity.js';
import { Carrera } from './carrera.entity.js';
import { Piloto } from './piloto.entity.js';
import { Escuderia } from './escuderia.entity.js';

export class Temporada {
  id!: number;
  year!: number | string;
  races?: Carrera[];
  racing_series!: Categoria;
  winner_driver?: Piloto;
  winner_team?: Escuderia;
}

export class NewTemporada {
  id?: number;
  year!: number | string;
  racing_series!: string | number;
  winner_driver?: string | null;
  winner_team?: string | null;
}
