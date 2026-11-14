import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEquipamentDto {
  @ApiProperty({
    example: 'Câmera',
    description: 'Nome do equipamento',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    example: 'ab234',
    description: 'Nome do equipamento',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @ApiProperty({
    example: 'Câmera dessa marca',
    description: 'Melhor descritivo possivel',
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
  active!: boolean;
}
