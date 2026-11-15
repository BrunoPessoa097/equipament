import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserRoleInterface } from './interface/user-role.interface';
import { PaginacaoInterface } from '../config/paginacao.interface';

@Injectable()
export class UserRolesService {
  private readonly logger = new Logger(UserRolesService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUserRoleDto: CreateUserRoleDto,
  ): Promise<UserRoleInterface> {
    const { id_user, id_roles } = createUserRoleDto;

    const [user, role] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: id_user },
        select: { id: true },
      }),
      this.prisma.roles.findUnique({
        where: { id: id_roles },
        select: { id: true },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (!role) {
      throw new NotFoundException('Role não encontrada.');
    }

    const userRole = await this.prisma.userRoles.create({
      data: { id_user, id_roles },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`Local de armazenamento cadastrado. ID: ${userRole.id}`);
    return userRole;
  }

  async findAll(
    page: number = 1,
    take: number = 10,
  ): Promise<PaginacaoInterface<UserRoleInterface[]>> {
    const skip: number = (page - 1) * take;

    const [dados, total] = await Promise.all([
      this.prisma.userRoles.findMany({
        skip,
        take,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updatedAt: true },
      }),
      this.prisma.userRoles.count(),
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

  async findOne(id: number): Promise<UserRoleInterface | null> {
    const userRole = await this.prisma.userRoles.findUniqueOrThrow({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.debug(
      userRole
        ? `Local de armazenamento encontrado. ID: ${id}`
        : `Local de armazenamento não encontrado. ID: ${id}`,
    );

    return userRole;
  }

  async update(
    id: number,
    updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<UserRoleInterface> {
    const userRole = await this.prisma.userRoles.update({
      where: { id },
      data: updateUserRoleDto,
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.log(`Local de armazenamento atualizado. ID: ${userRole.id}`);
    return userRole;
  }

  async remove(id: number): Promise<UserRoleInterface> {
    const userRole = await this.prisma.userRoles.delete({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.log(`Local de armazenamento excluído. ID: ${userRole.id}`);
    return userRole;
  }
}
