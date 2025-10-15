import { baseEntity } from './baseEntity.entity.js';
import { Escuderia } from './escuderia.entity.js';

export class Marca extends baseEntity {
    nationality!: string;
    foundation!: number;
    escuderias?: Escuderia[];
    
 
}
