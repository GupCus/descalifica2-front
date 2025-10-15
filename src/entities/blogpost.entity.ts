import { baseEntity } from "./baseEntity.entity.js";
import { Usuario } from "./usuario.entity.js";

export class Blogpost extends baseEntity {
  content!: string;
  author!: Usuario;
}
