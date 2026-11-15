import { Injectable, Logger } from '@nestjs/common';
import { CreateStorageEquipUserDto } from './dto/create-storage-equip-user.dto';
import { UpdateStorageEquipUserDto } from './dto/update-storage-equip-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StorageEquipUserInterface } from './interface/storage-equip-user.interface';
import { PaginacaoInterface } from '../config/paginacao.interface';

@Injectable()
export class StorageEquipUserService {
  private readonly logger = new Logger(StorageEquipUserService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createStorageEquipUserDto: CreateStorageEquipUserDto,
  ): Promise<StorageEquipUserInterface> {
    const storageEquipUser = await this.prisma.storageEquipUser.create({
      data: {
        user: {
          connect: { id: createStorageEquipUserDto.id_user },
        },
        storage: {
          connect: { id: createStorageEquipUserDto.id_storage },
        },
        equipament: {
          connect: { id: createStorageEquipUserDto.id_equipament },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.log(
      `Local de armazenamento cadastrado. ID: ${storageEquipUser.id}`,
    );
    return storageEquipUser;
  }

  async findAll(
    page: number = 1,
    take: number = 10,
  ): Promise<PaginacaoInterface<StorageEquipUserInterface[]>> {
    const skip: number = (page - 1) * take;

    const [dados, total] = await Promise.all([
      this.prisma.storageEquipUser.findMany({
        skip,
        take,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updatedAt: true },
      }),
      this.prisma.storageEquipUser.count(),
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

  async findOne(id: number): Promise<StorageEquipUserInterface | null> {
    const storageEquipUser = await this.prisma.storageEquipUser.findFirst({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.debug(
      storageEquipUser
        ? `Local de armazenamento encontrado. ID: ${id}`
        : `Local de armazenamento não encontrado. ID: ${id}`,
    );

    return storageEquipUser;
  }

  async update(
    id: number,
    updateStorageEquipUserDto: UpdateStorageEquipUserDto,
  ): Promise<StorageEquipUserInterface> {
    const storageEquipUser = await this.prisma.storageEquipUser.update({
      where: { id },
      data: {
        ...(updateStorageEquipUserDto.id_user !== undefined && {
          user: {
            connect: { id: updateStorageEquipUserDto.id_user },
          },
        }),
        ...(updateStorageEquipUserDto.id_storage !== undefined && {
          storage: {
            connect: { id: updateStorageEquipUserDto.id_storage },
          },
        }),
        ...(updateStorageEquipUserDto.id_equipament !== undefined && {
          equipament: {
            connect: { id: updateStorageEquipUserDto.id_equipament },
          },
        }),
      },
      omit: { createdAt: true, updatedAt: true },
    });
    this.logger.log(
      `Local de armazenamento atualizado. ID: ${storageEquipUser.id}`,
    );
    return storageEquipUser;
  }

  async remove(id: number): Promise<StorageEquipUserInterface> {
    const storageEquipUser = await this.prisma.storageEquipUser.delete({
      where: {
        id,
      },
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.log(
      `Local de armazenamento excluído. ID: ${storageEquipUser.id}`,
    );

    return storageEquipUser;
  }
}
