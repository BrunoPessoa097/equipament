import { Injectable } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StorageInterface } from './interface/storage.interface';
import { PaginacaoInterface } from '../config/paginacao.interface';

@Injectable()
export class StorageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStorageDto: CreateStorageDto): Promise<StorageInterface> {
    return await this.prisma.storage.create({
      data: createStorageDto,
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async findAll(
    page: number = 1,
    take: number = 10,
  ): Promise<PaginacaoInterface<StorageInterface[]>> {
    const skip: number = (page - 1) * take;

    const [dados, total] = await Promise.all([
      this.prisma.storage.findMany({
        skip,
        take,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updatedAt: true },
      }),
      this.prisma.storage.count(),
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

  async findOne(id: number): Promise<StorageInterface | null> {
    return this.prisma.storage.findFirst({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async update(
    id: number,
    updateStorageDto: UpdateStorageDto,
  ): Promise<StorageInterface> {
    return this.prisma.storage.update({
      where: { id },
      data: updateStorageDto,
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async remove(id: number): Promise<StorageInterface> {
    return this.prisma.storage.delete({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });
  }
}
