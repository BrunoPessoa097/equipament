import { Injectable } from '@nestjs/common';
import { CreateStorageEquipUserDto } from './dto/create-storage-equip-user.dto';
import { UpdateStorageEquipUserDto } from './dto/update-storage-equip-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StorageEquipUserInterface } from './interface/storage-equip-user.interface';
import { PaginacaoInterface } from '../config/paginacao.interface';

@Injectable()
export class StorageEquipUserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createStorageEquipUserDto: CreateStorageEquipUserDto,
  ): Promise<StorageEquipUserInterface> {
    return await this.prisma.storageEquipUser.create({
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

    return {
      dados,
      pagina: page,
      limite: take,
      total,
      totalPaginas: numPaginas,
    };
  }

  async findOne(id: number): Promise<StorageEquipUserInterface | null> {
    return await this.prisma.storageEquipUser.findFirst({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async update(
    id: number,
    updateStorageEquipUserDto: UpdateStorageEquipUserDto,
  ): Promise<StorageEquipUserInterface> {
    return await this.prisma.storageEquipUser.update({
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
  }

  async remove(id: number): Promise<StorageEquipUserInterface> {
    return this.prisma.storageEquipUser.delete({
      where: {
        id,
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }
}
