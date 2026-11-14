import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateStorageDto {
  @ApiProperty({
    example: 'A-01',
    description: 'Nome do local do armazenamento',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    example: 'Setor sul',
    description: 'Descrição da localização',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  description!: string;

  @ApiProperty({
    example: true,
    description: 'Estado da ativo',
  })
  @IsBoolean()
  @IsOptional()
  full!: boolean;
}
