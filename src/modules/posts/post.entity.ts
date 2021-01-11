import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import moment from 'moment-timezone';
@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
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
}
