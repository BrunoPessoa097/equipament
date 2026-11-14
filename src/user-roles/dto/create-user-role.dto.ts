import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateUserRoleDto {
  @ApiProperty({
    example: '1234',
    description: 'ID do usuario',
  })
  @IsInt()
  @IsNotEmpty()
  id_user!: number;

  @ApiProperty({
    example: '1234',
    description: 'ID do regras',
  })
  @IsInt()
  @IsNotEmpty()
  id_roles!: number;
}
