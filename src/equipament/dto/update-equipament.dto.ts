import { PartialType } from '@nestjs/swagger';
import { CreateEquipamentDto } from './create-equipament.dto';

export class UpdateEquipamentDto extends PartialType(CreateEquipamentDto) {}
