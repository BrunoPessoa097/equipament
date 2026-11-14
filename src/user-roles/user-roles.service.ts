import { Injectable } from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserRoleInterface } from './interface/user-role.interface';
import { PaginacaoInterface } from '../config/paginacao.interface';

@Injectable()
export class UserRolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUserRoleDto: CreateUserRoleDto,
  ): Promise<UserRoleInterface> {
    return await this.prisma.userRoles.create({
      data: createUserRoleDto,
      omit: { createdAt: true, updatedAt: true },
    });
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

    return {
      dados,
      pagina: page,
      limite: take,
      total,
      totalPaginas: numPaginas,
    };
  }

  async findOne(id: number): Promise<UserRoleInterface | null> {
    return await this.prisma.userRoles.findFirst({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async update(
    id: number,
    updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<UserRoleInterface> {
    return await this.prisma.userRoles.update({
      where: { id },
      data: updateUserRoleDto,
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async remove(id: number): Promise<UserRoleInterface> {
    return await this.prisma.userRoles.delete({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });
  }
}
