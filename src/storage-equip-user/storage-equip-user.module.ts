import { Module } from '@nestjs/common';
import { StorageEquipUserService } from './storage-equip-user.service';
import { StorageEquipUserController } from './storage-equip-user.controller';

@Module({
  controllers: [StorageEquipUserController],
  providers: [StorageEquipUserService],
})
export class StorageEquipUserModule {}
