import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStorageEquipUserDto } from './dto/create-storage-equip-user.dto';
import { UpdateStorageEquipUserDto } from './dto/update-storage-equip-user.dto';
import { StorageEquipUserService } from './storage-equip-user.service';

describe('StorageEquipUserService', () => {
  let service: StorageEquipUserService;

  const mockPrismaService = {
    storageEquipUser: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const relation = { id_user: 1, id_storage: 2, id_equipament: 3 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageEquipUserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<StorageEquipUserService>(StorageEquipUserService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateStorageEquipUserDto = {
      id_user: 1,
      id_storage: 2,
      id_equipament: 3,
    };

    it('deve criar a relação conectando usuário, armazenamento e equipamento', async () => {
      mockPrismaService.storageEquipUser.create.mockResolvedValue(relation);

      await expect(service.create(dto)).resolves.toEqual(relation);
      expect(mockPrismaService.storageEquipUser.create).toHaveBeenCalledWith({
        data: {
          user: { connect: { id: dto.id_user } },
          storage: { connect: { id: dto.id_storage } },
          equipament: { connect: { id: dto.id_equipament } },
        },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve propagar erros do Prisma', async () => {
      const error = new Error('Falha ao criar relação');
      mockPrismaService.storageEquipUser.create.mockRejectedValue(error);

      await expect(service.create(dto)).rejects.toBe(error);
    });
  });

  describe('findAll', () => {
    it('deve listar relações com paginação padrão', async () => {
      mockPrismaService.storageEquipUser.findMany.mockResolvedValue([relation]);
      mockPrismaService.storageEquipUser.count.mockResolvedValue(1);

      await expect(service.findAll()).resolves.toEqual({
        dados: [relation],
        pagina: 1,
        limite: 10,
        total: 1,
        totalPaginas: 1,
      });
      expect(mockPrismaService.storageEquipUser.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updatedAt: true },
      });
      expect(mockPrismaService.storageEquipUser.count).toHaveBeenCalledTimes(1);
    });

    it('deve calcular deslocamento e total de páginas', async () => {
      mockPrismaService.storageEquipUser.findMany.mockResolvedValue([relation]);
      mockPrismaService.storageEquipUser.count.mockResolvedValue(11);

      await expect(service.findAll(2, 5)).resolves.toEqual({
        dados: [relation],
        pagina: 2,
        limite: 5,
        total: 11,
        totalPaginas: 3,
      });
      expect(mockPrismaService.storageEquipUser.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        orderBy: { id: 'asc' },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve retornar lista vazia quando não houver relações', async () => {
      mockPrismaService.storageEquipUser.findMany.mockResolvedValue([]);
      mockPrismaService.storageEquipUser.count.mockResolvedValue(0);

      await expect(service.findAll()).resolves.toEqual({
        dados: [],
        pagina: 1,
        limite: 10,
        total: 0,
        totalPaginas: 0,
      });
    });

    it('deve propagar erros de consulta e contagem do Prisma', async () => {
      const queryError = new Error('Falha ao listar relações');
      mockPrismaService.storageEquipUser.findMany.mockRejectedValue(queryError);
      mockPrismaService.storageEquipUser.count.mockResolvedValue(0);
      await expect(service.findAll()).rejects.toBe(queryError);

      const countError = new Error('Falha ao contar relações');
      mockPrismaService.storageEquipUser.findMany.mockResolvedValue([]);
      mockPrismaService.storageEquipUser.count.mockRejectedValue(countError);
      await expect(service.findAll()).rejects.toBe(countError);
    });
  });

  describe('findOne', () => {
    it('deve buscar uma relação pelo id', async () => {
      mockPrismaService.storageEquipUser.findFirst.mockResolvedValue(relation);

      await expect(service.findOne(1)).resolves.toEqual(relation);
      expect(mockPrismaService.storageEquipUser.findFirst).toHaveBeenCalledWith(
        {
          where: { id: 1 },
          omit: { createdAt: true, updatedAt: true },
        },
      );
    });

    it('deve retornar null quando a relação não existir', async () => {
      mockPrismaService.storageEquipUser.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).resolves.toBeNull();
    });

    it('deve propagar erros do Prisma', async () => {
      const error = new Error('Falha ao buscar relação');
      mockPrismaService.storageEquipUser.findFirst.mockRejectedValue(error);

      await expect(service.findOne(1)).rejects.toBe(error);
    });
  });

  describe('update', () => {
    it('deve atualizar somente os relacionamentos informados', async () => {
      const dto: UpdateStorageEquipUserDto = { id_storage: 4 };
      mockPrismaService.storageEquipUser.update.mockResolvedValue({
        ...relation,
        id_storage: 4,
      });

      await expect(service.update(1, dto)).resolves.toEqual({
        ...relation,
        id_storage: 4,
      });
      expect(mockPrismaService.storageEquipUser.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { storage: { connect: { id: 4 } } },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve aceitar atualização vazia sem enviar conexões', async () => {
      mockPrismaService.storageEquipUser.update.mockResolvedValue(relation);

      await expect(service.update(1, {})).resolves.toEqual(relation);
      expect(mockPrismaService.storageEquipUser.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {},
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve propagar erros do Prisma', async () => {
      const error = new Error('Relação não encontrada');
      mockPrismaService.storageEquipUser.update.mockRejectedValue(error);

      await expect(service.update(999, { id_user: 2 })).rejects.toBe(error);
    });
  });

  describe('remove', () => {
    it('deve remover uma relação pelo id', async () => {
      mockPrismaService.storageEquipUser.delete.mockResolvedValue(relation);

      await expect(service.remove(1)).resolves.toEqual(relation);
      expect(mockPrismaService.storageEquipUser.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        omit: { createdAt: true, updatedAt: true },
      });
    });

    it('deve propagar erros do Prisma', async () => {
      const error = new Error('Relação não encontrada');
      mockPrismaService.storageEquipUser.delete.mockRejectedValue(error);

      await expect(service.remove(999)).rejects.toBe(error);
    });
  });
});
