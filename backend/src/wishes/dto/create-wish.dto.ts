import { IsString, IsOptional, Length, IsUrl, IsNumber } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  link: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  @Length(1, 1024)
  description: string;
}
