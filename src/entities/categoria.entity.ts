import { Escuderia } from "./escuderia.entity.js";
import { baseEntity } from "./baseEntity.entity.js";
import { Temporada } from "./temporada.entity.js";
import { Piloto } from "./piloto.entity.js";

export class Categoria extends baseEntity {
  description?: string;
  drivers?: Piloto[];
  teams?: Escuderia[];
  seasons?: Temporada[];
}
