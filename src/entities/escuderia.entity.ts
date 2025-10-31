import { Piloto } from "./piloto.entity.js";
import { baseEntity } from "./baseEntity.entity.js";
import { Marca } from "./marca.entity.js";
import { Categoria } from "./categoria.entity.js";
import { Temporada } from "./temporada.entity.js";

export class Escuderia extends baseEntity {
  drivers?: Piloto[];
  fundation!: string;
  nationality!: string;
  engine!: string;
  brand!: Marca;
  racing_series!: Categoria;
  wccs?: Temporada[];
}
export class NewEscuderia {
  id?: number
  name!: string
  fundation!: string;
  nationality!: string;
  engine!: string;
  brand!: string | number | null;
  racing_series!: string | number;
}
