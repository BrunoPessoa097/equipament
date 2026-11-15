import { Injectable, Logger } from '@nestjs/common';
import { CreateEquipamentDto } from './dto/create-equipament.dto';
import { UpdateEquipamentDto } from './dto/update-equipament.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EquipamentInterface } from './interface/equipament.interface';
import { PaginacaoInterface } from '../config/paginacao.interface';

@Injectable()
export class EquipamentService {
  private readonly logger = new Logger(EquipamentService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createEquipamentDto: CreateEquipamentDto,
  ): Promise<EquipamentInterface> {
    const equipament = await this.prisma.equipament.create({
      data: createEquipamentDto,
      omit: { createdAt: true, updatedAt: true },
    });
    this.logger.log(`Equipamento cadastrado. ID: ${equipament.id}`);
    return equipament;
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

    this.logger.debug(
      `Consulta de equipamentos realizada. Página: ${page}, Total: ${total}`,
    );
    return {
      dados,
      pagina: page,
      limite: take,
      total,
      totalPaginas: numPaginas,
    };
  }

  async findOne(id: number): Promise<EquipamentInterface | null> {
    const equipament = await this.prisma.equipament.findFirst({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.debug(
      equipament
        ? `Equipamento consultado. ID: ${id}`
        : `Equipamento não encontrado. ID: ${id}`,
    );

    return equipament;
  }

  async update(
    id: number,
    updateEquipamentDto: UpdateEquipamentDto,
  ): Promise<EquipamentInterface> {
    const equipament = await this.prisma.equipament.update({
      where: {
        id,
      },
      data: updateEquipamentDto,
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.log(`Equipamento atualizado. ID: ${equipament.id}`);
    return equipament;
  }

  async remove(id: number): Promise<EquipamentInterface> {
    const equipament = await this.prisma.equipament.delete({
      where: {
        id,
      },
      omit: { createdAt: true, updatedAt: true },
    });

    this.logger.warn(`Equipamento excluído. ID: ${equipament.id}`);
    return equipament;
  }
}
