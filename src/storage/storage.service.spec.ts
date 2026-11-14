import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';

describe('StorageService', () => {
  let service: StorageService;

  const mockPrismaService = {
    storage: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const storage = {
    id: 1,
    name: 'A-01',
    description: 'Setor sul',
    full: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateStorageDto = {
      name: 'A-01',
      description: 'Setor sul',
      full: false,
    };

    it('deve criar o armazenamento e omitir os campos de auditoria', async () => {
      mockPrismaService.storage.create.mockResolvedValue(storage);

      await expect(service.create(dto)).resolves.toEqual(storage);
      expect(mockPrismaService.storage.create).toHaveBeenCalledWith({
        data: dto,
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve propagar erros do Prisma', async () => {
      const error = new Error('Falha ao criar armazenamento');
      mockPrismaService.storage.create.mockRejectedValue(error);

      await expect(service.create(dto)).rejects.toBe(error);
    });
  });

  describe('findAll', () => {
    it('deve retornar a primeira página com os parâmetros padrão', async () => {
      mockPrismaService.storage.findMany.mockResolvedValue([storage]);
      mockPrismaService.storage.count.mockResolvedValue(1);

      await expect(service.findAll()).resolves.toEqual({
        dados: [storage],
        pagina: 1,
        limite: 10,
        total: 1,
        totalPaginas: 1,
      });
      expect(mockPrismaService.storage.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updatedAt: true },
      });
      expect(mockPrismaService.storage.count).toHaveBeenCalledTimes(1);
    });

    it('deve calcular o deslocamento e o total de páginas', async () => {
      mockPrismaService.storage.findMany.mockResolvedValue([storage]);
      mockPrismaService.storage.count.mockResolvedValue(11);

      await expect(service.findAll(2, 5)).resolves.toEqual({
        dados: [storage],
        pagina: 2,
        limite: 5,
        total: 11,
        totalPaginas: 3,
      });
      expect(mockPrismaService.storage.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve retornar uma lista vazia quando não houver armazenamentos', async () => {
      mockPrismaService.storage.findMany.mockResolvedValue([]);
      mockPrismaService.storage.count.mockResolvedValue(0);

      await expect(service.findAll()).resolves.toEqual({
        dados: [],
        pagina: 1,
        limite: 10,
        total: 0,
        totalPaginas: 0,
      });
    });

    it('deve propagar erros de consulta do Prisma', async () => {
      const error = new Error('Falha ao listar armazenamentos');
      mockPrismaService.storage.findMany.mockRejectedValue(error);
      mockPrismaService.storage.count.mockResolvedValue(0);

      await expect(service.findAll()).rejects.toBe(error);
    });

    it('deve propagar erros de contagem do Prisma', async () => {
      const error = new Error('Falha ao contar armazenamentos');
      mockPrismaService.storage.findMany.mockResolvedValue([]);
      mockPrismaService.storage.count.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toBe(error);
    });
  });

  describe('findOne', () => {
    it('deve buscar um armazenamento pelo id', async () => {
      mockPrismaService.storage.findFirst.mockResolvedValue(storage);

      await expect(service.findOne(1)).resolves.toEqual(storage);
      expect(mockPrismaService.storage.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve retornar null quando o armazenamento não existir', async () => {
      mockPrismaService.storage.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).resolves.toBeNull();
      expect(mockPrismaService.storage.findFirst).toHaveBeenCalledWith({
        where: { id: 999 },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve propagar erros do Prisma', async () => {
      const error = new Error('Falha ao buscar armazenamento');
      mockPrismaService.storage.findFirst.mockRejectedValue(error);

      await expect(service.findOne(1)).rejects.toBe(error);
    });
  });

  describe('update', () => {
    const dto: UpdateStorageDto = { name: 'A-02' };

    it('deve atualizar o armazenamento', async () => {
      const updated = { ...storage, name: dto.name };
      mockPrismaService.storage.update.mockResolvedValue(updated);

      await expect(service.update(1, dto)).resolves.toEqual(updated);
      expect(mockPrismaService.storage.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve propagar erros do Prisma', async () => {
      const error = new Error('Armazenamento não encontrado');
      mockPrismaService.storage.update.mockRejectedValue(error);

      await expect(service.update(999, dto)).rejects.toBe(error);
    });
  });

  describe('remove', () => {
    it('deve remover o armazenamento e omitir os campos de auditoria', async () => {
      mockPrismaService.storage.delete.mockResolvedValue(storage);

      await expect(service.remove(1)).resolves.toEqual(storage);
      expect(mockPrismaService.storage.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve propagar erros do Prisma', async () => {
      const error = new Error('Armazenamento não encontrado');
      mockPrismaService.storage.delete.mockRejectedValue(error);

      await expect(service.remove(999)).rejects.toBe(error);
    });
  });
});
