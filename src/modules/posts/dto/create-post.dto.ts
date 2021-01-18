import { IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  @MinLength(10, { message: 'Content to short' })
  content: string;
}
