import { baseEntity } from './baseEntity.entity.js';
import { Escuderia } from './escuderia.entity.js';
import { Categoria } from './categoria.entity.js';

export class Piloto extends baseEntity{ 
        escuderia!: Escuderia;
        num!:number
        nationality!:string
        role!:string
        racing_series!: Categoria
}

export class NewPiloto extends baseEntity{ 
        escuderia!: number | string;
        num!:number
        nationality!:string
        role!:string
        racing_series!: number | string
}

