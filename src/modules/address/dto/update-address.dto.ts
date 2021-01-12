import { IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  public street: string;

  @IsString()
  public city: string;

  @IsString()
  public country: string;
}
