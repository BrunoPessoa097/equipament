import { IsOptional, Max, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ListUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;
}
