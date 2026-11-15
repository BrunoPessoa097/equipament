import { Module } from '@nestjs/common';
import { StorageEquipUserService } from './storage-equip-user.service';
import { StorageEquipUserController } from './storage-equip-user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [StorageEquipUserController],
  providers: [StorageEquipUserService],
})
export class StorageEquipUserModule {}
