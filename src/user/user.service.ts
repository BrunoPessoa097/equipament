import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserINterface } from './interface/user.interface';
import { PaginacaoInterface } from '../config/paginacao.interface';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserINterface> {
    const passwordHash = await argon2.hash(createUserDto.password);
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: passwordHash,
      },
    });
  }

  async findAll(
    page: number = 1,
    take: number = 10,
  ): Promise<PaginacaoInterface<UserINterface[]>> {
    const skip: number = (page - 1) * take;

    const [dados, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updatedAt: true },
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

  async findOne(id: number): Promise<UserINterface | null> {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserINterface> {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async remove(id: number): Promise<UserINterface> {
    return await this.prisma.user.delete({ where: { id } });
  }
}
