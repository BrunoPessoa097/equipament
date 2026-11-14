import { Test, TestingModule } from '@nestjs/testing';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';

describe('StorageController', () => {
  let controller: StorageController;

  const mockStorageService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [{ provide: StorageService, useValue: mockStorageService }],
    }).compile();

    controller = module.get<StorageController>(StorageController);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateStorageDto = {
      name: 'A-01',
      description: 'Setor sul',
      full: false,
    };

    it('deve delegar a criação ao service e retornar o resultado', async () => {
      const created = { id: 1, ...dto };
      mockStorageService.create.mockResolvedValue(created);

      await expect(controller.create(dto)).resolves.toEqual(created);
      expect(mockStorageService.create).toHaveBeenCalledWith(dto);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao criar armazenamento');
      mockStorageService.create.mockRejectedValue(error);

      await expect(controller.create(dto)).rejects.toBe(error);
    });
  });

  describe('findAll', () => {
    it('deve delegar a listagem ao service e retornar o resultado', async () => {
      const result = {
        dados: [{ id: 1, name: 'A-01', description: 'Setor sul', full: false }],
        pagina: 1,
        limite: 10,
        total: 1,
        totalPaginas: 1,
      };
      mockStorageService.findAll.mockResolvedValue(result);

      await expect(controller.findAll()).resolves.toEqual(result);
      expect(mockStorageService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao listar armazenamentos');
      mockStorageService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toBe(error);
    });
  });

  describe('findOne', () => {
    it('deve buscar um armazenamento pelo id', async () => {
      const storage = {
        id: 1,
        name: 'A-01',
        description: 'Setor sul',
        full: false,
      };
      mockStorageService.findOne.mockResolvedValue(storage);

      await expect(controller.findOne(1)).resolves.toEqual(storage);
      expect(mockStorageService.findOne).toHaveBeenCalledWith(1);
    });

    it('deve retornar null quando o armazenamento não existir', async () => {
      mockStorageService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(999)).resolves.toBeNull();
      expect(mockStorageService.findOne).toHaveBeenCalledWith(999);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao buscar armazenamento');
      mockStorageService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toBe(error);
    });
  });

  describe('update', () => {
    const dto: UpdateStorageDto = { name: 'A-02' };

    it('deve converter o id para número e delegar a atualização', async () => {
      const updated = {
        id: 1,
        name: 'A-02',
        description: 'Setor sul',
        full: false,
      };
      mockStorageService.update.mockResolvedValue(updated);

      await expect(controller.update('1', dto)).resolves.toEqual(updated);
      expect(mockStorageService.update).toHaveBeenCalledWith(1, dto);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao atualizar armazenamento');
      mockStorageService.update.mockRejectedValue(error);

      await expect(controller.update('1', dto)).rejects.toBe(error);
    });
  });

  describe('remove', () => {
    it('deve remover o armazenamento pelo id', async () => {
      const removed = {
        id: 1,
        name: 'A-01',
        description: 'Setor sul',
        full: false,
      };
      mockStorageService.remove.mockResolvedValue(removed);

      await expect(controller.remove(1)).resolves.toEqual(removed);
      expect(mockStorageService.remove).toHaveBeenCalledWith(1);
    });

    it('deve propagar erros do service', async () => {
      const error = new Error('Falha ao remover armazenamento');
      mockStorageService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toBe(error);
    });
  });
});
