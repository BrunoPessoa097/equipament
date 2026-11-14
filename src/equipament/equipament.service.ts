import { Injectable } from '@nestjs/common';
import { CreateEquipamentDto } from './dto/create-equipament.dto';
import { UpdateEquipamentDto } from './dto/update-equipament.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EquipamentInterface } from './interface/equipament.interface';
import { PaginacaoInterface } from '../config/paginacao.interface';

@Injectable()
export class EquipamentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createEquipamentDto: CreateEquipamentDto,
  ): Promise<EquipamentInterface> {
    return await this.prisma.equipament.create({
      data: createEquipamentDto,
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async findAll(
    page: number = 1,
    take: number = 10,
  ): Promise<PaginacaoInterface<EquipamentInterface[]>> {
    const skip: number = (page - 1) * take;

    const [dados, total] = await Promise.all([
      this.prisma.equipament.findMany({
        skip,
        take,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updatedAt: true },
      }),
      this.prisma.equipament.count(),
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

  async findOne(id: number): Promise<EquipamentInterface | null> {
    return await this.prisma.equipament.findFirst({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async update(
    id: number,
    updateEquipamentDto: UpdateEquipamentDto,
  ): Promise<EquipamentInterface> {
    return await this.prisma.equipament.update({
      where: {
        id,
      },
      data: updateEquipamentDto,
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async remove(id: number): Promise<EquipamentInterface> {
    return await this.prisma.equipament.delete({
      where: {
        id,
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }
}
