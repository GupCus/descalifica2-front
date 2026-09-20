import { Piloto } from './piloto.entity.ts';
import { Temporada } from './temporada.entity.ts';

export class Driver_Championship {
  id!: number;
  points!: number;
  position!: number;
  piloto!: Piloto;
  season!: Temporada;
}

export class NewDriver_Championship {
  id?: number;
  points?: number;
  position?: number;
  piloto!: Piloto;
  season!: Temporada;
}
