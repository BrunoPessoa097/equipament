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
import { StorageEquipUserService } from './storage-equip-user.service';
import { CreateStorageEquipUserDto } from './dto/create-storage-equip-user.dto';
import { UpdateStorageEquipUserDto } from './dto/update-storage-equip-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('storage-equip-user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Storage Equipamento User')
export class StorageEquipUserController {
  constructor(
    private readonly storageEquipUserService: StorageEquipUserService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar um nova relação de estoque equipamento e do usuário',
  })
  @ApiBody({ type: CreateStorageEquipUserDto })
  @ApiResponse({
    status: 201,
    description: 'stoque equipamento e do usuário',
  })
  create(@Body() createStorageEquipUserDto: CreateStorageEquipUserDto) {
    return this.storageEquipUserService.create(createStorageEquipUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as relações de estoque equipamento e do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista as relações de estoque equipamento e do usuário.',
  })
  findAll() {
    return this.storageEquipUserService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar um relações de estoque equipamento e do usuário pelo ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description:
      'Identificador de relações de estoque equipamento e do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Relações de estoque equipamento e do usuário.',
  })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storageEquipUserService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um estoque equipamento e do usuário' })
  @ApiParam({
    name: 'id',
    type: Number,
    description:
      'Identificador de relações de estoque equipamento e do usuário',
  })
  @ApiBody({ type: UpdateStorageEquipUserDto })
  @ApiResponse({
    status: 200,
    description: 'Relações de estoque equipamento e do usuário atualizado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStorageEquipUserDto: UpdateStorageEquipUserDto,
  ) {
    return this.storageEquipUserService.update(+id, updateStorageEquipUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um estoque equipamento e do usuário' })
  @ApiParam({
    name: 'id',
    type: Number,
    description:
      'Identificador de relações de estoque equipamento e do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Estoque equipamento e do usuário removida com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.storageEquipUserService.remove(+id);
  }
}
