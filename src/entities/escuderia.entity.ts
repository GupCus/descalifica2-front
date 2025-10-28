import { Piloto } from './piloto.entity.js';
import { baseEntity } from './baseEntity.entity.js';
import { Marca } from './marca.entity.js';
import { Categoria } from './categoria.entity.js';

export class Escuderia extends baseEntity {
  pilotos?: Piloto[];
  fundation!: string;
  nationality!: string;
  engine!: string;
  marca!: Marca;
  racing_series!: Categoria;
}
export class NewEscuderia extends baseEntity {
  fundation!: string;
  nationality!: string;
  engine!: string;
  marca!: string | number;
  racing_series!: string | number;
}
