import { Module } from '@nestjs/common';
import { EquipamentService } from './equipament.service';
import { EquipamentController } from './equipament.controller';

@Module({
  controllers: [EquipamentController],
  providers: [EquipamentService],
})
export class EquipamentModule {}
