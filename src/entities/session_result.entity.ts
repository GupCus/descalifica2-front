import { Piloto } from './piloto.entity.ts';
import { Sesion } from './sesion.entity.ts';

export class Session_Result {
  id!: number;

  session!: Sesion;

  position!: number;

  piloto!: Piloto;

  number_of_laps!: number;

  dnf!: boolean;

  dns!: boolean;

  dsq!: boolean;

  duration!: string;

  gap_to_leader!: string;
}
