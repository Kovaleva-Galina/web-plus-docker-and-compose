import { IsNotEmpty, IsString } from 'class-validator';

export class FindManyUsersDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
