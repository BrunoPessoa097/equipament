import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('storage')
@ApiTags('Storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo armazenamento' })
  @ApiBody({ type: CreateStorageDto })
  @ApiResponse({
    status: 201,
    description: 'Equipamento cadastrada com sucesso.',
  })
  create(@Body() createStorageDto: CreateStorageDto) {
    return this.storageService.create(createStorageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas os armazenamentos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de armazenamentos retornada com sucesso.',
  })
  findAll() {
    return this.storageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma armazenamento pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador da armazenamento',
  })
  @ApiResponse({ status: 200, description: 'armazenamento encontrada.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storageService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um armazenamento' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador do armazenamento',
  })
  @ApiBody({ type: UpdateStorageDto })
  @ApiResponse({
    status: 200,
    description: 'Armazenamento atualizada com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  update(@Param('id') id: string, @Body() updateStorageDto: UpdateStorageDto) {
    return this.storageService.update(+id, updateStorageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma armazenamento' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador da armazenamento',
  })
  @ApiResponse({
    status: 200,
    description: 'Armazenamento removida com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.storageService.remove(+id);
  }
}
