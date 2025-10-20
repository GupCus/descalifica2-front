import { baseEntity } from './baseEntity.entity.js';
import { Escuderia } from './escuderia.entity.js';

export class Marca extends baseEntity {
    nationality!: string;
    foundation!: number;
    escuderias?: Escuderia[];
}
export class NuevaMarca extends baseEntity {
    nationality!: string;
    foundation!: number | string;
    escuderias?: string | number;
}
