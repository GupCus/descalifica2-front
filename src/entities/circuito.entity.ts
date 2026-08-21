import { baseEntity } from "./baseEntity.entity.js";

export class Circuito extends baseEntity {
  country!: string;
  length?: string;
  year?: number | string;
  track_map_image?: string;
  photo_image?: string;
}
