import { baseEntity } from './baseEntity.entity.js';

export class Usuario extends baseEntity {
  username!: string;
  password!: string;
  surname!: string;
  email!: string;
  date_of_birth!: Date;
  fav_driver!: string;
  fav_team!: string
  fav_circuit!: string;
  bio!: string;

}
