import { Piloto } from './piloto.entity.js';
import { baseEntity } from './baseEntity.entity.js';
import { Marca } from './marca.entity.js';
import { Categoria } from './categoria.entity.js';

export class Escuderia extends baseEntity {
  pilotos?: Piloto[];
  fundation!: number;
  nationality!: string;
  engine!: string;
  marca!: Marca;
  categoria!: Categoria;
}
