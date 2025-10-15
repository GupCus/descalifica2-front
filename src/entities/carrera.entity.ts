import { baseEntity } from './baseEntity.entity.js';
import { Circuito } from './circuito.entity.js';
import { Temporada } from './temporada.entity.js';

export class Carrera extends baseEntity {
    
    start_date!: Date;
    
    end_date!: Date;
    
    Circuito!: Circuito;
    
    temporada!: Temporada;
}
