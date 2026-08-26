import { baseEntity } from "./baseEntity.entity.js";
import { Escuderia } from "./escuderia.entity.js";

export class Marca extends baseEntity {
  name!: string;
  nationality!: string;
  foundation!: number;
  teams?: Escuderia[];
  logo_image?: string;
}
export class NewMarca extends baseEntity {
  name!: string;
  nationality!: string;
  foundation!: number;
  teams?: Escuderia[];
  logo_image?: string;
}
