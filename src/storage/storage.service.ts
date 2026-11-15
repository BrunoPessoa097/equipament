import { Injectable, Logger } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StorageInterface } from './interface/storage.interface';
import { PaginacaoInterface } from '../config/paginacao.interface';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(createStorageDto: CreateStorageDto): Promise<StorageInterface> {
    const storage = await this.prisma.storage.create({
      data: createStorageDto,
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.log(`Local de armazenamento cadastrado. ID: ${storage.id}`);
    return storage;
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

  async findOne(id: number): Promise<StorageInterface | null> {
    const storage = await this.prisma.storage.findFirst({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.debug(
      storage
        ? `Local de armazenamento encontrado. ID: ${id}`
        : `Local de armazenamento não encontrado. ID: ${id}`,
    );

    return storage;
  }

  async update(
    id: number,
    updateStorageDto: UpdateStorageDto,
  ): Promise<StorageInterface> {
    const storage = await this.prisma.storage.update({
      where: { id },
      data: updateStorageDto,
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.log(`Local de armazenamento atualizado. ID: ${storage.id}`);

    return storage;
  }

  async remove(id: number): Promise<StorageInterface> {
    const storage = await this.prisma.storage.delete({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.log(`Local de armazenamento excluído. ID: ${storage.id}`);
    return storage;
  }
}
