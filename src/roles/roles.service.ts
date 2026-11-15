import { Injectable, Logger } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RoleInterface } from './interface/roles.interface';
import { PaginacaoInterface } from '../config/paginacao.interface';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleInterface> {
    const roles = await this.prisma.roles.create({ data: createRoleDto });
    this.logger.log(`Local de armazenamento cadastrado. ID: ${roles.id}`);
    return roles;
  }

  async findAll(
    page: number = 1,
    take: number = 10,
  ): Promise<PaginacaoInterface<RoleInterface[]>> {
    const skip: number = (page - 1) * take;

    const [dados, total] = await Promise.all([
      this.prisma.roles.findMany({
        skip,
        take,
        orderBy: { id: 'asc' },
        omit: { createdAt: true },
      }),
      this.prisma.roles.count(),
    ]);

    const numPaginas: number = Math.ceil(total / take);

    this.logger.debug(
      `Consulta de locais de armazenamento realizada. Página: ${page}, Total: ${total}`,
    );
    return {
      dados,
      pagina: page,
      limite: take,
      total,
      totalPaginas: numPaginas,
    };
  }

  async findOne(id: number): Promise<RoleInterface | null> {
    const role = await this.prisma.roles.findFirst({
      where: {
        id,
      },
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.debug(
      role
        ? `Local de armazenamento encontrado. ID: ${id}`
        : `Local de armazenamento não encontrado. ID: ${id}`,
    );
    return role;
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleInterface> {
    const role = await this.prisma.roles.update({
      where: {
        id,
      },
      data: updateRoleDto,
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.log(`Local de armazenamento atualizado. ID: ${role.id}`);
    return role;
  }

  async remove(id: number): Promise<RoleInterface> {
    const role = await this.prisma.roles.delete({
      where: {
        id,
      },
    });

    this.logger.log(`Local de armazenamento excluído. ID: ${role.id}`);
    return role;
  }
}
