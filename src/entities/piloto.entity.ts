import { baseEntity } from "./baseEntity.entity.js";
import { Escuderia } from "./escuderia.entity.js";
import { Categoria } from "./categoria.entity.js";
import { Temporada } from "./temporada.entity.js";

export class Piloto extends baseEntity {
  team!: Escuderia;
  num!: number;
  nationality!: string;
  birth_date!: Date;
  role!: string;
  racing_series!: Categoria;
  wdcs!: Temporada[];
}

export class NewPiloto {
  id?: number
  name!: string
  team!: string;
  num!: number | string;
  nationality!: string;
  birth_date!: string;
  role!: string;
  racing_series!: string;
}
