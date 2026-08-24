import { baseEntity } from './baseEntity.entity.js';

export class Comentario extends baseEntity {
  content!: string;
  createdAt!: string;
  author!: number;
  blogpost!: number;
}

export class NewComentario {
  content!: string;
  author!: number;
  blogpost!: number;
}
