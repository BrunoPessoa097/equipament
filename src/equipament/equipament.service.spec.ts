import { Test, TestingModule } from '@nestjs/testing';
import { EquipamentService } from './equipament.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipamentDto } from './dto/create-equipament.dto';
import { UpdateEquipamentDto } from './dto/update-equipament.dto';

describe('EquipamentService', () => {
  let service: EquipamentService;

  const mockPrismaService = {
    equipament: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const equipament = {
    id: 1,
    name: 'Câmera',
    code: 'CAM-001',
    description: 'Câmera de segurança',
    active: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipamentService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<EquipamentService>(EquipamentService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateEquipamentDto = {
      name: 'Câmera',
      code: 'CAM-001',
      description: 'Câmera de segurança',
      active: true,
    };

    it('deve criar o equipamento e omitir os campos de auditoria', async () => {
      mockPrismaService.equipament.create.mockResolvedValue(equipament);

      await expect(service.create(dto)).resolves.toEqual(equipament);
      expect(mockPrismaService.equipament.create).toHaveBeenCalledWith({
        data: dto,
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve propagar erros do Prisma', async () => {
      const error = new Error('Falha ao criar equipamento');
      mockPrismaService.equipament.create.mockRejectedValue(error);

      await expect(service.create(dto)).rejects.toBe(error);
    });
  });

  describe('findAll', () => {
    it('deve retornar a primeira página com os parâmetros padrão', async () => {
      mockPrismaService.equipament.findMany.mockResolvedValue([equipament]);
      mockPrismaService.equipament.count.mockResolvedValue(1);

      await expect(service.findAll()).resolves.toEqual({
        dados: [equipament],
        pagina: 1,
        limite: 10,
        total: 1,
        totalPaginas: 1,
      });
      expect(mockPrismaService.equipament.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updatedAt: true },
      });
      expect(mockPrismaService.equipament.count).toHaveBeenCalledTimes(1);
    });

    it('deve calcular o deslocamento e o total de páginas para a página solicitada', async () => {
      mockPrismaService.equipament.findMany.mockResolvedValue([equipament]);
      mockPrismaService.equipament.count.mockResolvedValue(11);

      await expect(service.findAll(2, 5)).resolves.toEqual({
        dados: [equipament],
        pagina: 2,
        limite: 5,
        total: 11,
        totalPaginas: 3,
      });
      expect(mockPrismaService.equipament.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve retornar uma lista vazia quando não houver equipamentos', async () => {
      mockPrismaService.equipament.findMany.mockResolvedValue([]);
      mockPrismaService.equipament.count.mockResolvedValue(0);

      await expect(service.findAll()).resolves.toEqual({
        dados: [],
        pagina: 1,
        limite: 10,
        total: 0,
        totalPaginas: 0,
      });
    });

    it('deve propagar erros de consulta do Prisma', async () => {
      const error = new Error('Falha ao listar equipamentos');
      mockPrismaService.equipament.findMany.mockRejectedValue(error);
      mockPrismaService.equipament.count.mockResolvedValue(0);

      await expect(service.findAll()).rejects.toBe(error);
    });

    it('deve propagar erros de contagem do Prisma', async () => {
      const error = new Error('Falha ao contar equipamentos');
      mockPrismaService.equipament.findMany.mockResolvedValue([]);
      mockPrismaService.equipament.count.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toBe(error);
    });
  });

  describe('findOne', () => {
    it('deve buscar um equipamento pelo id', async () => {
      mockPrismaService.equipament.findFirst.mockResolvedValue(equipament);

      await expect(service.findOne(1)).resolves.toEqual(equipament);
      expect(mockPrismaService.equipament.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve retornar null quando o equipamento não existir', async () => {
      mockPrismaService.equipament.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).resolves.toBeNull();
      expect(mockPrismaService.equipament.findFirst).toHaveBeenCalledWith({
        where: { id: 999 },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve propagar erros do Prisma', async () => {
      const error = new Error('Falha ao buscar equipamento');
      mockPrismaService.equipament.findFirst.mockRejectedValue(error);

      await expect(service.findOne(1)).rejects.toBe(error);
    });
  });

  describe('update', () => {
    const dto: UpdateEquipamentDto = { name: 'Câmera atualizada' };

    it('deve atualizar o equipamento', async () => {
      const updated = { ...equipament, name: dto.name };
      mockPrismaService.equipament.update.mockResolvedValue(updated);

      await expect(service.update(1, dto)).resolves.toEqual(updated);
      expect(mockPrismaService.equipament.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve propagar erros do Prisma', async () => {
      const error = new Error('Equipamento não encontrado');
      mockPrismaService.equipament.update.mockRejectedValue(error);

      await expect(service.update(999, dto)).rejects.toBe(error);
    });
  });

  describe('remove', () => {
    it('deve remover o equipamento', async () => {
      mockPrismaService.equipament.delete.mockResolvedValue(equipament);

      await expect(service.remove(1)).resolves.toEqual(equipament);
      expect(mockPrismaService.equipament.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve propagar erros do Prisma', async () => {
      const error = new Error('Equipamento não encontrado');
      mockPrismaService.equipament.delete.mockRejectedValue(error);

      await expect(service.remove(999)).rejects.toBe(error);
    });
  });
});
