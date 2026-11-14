import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserRoleDto {
  @ApiProperty({
    example: '1234',
    description: 'ID do usuario',
  })
  @IsInt()
  @IsNotEmpty()
  @MaxLength(50)
  id_user!: number;

  @ApiProperty({
    example: '1234',
    description: 'ID do regras',
  })
  @IsInt()
  @IsNotEmpty()
  @MaxLength(50)
  id_roles!: number;
}
