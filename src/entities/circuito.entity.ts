import { baseEntity } from './baseEntity.entity.js';

export class Circuito extends baseEntity {
  name!: string;
  country!: string;
  length?: string;
  year?: number | string;
  track_map_image?: string;
  track_map_url?: string;
  photo_image?: string;
}
