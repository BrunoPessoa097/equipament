import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStorageEquipUserDto {
  @ApiProperty({
    example: '1',
    description: 'ID do usuário',
  })
  @IsNumber()
  @IsNotEmpty()
  id_user!: number;

  @ApiProperty({
    example: '1',
    description: 'ID do storage',
  })
  @IsNumber()
  @IsNotEmpty()
  id_storage!: number;

  @ApiProperty({
    example: '1',
    description: 'ID do equipament',
  })
  @IsNumber()
  @IsNotEmpty()
  id_equipament!: number;
}
