import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RoleInterface } from './interface/roles.interface';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleInterface> {
    return await this.prisma.roles.create({ data: createRoleDto });
  }

  async findAll(page: number = 1, take: number = 10) {
    const skip: number = (page - 1) * take;

    const [dados, total] = await Promise.all([
      this.prisma.roles.findMany({
        skip,
        take,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updateAt: true },
      }),
      this.prisma.roles.count(),
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

  async findOne(id: number) {
    return await this.prisma.roles.findFirst({
      where: {
        id,
      },
      omit: { createdAt: true, updateAt: true },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return await this.prisma.roles.update({
      where: {
        id,
      },
      data: {
        updateRoleDto,
      },
      omit: { createdAt: true, updateAt: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.roles.delete({
      where: {
        id,
      },
    });
  }
}
