import { Post } from '@modules/posts/post.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @ManyToMany(() => Post, (post: Post) => post.categories)
  posts?: Post[];
}
