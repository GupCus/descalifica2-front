import { baseEntity } from "./baseEntity.entity.js";
import { Circuito } from "./circuito.entity.js";
import { Sesion } from "./sesion.entity.js";
import { Temporada } from "./temporada.entity.js";

export class Carrera extends baseEntity {
  start_date!: Date;
  end_date!: Date;
  track?: Circuito;
  season?: Temporada;
  sessions?: Sesion[];
}

export class NewCarrera extends baseEntity {
  start_date!: Date;
  end_date!: Date;
  track?: number | string;
  season?: number | string;
}
