import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Nome',
    description: 'Nome do usuario',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nome!: string;

  @ApiProperty({
    example: 'exemple@exemple.com',
    description: 'email pessoa',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email!: string;

  @ApiProperty({
    description: 'Senha de acesso do usuário',
    example: 'Senha@123',
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  password!: string;

  @ApiProperty({
    example: true,
    description: 'Estado da conta',
  })
  @IsBoolean()
  @IsOptional()
  active!: boolean;
}
