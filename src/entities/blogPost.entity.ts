import { baseEntity } from './baseEntity.entity';

export class BlogPost extends baseEntity {
  title!: string;
  content!: string;
  cover_image?: string;
  cover_image_url?: string;
  author!: number;
  tags?: string[];
  created_at!: string;
}

export class NewBlogPost {
  id?: number;
  title!: string;
  content!: string;
  cover_image?: string;
  author!: number;
  tags?: string[];
}
export default BlogPost;
