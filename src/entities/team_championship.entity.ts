import { Escuderia } from './escuderia.entity.js';
import { Temporada } from './temporada.entity.js';

export class Team_Championship {
  id!: number;
  points!: number;
  position!: number;
  escuderia!: Escuderia;
  season!: Temporada;
}

export class NewTeam_Championship {
  id?: number;
  points!: number;
  position!: number;
  escuderia!: Escuderia;
  season!: Temporada;
}
