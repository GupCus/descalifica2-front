import { baseEntity } from './baseEntity.entity.js';
import { Escuderia } from './escuderia.entity.js';
import { Categoria } from './categoria.entity.js';

export class Piloto extends baseEntity{ 
        
        escuderia!: Escuderia[] | Escuderia;
        num!:number
        nationality!:string
        role!:string
        racing_series?: Categoria[]
}

