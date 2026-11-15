import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { EquipamentService } from './equipament.service';
import { CreateEquipamentDto } from './dto/create-equipament.dto';
import { UpdateEquipamentDto } from './dto/update-equipament.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('equipament')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Equipament')
export class EquipamentController {
  constructor(private readonly equipamentService: EquipamentService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo equipamento' })
  @ApiBody({ type: CreateEquipamentDto })
  @ApiResponse({
    status: 201,
    description: 'Equipamento cadastrada com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createEquipamentDto: CreateEquipamentDto) {
    return this.equipamentService.create(createEquipamentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas os equipamentos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de equipamentos retornada com sucesso.',
  })
  findAll() {
    return this.equipamentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma equipamento pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador da equipamento',
  })
  @ApiResponse({ status: 200, description: 'equipamento encontrada.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equipamentService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma equipamento' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador do equipamento',
  })
  @ApiBody({ type: UpdateEquipamentDto })
  @ApiResponse({
    status: 200,
    description: 'Equipamento atualizada com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEquipamentDto: UpdateEquipamentDto,
  ) {
    return this.equipamentService.update(+id, updateEquipamentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma equipamento' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador da equipamento',
  })
  @ApiResponse({
    status: 200,
    description: 'Equipamento removida com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  remove(@Param('id') id: string) {
    return this.equipamentService.remove(+id);
  }
}
