import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Nome da role',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    example: 'Administrador do sistema',
    description: 'Descrição da role',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description!: string;

  @ApiProperty({
    example: true,
    description: 'Estado da role',
  })
  @IsBoolean()
  @IsOptional()
  active!: boolean;
}
