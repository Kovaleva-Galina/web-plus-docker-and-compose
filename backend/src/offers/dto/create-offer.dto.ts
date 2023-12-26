import { IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;
}
