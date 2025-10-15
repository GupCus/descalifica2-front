import { baseEntity } from './baseEntity.entity.js';
import { Circuito } from './circuito.entity.js';
import { Sesion } from './sesion.entity.js';
import { Temporada } from './temporada.entity.js';

export class Carrera extends baseEntity {
    
    start_date!: Date;
    end_date!: Date;
    circuito!: Circuito;
    temporada!: Temporada;
    //Cambios del front a adaptar al back Circuito -> circuito y agrege el arreglo de sesiones
    sesiones!:Sesion[]
}
