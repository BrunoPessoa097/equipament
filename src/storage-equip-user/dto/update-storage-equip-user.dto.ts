import { PartialType } from '@nestjs/swagger';
import { CreateStorageEquipUserDto } from './create-storage-equip-user.dto';

export class UpdateStorageEquipUserDto extends PartialType(
  CreateStorageEquipUserDto,
) {}
