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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADM')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma nova role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Role cadastrada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as roles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles retornada com sucesso.',
  })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma role pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Identificador da role' })
  @ApiResponse({ status: 200, description: 'Role encontrada.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma role' })
  @ApiParam({ name: 'id', type: Number, description: 'Identificador da role' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Role atualizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma role' })
  @ApiParam({ name: 'id', type: Number, description: 'Identificador da role' })
  @ApiResponse({ status: 200, description: 'Role removida com sucesso.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(+id);
  }
}
