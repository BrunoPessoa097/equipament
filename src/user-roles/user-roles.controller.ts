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
import { UserRolesService } from './user-roles.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-roles')
@ApiTags('User Roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma nova userRole' })
  @ApiBody({ type: CreateUserRoleDto })
  @ApiResponse({ status: 201, description: 'Role cadastrada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRolesService.create(createUserRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as userRole' })
  @ApiResponse({
    status: 200,
    description: 'Lista de userRole retornada com sucesso.',
  })
  findAll() {
    return this.userRolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma userRole pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador da userRole',
  })
  @ApiResponse({ status: 200, description: 'userRole encontrada.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userRolesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma userRole' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador da userRole',
  })
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiResponse({ status: 200, description: 'userRole atualizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.userRolesService.update(+id, updateUserRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma userRole' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador da userRole',
  })
  @ApiResponse({ status: 200, description: 'userRole removida com sucesso.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userRolesService.remove(+id);
  }
}
