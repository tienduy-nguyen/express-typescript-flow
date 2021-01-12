import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import moment from 'moment-timezone';
import { Category } from '@modules/category/category.entity';
@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  author: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({
    type: Date,
    default: moment(new Date()).format('YYYY-MM-DD HH:ss'),
  })
  createdAt;

  @Column({
    type: Date,
    default: null,
  })
  updatedAt;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  categories: Category[];
}
