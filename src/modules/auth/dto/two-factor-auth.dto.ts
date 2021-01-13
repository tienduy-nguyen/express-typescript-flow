import { IsString } from 'class-validator';

export class TwoFactorAuthDto {
  @IsString()
  public code: string;
}
