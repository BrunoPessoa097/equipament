import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserInterface } from './interface/user.interface';
import { PaginacaoInterface } from '../config/paginacao.interface';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserInterface> {
    const passwordHash = await argon2.hash(createUserDto.password);
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: passwordHash,
      },
      omit: { createdAt: true, updatedAt: true, password: true },
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

    return {
      dados,
      pagina: page,
      limite: take,
      total,
      totalPaginas: numPaginas,
    };
  }

  async findOne(id: number): Promise<UserInterface | null> {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
      omit: { createdAt: true, updatedAt: true, password: true },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserInterface> {
    const data = { ...updateUserDto };
    if (data.password) {
      data.password = await argon2.hash(data.password);
    }

    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
      omit: { createdAt: true, updatedAt: true, password: true },
    });
  }

  async remove(id: number): Promise<UserInterface> {
    return await this.prisma.user.delete({
      where: { id },
      omit: { createdAt: true, updatedAt: true, password: true },
    });
  }
}
