import { Address } from '@modules/address/address.entity';
import { Post } from '@modules/posts/post.entity';
import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @MinLength(3)
  password: string;

  @Column({
    nullable: true,
  })
  @IsString()
  twoFactorAuthCode: string;

  @Column('boolean', { default: false })
  @IsBoolean()
  isTwoFactorAuthEnabled: boolean;

  @OneToOne(() => Address, (address: Address) => address.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  post: Post[];
}
