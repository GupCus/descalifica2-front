import { baseEntity } from "./baseEntity.entity.js";
import { Escuderia } from "./escuderia.entity.js";
import { Categoria } from "./categoria.entity.js";

export class Piloto extends baseEntity {
  team!: Escuderia;
  num!: number;
  nationality!: string;
  role!: string;
  racing_series!: Categoria;
}

export class NewPiloto extends baseEntity {
  team!: number | string;
  num!: number;
  nationality!: string;
  role!: string;
  racing_series!: number | string;
}
