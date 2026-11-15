import { Module } from '@nestjs/common';
import { EquipamentService } from './equipament.service';
import { EquipamentController } from './equipament.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [EquipamentController],
  providers: [EquipamentService],
})
export class EquipamentModule {}
