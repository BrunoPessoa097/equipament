import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserInterface } from './interface/user.interface';
import { PaginacaoInterface } from '../config/paginacao.interface';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserInterface> {
    const passwordHash = await argon2.hash(createUserDto.password);

    return await this.prisma.$transaction(async (tx) => {
      const rolePublic = await tx.roles.findUniqueOrThrow({
        where: { name: 'PUBLIC' },
        select: { id: true },
      });

      const user = await tx.user.create({
        data: {
          ...createUserDto,
          password: passwordHash,
        },
        omit: {
          createdAt: true,
          updatedAt: true,
          password: true,
        },
      });

      await tx.userRoles.create({
        data: {
          id_user: user.id,
          id_roles: rolePublic.id,
        },
      });

      this.logger.log(`Local de armazenamento cadastrado. ID: ${user.id}`);
      return user;
    });
  }

  async findAll(
    page: number = 1,
    take: number = 10,
  ): Promise<PaginacaoInterface<UserInterface[]>> {
    const skip: number = (page - 1) * take;

    const [dados, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updatedAt: true, password: true },
      }),
      this.prisma.user.count(),
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

  async findOne(id: number): Promise<UserInterface | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
      omit: { createdAt: true, updatedAt: true, password: true },
    });
    this.logger.debug(
      user
        ? `Local de armazenamento encontrado. ID: ${id}`
        : `Local de armazenamento não encontrado. ID: ${id}`,
    );
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserInterface> {
    const data = { ...updateUserDto };
    if (data.password) {
      data.password = await argon2.hash(data.password);
    }

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data,
      omit: { createdAt: true, updatedAt: true, password: true },
    });

    this.logger.log(`Local de armazenamento atualizado. ID: ${user.id}`);
    return user;
  }

  async remove(id: number): Promise<UserInterface> {
    const user = await this.prisma.user.delete({
      where: { id },
      omit: { createdAt: true, updatedAt: true, password: true },
    });
    this.logger.log(`Local de armazenamento excluído. ID: ${user.id}`);
    return user;
  }
}
