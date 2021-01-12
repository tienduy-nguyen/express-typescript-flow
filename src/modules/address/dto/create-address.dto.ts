import { IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  public street: string;

  @IsString()
  public cicy: string;

  @IsString()
  public country: string;
}
